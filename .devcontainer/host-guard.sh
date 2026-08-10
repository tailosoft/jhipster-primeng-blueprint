#!/usr/bin/env bash
#
# host-guard.sh — runs on the HOST via devcontainer.json "initializeCommand",
# BEFORE the container starts. Refuses to start unless EVERY key in the ssh-agent
# that would be forwarded in requires interactive confirmation to sign.
#
# Why timing: the ssh-agent protocol exposes no query for the `-c` (confirm)
# constraint, so we can't ask "is this key confirm-protected?". Instead we TIME an
# agent-backed signature. A key added with `ssh-add -c` blocks on a human
# confirmation dialog (seconds); an unprotected key signs in milliseconds. Any key
# that signs faster than THRESHOLD was NOT gated by a human → usable silently → unsafe.
#
# Fail-closed by BLOCKING, not by exit code: JetBrains Gateway runs this command and
# WAITS for it to return, but ignores its exit status (verified: it logs
# "exit code: 1" and starts the container anyway). So on an unsafe agent we do NOT
# exit — we keep re-alerting and re-checking in a loop, and only RETURN once every
# key is confirm-protected. Not returning = the container is never created. Fix the
# agent host-side (ssh-add -D; ssh-add -c ...) and the next check pass lets it start.
# Cost: every start pops a heads-up + one signing prompt per key. That's the point.
#
set -u

THRESHOLD=1.0   # seconds; a signature faster than this means no human was asked

now() { printf '%s' "${EPOCHREALTIME:-$(date +%s.%N)}"; }
lt()  { awk -v a="$1" -v b="$2" 'BEGIN{exit !(a<b)}'; }   # true if a < b

# Detect a usable GUI dialog tool once. Without one we can't "keep showing a popup",
# so we fall back to a single stderr warning and do NOT loop (avoids a headless hot loop).
if   command -v zenity  >/dev/null 2>&1; then GUI=zenity
elif command -v kdialog >/dev/null 2>&1; then GUI=kdialog
else GUI=""; fi

# Loud, blocking error alert for the unsafe case — must be acknowledged before we re-check.
alert() {
  case "$GUI" in
    zenity)  zenity  --error --no-markup --no-wrap --title="NOT PROTECTED" --text="$1" >/dev/null 2>&1 ;;
    kdialog) kdialog --error --title "NOT PROTECTED" "$1"                  >/dev/null 2>&1 ;;
    *)       printf '\n%s\n\n' "$1" >&2 ;;
  esac
}
ask() { # 0 = proceed, 1 = abort; auto-proceeds when there is no GUI
  case "$GUI" in
    zenity)  zenity  --question --no-markup --no-wrap --text="$1" >/dev/null 2>&1 ;;
    kdialog) kdialog --yesno    "$1"                   >/dev/null 2>&1 ;;
    *)       return 0 ;;
  esac
}

sock="${SSH_AUTH_SOCK:-}"

# Re-evaluate the agent on every pass — keys can be re-added with -c in another
# terminal while we loop. We only RETURN (allow the start) once every forwarded key
# requires a human confirmation to sign; otherwise we alert and check again.
first=1
while true; do
  # No agent, or agent holds no keys → nothing forwarded in → allow start.
  if [ -z "$sock" ] || ! ssh-add -l >/dev/null 2>&1; then
    exit 0
  fi

  if [ "$first" = 1 ]; then
    first=0
    ask "Dev container security check.

I will ask your ssh-agent to sign a test challenge for EACH loaded key.
- If you enabled per-use confirmation (ssh-add -c), you'll get a signing
  prompt for each key — APPROVE it.
- If a key signs WITHOUT prompting you, it is usable silently by anything
  in the container. The container start will be BLOCKED and this check will
  keep re-appearing until every key is confirmation-protected.

Continue?" || { echo "host-guard: cancelled by user." >&2; exit 1; }
  fi

  data="$(mktemp)"; printf 'devcontainer-guard-probe' > "$data"
  n=0; bad=0; badn=0; badel=0; badkey=""
  while IFS= read -r pub; do
    [ -n "$pub" ] || continue
    n=$((n + 1))
    kf="$(mktemp)"; printf '%s\n' "$pub" > "$kf"
    t0="$(now)"
    ssh-keygen -Y sign -U -f "$kf" -n devcontainer-guard "$data" >/dev/null 2>&1
    rc=$?
    t1="$(now)"
    el="$(awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.3f", b - a}')"
    have_sig=0; { [ "$rc" -eq 0 ] && [ -f "$data.sig" ]; } && have_sig=1
    # Only a FAST *successful* signature proves silent usability. A fast FAILURE
    # (rc!=0 / no .sig) means signing was refused — e.g. a -c key whose confirmation
    # was denied or whose prompter errored — which is NOT silent use, so don't flag it.
    if [ "$have_sig" = 1 ] && lt "$el" "$THRESHOLD"; then
      # Identify the actual offending key (fingerprint + comment) for the message —
      # NOT a hardcoded filename. ssh-keygen -lf prints "<bits> SHA256:… <comment> (TYPE)".
      badkey="$(ssh-keygen -lf "$kf" 2>/dev/null)"
      rm -f "$kf" "$data.sig"
      bad=1; badn=$n; badel=$el
      break
    fi
    rm -f "$kf" "$data.sig"
    if [ "$have_sig" = 1 ]; then
      echo "host-guard: key #$n confirmed (signed in ${el}s)." >&2
    else
      echo "host-guard: key #$n did not sign (rc=$rc) — refused/prompt-failed, not silent; skipping." >&2
    fi
  done < <(ssh-add -L)
  rm -f "$data"

  # All keys required a human confirmation → safe → allow the container to start.
  if [ "$bad" = 0 ]; then
    echo "host-guard: all $n key(s) confirm-protected — allowing start." >&2
    exit 0
  fi

  alert "⚠️  YOU ARE NOT PROTECTED — dev container start is BLOCKED.

This key (#$badn) signed in ${badel}s WITHOUT prompting you:
    ${badkey:-<unknown key>}
It is usable silently by anything running in the container (including AI agents) —
it can push, and log into any server the key reaches, as you.

HERE IS WHAT TO DO on the host, then this check will retry automatically:

  1) Stop forwarding the agent entirely (simplest — do this if you push from
     the host anyway):
       JetBrains > Settings > Tools > SSH Configurations / SSH Forwarding >
       uncheck \"Enable SSH agent forwarding\"

  OR

  2) Require confirmation on each use (gcr 4 / GNOME keyring honors -c and pops a
     confirm dialog per signature; re-run after login if keys auto-load unconfirmed):
       ssh-add -D
       ssh-add -c ~/.ssh/<the-key-above>

Dismiss this dialog to re-check."
  echo "host-guard: key #$badn signed in ${badel}s (< ${THRESHOLD}s) — re-checking." >&2

  # No GUI to keep popping → don't spin headlessly; leave the start blocked deliberately.
  if [ -z "$GUI" ]; then
    echo "host-guard: no GUI dialog tool; refusing to start (unsafe agent)." >&2
    exit 1
  fi
done

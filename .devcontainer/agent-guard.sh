#!/usr/bin/env bash
#
# agent-guard.sh — CONTAINER-side backstop to host-guard.sh.
#
# host-guard.sh runs on the HOST and blocks an unsafe START, BUT JetBrains Gateway
# ignores its exit code, so a container can still come up with an unprotected
# ssh-agent forwarded in.
#
# Runs from /etc/bash.bashrc on every interactive shell — that's where the forwarded
# agent is actually visible (lifecycle hooks / docker exec run without it).
#
# Caching policy (the whole point):
#   - SUCCESS is cached, but ONLY for this container start. The marker stores an id
#     that changes on every (re)start / host reboot, plus the verification time. A
#     protected key is verified at most ONCE per start; later shells report the
#     cached "last verified" time in green.
#   - FAILURE (a key signs silently) is NEVER cached: re-warns on every shell.
#   - "no agent" / "no keys" / "can't verify" are NEVER cached.
#
# Run `agent-guard.sh recheck` (alias -f / --force) to bypass the cache and verify
# again right now.
set -u

THRESHOLD=1.0        # a signature this fast can't have shown a dialog -> signed silently
WAIT=20              # seconds to wait for you to answer the confirm dialog before giving up
marker=/tmp/.agent-guard.ok
recheck_cmd="agent-guard.sh recheck"

warn() { printf '\033[1;31m%s\033[0m\n' "$1" >&2; }   # bold red
ok()   { printf '\033[1;32m%s\033[0m\n' "$1" >&2; }   # bold green
info() { printf '\033[2m%s\033[0m\n'    "$1" >&2; }   # dim/grey
now()  { printf '%s' "${EPOCHREALTIME:-$(date +%s.%N)}"; }
lt()   { awk -v a="$1" -v b="$2" 'BEGIN{exit !(a<b)}'; }   # true if a < b

# `recheck` / -f / --force bypasses the per-start cache.
force=0
case "${1:-}" in recheck|-f|--force) force=1 ;; esac

sock="${SSH_AUTH_SOCK:-}"
# No agent in THIS shell yet -> nothing to check. Exit 75 (NOT 0) so the
# /etc/bash.bashrc dedup does not latch onto a shell whose SSH_AUTH_SOCK isn't set
# yet (the login-phase source can run before the IDE injects the socket); a later
# source WITH the agent then still runs the real check.
[ -z "$sock" ] && exit 75

# Id changes on every container (re)start and host reboot, forcing a fresh check.
startid="$(cat /proc/sys/kernel/random/boot_id 2>/dev/null):$(awk '{print $22}' /proc/1/stat 2>/dev/null)"

# Already verified SAFE during THIS container start -> report the cached result (green).
if [ "$force" = 0 ] && [ -r "$marker" ]; then
  { read -r m_startid; read -r m_time; } < "$marker" 2>/dev/null
  if [ "${m_startid:-}" = "$startid" ]; then
    ok "✓ ssh-agent OK — forwarded key(s) require confirmation.  last checked: ${m_time:-earlier}   (re-check: $recheck_cmd)"
    exit 0
  fi
fi

# Need the ssh tools to verify. Warn conservatively if missing (do NOT cache).
if ! command -v ssh-add >/dev/null 2>&1 || ! command -v ssh-keygen >/dev/null 2>&1; then
  warn "⚠  A host ssh-agent is forwarded into this container but its safety can't be verified (ssh tools missing)."
  warn "   DO NOT run 'claude' or 'codex' here unless your host keys require ssh-add -c confirmation."
  exit 0
fi

# Agent present but holds no keys -> nothing forwarded to abuse. Report green.
if ! ssh-add -l >/dev/null 2>&1; then
  ok "✓ ssh-agent forwarded but holds no keys — nothing to expose."
  exit 0
fi

# Explain BEFORE the probe, so the confirm dialog is expected and understood.
info "agent-guard: it has been a while since your forwarded ssh key(s) were verified —"
info "  re-checking now that they still require confirmation to sign."
info "  → Your host may pop a \"confirm use of key\" dialog in a moment. THAT is this"
info "    check — a harmless test signature, NOT a real login."
info "  → You do NOT have to accept it. Approve, deny, or just ignore it: approving,"
info "    denying, or letting it time out all prove the key is protected. Only a"
info "    SILENT signature (no dialog at all) means you are exposed — see below."

# Time a signature per key. A silent sign returns in ms; a -c key blocks on the
# confirm dialog, so we WAIT up to $WAIT for your answer. Only a fast SUCCESS
# (rc 0 + .sig faster than THRESHOLD) is UNSAFE; a slow success (approved), a
# refusal (denied) or a timeout (ignored) are all SAFE.
data="$(mktemp)"; printf 'agent-guard-probe' > "$data"
nprobed=0; unsafe=0; badkey=""
while IFS= read -r pub; do
  [ -n "$pub" ] || continue
  nprobed=$((nprobed + 1))
  kf="$(mktemp)"; printf '%s\n' "$pub" > "$kf"; rm -f "$data.sig"
  t0="$(now)"
  timeout "$WAIT" ssh-keygen -Y sign -U -f "$kf" -n agent-guard "$data" >/dev/null 2>&1
  rc=$?
  t1="$(now)"
  el="$(awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.3f", b - a}')"
  have_sig=0; { [ "$rc" -eq 0 ] && [ -f "$data.sig" ]; } && have_sig=1
  if [ "$have_sig" = 1 ] && lt "$el" "$THRESHOLD"; then
    badkey="$(ssh-keygen -lf "$kf" 2>/dev/null)"
    rm -f "$kf" "$data.sig"
    unsafe=1; break
  fi
  rm -f "$kf" "$data.sig"
done < <(ssh-add -L)
rm -f "$data"

# All keys required confirmation (or refused/ignored) -> SAFE. Cache for this start.
if [ "$unsafe" = 0 ]; then
  ts="$(date '+%F %T')"
  [ "$nprobed" -gt 0 ] && printf '%s\n%s\n' "$startid" "$ts" > "$marker" 2>/dev/null
  ok "✓ ssh-agent verified just now — all forwarded key(s) require confirmation to sign.  (re-check: $recheck_cmd)"
  exit 0
fi

whoami_="$(id -un 2>/dev/null || echo you)"
warn "═══════════════════════════════════════════════════════════════════════════════"
warn "⚠  YOU ARE NOT PROTECTED — a host ssh-agent forwarded into this container signs"
warn "   WITHOUT confirmation. Anything running here (Claude, Codex, any process) can"
warn "   silently USE your host SSH keys — push, and log into any server they reach, AS YOU."
warn ""
warn "   Offending key: ${badkey:-<unknown key>}"
warn ""
warn "   DO NOT run 'claude' or 'codex' as '$whoami_' until you fix it on the HOST, either:"
warn "     - disable JetBrains SSH agent forwarding (simplest if you push from the host), or"
warn "     - make the key require confirmation on every use, host-side. NOTE: under GNOME's"
warn "       gcr-ssh-agent, 'ssh-add -c' is dropped by its auto-load; hide the key's .pub so"
warn "       gcr can't auto-load it, then add it yourself with 'ssh-add -c'."
warn "   Then open a new shell (or run: $recheck_cmd)."
warn "═══════════════════════════════════════════════════════════════════════════════"
exit 0

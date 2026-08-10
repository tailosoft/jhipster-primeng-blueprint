# JHipster 9 generated apps need a modern JDK; Java 21 (LTS) is the safe default.
ARG VARIANT="21-bookworm"
FROM mcr.microsoft.com/devcontainers/java:${VARIANT}

# Browsers for e2e:
#  - google-chrome-stable + xvfb: Cypress (the default e2e framework).
#  - Playwright installs its own browsers later via `npx playwright install`, but its
#    Chromium/WebKit/Firefox need the shared system libraries below to launch.
# NOTE: this image runs with --cap-drop=ALL, so Chrome/Chromium must be started with
# --no-sandbox (Cypress: CYPRESS_... / launch flags; Playwright: chromiumSandbox:false
# or `--no-sandbox`). JHipster's generated CI config already passes this in headless runs.
RUN rm -f /etc/apt/sources.list.d/yarn.list && \
      curl -fsSL https://dl.google.com/linux/linux_signing_key.pub \
        | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg && \
      echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
        > /etc/apt/sources.list.d/google-chrome.list && \
      apt-get update && apt-get install -y --no-install-recommends \
        xvfb google-chrome-stable \
      && rm -rf /var/lib/apt/lists/*

# This repo (generator-jhipster-primeng-blueprint) requires Node ^20.18.3 || >=22.12.0.
# Node 22 covers both the blueprint itself AND Claude Code (needs Node >= 18), so — unlike
# a project pinned to an older Node — there is no need for a separate Claude-only Node.
ARG NODE_VERSION="22"
RUN su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION} 2>&1"

# Install Claude Code globally on the default (Node 22) toolchain. nvm here runs with
# NVM_SYMLINK_CURRENT, so /usr/local/share/nvm/current (what PATH resolves) already points
# at Node 22 after `nvm alias default` above — `claude` lands on PATH directly, no wrapper.
RUN su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm use ${NODE_VERSION} && npm install -g @anthropic-ai/claude-code"

# pre-create ~/.claude as vscode so the persistent-state volume mounts writable
RUN mkdir -p /home/vscode/.claude && chown vscode:vscode /home/vscode/.claude

# Inside this sandbox (cap-drop=ALL, no-new-privileges, no credentials, no push,
# .devcontainer read-only) Claude defaults to bypassing permission prompts.
# Managed settings (/etc/claude-code) is highest precedence and lives only in the
# image — it never touches the host-shared ~/.claude/settings.json mount.
RUN mkdir -p /etc/claude-code && \
      printf '%s\n' '{ "permissions": { "defaultMode": "bypassPermissions" } }' \
        > /etc/claude-code/managed-settings.json

# Container-side backstop to .devcontainer/host-guard.sh. host-guard blocks an unsafe start
# on the host, but JetBrains ignores its exit code, so a container can still come up with an
# unprotected ssh-agent forwarded in. This warns (loudly) on every interactive shell not to
# run claude until the agent is fixed host-side. NOTE: it only reminds a HUMAN opening a
# terminal — the IDE execs claude directly, not via a shell, so this never gates the agent
# process itself; host-guard.sh is the real gate.
#
# Hook /etc/bash.bashrc only: the container user's default shell is /bin/bash. Debian's
# /etc/profile sources /etc/bash.bashrc, so this fires for both login and non-login
# interactive bash. The `_AGENT_GUARD_DONE` guard makes it run once per shell.
COPY agent-guard.sh /usr/local/bin/agent-guard.sh
RUN chmod +x /usr/local/bin/agent-guard.sh && \
      printf '\n%s\n' 'if [ -z "${_AGENT_GUARD_DONE:-}" ] && [ -x /usr/local/bin/agent-guard.sh ]; then /usr/local/bin/agent-guard.sh; [ $? -eq 75 ] || export _AGENT_GUARD_DONE=1; fi' \
        >> /etc/bash.bashrc

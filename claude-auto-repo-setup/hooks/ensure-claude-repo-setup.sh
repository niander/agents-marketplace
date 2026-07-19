#!/usr/bin/env bash
# ensure-claude-repo-setup.sh — global Claude Code hook.
#
# In the current git repository, ensure a few LOCAL-ONLY conveniences exist and
# add each to the repo's local git excludes (.git/info/exclude) so they are
# never committed or shared:
#
#   1. CLAUDE.md  — if an AGENTS.md (case-insensitive) is at the repo root and no
#      CLAUDE.md exists, create CLAUDE.md containing "@<AGENTS filename>".
#   2. .claude/skills/<name> -> ../../.github/skills/<name> — one symlink per
#      repo skill under .github/skills, EXCEPT skills whose name collides with a
#      built-in Claude Code skill/command (see BUILTIN_SKILL_COLLISIONS). A repo
#      skill that shadows a built-in of the same name makes the runtime resolve
#      the clash by disabling the built-in (it writes a skillOverride into the
#      repo's .claude/settings.local.json), so the built-in command (e.g.
#      /code-review) goes missing. Skipping the colliding repo skills keeps the
#      built-ins available. .claude/skills is therefore a real directory of
#      per-skill symlinks rather than a single directory symlink.
#   3. .claude/agents/<name> -> ../../.github/agents/<name> — the same per-item
#      linking for agents (no known built-in collisions today).
#
# A whole-directory .claude/skills or .claude/agents symlink created by an
# earlier version of this hook (target exactly ../.github/<leaf>) is migrated in
# place to the per-item form so the collision skip can take effect.
#
# Wired into ~/.claude/settings.json under the SessionStart and CwdChanged hook
# events, so it runs on every new session and working-directory change
# (including entering/creating a worktree). The hook payload (JSON on stdin)
# supplies the working directory.
#
# Contract: idempotent and side-effect-safe. No-ops outside git repos; never
# clobbers a file or symlink it did not create; never edits a repo's shared
# .gitignore, and never touches .claude/settings.local.json (skillOverrides are
# the runtime's to manage). Notification-only — a nonzero exit is harmless and
# never blocks the session. Keep this header in sync if you change the behavior.

set -u

# Built-in Claude Code skill/command names that a same-named repo skill would
# shadow — a clash the runtime resolves by disabling the built-in. Repo skills
# with these names are NOT linked into .claude/skills, so the built-in (e.g.
# /code-review) stays available. Extend this space-delimited list as more
# collisions are found.
BUILTIN_SKILL_COLLISIONS="code-review review security-review"

# --- resolve working dir + git repo root, then operate from the root --------
cwd="$(jq -r '.cwd // empty' 2>/dev/null || true)"
[ -n "${cwd:-}" ] || cwd="$PWD"
[ -d "$cwd" ] || exit 0
repo="$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)" || exit 0
[ -n "$repo" ] || exit 0
cd "$repo" 2>/dev/null || exit 0

# Add a repo-relative path to the repo's LOCAL-only excludes (never the shared
# .gitignore), unless git already ignores it.
exclude_local() {  # $1 = repo-relative path
  local p="$1" exclude
  git check-ignore -q "$p" 2>/dev/null && return 0
  exclude="$(git rev-parse --git-path info/exclude 2>/dev/null || true)"
  [ -n "${exclude:-}" ] || return 0
  mkdir -p "$(dirname "$exclude")" 2>/dev/null || true
  grep -qxF "/$p" "$exclude" 2>/dev/null || printf '/%s\n' "$p" >> "$exclude"
}

# --- 1. CLAUDE.md -> @AGENTS.md ---------------------------------------------
ensure_claude_md() {
  local agents
  ls -1 . 2>/dev/null | grep -iqx 'claude\.md' && return 0   # a CLAUDE.md (any case) already exists
  agents="$(ls -1 . 2>/dev/null | grep -im1 -x 'agents\.md' || true)"
  [ -n "${agents:-}" ] && [ -f "$agents" ] || return 0       # need a regular-file AGENTS.md (any case)
  exclude_local CLAUDE.md                                    # exclude first, so it's born ignored
  printf '@%s\n' "$agents" > CLAUDE.md 2>/dev/null || return 0
}

# --- 2/3. .claude/<leaf>/<name> -> ../../.github/<leaf>/<name> --------------
# Symlink each entry under .github/<leaf> individually, skipping any name in the
# optional space-delimited denylist. .claude/<leaf> is a real directory so its
# entry set can differ from the source — that is what lets a colliding skill be
# left out so the built-in it would otherwise shadow stays enabled.
ensure_links() {  # $1 = leaf (skills|agents); $2 = space-delimited names to skip
  local leaf="$1" deny="${2:-}" src=".github/$1" dst=".claude/$1"
  [ -d "$src" ] || return 0                                  # source must exist

  # Migrate a whole-directory symlink from an earlier version of this hook into
  # a real directory. Only touch a symlink pointing exactly where this hook
  # would have created it; leave any other symlink or non-directory file alone.
  if [ -L "$dst" ]; then
    [ "$(readlink "$dst" 2>/dev/null || true)" = "../.github/$leaf" ] || return 0
    rm -f "$dst" 2>/dev/null || return 0                     # removes the symlink, not its target
  elif [ -e "$dst" ] && [ ! -d "$dst" ]; then
    return 0
  fi

  mkdir -p "$dst" 2>/dev/null || return 0
  exclude_local "$dst"                                       # exclude the whole dir once

  local entry name
  for entry in "$src"/*/; do
    [ -d "$entry" ] || continue                              # only real subdirectories (no-op on empty glob)
    name="$(basename "$entry")"
    case " $deny " in *" $name "*) continue ;; esac          # skip: would shadow (and thus disable) a built-in
    { [ -e "$dst/$name" ] || [ -L "$dst/$name" ]; } && continue
    ln -s "../../$src/$name" "$dst/$name" 2>/dev/null || true
  done
}

ensure_claude_md
ensure_links skills "$BUILTIN_SKILL_COLLISIONS"
ensure_links agents ""
exit 0

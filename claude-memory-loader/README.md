# claude-memory-loader

Automatically loads Claude Code's machine-local auto-memory index for the
current Git repository into Copilot CLI session context.

## Behavior

The plugin runs a command hook at `sessionStart`. When supported Claude Code
memory exists, it injects:

- The first complete lines of `MEMORY.md` within Claude Code's 200-line and
  25,000-byte startup limits.
- The absolute Claude Code memory-directory path, so the agent can selectively
  read a relevant topic file when its tools permit that access.
- Source and precedence guidance that distinguishes Claude Code auto-memory
  from memory owned by Copilot CLI or another current agent harness.

The plugin performs no writes and makes no network requests. Missing or
unsupported memory returns no additional context and does not block startup.
Operational failures emit a short diagnostic on stderr and exit with status 2;
Copilot CLI surfaces that as a non-blocking hook warning. Injected context can
also be visible to subagents spawned by the session.

## Scope

The initial implementation intentionally supports:

- Copilot CLI on Linux, WSL, and native Windows.
- Python 3, launched as `python3` on Linux/WSL, `py -3` on Windows, or a
  verified Python 3 `python` fallback.
- PowerShell 7 or later for native Windows hook execution.
- Claude Code's default `~/.claude` configuration directory.
- Git repositories with main checkout paths containing only ASCII letters,
  digits, hyphens, and path separators. Native Windows drive prefixes are also
  supported.
- Linked worktrees, which resolve to the main checkout's shared Claude Code
  auto-memory directory.

Custom Claude Code memory directories, custom project-directory names, UNC
paths, and fuzzy project matching are not supported. WSL reads Claude Code
memory created in the same WSL environment; it does not search native Windows
profiles or mounted drives for another Claude installation.

In headless `copilot -p` sessions, the command hook still injects the index.
Detailed topic-file reads depend on the tools and path access available to that
session. If no Python 3 interpreter is available, the platform launcher reports
the missing prerequisite as a non-blocking hook warning.

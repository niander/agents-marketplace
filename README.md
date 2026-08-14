# agents-marketplace

A personal plugin marketplace for [GitHub Copilot CLI](https://docs.github.com/copilot/concepts/agents/copilot-cli/about-cli-plugins) and [Claude Code](https://code.claude.com/docs/en/plugins).
Plugins bundle skills, agents, or hooks for one or both CLIs.

Add it as a marketplace from `niander/agents-marketplace`.

## Plugins

| Plugin | What it does | Copilot CLI | Claude Code |
| --- | --- | :-: | :-: |
| [`pr-code-review`](pr-code-review) | Multi-model code review: sub-agents report findings with confidence scores, an orchestrator filters and synthesizes them | ✅ | ✅ |
| [`azure-kusto`](azure-kusto) | KQL and Azure Data Explorer guidance for logs, telemetry, and time series | ✅ | ✅ |
| [`azure-pipelines`](azure-pipelines) | Azure Pipelines YAML guidance with schema-aware language server support | ✅ | ✅ |
| [`run-simplify`](run-simplify) | Code-quality cleanup pass over a diff, looking for reuse, simplification, efficiency, and altitude issues | ✅ | ✅ |
| [`human-message-style`](human-message-style) | Rules for drafting concise, natural chat messages, emails, and PR comments | ✅ | ✅ |
| [`writing-clearly-and-concisely`](writing-clearly-and-concisely) | Editing help for long-form writing, including the tells of AI-generated prose | ✅ | ✅ |
| [`claude-auto-repo-setup`](claude-auto-repo-setup) | Hooks that wire up local-only Claude conveniences in the current git repo | — | ✅ |
| `sembr` | Reflows prose into [Semantic Line Breaks](https://sembr.org). Sourced from [sembr/skills](https://github.com/sembr/skills) | ✅ | ✅ |

## Layout

- `marketplace.json` — the catalog Copilot CLI reads.
- `.claude-plugin/marketplace.json` — the catalog Claude Code reads.
  The two lists differ where a plugin only works on one platform.
- Local plugins each have a directory holding their manifests and `skills/`, `agents/`, or `hooks/` assets.
  Externally sourced plugins are pinned in the marketplace manifests.
- `AGENTS.md` — conventions to follow when changing this repo.

## License

MIT, except where noted.
Some plugins bundle third-party content under other terms;
per-file licensing is declared in `REUSE.toml`,
with license texts in `LICENSES/`.
Attribution for those plugins lives in their own `README.md`.

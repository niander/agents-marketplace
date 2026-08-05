# Repository instructions

## Architecture

- This is a source-based plugin marketplace, not a conventional application. Each top-level plugin directory is self-contained and may provide platform metadata plus runtime assets such as `skills/`, `agents/`, and `hooks/`.
- The marketplace is published through two platform-specific manifests. `marketplace.json` is Copilot CLI-facing, while `.claude-plugin/marketplace.json` is Claude Code-facing. Their plugin lists may differ according to platform support.
- Marketplace entries point to local plugin directories through relative `source` paths. Each plugin's platform descriptor controls which runtime asset directories are loaded; hook plugins additionally declare event wiring in `hooks/hooks.json`.

## Repository conventions

- Copilot CLI and Claude Code have separate, evolving plugin contracts. For each plugin change, determine what both runtimes currently support and publish to both when possible without forcing their manifests or configuration files to be identical.
- Before changing plugin structure or configuration, consult the current [Copilot CLI plugin reference](https://docs.github.com/copilot/reference/copilot-cli-reference/cli-plugin-reference) and [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference). Use the installed CLIs' help and validation commands as the final authority for the versions available locally.
- Keep shared plugin identity, source, version, and user-visible behavior consistent across the marketplaces and applicable descriptors while retaining runtime-specific configuration where required.
- Keep plugin and skill names aligned with their directory names, and ensure manifest and frontmatter paths reference existing bundled assets.
- When relocating an existing skill, agent, script, or language-server integration, preserve its content, companion assets, metadata, dependency versions, and runtime behavior. Limit edits to those required for packaging compatibility.
- Preserve LF line endings for JSON, Markdown, and shell files as required by `.gitattributes`.

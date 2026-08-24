# Repository instructions

## Architecture

- This is a source-based plugin marketplace, not a conventional application. Each top-level plugin directory is self-contained and may provide platform metadata plus runtime assets such as `skills/`, `agents/`, and `hooks/`.
- The marketplace is published through two platform-specific manifests. `marketplace.json` is Copilot CLI-facing, while `.claude-plugin/marketplace.json` is Claude Code-facing. Their plugin lists may differ according to platform support.
- Marketplace entries point to local plugin directories through relative `source` paths. Each plugin's platform descriptor controls which runtime asset directories are loaded; hook plugins additionally declare event wiring in `hooks/hooks.json`.

## Repository conventions

- Copilot CLI and Claude Code have separate, evolving plugin contracts. For each plugin change, determine what both runtimes currently support and publish to both when possible without forcing their manifests or configuration files to be identical.
- Before changing plugin structure or configuration, consult the current [Copilot CLI plugin reference](https://docs.github.com/copilot/reference/copilot-cli-reference/cli-plugin-reference) and [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference). Use the installed CLIs' help and validation commands as the final authority for the versions available locally.
- Keep shared plugin identity, source, and user-visible behavior consistent across marketplaces while retaining runtime-specific configuration where required. Define release versions in plugin manifests rather than duplicating them in marketplace entries.
- Bump an affected plugin's semantic version in both platform manifests whenever packaged behavior, runtime assets, or metadata changes. Keep shared versions aligned unless a runtime-specific release intentionally differs.
- Keep each plugin description identical in its Copilot CLI manifest, Claude Code manifest, and both marketplace entries. These descriptions serve the same discovery and metadata purpose; put runtime-specific differences in other manifest fields.
- Keep plugin and skill names aligned with their directory names, and ensure manifest and frontmatter paths reference existing bundled assets.
- When adding a plugin, update the root `README.md` in the same change. Add local plugins to the local table and externally sourced plugins to the external table, including supported runtimes and an exact pinned source link where applicable.
- When relocating an existing skill, agent, script, or language-server integration, preserve its content, companion assets, metadata, dependency versions, and runtime behavior. Limit edits to those required for packaging compatibility.
- Declare licensing for vendored or derived third-party content in `REUSE.toml` following the [REUSE specification](https://reuse.software/spec/), with verbatim SPDX license texts in `LICENSES/`. Add an `[[annotations]]` entry per affected path rather than writing license prose; a plugin whose content is all original needs no entry. Put provenance and attribution in the plugin's `README.md`. Verify with `uvx reuse lint-file <paths>`.
- Do not declare a `license` field in plugin manifests or skill frontmatter. The root `LICENSE` and `REUSE.toml` are authoritative.
- When drafting pull request descriptions, describe the repository-visible outcome for reviewers. Do not include private provenance such as where files came from, that they previously existed on a local machine, or other authoring-process context unless it affects behavior or reproducibility.
- Preserve LF line endings for JSON, Markdown, and shell files as required by `.gitattributes`.

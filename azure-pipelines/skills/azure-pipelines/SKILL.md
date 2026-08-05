---
name: azure-pipelines
description: Guidance for working with Azure Pipelines YAML files using the azure-pipelines-language-server LSP. Use when reading, editing, validating, or generating Azure Pipelines YAML, resolving template references, or diagnosing pipeline syntax errors. Do not use for GitHub Actions, GitLab CI, or generic Kubernetes or Helm YAML.
---

# Azure Pipelines

Use this skill for Azure Pipelines YAML and templates. The plugin registers the `azure-pipelines-language-server` for `.yml` and `.yaml` files through a schema-aware stdio wrapper.

## When to use

Activate for:

- `azure-pipelines.yml`, `azure-pipelines-*.yml`, files under `.azure-pipelines/` or `.pipelines/`, and pipeline templates.
- YAML whose root structure uses Azure Pipelines keys such as `trigger`, `pool`, `stages`, `jobs`, `steps`, `parameters`, `variables`, `extends`, or `resources`.
- Requests involving Azure DevOps pipelines, task templates, stage/job/step structure, or Azure Pipelines diagnostics.

Do not apply Azure Pipelines schema assumptions to GitHub Actions, GitLab CI, Kubernetes, Helm, Docker Compose, Ansible, or generic application YAML.

## LSP workflow

Prefer the `lsp` tool for structural and semantic operations:

- `documentSymbol` for the stage, job, and step outline.
- `hover` for contextual descriptions of tasks and built-in properties.
- `goToDefinition` on local `template:` references.
- `findReferences` for usages across files already opened by the language server.

Use text search for broad literal searches across many files. The language server only has complete cross-file awareness for documents it has opened.

Any position-based LSP call opens the target document and triggers diagnostics. Diagnostics can include:

1. YAML parser errors.
2. Unknown or misplaced Azure Pipelines properties.
3. Invalid types or missing required properties.
4. Unknown task names or versions.

## Schema-aware wrapper

The co-located `lsp-wrapper.js` proxies the Copilot CLI LSP client to the upstream language server. It:

- injects `workspace/didChangeConfiguration` after initialization;
- answers upstream `custom/schema/request` calls that Copilot CLI does not handle directly;
- applies the Azure Pipelines schema only to configured pipeline file globs;
- bootstraps its locked npm dependencies on first start if they are absent.

Do not replace the wrapper with the bare language-server command. Doing so degrades validation to YAML syntax checking because schema requests remain unanswered.

## Configuration

The wrapper reads these environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `AZURE_PIPELINES_LSP_SCHEMA_URL` | Microsoft Azure Pipelines service schema | Schema URL used for validation |
| `AZURE_PIPELINES_LSP_GLOBS` | Common Azure Pipelines paths and filenames | Comma-separated globs that receive schema validation |
| `AZURE_PIPELINES_LSP_BIN` | Local or globally installed server | Explicit language-server JavaScript entrypoint |
| `AZURE_PIPELINES_LSP_DEBUG` | unset | Enables wrapper diagnostics on stderr |

The default schema globs cover:

- `**/azure-pipelines.yml`
- `**/azure-pipelines.yaml`
- `**/azure-pipelines-*.yml`
- `**/azure-pipelines-*.yaml`
- `**/.azure-pipelines/**/*.yml`
- `**/.azure-pipelines/**/*.yaml`
- `**/.pipelines/**/*.yml`
- `**/.pipelines/**/*.yaml`

Files outside these globs receive YAML syntax support but not Azure Pipelines schema validation.

## Limitations

- Local-file templates can be resolved; templates from a `repository:` resource cannot.
- `findReferences` and `goToDefinition` only see files opened by the LSP.
- Because Copilot CLI registers LSP servers by extension, the server activates for non-pipeline YAML too; schema validation remains restricted by the configured globs.

## Troubleshooting

- If LSP calls return no useful information, confirm the plugin and `azure-pipelines` LSP are enabled, then reload LSP configuration.
- If diagnostics only report YAML syntax, verify the file path matches `AZURE_PIPELINES_LSP_GLOBS`.
- If startup dependency installation fails, run `npm ci` in this skill directory and retry.
- Set `AZURE_PIPELINES_LSP_DEBUG=1` to log schema matching and server startup details to stderr.

# azure-kusto

KQL guidance for Azure Data Explorer: discovering clusters and databases,
inspecting table schemas, and querying logs, telemetry, and time series data.

The skill carries a short query workflow, four annotated KQL patterns, the Kusto
MCP tool surface, an Azure CLI fallback for when those tools are unavailable,
and a troubleshooting list.

## Bundled files

| File | Purpose |
| --- | --- |
| [`SKILL.md`](skills/azure-kusto/SKILL.md) | Query workflow, KQL patterns, tool reference, troubleshooting |

## Attribution

This skill is adapted from `azure-kusto` skill in [microsoft/azure-skills](https://github.com/microsoft/azure-skills).

It starts from upstream version 1.1 — mirrored at commit
[`317a8e7`](https://github.com/microsoft/azure-skills/commit/317a8e7b879c0ed6a1890378eafd939bdd9bc749)

Some modifications:

- The `az rest` fallback gains `--resource "https://api.kusto.windows.net"`.
  Without it the call acquires an ARM-scoped token, which the Kusto data-plane
  endpoint rejects.
- The aggregation and join examples gain explicit time filters. Upstream's run
  unbounded, against its own advice to always filter by time range.
- Aggregations name their output column instead of ordering by the generated
  `count_`.
- Empty query results are treated as ambiguous — verify cluster, database,
  table, and time range before reporting no data.
- Sections restating the frontmatter description or duplicating other sections
  are dropped.

## License

MIT. The upstream skill is MIT-licensed by Microsoft Corporation (2025).
Per-file licensing is declared in the repository's `REUSE.toml`; license texts
are in `LICENSES/`.

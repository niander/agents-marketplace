---
name: azure-kusto
description: "Query and analyze data in Azure Data Explorer (Kusto/ADX) using KQL for log analytics, telemetry, and time series analysis. Use for KQL queries, Kusto databases, ADX clusters, log analytics, time series data, IoT telemetry, and anomaly detection."
license: MIT
metadata:
  author: Microsoft
  version: "1.1"
---

# Azure Data Explorer (Kusto) Query and Analytics

Use KQL to query and analyze Azure Data Explorer data, especially logs, telemetry, security events, and time series.

## Core workflow

1. Discover the available clusters and databases.
2. Inspect table schemas before writing unfamiliar queries.
3. Query with an explicit time range and project only required columns.
4. Aggregate or correlate results, then summarize the findings for the user.

## Query patterns

### Recent records

```kql
Events
| where Timestamp > ago(1h)
| take 100
```

### Aggregation

```kql
Events
| where Timestamp > ago(24h)
| summarize EventCount = count() by EventType, bin(Timestamp, 1h)
| order by EventCount desc
```

### Time series

```kql
Telemetry
| where Timestamp > ago(24h)
| summarize
    AverageResponseTime = avg(ResponseTime),
    percentiles(ResponseTime, 50, 95, 99)
  by bin(Timestamp, 5m)
| render timechart
```

### Correlation

```kql
Events
| where Timestamp > ago(1h) and EventType == "Error"
| join kind=inner (
    Logs
    | where Timestamp > ago(1h) and Severity == "Critical"
) on CorrelationId
| project Timestamp, EventType, LogMessage, Severity
```

## Query guidance

- Filter by time as early as possible.
- Apply selective `where` clauses before joins and aggregations.
- Use `take` or `limit` during exploration.
- Use `project` to return only required columns.
- Use `summarize` for server-side aggregation rather than processing large raw result sets locally.
- Use `bin()` for time buckets and `percentiles()` for latency distributions.
- Confirm table and column names from the schema instead of guessing.
- Treat empty results as ambiguous: verify the cluster, database, table, and time range before concluding no data exists.

## Resource and query tools

When Azure Kusto MCP tools are available, use:

| Tool | Purpose |
| --- | --- |
| `kusto_cluster_list` | List Azure Data Explorer clusters |
| `kusto_database_list` | List databases in a cluster |
| `kusto_table_schema_get` | Inspect a table schema |
| `kusto_query` | Execute a KQL query |

Typical parameters are `subscription`, `cluster`, `database`, `table`, and `query`. A cluster name normally excludes the `.kusto.windows.net` suffix.

## Azure CLI fallback

If Kusto MCP tools are unavailable, use Azure CLI for resource discovery:

```bash
az kusto cluster list --resource-group <resource-group>
az kusto database list --cluster-name <cluster> --resource-group <resource-group>
az kusto cluster show --name <cluster> --resource-group <resource-group>
az kusto database show --cluster-name <cluster> --database-name <database> --resource-group <resource-group>
```

Queries can be sent through the Kusto REST endpoint:

```bash
az rest --method post \
  --url "https://<cluster>.<region>.kusto.windows.net/v1/rest/query" \
  --body "{ \"db\": \"<database>\", \"csl\": \"<kql-query>\" }"
```

## Troubleshooting

- Access denied: verify the active tenant and that the identity has at least database Viewer permissions.
- Query timeout or high CPU: narrow the time range, filter earlier, reduce joins, and limit returned columns.
- Syntax errors: check pipe placement, operator names, quoting, and table or column spelling.
- Empty results: widen the time range and verify ingestion delay, database, and table selection.
- Cluster not found: verify subscription, resource group, region, and the short cluster name.

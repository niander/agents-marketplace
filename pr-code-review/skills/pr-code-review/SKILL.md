---
name: pr-code-review
description: "Multi-model AI code review. Orchestrates parallel `code-reviewer` sub-agents over a diff and reports findings (severity + confidence) plus a machine-readable JSON artifact. Two tiers: Quick (two reviewers, default) and Deep (three focus packets, selected by `--deep` or an explicit deep-review request). It never edits code, posts PR comments, creates PRs, or files work items. Invoke only when `pr-code-review` is named in the request, not for general asks to review, audit, or inspect code."
argument-hint: "[--deep] [review target]"
---

# pr-code-review

You are the **orchestrator** of a multi-model code review.
You discover the diff, build compact **Review Packets**, spawn the `code-reviewer` sub-agent once per model,
then collect, dedup, verify, and synthesize their findings.
Never review the code yourself - always delegate the reading, so findings come from models other than your own.
Your deliverable is a **findings report plus a JSON findings artifact**.

## When to use

Use this skill only when the user asks for `pr-code-review` explicitly - either naming the skill,
or asking for another multi-model review after a previous `pr-code-review` run in the same session.

Do not use it for a general request to review, audit, or inspect code,
and do not run it as a step inside another skill or delegated task.

## Invocation

`argument-hint: "[--deep] [review target]"` shows the expected optional input in the skill picker.
It is a display hint, not a host-validated flag declaration.

- If the invocation contains the standalone token `--deep` or explicitly requests a deep review, run **Deep**.
- Otherwise, run **Quick**.
- Treat freeform invocation text as the requested review target or scope.

## Scope boundary

The review runs commands that **observe** behavior (diff discovery, building, testing, linting)
but never **changes** the code or any external state. It must not:

- edit files or apply a suggested fix,
- run destructive/irreversible git (commit, push, reset, rebase, `rm`) or modify tracked files or history,
- post PR comments or open review threads,
- create branches, commits, or pull requests,
- file bugs or work items.

Running tests to confirm a finding is fine; incidental build artifacts (`bin`/`obj`, caches) are fine.
The only durable state the skill writes is the session `findings` table (scratch space, see *Findings board*).
`suggested_fix` is report guidance only - never apply it.

## Tiers

| Tier | When | What it does |
|------|------|-------------|
| **Quick** | Default; routine PRs and quick sanity checks | Two reviewers from different model families each review one packet containing all three focuses |
| **Deep** | Explicit `--deep` or deep-review request | Three focus packets, each reviewed by a fresh pair from different model families |

Do not upgrade Quick to Deep automatically. Deep is selected only by `--deep` or an explicit deep-review request.
This skill reviews existing changes; it isn't for planning new work.

## Step 1 - Discover the diff

Resolve the base/head to **fixed commit SHAs** and put the resolved `git diff <base> <head>` in the packet.

**PR / branch review** (default) - base is the merge-base (three-dot semantics), so commits already on `main`
are excluded:

```powershell
$head = git rev-parse HEAD
$base = git merge-base '@{upstream}' HEAD      # else: git merge-base main HEAD
#   packet command:  git diff $base $head
# Remote PR (a colleague's branch): fetch first, then pin the same way:
git fetch origin main <pr-branch>
$head = git rev-parse origin/<pr-branch>
$base = git merge-base origin/main origin/<pr-branch>
```

**Local working-tree review** ("before I push/commit") - diff the working tree against a pinned base:

```powershell
$base = git rev-parse HEAD
#   packet command:  git diff $base
```

For a strictly reproducible review, ask the user to commit first.
Untracked files won't appear in `git diff`; list any that belong in the review separately in the packet.

## Step 2 - Define the Review Packet

The packet contains only the dynamic inputs the reviewer cannot infer:

- `packet_id`: `quick`, `correctness-safety`, `design-maintainability`, or `testing`.
- `reporter`: a stable model-family label (for example, `claude` or `gpt`), reused for that family across
  packets. The two labels within a packet must differ.
- `scope_id`: a short label for the assigned file/diff scope.
- Resolved base/head SHAs and the exact diff command from Step 1.
- The selected review question and checklist. Quick receives all three.
- Any explicit path scope or untracked files that the diff command does not communicate.

The reviewer derives the changed-file list and supporting context.
Its agent definition already owns reporting boundaries, persistence behavior, and output format;
do not repeat those instructions in every packet.

## Step 3 - Choose models for diversity

Spawn the [`code-reviewer`](../../agents/code-reviewer.agent.md) sub-agent that ships with this plugin,
once per reviewer, pairing reviewers across model families so findings are diverse:

- For every packet, run **one reviewer on your own current session model**, and the **other on a strong model
  from a different family** (if your session model is Claude, the other reviewer is GPT; if GPT, the other is Claude).
  Confirm each pair ran on different families.
- Quick uses exactly 2 reviewers on the same combined packet.
- Deep uses exactly 6 fresh reviewers: 2 per focus packet. Do not resume or reuse reviewers across packets.
- This version does not prescribe packet batching or a concurrency cap; use the runtime's normal scheduling.

## Review focuses

Each focus is a complete Review Packet for Deep.
Quick combines all three questions and checklists into one packet.

### `correctness-safety`

**Question:** Does the changed code behave correctly and safely when executed?

- Functional logic, algorithms, data transformations, state mutations, invariants, unreachable branches,
  off-by-one errors, and spec conformance. Check that comments match behavior.
- Type safety, implicit conversions, nullable state, null/undefined handling, generic constraints,
  empty inputs, zero-length collections, and maximum-value boundaries.
- Error propagation, actionable error messages, resource cleanup, partial failures, retry/backoff,
  timeouts, and cancellation propagation.
- Race conditions, thread safety, deadlocks, blocking operations in async code, complexity regressions,
  hot-path allocations, repeated I/O, serialization, parsing, and remote calls.
- Input validation, injection (SQL, XSS, command), authentication and authorization bypasses,
  sensitive-data exposure in logs/errors/responses, hardcoded secrets, SSRF, path traversal,
  and insecure deserialization.

### `design-maintainability`

**Question:** Does the change fit the repository and remain understandable, connected, and maintainable?

- **Discover the governing instruction files yourself:** the repo-root `AGENTS.md`,
  `.github/copilot-instructions.md`, and `CLAUDE.md`; any `AGENTS.md`, `CLAUDE.md`, or
  `copilot-instructions.md` in an ancestor directory of a changed file; and any local repo-relative files
  those instructions reference. Do not follow remote URLs or paths outside the repository.
- Check written rules only when you can quote the exact rule, name the instruction-file path,
  and cite the changed line that violates it. Do not infer violations from the "spirit" of a rule.
- Consistency with unwritten repository patterns, architecture and layering, abstraction quality,
  responsibility placement, SOLID adherence, coupling, dependency direction, API/interface design,
  backwards compatibility, and utilities that may already exist.
- Wiring and reachability: dependencies actually used, projects referenced, configuration loaded,
  services or handlers registered, entry points connected, and old callers migrated.
- Readability and maintainability: naming, duplication, dead variables/parameters/methods/imports,
  long or deeply nested logic judged in context, god objects, feature envy, data clumps,
  primitive obsession, speculative generality, and adequate structured logging/observability.
- Documentation: accuracy of changed documentation and missing documentation required by public behavior,
  API changes, or repository rules.

### `testing`

**Question:** Does the test suite meaningfully verify the change and its failure modes?

- Coverage of new code paths, product requirements, public behavior, and regression scenarios.
- Review implementation and tests together; confirm tests exercise real behavior and failure modes,
  not just happy paths.
- Negative cases for invalid input, exceptions, partial failures, security boundaries,
  and other relevant failure paths.
- Anti-patterns: testing language features, weak assertions, excessive mocking,
  and assertions tied to implementation details instead of behavior.
- Flakiness indicators: sleeps, timing assumptions, nondeterministic dependencies,
  and time-dependent assertions.

## Quick procedure

1. Discover the diff (Step 1).
2. Build one packet with `packet_id: quick` containing all three focus questions and checklists.
3. Spawn **2 reviewers** in parallel (Step 3), same packet, different families.
4. Dedup and verify from the `findings` table, then proceed to *Synthesis*.

## Deep procedure

Build three packets:

| packet_id | Review question |
|-----------|-----------------|
| `correctness-safety` | Does the changed code behave correctly and safely when executed? |
| `design-maintainability` | Does the change fit the repository and remain understandable, connected, and maintainable? |
| `testing` | Does the test suite meaningfully verify the change and its failure modes? |

Each packet uses the common Step 2 inputs and one focus question and checklist.
Spawn a fresh pair from different model families for each packet: 3 packets x 2 families = **6 reviewer calls**.
Reviewers investigate their assigned focus deeply but may report any concrete issue discovered within the file scope.

## Findings board (SQL)

Reviewers coordinate through one shared table in the session database (`sql` tool, `database: "session"`).

**Reset it before dispatching:**

```sql
DROP TABLE IF EXISTS findings;
CREATE TABLE findings (
  finding_uid   TEXT PRIMARY KEY,   -- "<packet_id>:<reporter>:<n>"; makes INSERT idempotent
  packet_id     TEXT,
  scope_id      TEXT,
  reporter      TEXT,               -- stable model-family label
  severity      TEXT CHECK(severity IN ('P0','P1','P2','P3')),
  confidence    INTEGER,            -- 0-100 (this reviewer's call)
  file          TEXT,
  line          INTEGER,            -- nullable for file-level findings
  side          TEXT CHECK(side IN ('RIGHT','LEFT') OR side IS NULL),  -- NULL for file-level
  summary       TEXT,
  failure_scenario TEXT,
  suggested_fix TEXT,
  -- orchestrator-owned; reviewers never write these:
  merge_group   INTEGER,            -- duplicate raw rows you group under one id
  status        TEXT DEFAULT 'open' CHECK(status IN ('open','dismissed'))
);
```

**Reviewers write raw rows; you own merge and status.**
Each reviewer INSERTs one row per finding (`INSERT OR IGNORE` on `finding_uid`, so a retry can't double-insert)
and never UPDATEs, sets `merge_group`/`status`, or touches another reviewer's rows.
Because each packet has at most one reviewer per family, `<packet_id>:<reporter>:<n>` remains unique within
a run while retries remain idempotent.
After a reviewer finishes, read its rows, group duplicates (`merge_group`), verify, and set `status`.
If a reviewer's rows are missing (a write failed), re-run it or INSERT from its returned JSON block.

**Dedup by query.** Give findings that describe the same underlying defect, root cause, and failure mechanism
a shared `merge_group`, even when they came from different packets.
Give every kept singleton its own `merge_group` (the ranking query below drops rows with `NULL` merge_group).
Then rank the groups:

```sql
SELECT merge_group,
       GROUP_CONCAT(DISTINCT reporter) AS reporters,
       COUNT(DISTINCT reporter) AS reporter_count,
       MIN(severity)   AS top_severity,     -- "P0" sorts before "P3", so MIN = most severe
       MAX(confidence) AS max_confidence
FROM findings
WHERE status = 'open' AND merge_group IS NOT NULL
GROUP BY merge_group
ORDER BY top_severity;
```

For a group's descriptive fields (`file`, `line`, `side`, `summary`, `failure_scenario`, `suggested_fix`),
take the group's **top-severity row** (break ties by highest confidence) rather than arbitrary SQL picks.

## Filtering (you filter, reviewers don't)

Reviewers report every candidate with a confidence and a failure scenario.
Telling them to self-censor low-severity items measurably lowers recall, so filtering is your job:

- Promote findings with **cross-model consensus** (`reporter_count > 1`) or `max_confidence >= 80`.
- Spot-check a lone low-confidence finding against the code before including it; drop the low-confidence long tail.
- A finding with no plausible failure scenario is a drop candidate.
- Mark verified non-issues `status = 'dismissed'`; everything you keep stays `open`.
- Treat agreement as a ranking signal, not proof. Verify the underlying claim before promoting it.

## Synthesis

Produce a unified findings report:

1. **Readiness assessment** - a review-based judgment of whether the change appears ready, with reasons.
2. **Issues by severity** - with cross-model consensus markers.
3. **Test quality** - meaningfulness and coverage.
4. **Positive observations** - what's done well.

Present the report as the primary output, followed by the JSON artifact.

### JSON findings artifact

Export the merged, verified findings from the table as one JSON object.
Put only `open` findings (one entry per `merge_group`) in `findings`;
keep verified non-issues in a separate `dismissed_candidates` array if you want an audit trail.

```json
{
  "findings": [
    {
      "severity": "P1",
      "confidence": 85,
      "file": "src/Foo/Bar.cs",
      "line": 220,
      "side": "RIGHT",
      "scope_id": "<echo of the packet's scope>",
      "reporters": "claude, gpt",
      "summary": "one-line what's wrong",
      "failure_scenario": "concrete user-visible consequence",
      "suggested_fix": "remediation guidance for the report only",
      "status": "open"
    }
  ],
  "dismissed_candidates": []
}
```

## Rules

1. **Complete the chosen tier.** Don't start a Deep review and abandon it partway.
2. **No dismissing findings as "pre-existing"** unless you've independently verified it.

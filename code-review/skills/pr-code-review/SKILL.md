---
name: pr-code-review
description: "Multi-model AI code review. Orchestrates parallel `code-reviewer` sub-agents over a diff and reports findings (severity + confidence) plus a machine-readable JSON artifact. Two tiers — Lightweight (two reviewers) and Full (per-focus packets). It never edits code, posts PR comments, creates PRs, or files work items."
user-invocable: true
disable-model-invocation: true
---

# pr-code-review

You are the **orchestrator** of a multi-model code review.
You discover the diff, build a compact **Review Packet**, spawn the `code-reviewer` sub-agent once per model,
then collect, dedup, verify, and synthesize their findings.
Never review the code yourself — always delegate the reading, so findings come from models other than your own.
Your deliverable is a **findings report plus a JSON findings artifact**.

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
`suggested_fix` is report guidance only — never apply it.

## Tiers

| Tier | When | What it does |
|------|------|-------------|
| **Lightweight** | Small-to-medium changes, routine PRs, quick sanity check | Two parallel reviewers (one per model family) each cover ALL focus areas on one packet |
| **Full** | Major features, security-sensitive changes, large refactors, or explicit request | Seven focus packets, each reviewed by 2 diverse-family reviewers |

**Lightweight** — use freely for "review this", "take a look", "is this ready?", a pre-PR sanity check,
or small-to-medium routine changes.

**Full** — only with clear signal: the user asks for a thorough review; a major feature is being finalized;
security-sensitive changes (auth, input validation, secrets); or a large PR.

This skill reviews existing changes; it isn't for planning new work.

## Step 1 — Discover the diff

Resolve the base/head to **fixed commit SHAs** and put the resolved `git diff <base> <head>` in the packet.

**PR / branch review** (default) — base is the merge-base (three-dot semantics), so commits already on `main` are excluded:

```powershell
$head = git rev-parse HEAD
$base = git merge-base '@{upstream}' HEAD      # else: git merge-base main HEAD
#   packet command:  git diff $base $head
# Remote PR (a colleague's branch): fetch first, then pin the same way:
git fetch origin main <pr-branch>
$head = git rev-parse origin/<pr-branch>
$base = git merge-base origin/main origin/<pr-branch>
```

**Local working-tree review** ("before I push/commit") — diff the working tree against a pinned base:

```powershell
$base = git rev-parse HEAD
#   packet command:  git diff $base
```

For a strictly reproducible review, ask the user to commit first.
Untracked files won't appear in `git diff`; to review one, name it in the changed-file list so a reviewer opens it with `view`.

## Step 2 — Build the Review Packet

The packet is **pointers, not dumps**: the reviewer runs the diff command and discovers instruction files itself. Include:

- **packet_id** and **scope_id** — short labels the reviewer must echo back.
- **base/head SHAs** and the **exact diff command** (from Step 1) for the reviewer to run.
- **changed-file list + stat**, flagging renames, deletions, and binary/generated files.
- **diff scope** — mark whether the command covers the **whole** change or is **scoped** to assigned files;
  for a scoped packet the changed-file list marks what's out of scope.
- **prior findings** — for a sequential packet, the `open`/`dismissed` findings so far (see *Filtering*),
  so reviewers skip `dismissed` items and avoid duplicating `open` ones.
- **focus** — the focus ID(s) **and their checklists** pasted in from *Focus areas*.
- **how to persist** — the `findings` table name, the reviewer's `reporter` label, its `packet_id`,
  and the `finding_uid` scheme; tell it to write rows **and** return the JSON block.

## Step 3 — Choose models for diversity

Spawn the [`code-reviewer`](../../agents/code-reviewer.agent.md) sub-agent that ships with this plugin,
in the background, once per reviewer, pairing the two across model families so findings are diverse:

- Run **one reviewer on your own current session model**, and the **other on a strong model from a
  different family** (if your session model is Claude, the other reviewer is GPT; if GPT, the other is Claude).
  Confirm the two ran on different families.
- **Caps:** Lightweight = exactly 2 reviewers. Full = the packet plan below (or the Large-PR plan), no more.
  Don't spawn extra reviewers when models disagree — default to the higher severity.

## Focus areas (checklists)

Paste the checklist(s) for a packet's focus ID(s) into it (Step 2) and tell the reviewer to work through every item.
The procedures below decide which IDs go in which packet.

### `correctness-security`
- Logic errors, incorrect algorithms, dead code, unreachable branches.
- Null/undefined handling gaps; null-reference risk in chained operations.
- Race conditions, thread-safety, deadlock potential in concurrent code.
- Input validation gaps; injection (SQL, XSS, command); auth/authz bypasses.
- Sensitive data exposure in logs/errors/responses; hardcoded secrets.
- SSRF, path traversal, insecure deserialization.
- Spec conformance: does the code do what it claims? Do comments match behavior?

### `architecture`
- Consistency with existing, **uncodified** codebase patterns
  (formal instruction-file rule violations belong to `conventions`, not here).
- Abstraction quality: right level? Leaky abstractions? SOLID adherence.
- Coupling that should be loose; dependencies flowing the wrong direction.
- Reinventing utilities that already exist (use `grep`/`glob` to check).

### `edge-cases-resilience`
- Error handling: swallowed errors, empty catch blocks, missing propagation.
- Unclear or unhelpful error messages.
- Boundary conditions: empty inputs, nulls, max values, zero-length collections.
- Resource cleanup on failure (IDisposable, using/try-finally).
- Partial-failure states in multi-step operations.
- Missing retry/backoff for transient failures; missing timeouts for external calls.
- CancellationToken propagation through async chains.

### `testing`
- Are all new code paths tested? Are product requirements covered?
- Review implementation and test code together: do tests exercise the real failure modes, not just happy paths?
  Untested exception paths that could crash production are correctness bugs, not just coverage gaps.
- Anti-patterns: testing language features, weak assertions (only `!= null`), over-mocked tests,
  asserting implementation details instead of behavior.
- Missing negative cases for error paths and invalid inputs.
- Flaky indicators: sleep/delay, time-dependent assertions.

### `detailed-correctness`
- Trace each code path: is data transformed correctly at each step?
- Type safety: implicit conversions, nullable misuse, generic constraints.
- Off-by-one errors in loops, indices, string operations.
- State management: are invariants maintained? Is state mutated correctly?

### `polish-performance`
- O(n^2) or worse where O(n) is achievable; unnecessary allocations in hot paths.
- Blocking operations in async contexts (`.Result`, `.Wait()`).
- Unused/dead code: variables, parameters, methods, imports.
- Redundant or duplicated logic that should be consolidated.
- Logging/observability: adequate structured logging at the right levels.
- Naming clarity: descriptive, consistent, unambiguous.

### `code-smells`
- Long methods (>50 lines), deep nesting (>3 levels), god classes/functions.
- Copy-paste (DRY violations), feature envy, data clumps, primitive obsession.
- TODO/FIXME accumulation; speculative generality (over-engineering).

### `wiring`
- New packages/dependencies added but never imported or used.
- New projects in the solution but not referenced by any other project.
- Suspicious cross-component references introducing coupling between unrelated areas.
- Config/environment variables defined but never loaded.
- Old patterns that should have been replaced by newly added capabilities.

### `conventions`
- **Discover the instruction files yourself** — their contents are not in the packet.
  Find the ones governing the changed code:
  the repo-root `AGENTS.md`, `.github/copilot-instructions.md`, and `CLAUDE.md`;
  any `AGENTS.md`/`CLAUDE.md`/`copilot-instructions.md` in a directory that is an ancestor of a changed file
  (a directory's file applies only to files at or below it);
  and any further files those reference (local, repo-relative references only — no remote URLs, nothing outside the repo).
  Read each that exists.
- Check the diff for **clear violations** of the rules they state —
  logging, DI, naming, test-framework, error-handling, file-placement, and any repo-specific musts.
- **Only flag a violation you can pin down:** quote the exact rule and cite the exact changed line that breaks it.
  No style preferences, no vague "spirit of the doc" inferences.
- Name the instruction-file path and quote the rule in each finding;
  in `failure_scenario`, state which rule is broken and the concrete consequence.
- If no instruction file applies to the changed files, report nothing for this area.

## Lightweight procedure

1. Discover the diff (Step 1) and build one packet (Step 2) with **all** focus IDs:
   `correctness-security, architecture, edge-cases-resilience, testing, detailed-correctness, polish-performance, code-smells, wiring, conventions`.
2. Spawn **2 reviewers** in parallel (Step 3), same packet, different families.
3. Dedup and verify from the `findings` table, then proceed to *Synthesis*.

## Full procedure

Seven focus packets, each reviewed by 2 different-family reviewers.
Testing sits with implementation review (not last) so reviewing implementation alongside tests
surfaces correctness bugs, not just coverage gaps.

| Packet | Focus ID | Notes |
|--------|----------|-------|
| **P1** | `correctness-security` | Broad sweep |
| **P2** | `architecture` | Design, structure |
| **Verification** | `code-smells`, `wiring` | One packet bundling both IDs |
| **P3** | `edge-cases-resilience` | Failure modes, robustness |
| **P4** | `testing` | Test meaningfulness, untested failure modes |
| **P5** | `detailed-correctness`, `polish-performance` | Line-by-line, data flow, dead code, perf |
| **P6** | `conventions` | Self-discovers instruction files, flags rule violations |

The `P` labels are stable packet identities, not an execution order: 7 packets × 2 families = **14 reviewer calls**.

**Run packets in parallel** — dispatch concurrently in batches within the runtime's parallelism cap.
Run a packet sequentially only to feed a prior packet's confirmed findings forward as dedup context (Step 2)
when it meaningfully cuts duplicate reporting.

### Large PRs (>2000 lines)

Use a read-only exploration pass (e.g. an `explore` agent) to group the changed files into:
component groups, implementation-test pairings, and cross-cutting files (shared interfaces, configs, DI).
Then build **scoped packets**, each with a diff command narrowed by pathspec to its files:

| Reviewer | Scope | Focus |
|----------|-------|-------|
| **Cross-cutting** | Once, whole PR | `architecture`, `code-smells`, `wiring`, `conventions` |
| **Per-component** | Parallel across groups | `correctness-security`, `edge-cases-resilience`, `detailed-correctness`, `polish-performance` |
| **Paired** | Parallel across impl+test pairs | `testing` |

Each scoped packet still carries the full changed-file list and a "scoped" marker.
The shared `findings` table keeps this fan-out coordinated and resumable across the many reviewers.

## Findings board (SQL)

Reviewers coordinate through one shared table in the session database (`sql` tool, `database: "session"`).

**Reset it before dispatching:**

```sql
DROP TABLE IF EXISTS findings;
CREATE TABLE findings (
  finding_uid   TEXT PRIMARY KEY,   -- "<packet_id>:<reporter>:<n>"; makes INSERT idempotent
  packet_id     TEXT,
  scope_id      TEXT,
  reporter      TEXT,               -- model family / round that raised this row
  severity      TEXT CHECK(severity IN ('P0','P1','P2','P3')),
  confidence    INTEGER,            -- 0-100 (this reviewer's call)
  file          TEXT,
  line          INTEGER,            -- nullable for file-level findings
  side          TEXT CHECK(side IN ('RIGHT','LEFT') OR side IS NULL),  -- NULL for file-level
  focus         TEXT,
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
After a reviewer finishes, you read its rows, group duplicates (`merge_group`), verify, and set `status`.
If a reviewer's rows are missing (a write failed), re-run it or INSERT from its returned JSON block.

**Dedup by query.** Give plausibly-matching rows (same `file`/`side`, near line, similar intent) a shared `merge_group`,
and **give every kept singleton its own `merge_group`** (the ranking query below drops rows with `NULL` merge_group).
Then rank the groups:

```sql
SELECT merge_group,
       GROUP_CONCAT(DISTINCT reporter) AS reporters,
       MIN(severity)   AS top_severity,     -- "P0" sorts before "P3", so MIN = most severe
       MAX(confidence) AS max_confidence
FROM findings
WHERE status = 'open' AND merge_group IS NOT NULL
GROUP BY merge_group
ORDER BY top_severity;
```

For a group's descriptive fields (`file`, `line`, `side`, `focus`, `summary`, `failure_scenario`, `suggested_fix`),
take the group's **top-severity row** (break ties by highest confidence) rather than arbitrary SQL picks.

## Filtering (you filter, reviewers don't)

Reviewers are coverage-first by design: they report every candidate with a confidence and a failure scenario.
Telling them to self-censor low-severity items measurably lowers recall, so filtering is your job:

- Promote findings with **cross-model consensus** (more than one `reporter`) or `max_confidence >= 80`.
- Spot-check a lone low-confidence finding against the code before including it; drop the low-confidence long tail.
- A finding with no plausible failure scenario is a drop candidate.
- Mark verified non-issues `status = 'dismissed'`; everything you keep stays `open`.

When feeding prior findings forward (Step 2):

- **`dismissed` = hard exclusion** — reviewers must not re-raise these.
- **`open` = known context** — reviewers must not duplicate these *unless* they add new evidence, higher severity,
  or a distinct failure mode. Don't hard-exclude `open` items, or you lose the cross-model / cross-focus
  confirmation that is one of this skill's strongest signals.

## Synthesis

Produce a unified findings report:

1. **Readiness assessment** — a review-based judgment of whether the change appears ready, with reasons.
2. **Issues by severity** — with cross-model consensus markers.
3. **Test quality** — meaningfulness and coverage.
4. **Positive observations** — what's done well.

Present the report as the primary output, followed by the JSON artifact.

### JSON findings artifact

Export the merged, verified findings from the table as one JSON object.
Put only `open` findings (one entry per `merge_group`) in `findings`; keep verified non-issues in a separate `dismissed_candidates` array if you want an audit trail.

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
      "focus": "correctness-security",
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

1. **Complete the chosen scope.** Don't start a Full review and abandon it partway.
2. **No dismissing findings as "pre-existing"** unless you've independently verified it.

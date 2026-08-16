---
name: pr-code-review-ado-report
description: "Report code-review findings to an Azure DevOps pull request. Use when the user asks to post, publish, or report any set of findings in ADO, regardless of where the findings came from. Produces a concise summary, separate P0-P2 threads, P3 findings in the summary, safe inline placement, duplicate detection, stale-source confirmation when commit metadata is available, and write verification. Azure DevOps only."
---

# pr-code-review-ado-report

Report a supplied set of findings to an Azure DevOps pull request.
The findings may come from the conversation, a file, JSON, a database table, another tool, or another agent.

ADO writes require explicit user authorization.
Automatic or model-selected invocation of this skill is not authorization.
If the user has not clearly asked to publish the findings to ADO in the current conversation, prepare the report but ask for confirmation before any write.

## 1. Understand the findings

Collect the findings the user intends to report.
For each finding, preserve these fields when available:

- severity,
- title or summary,
- claim, problem, or description,
- concrete failure scenario,
- evidence or verification,
- suggested fix,
- file and line,
- diff side or deletion status,
- confidence,
- focus or category,
- reporters or supporting sources,
- repository identity,
- source commit or other snapshot identifier.

Preserve the supplied text for these fields verbatim.
Do not expand it, rewrite it into a longer explanation, or invent missing technical claims.
Omit a field when the source does not provide it.
Report P4 or any lower-priority severity label as P3.
If severity is missing or cannot be interpreted as P0-P3, ask the user before posting.
If the supplied material contains raw candidates and verified findings, report only the verified set.
If it is unclear which findings the user approved, ask before writing to ADO.

Before formatting, consolidate findings that describe the same underlying defect, root cause, and failure mechanism,
even when they cite different files or lines.
Preserve all affected locations and supporting evidence, and retain the highest supplied severity and confidence.
Do not merge findings merely because they concern the same component or theme.

## 2. Resolve which pull request

Use an explicit ADO PR URL or ID when supplied.
Otherwise resolve the current git repository and branch, then find its active PR.
If resolution is ambiguous, ask the user to select the PR.
If the findings identify a repository and it does not match the resolved PR repository, stop.
Do not treat a repository mismatch as ordinary staleness.
Keep and report the exact PR URL returned by the available ADO capability; do not construct one manually.

Use any authenticated ADO capability already available in the environment:

1. configured ADO tools,
2. the Azure DevOps CLI,
3. authenticated REST access as a fallback.

Do not install tools, start login flows, or define a dependency on one tool's current parameter names.

## 3. Check whether the findings are stale

When the findings include a source or reviewed commit, compare it with the PR's current source commit.
If they differ, warn the user with both commits and wait for explicit confirmation before posting.
Default to not posting.

If no source commit is available, do not claim that freshness was verified.
Validate each inline location against the current PR diff before using it.
Re-read the PR source commit immediately before the first write; repeat the warning if it changed.

## 4. Prepare the ADO report

### Finding writing contract

Write individual findings in this order:

1. **Title** - severity plus the supplied title or summary.
2. **Review metadata** - a collapsed block containing confidence, focus/category, reporters or supporting
   sources, and source commit when available.
3. **Claim** - what is wrong and why it is a defect.
4. **Failure scenario** - the concrete consequence.
5. **Evidence** - how the finding was verified.
6. **Suggested fix** - include only when the supplied finding already contains one.

Omit missing fields rather than filling them with generic prose.
Do not add an implementation plan.
Do not add an introduction, conclusion, compliment, or other boilerplate to an individual finding.

Use this shape, omitting unavailable lines:

```markdown
**P1: Brief finding title**

<details>
<summary>Review metadata</summary>

- Confidence: 92/100
- Focus: correctness
- Found by: reviewer-a, reviewer-b
- Commit: abc1234

</details>

**Claim:** What is wrong and why it is a defect.

**Failure scenario:** The concrete consequence.

**Evidence:** How the finding was verified.

**Suggested fix:** Brief supplied remediation.
```

Create one PR-level summary containing:

- the source of the findings when known,
- source/reviewed commit and current PR commit when known,
- a stale-source warning when the user confirmed posting stale findings,
- readiness or overall assessment when supplied,
- severity counts,
- a concise list of every finding,
- full P3 details using the same visible fields and collapsed review-metadata block.

Use this summary shape:

```markdown
## Code review findings

Reviewed: <source or commit when known>
Assessment: <readiness or overall assessment when supplied>
Counts: P0=<n>, P1=<n>, P2=<n>, P3=<n>

### Findings
- **P1: Brief title** (`path/to/file.cs:42`)
- **P2: Brief title** (`path/to/other.cs:18`)

### P3 details
<full P3 findings using the individual finding template>
```

Omit unavailable metadata lines and omit `### P3 details` when there are no P3 findings.

Create a separate comment for every P0, P1, and P2 finding using the finding writing contract.

P3 findings appear only in the summary.
Do not create individual P3 threads.

If the complete summary cannot fit in one ADO comment, try once to shorten only the summary prose and
the concise P0-P2 list.
Do not rewrite or truncate the full supplied P3 fields.
If it fails again, report the failure to the user and ask how to proceed.

## 5. Place individual findings

Use an inline thread when either:

- the finding has a repository-relative file and valid line,
  refers to a changed line on either side of the diff,
  and the current PR iteration still contains the relevant changed line; or
- the finding applies to a single file without a line,
  and that file appears in the current PR diff.

Use a right-side anchor for added or modified lines,
and a left-side anchor for removed lines.
Use a PR-level thread for the rest.

Never attach a finding to an arbitrary nearby line.

## 6. Avoid duplicate reports

Before posting, list existing PR threads across all statuses and all result pages.
Exclude deleted threads and deleted comments.
Skip a finding only when a non-deleted existing comment has the same normalized file, side, line, Title, and Claim.
For PR-level findings without a line, compare the available file, Title, and Claim.
Skip the summary only when the same visible summary body is already present.
Do not infer thread presence or resolution from high-level PR status, reviewer decisions, replies, or comment counts.
Do not treat similar wording alone as proof of duplication.
Do not update or reopen an existing matching thread in this version.

## 7. Post and verify

Before the first write, verify that the user's authorization applies to the resolved PR and the findings being posted.
If the target PR or finding set changed after authorization, ask again.

Post the summary first, then missing P0-P2 comments.
Do not change votes, reviewers, thread statuses, work items, PR completion settings, or code.
Do not request review or @-mention reviewers, teams, or code owners.
This skill creates new finding threads; it does not answer or resolve existing review discussions.

If a write fails because of permissions or an unsupported thread operation, do not retry indefinitely.
Continue with independent comments when safe, then report the exact blocked writes.

After writing, re-read all PR thread pages and verify that every intended visible comment appears exactly once.

Report:

- PR ID or URL,
- summary posted or already present,
- P0-P2 threads posted inline,
- P0-P2 threads posted at PR level,
- duplicates skipped,
- P3 findings included in the summary,
- any failed or blocked writes.

Do not claim success from write responses alone.

## Boundaries

- Azure DevOps only.
- Findings reporting only.
- No code edits, commits, pushes, PR creation, work items, votes, reviewer changes, or thread resolution.
- Never post stale findings without explicit user confirmation.
- Never treat skill invocation alone as authorization to write to ADO.

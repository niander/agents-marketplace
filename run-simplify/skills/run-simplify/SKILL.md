---
name: run-simplify
description: "Reviews the changed code for reuse, simplification, efficiency, and altitude cleanups, using 4 independent subagents. Applies fixes at the end. Quality only — it does not hunt for correctness bugs. Invoke only when `run-simplify` is named in the request, not for general asks to simplify, clean up, or refactor code."
metadata:
  source: Adapted from the Claude Code built-in `simplify` skill.
---

# When to use

Use this skill only when the user asks for `run-simplify` explicitly — either naming the skill, or asking for another "simplify" run after a previous `run-simplify` in the same session.

Do not use it for a general request to simplify, clean up, or refactor code, and do not run it as a step inside another skill or delegated task.

# Instructions

You are improving the quality of the changed code, not hunting for bugs.
Review it for reuse, simplification, efficiency, and altitude issues, then fix what you find.
Do not look for correctness bugs.

## Phase 0 — Gather the diff

Run `git diff @{upstream}...HEAD` (or `git diff main...HEAD` / `git diff HEAD~1` if there's no upstream) to get the unified diff under review.
If there are uncommitted changes, or the range diff is empty, also run `git diff HEAD` and include the working-tree changes in scope — the review often runs before the commit.
If a PR number, branch name, or file path was passed as an argument, review that target instead.
Treat this diff as the review scope.

## Phase 1 — Review (4 cleanup agents in parallel)

Launch **4 independent general-purpose agents** using whatever subagent/task tool the harness provides, all in a single message so they run concurrently.
Pass each agent the diff and one of the four angles below.
Each returns its findings with `file`, `line`, a one-line `summary`, and the concrete cost (what is duplicated, wasted, or harder to maintain).

If no subagent tool is available, make the four passes yourself instead — one angle at a time, each a separate read of the diff.
Keep them separate; one combined pass blurs the angles and finds less.
If the harness has a task/todo tool, use it to track the four passes.

### Reuse

Flag new code that re-implements something the codebase already has — search shared/utility modules and files adjacent to the change, and name the existing helper to call instead.

### Simplification

Flag unnecessary complexity the diff adds: redundant or derivable state, copy-paste with slight variation, deep nesting, dead code left behind.
Name the simpler form that does the same job.

### Efficiency

Flag wasted work the diff introduces: redundant computation or repeated I/O, independent operations run sequentially, blocking work added to startup or hot paths.
Also flag long-lived objects built from closures or captured environments — they keep the entire enclosing scope alive for the object's lifetime (a memory leak when that scope holds large values); prefer a class/struct that copies only the fields it needs.
Name the cheaper alternative.

### Altitude

Check that each change is implemented at the right depth, not as a fragile bandaid.
Special cases layered on shared infrastructure are a sign the fix isn't deep enough — prefer generalizing the underlying mechanism over adding special cases.

## Phase 2 — Apply the fixes

Once all four angles are in, dedup findings that point at the same line or mechanism, and fix each remaining one directly.
Skip any finding whose fix would change intended behavior, require changes well outside the reviewed diff, or that you judge to be a false positive — note the skip rather than arguing with it.
Finish with a brief summary of what was fixed and what was skipped (or confirm the code was already clean).

---
name: remove-llm-reasoning
description: Remove nasty LLM reasoning that leaked into code and documentation.
---

# Check Reasoning

Go back over the modified files and find your own reasoning where it does not belong.

## In code

Comments and docstrings carry what a reader cannot see: how an external system behaves, a non-obvious invariant, control flow that would otherwise look like a mistake.

They do not carry historical implementation decisions, future planned work, or the reason for the decisions taken unless it is important to understand the code.

Delete a clause and ask what the reader can no longer do. If the answer is nothing, it was reasoning.

## In documentation

Documentation describes the system as it is, and has to stay true after the current work closes.

Open decisions, progress, known gaps, and work-item references are not that.

## Where it belongs

If the work is tracked somewhere, that is where decisions, caveats, and history go.

Read it. Confirm they are there, that nothing in it describes an approach you have since replaced, and that anything you chose not to fix is written down. Do not assume any of that.

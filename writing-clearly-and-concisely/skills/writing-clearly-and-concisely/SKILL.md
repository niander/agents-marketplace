---
name: writing-clearly-and-concisely
description: Use when writing or editing a substantial document for human readers, e.g., documentation, READMEs, design docs, reports, articles. Also when the user asks to make existing text clearer or tighter, or to stop it sounding AI-generated. Contains Strunk's principles of composition plus a field guide to AI writing tells. Not for short prose, such as chat replies, commit messages, or single comments.
---

# Writing Clearly and Concisely

## Overview

Two references on the same subject from opposite directions. Strunk describes what good prose is built from. The AI-tells guide catalogues what shows up when it isn't.

## When to Use This Skill

Use it for substantial prose someone will sit down and read:

- Documentation, READMEs, guides, technical explanations
- Design docs, proposals, postmortems, reports
- Articles, announcements, long-form summaries
- Any editing pass meant to make existing text clearer, tighter, or less AI-sounding

## Strunk's rules

From *The Elements of Style* (1918).

### Main points

**Elementary Rules of Usage (Grammar/Punctuation)**:

1. Form possessive singular by adding 's
2. Use comma after each term in series except last
3. Enclose parenthetic expressions between commas
4. Comma before conjunction introducing co-ordinate clause
5. Don't join independent clauses by comma
6. Don't break sentences in two
7. Participial phrase at beginning refers to grammatical subject

**Elementary Principles of Composition**:

8. One paragraph per topic
9. Begin paragraph with topic sentence
10. **Use active voice**
11. **Put statements in positive form**
12. **Use definite, specific, concrete language**
13. **Omit needless words**
14. Avoid succession of loose sentences
15. Express co-ordinate ideas in similar form
16. **Keep related words together**
17. Keep to one tense in summaries
18. **Place emphatic words at end of sentence**

### Reference files

Rules 1-7 are correctness, and stand on their own as a checklist. Rules 8-18 are craft.

Treat all of them as defaults with reasons, not commandments. Rule 10 makes this explicit about its own subject: the passive is right whenever the thing acted upon is what the paragraph is about.

Load [03-elementary-principles-of-composition.md](./elements-of-style/03-elementary-principles-of-composition.md) when writing or tightening prose. It carries Strunk's reasoning and worked examples for rules 8-18.

## AI writing tells

What fills the page when prose is generated rather than known. The patterns that recur most:

- **Puffery:** pivotal, crucial, vital, testament, enduring legacy
- **Empty "-ing" phrases:** ensuring reliability, showcasing features, highlighting capabilities
- **Promotional adjectives:** groundbreaking, seamless, robust, cutting-edge
- **Overused AI vocabulary:** delve, leverage, multifaceted, foster, realm, tapestry
- **Formatting overuse:** excessive bullets, emoji decorations, bold on every other word

These are signs, not verdicts. Every one has legitimate uses, and some things that feel like tells point the wrong way: perfect grammar, bland prose, and unusual words are not evidence. Treating the catalogue as a checklist does its own damage.

Load [signs-of-ai-writing.md](./signs-of-ai-writing.md) when text reads as AI-generated.

## How the two references connect

Rule 12 from *The Elements of Style*: Prefer the specific to the general, the definite to the vague, the concrete to the abstract. Example:

> A period of unfavorable weather set in. → It rained every day for a week.

The AI-tells guide catalogues what appears when the right-hand side isn't available: *marking a pivotal moment*, *plays a vital role*, *reflecting its continued relevance*. Those phrases arrive to fill a gap where a specific fact was missing. They are the symptom; the missing fact is the problem.

So when one turns up in your own draft, the question is not which words to swap for which. It is what you actually know. What does this thing do, what did it cost, when does it break, who decided and why. Write that.


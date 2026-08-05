---
name: human-message-style
description: Rules for drafting team-facing or collaborative chat/email messages and short summaries. Use whenever the user asks for help drafting a message, an announcement, a Teams message, an email, or any short-form writeup intended for human collaborators. Prevents LLM-flavored documentation-page output, smart typography, and author-process metadata leaks. Do NOT use for actual documentation pages, design docs, formal specs, or PR descriptions.
---

# human-message-style

Rules for drafting chat / email messages and short summaries intended for human teammates. Saves the user from iterating an LLM-flavored corporate writeup into something that reads like a human typed it.

## WHEN TO USE

- User asks for a summary, update, status note, announcement, or "share with the team" writeup
- User says "draft a Teams message" / "draft an email"
- User asks to convert a longer doc / report into a shareable short message
- PR comments, code review notes, or messages to a PR author
- Any short-form writeup where the audience is human teammates, not future-readers-of-a-spec

## WHEN NOT TO USE

- Drafting actual documentation pages (use the relevant docs skill instead)
- Writing the PR description field itself (PR comments and review notes are fine - see above)
- Drafting formal specs, design docs, or RFCs
- Multi-paragraph essays where the reader expects exposition

## Core principle

A chat/email message is NOT a documentation page. The reader is a busy teammate, not someone reading a manual. They want to know what shipped, what matters about it, and whether they need to do anything. They do not want section headings, status badges, marketing language, or LLM-flavored typography.

## Content rules

1. **Lead with what shipped.** No project-status preamble, no "I'm excited to share..." opener.

2. **Include only what the reader needs to decide or act on.** Typically: what improved, by how much, on what, why, any caveats. Drop everything else.

3. **Drop author-process metadata.** Reader does not care about:
   - Branch names, commit counts, commit SHAs
   - Test counts ("1079 tests pass")
   - Internal tool names that aren't the reader's interface
   - Self-deprecating status ("still polishing", "sorry it's rough"). Keep status the reader needs to act on ("merge pending until Tuesday", "behind a flag", "rolling out next week").

4. **When generalizing ("why this works", "key takeaways"), prefer lessons that generalize over single-observation specifics.** If the reader can use the lesson elsewhere, lead with that. Save benchmark-specific observations for inline detail.

5. **Be precise about scope.** If a claim is true only for a subset, say so inline. Do not write "X is faster" when the truth is "X is faster on three of five benchmarks." This is the #1 source of misleading summaries.

## Style rules

6. **Plain ASCII only.** Use only characters in the printable-ASCII range (codepoints 0x20–0x7E). Any non-ASCII character in a draft is a tell that an LLM wrote it, because humans typing on a keyboard almost never produce these — they require autocorrect, an IDE shortcut, or explicit insertion, none of which a teammate would bother with for a Teams message or email. LLMs slip them in because their training favored "polished" typography and because they interpret math/science context as a cue to use math notation.

    Common offenders, but **the list is not exhaustive** — anything outside printable ASCII counts:

    | Wrong | Replace with |
    |---|---|
    | Arrows: → ← ⇒ | `->` or rephrase |
    | Em/en dashes: — – | `-` (or split into two sentences) |
    | Minus sign: − | `-` |
    | Multiplication: × | `x` |
    | Ellipsis: … | `...` |
    | Smart quotes: " " ' ' | `"` and `'` |
    | Plus-minus: ± | `+/-` |
    | Greek letters: σ μ Δ δ π Σ | `stdev`, `mean`, `delta`, `pi`, `sum` (or spell out) |
    | Approximately: ≈ | `~=` or `roughly` |
    | Inequalities: ≤ ≥ ≠ | `<=` `>=` `!=` |
    | Middle dot, degree: · ° | `*`, `deg` |
    | Other: ™ ® © § ¶ | spell out or drop |

7. **No marketing closings.** Cut "If you're hitting X, this should help!", "Happy to discuss!", "Let me know your thoughts!", "Feedback welcome!". End on substance.

8. **No doc-page section headings that exist only to fill an outline.** Use a heading only when it helps the reader act, such as when the message has 3 or more distinct chunks or includes a table. Otherwise, use a sentence opener and plain bullets.

9. **Cut every sentence that doesn't change the reader's understanding.** First drafts (yours or the user's) carry sentences that serve the writer, not the reader - context they already have, your reasoning chain, hedges that pad. Cut them.

10. **Match the user's voice if you know it.** If the user has a Microsoft 365 / Teams / Outlook history accessible (via WorkIQ or similar), look at recent technical messages they wrote and match tone, sentence length, and structural habits. Voice matching may override the default style rules in this skill. For example, if the user consistently uses em-dashes, write em-dashes; if they sign off with "thanks", sign off with "thanks".

11. **Open in a sentence, not a heading.** A message starts in conversation, not at the top of a doc outline. "Quick update on X:", "Heads up - Y", "I found Z" all work. Bold headlines and `## titles` as the first thing signal "this is a document" and shift the reader into reading-a-spec mode. Internal headings later in the message are fine when the content warrants them (rule 8); just don't open with one.

12. **Don't reflexively use code-navigation syntax in prose.** Stack-trace references like `file.py:NNN` and source-syntax for literals like `("a", "b")` help when the reader is in an IDE or grep workflow and will jump to the code. In a message, prefer prose phrasing: "line NNN in `file.py`", "only `a` and `b`". Reserve the navigation form for cases where the reader is genuinely expected to navigate (e.g., a single deep-linked error report).

## When the reader is closer to the material than you

Use a lighter register when the reader has worked the material more recently or deeply than you have - the PR author whose code you're commenting on, the project owner you're updating, the person who shipped the thing you're asking about. They've already paid the cost of full context; cut the work that serves only to bring you up to their level.

- **Don't recap what they already know.** A PR author wrote the change; quote the new line, not both sides of the diff. A project owner doesn't need a one-sentence project summary. Cut anything they'd skim past.

- **Soften findings when reporting to someone more familiar than you.** Use "looks like", "potential", "possible". A more-informed reader often has reasons you haven't seen; declarative claims to them read as overreach where a hedge invites dialogue.

## Anti-pattern examples

### Wrong: documentation-page tone

```markdown
# Feature X Update

## What changed
Redesigned the Y subsystem to handle Z more reliably...

## Activation / scope
- **Gated by:** FeatureFlag
- **Default behavior:** unchanged

## Risk
- No agent-path changes
- 1079 tests pass

## How to enable
- Turn on FeatureFlag
- Use a Z deployment
```

### Right: chat/email tone

```markdown
Shipped Y subsystem redesign for Z (behind `FeatureFlag`). Default unchanged.

**Why it works:**
- [generalizable lesson 1]
- [generalizable lesson 2]
```

### Wrong: LLM typography

```
- Per-call: 1.4–2.9× slower
- End-to-end p50: faster (−15% to −40%) → big win
- p95: higher (token variance)
```

### Right: plain ASCII

```
- Per-call: 1.4 to 2.9x slower
- End-to-end p50: 15-40% faster on few-shot benchmarks (single call vs ensemble)
- p95: higher across the board (token variance)
```

## Procedure when invoked

1. Before drafting, confirm any material context you don't already know. Ask the user rather than assume whenever the answer would change how you draft. Common unknowns:
   - **Medium**: "This is a Teams message, right? Not a doc?"
   - **Reader proximity**: whether the reader is close to the material (the PR author whose code you're commenting on, the project owner you're updating) or further from it (a team catching up). This decides whether to apply the "When the reader is closer to the material than you" branch.
   - **Audience size**: 1:1, small team, or broad broadcast. Bigger audiences usually need more context surfaced.
   - **Format constraints**: length target, bullets vs paragraphs, must-include items.

   If the user already specified any of these in their request, or this is clear from past interactions, don't re-ask.
2. Draft a short version following the rules above.
3. Run a self-check before showing the draft:
   - Any author-process metadata? (branch, commit, test count, file paths)
   - Any marketing closing?
   - Any unscoped claim ("X is faster") that should be scoped ("X is faster on Y")?
   - Any bullet with a semicolon, an em-dash splice, or two ideas welded by a comma? Split into two bullets.
   - Did you open with "Shipped X" / "Launched X" / "Released X" when X is actually still in design / behind a flag / in PR? Use "Designed", "Drafted", "Sharing results for", "Built behind a flag" instead.
   - Did you open with a bold headline or `## title` instead of a sentence? (rule 11)
   - Are you using stack-trace syntax (`file:NNN`) or source-code literal syntax in prose where natural phrasing would read better? (rule 12)
   - If the reader is closer to the material than you, did you recap things they already know, or assert findings that would read better hedged?
   - **The self-check is internal.** Don't paste the checklist or the check results into your reply unless the user asks.
4. Iterate with the user. After every revision, re-run the self-check.

## Editing protocol

When revising a draft the user has already seen:

- **Never silently remove content** that was in the previous version. Even if you think it's redundant or weak, flag it.
- After applying an edit, briefly list the **substantive changes**: what you added, what you removed, and any structural reorganization. Don't list unchanged content. Don't list trivial wording tweaks. The point is that the user can spot anything they want restored.
- **Respect the format the user has accepted.** If they liked a bulleted list, do not convert it to paragraphs to "improve flow." If a bullet is too dense, break it into more bullets (atomic per fact), do not change the format.
- **Smaller increments beat larger rewrites.** When in doubt, change less per turn.

## Bullet hygiene

- One fact per bullet.
- If a bullet contains a semicolon or comma-spliced multi-clause sentence, that is a signal to break it into multiple bullets, not a signal to rewrite into prose.
- Nest sub-bullets two levels deep when one parent topic has several atomic facts. Three levels deep is too much.

## Bonus: leveraging WorkIQ for voice matching

If the user has WorkIQ or similar M365 search access and asks for voice-matched drafts, ask WorkIQ to look at recent Teams messages / emails the user wrote on similar topics, and rewrite the draft to match. Pass WorkIQ explicit constraints (length target, what to include, what to drop) so it doesn't pull in formatting habits from longer-form docs the user wrote. If the evidence is thin or mixed, say so and match only the patterns you can infer confidently.

### Style attributes WorkIQ should explicitly profile

A generic "match my tone" prompt to WorkIQ tends to come back with macro tone (formal/casual) but miss idiosyncratic micro-style. When asking WorkIQ to learn the user's style, ask it to extract concrete answers to these questions from the user's recent technical messages:

**Numbers and units**
- Percentage changes: does the user write `+19.2pp`, `+19.2%`, `19.2 percentage points`, or `from 78.8% to 98.0%`?
- Absolute percentages: `98.0%`, `98%`, or `98 percent`?
- Ratios / multipliers: `1.4x`, `1.4X`, `1.4 times`, or `~1.4x`?
- Time: `1.4s`, `1400ms`, `1.4 seconds`, `~1.4s`, or rounded to whole numbers?
- Ranges: `1.4-2.9x`, `1.4 to 2.9x`, `between 1.4 and 2.9x`?
- Thousands separators: `1,200` or `1200`?
- Approximate prefix: `~`, `roughly`, `about`, `circa`, or none?

**Structure and pacing**
- Paragraph break frequency: does the user break every 2-3 sentences, every 5-6, or write longer blocks?
- Bullets vs paragraphs: do they prefer bullets for facts, paragraphs for explanations, or all bullets?
- Bullet length: one short clause per bullet, or longer multi-sentence bullets?
- Bullet hierarchy: do they nest sub-bullets, or keep one flat level?
- Headings vs bold-leading lines (e.g., `**Results:**` vs `## Results`)?
- Section ordering: do they lead with the headline number, the context, or the recommendation?

**Punctuation and joins**
- Em-dash, parentheses, or comma for asides?
- Colons after labels: `Results:` or `Results -` or no separator?
- Sentence terminators: do they always end with periods, or drop the period from bullet items?
- Lists in prose: Oxford comma or not?

**References and identifiers**
- Code / config identifiers: always backticked, sometimes backticked, or italicized?
- File paths: full path, repo-relative, or just filename?
- People / teams: first name, full name, @-mention?

**Voice**
- Hedging frequency: does the user use "I think", "probably", "likely", "should", or write declaratively?
- First-person plural ("we shipped") vs first-person singular ("I shipped") vs passive ("X was shipped")?
- Disclosure of uncertainty: do they call out unknowns explicitly, or omit them?
- Sign-off / closing style: blank end, "thanks", "let me know if questions", initials, name?

**Topic-specific patterns**
- When reporting benchmark results: do they always cite N replications? Always cite σ? Always cite raw vs filtered counts?
- When announcing a feature: do they always mention the flag name? The deployment scope?
- When raising risk: do they hedge ("might cause") or commit ("will not affect")?

The WorkIQ prompt should ask for these as discrete answers, not as a vibe summary. A good WorkIQ response is a list like:

> The user writes percentages as `78.8%` (one decimal) and percentage changes as `+19.2pp`. Multipliers as `1.4x` (lowercase, no space). Ranges with `-` not `to`. Paragraph breaks roughly every 3 sentences. Always uses bullets for facts, never for explanations. Bullet items end without periods. Bold-leading lines (`**Results:**`) rather than markdown headings (`## Results`). Identifiers always in backticks. Declarative, no hedging.

With that profile, the draft rewrite produces a recognizable match instead of a generic "professional" version.

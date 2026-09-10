---
name: proseX
description: Shared writing standard for every WorkflowX document output. Reference from any skill that produces docs.
---

# proseX

Every document this workflow produces follows this standard: Parent/Child, Agent Notes, Repair Packet, Integration Note, Proposal Pool entry, xstatus report, code entry comment, commit message.

`xdo` is exempt from gate timing, never from this standard.

## 1. Tense by artifact

- `implemented/` Note: present tense, landed facts only. No `Proposal/Plan/Acceptance criteria`, no change narrative (`used to`/`no longer`/`now`). Regressions use present-tense counterfactuals: "without X, Y".
- `proposed/` entry, Child AC, Repair Packet: future tense / imperative.
- Parent/Child Change Notes, xstatus: present tense with date stamps, no process ledger (`round N`, `v3 history`).
- Commit message: imperative + Note path index. Rationale lives in the Note, never in the message.

## 2. Complete propositions

Each paragraph keeps: subject/action, conditions/timing, must/may/never, negative guarantees with exceptions, ownership, side effects, failure and consequence. Name who does what under which condition. Keep searchable mechanism names and must/may/never emphasis. Write only what code cannot say: behavior, failure, timing, ownership, consequence, trade-off.

## 3. Leakage check (fix on hit)

For each suspicious passage ask: **is this verifiable by a HEAD reader without the session?** If not, restate from the repository view.

1. Dead refs: `(decision 7)`/`§N` with no owner -> named path reference or restated fact.
2. Stack/PR view: `follow-up PR`/`this PR adds` -> landed mechanism or extension point; undone work uses `TODO`/issue refs.
3. Change narrative -> present tense.
4. Review choreography: `rejected in review`/`reviewer confirmed`/`v5` -> decision and reason only.
5. Self-justification: `this is safe because...` -> the invariant that makes it safe, or delete.
6. Process replay: `first X then Y`/test walkthrough -> delete, keep non-obvious contracts.
7. Vague placeholders: `should be fine` -> `TODO/FIXME` or an explicit boundary.
8. Mixed working-language fragments -> translate or delete.

Cross-artifact numbering ban: `implemented/` body must not reference Parent/Child identifiers or PR-process nouns (`follow-up PR`, `round N`). Provenance is answered by the atomic git commit, not the prose. `proposed/` drafts may note origin temporarily; strip on promotion.

Kept: issue refs, `TODO(name):`, merged-PR refs, suppression reasons, present-tense counterfactuals, measured bounds, runtime old/new states, committed doc numbers.

## 4. Semantic bar (human nod, never a script)

- Problem stands alone with Decision deleted; trigger is clear (what broke / what changes / cost of inaction).
- Decision is actionable and earned by a vs: writing "use X" needs "X vs Y, why X".
- Alternatives are anti-strawman: >=2 real options, strongest case for each rejected side first, concrete drivers, always an explicit do-nothing/reuse option.
- Consequences carry cost and gain: what got harder, maintenance cost; simplifications state known limits and revisit signals; no baseless "faster".
- Verification is checkable: which path, what magnitude, what command. No "looks fine".

## 5. One home per fact

One fact lives in one place; everything else links there. Cross-Note refs use relative Markdown links, never bare numbers. Tree -> Notes by relative link plus one-line summary, never inlined prose. Code entry comment shape: `// Note: <one-line reason> — see <relative Note path>`, placed at public interfaces/type definitions/module tops/state-machine entries only.

## 6. Length principle

No numeric budgets. A Note may be long or short; size follows the fact. Smell, not gate: one Note holding two decisions should split by judgment. Structural gates only: Parent §5/§6 and Child §3 allow links, not inlined decisions; Child derivation history belongs in the Proposal Pool.

## 7. Report shape

After writing, report gaps only (<=5 lines): what is stable, each gap with location/problem/fix, then `fix and land` or `accept gaps and land`. Accepted gaps land.

## 8. Over-trim warnings

Keep must/never constraints (never soften to optional), keep proposals as proposals, never delete a true fact for sounding procedural, never drop bearing provenance (`measured:` values and source refs root the conclusion).

## 9. Natural style (anti-slop)

Applies to narrative prose only (Note bodies, summaries, report paragraphs). Structured artifacts (AC checklists, registries, payload fields, report contracts) are exempt.

Default to clear, coherent paragraphs, one idea each. Use lists only for genuinely parallel items or ordered steps where a list lowers comprehension cost; tables only to compare the same attributes across objects. No heading/bold/nesting decoration piles; paragraphs flow into an article, not a card deck.

Avoid hollow stock phrasing ("in conclusion:", "delve into", "leverage", "notably", "the question is... the answer is...", "not about X but about Y", "in short..."). State the action directly; do not narrate what you will not do, what stays unchanged, or how you will categorize the result. No "X, not Y" contrast sentences that introduce an unasked alternative; no coined compound labels; no vague hedges or formulaic transitions. Use simple verbs and prepositions for real relations. (Source: GPT-6 Astra prompting guidance via LINUX DO topic 2869040.)

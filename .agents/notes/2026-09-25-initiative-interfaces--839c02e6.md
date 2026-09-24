---
schema: harness-note/1
id: 839c02e6-5215-4611-a11c-39981aa16069
kind: decision
lifecycle: implemented
created: 2026-09-25
class: architecture
tags: [harness-note, interfaces]
---

# Optional initiative interfaces in S1.2 candidate

## Problem

Module notes declare provided and needed interfaces only as prose tables, so the assembler can match names but cannot reject malformed declarations, and a misspelled name surfaces only as an unmatched edge with no machine diagnosis. Promoting the declaration to a real field was blocked on two questions: which kinds may carry it, and whether it enters the task contract hash.

## Decision

S1.2 candidate adds optional `interfaces[]` (name `^[A-Z][A-Za-z0-9_]*$`, direction provides or needs, optional provider note URI, no duplicate direction-plus-name pairs, no unknown keys) restricted to `initiative`; any other kind carrying it fails `SCHEMA_INVALID`. A needs entry without provider is legal and renders as dangling demand. The field is structurally excluded from `taskContractHash` (the hash input reads a fixed field list that does not contain it), so architect edits to module interfaces never invalidate downstream receipts; the S1.1 hash lock is byte-identical under S1.2. Sealed set: `note.schema.json`, `verify-harness-standard.mjs`, `templates/initiative.md` (commented example only), one valid plus two invalid fixtures, manifest `1.0.0-s1.2` candidate, release-matrix candidate row with recomputed digest. Status stays candidate pending user review; no consumer adopts it before the flip to final.

## Alternatives considered

- Prose tables only (status quo) — zero schema cost, but malformed declarations pass silently and the assembler cannot distinguish "no declaration" from "broken declaration"; rejected because S1.2 validation now draws exactly that line.
- Interfaces on every kind — strongest case is uniformity, but only initiative modules participate in assembly matching; spreading the field invites speculative use with no consumer, so owner is initiative-only until a second consumer proves need.
- Interfaces inside taskContractHash — strongest case is strongest binding, but every architect wording tweak would expire downstream task baselines and receipts; rejected, exclusion is structural (input field list) not conditional.
- Do nothing / reuse — keep S1.1 sealed; rejected for this item by the item ballot, which approved conditional entry into the version track.

## Consequences

- **Gains**: malformed interface declarations fail fast with `SCHEMA_INVALID`; dangling demand becomes a first-class renderable state; contract stability is proven by the unchanged S1.1 hash lock.
- **Costs and limits**: one more optional field to learn; initiative authors should keep declarations near ten per module or the matching view degrades into noise. Revisit if a second kind needs the field or if assembly matching demands richer operators.

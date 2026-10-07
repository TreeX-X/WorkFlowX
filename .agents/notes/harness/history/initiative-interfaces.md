---
{
  "schema": "harness-note/2",
  "id": "839c02e6-5215-4611-a11c-39981aa16069",
  "kind": "decision",
  "lifecycle": "archived",
  "created": "2026-09-25",
  "class": "architecture",
  "tags": [
    "harness-note",
    "interfaces"
  ],
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-25-initiative-interfaces--839c02e6.md",
      "sourceHash": "3c71ba43334d08e65aafb98c5c7a6d4196a73818e8ef049ad706f4a2fd713e48",
      "gitBlobHash": "3c71ba43334d08e65aafb98c5c7a6d4196a73818e8ef049ad706f4a2fd713e48"
    }
  },
  "disposition": {
    "reason": "Historical v1 delivery/decision. The v2 maintained-document standard supersedes its authoring rules; original evidence remains at the recorded Git source."
  }
}
---

# Optional initiative interfaces in S1.2

## Problem

Module notes declare provided and needed interfaces only as prose tables, so the assembler can match names but cannot reject malformed declarations, and a misspelled name surfaces only as an unmatched edge with no machine diagnosis. Promoting the declaration to a real field was blocked on two questions: which kinds may carry it, and whether it enters the task contract hash.

## Decision

S1.2 adds optional `interfaces[]` (name `^[A-Z][A-Za-z0-9_]*$`, direction provides or needs, optional provider note URI, no duplicate direction-plus-name pairs, no unknown keys) restricted to `initiative`; any other kind carrying it fails `SCHEMA_INVALID`. A needs entry without provider is legal and renders as dangling demand. Null/non-object declarations and non-string providers are rejected with schema diagnostics. The field is structurally excluded from `taskContractHash` (the hash input reads a fixed field list that does not contain it), so architect edits to module interfaces never invalidate downstream receipts; the S1.1 hash lock is byte-identical under S1.2.

[R1 adoption](note://972afef3-2fc7-49de-a3ee-7e041225d28c/81fc137e-9c56-4d3a-88e4-10f175852c97) aligns the standard, shared runtime and JanusX's installed dependencies. The final manifest digest is `1b9500b1ea5101231650f04f2e5e2c480001ccf9512ec173b8e5d737bf2d6923`. The release matrix records activation only after independent review; the user's continuous implementation authorization covers this cutover. Standard validation and the unchanged task/receipt hash locks pass. Core, CLI and JanusX consume the same interface fixtures.

## Alternatives considered

- Prose tables only (status quo) — zero schema cost, but malformed declarations pass silently and the assembler cannot distinguish "no declaration" from "broken declaration"; rejected because S1.2 validation now draws exactly that line.
- Interfaces on every kind — strongest case is uniformity, but only initiative modules participate in assembly matching; spreading the field invites speculative use with no consumer, so owner is initiative-only until a second consumer proves need.
- Interfaces inside taskContractHash — strongest case is strongest binding, but every architect wording tweak would expire downstream task baselines and receipts; rejected, exclusion is structural (input field list) not conditional.
- Do nothing / reuse — keep S1.1 sealed; rejected for this item by the item ballot, which approved conditional entry into the version track.

## Consequences

- **Gains**: malformed interface declarations fail fast with `SCHEMA_INVALID`; dangling demand becomes a first-class renderable state; contract stability is proven by the unchanged S1.1 hash lock.
- **Costs and limits**: one more optional field to learn; initiative authors should keep declarations near ten per module or the matching view degrades into noise. Revisit if a second kind needs the field or if assembly matching demands richer operators.

---
{
  "schema": "harness-note/2",
  "id": "5b298c37-09e6-46bf-8b4f-084138acde9a",
  "kind": "decision",
  "created": "2026-09-16",
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583",
  "extensions": {
    "migration": {
      "from": "legacy",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/implemented/architecture/2026-09-16-harness-note-standard-s1.md",
      "sourceHash": "702d08aff067dfd267eca30ab3a74ab12cb884e3e0eab49ab21ccf823ba4932b",
      "gitBlobHash": "702d08aff067dfd267eca30ab3a74ab12cb884e3e0eab49ab21ccf823ba4932b"
    }
  },
  "lifecycle": "archived",
  "disposition": {
    "reason": "Historical v1 delivery/decision. The v2 maintained-document standard supersedes its authoring rules; original evidence remains at the recorded Git source."
  }
}
---

# Harness note standard S1 candidate


## Problem
No versioned bundle pins the shared note, receipt, change-set, and bundle shapes. Each future host fills gaps on its own, so formats drift across terminal, desktop, and built-in execution.

## Decision
The versioned bundle lives at [manifest](../../../../standards/harness-note/1/manifest.json) with schemas, five kind templates, valid plus invalid fixtures, and a locked contract-hash sample. The offline checker lives at [verify script](../../../../scripts/verify-harness-standard.mjs) and gates the bundle: manifest list, template shapes, valid fixtures pass, invalid fixtures fail with fixed codes, hash sample matches. The historical design doc stays as background reading and carries an explicit non-normative banner; runtime behavior still follows the checked-in skills until the later cutover segment.

## Alternatives considered
- Let each later host define shapes as needed — strongest case is zero upfront schema work, but three hosts then lock three dialects and every later fix pays cross-host rework.
- Hand-write prose rules with no fixtures or checker — strongest case is fast drafting, but prose alone cannot pin hashes, error codes, or required sections, so reviews stay opinion-based.
- Do nothing / reuse — keep the current skill prose as the only rule; rejected because nothing machine-checkable exists for identity, relations, acceptance refs, or evidence.

## Consequences
- **Gains**: one bundle gives later segments a fixed target; `node scripts/verify-harness-standard.mjs` reports PASS with five templates, six valid fixtures, six invalid fixtures, and one locked hash.
- **Costs and limits**: the bundle is a candidate only; skills, desktop, and execution still run old rules, and the hash lock covers the S1 sample rather than live cross-host agreement. Revisit when the shared library segment reuses the same fixtures.

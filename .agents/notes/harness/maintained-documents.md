---
{
  "schema": "harness-note/2",
  "id": "95637c00-528b-48c6-8021-d94ee5ef829b",
  "kind": "decision",
  "lifecycle": "implemented",
  "created": "2026-10-07",
  "updated": "2026-10-08T02:00:16.496Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583"
}
---

# Maintained documents with compact workflow instructions

## Problem

Flat date-prefixed Notes obscure module structure and invite duplicate work records. Oversized metadata can consume an entire read page, while repeated state and handoff text adds conflicting copies. Task ownership and xdel review boundaries must remain explicit as instructions become shorter.

## Decision

The v2 standard gives each module one entry and stable topic files, with complete planned structure and explicit state. Authors maintain the owning subject; Idea conversion and scoped restructuring preserve useful identity. Main Agent maintains a common Task before handoff, while ordinary xdo needs no Task.

Skills provide small action-specific instructions; standard details and templates are read only when needed. Existing fixed acceptance, independent evaluation and portable evidence remain explicit contracts. Runtime adoption proceeds WorkflowX, agentX, JanusX. Shared tooling owns hash computation: the Task contract detects changed execution grounds, while raw-file SHA-256 identifies source bytes. Only visible AC completion markers normalize; executable metadata and code literals remain significant. Hashes do not judge document quality or authorize changes. Main Agent validates and accepts an agreed Task before pinning and dispatch, using existing user authorization.

Task contracts and their six body sections remain complete. Metadata uses a deterministic compact JSON formatter: short nested values stay inline, long values remain intact, and key order and parsed values are preserved. Raw hashes change on formatting; task contracts, input digests and sealed receipt semantics do not. The shared formatter is vendored by agentX. Commands, source identities and machine state each have one owning field; body sections add constraints, findings, evidence references and next action.

Only Main Agent modifies Task files, including metadata, prose, time, moves and deletion. coderX returns Change Summary + Note draft. xdel performs one implementation and self-review without automatic evaluator dispatch; any stronger review obligation remains pending. xflow follows discovery, socratesX, Ready Summary, Tasks, dependency-ordered implementation and independent evaluation. Runtime handoffs keep one bounded next-action block and preserve authored progress and evidence.

## Alternatives considered

Keeping the flat layout avoids migration but leaves the navigation and accumulation problem. Requiring every edit to create a Task improves uniformity but adds low-value records. Moving all instructions into an always-read manual merely relocates context cost. Module ownership plus progressive reading addresses both maintenance and import size. Removing Task sections would reduce text but lose delivery context; keeping all automatic summaries repeats existing execution fields. Compact serialization and one handoff block retain the useful contract without those copies.

## Consequences

Schema changes require an explicit new profile and downstream tool work. Corpus migration repairs references and accounts for protected files. Offline conformance covers format and contract examples; it cannot claim live host recovery or blueprint acceptance. Validation and source inventory are in docs/migrations and the corpus migration Task.


[Source review](../../../docs/reviews/workflowx-v2.md) records repaired implementation defects and regression evidence. These fixes align the reference implementation with the existing v2 contract; sealed standards, profile identity and existing hash fixtures are unchanged. Previously computed hashes for affected edge cases must be reassessed, never silently adopted.


Verification: `node --test scripts/note-format.test.mjs scripts/note-v2.test.mjs scripts/sync-harness-rules.test.mjs` passes 14 tests; `node scripts/review-note-v2.mjs` passes eight regression assertions. Standard/corpus validation and the 48-resource skill check pass. Managed synchronization to agentX passes preflight/apply/check and a second apply changes zero files; local model/permission settings retain their hashes. The cross-repository Task header shrinks from 107 to 61 lines and its body starts at character 2837 rather than 6427 (LF-normalized text); its contract hash is unchanged. agentX runtime verification is recorded in its owning adoption Note. No live-model or JanusX UI acceptance is claimed.

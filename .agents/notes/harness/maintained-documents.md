---
{
  "schema": "harness-note/2",
  "id": "95637c00-528b-48c6-8021-d94ee5ef829b",
  "kind": "decision",
  "lifecycle": "implemented",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:06:22.322Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583"
}
---

# Maintained documents with compact workflow instructions

## Problem

Flat date-prefixed Notes obscure module structure and invite duplicate work records. Repeating detailed rules across skill entrypoints also consumes context before an Agent reaches the relevant code.

## Decision

The v2 standard gives each module one entry and stable topic files, with complete planned structure and explicit state. Authors maintain the owning subject; Idea conversion and scoped restructuring preserve useful identity. Main Agent maintains a common Task before handoff, while ordinary xdo needs no Task.

Skills provide small action-specific instructions; standard details and templates are read only when needed. Existing fixed acceptance, independent evaluation and portable evidence remain explicit contracts. Runtime adoption proceeds WorkflowX, agentX, JanusX.

## Alternatives considered

Keeping the flat layout avoids migration but leaves the navigation and accumulation problem. Requiring every edit to create a Task improves uniformity but adds low-value records. Moving all instructions into an always-read manual merely relocates context cost. Module ownership plus progressive reading addresses both maintenance and import size.

## Consequences

Schema changes require an explicit new profile and downstream tool work. Corpus migration repairs references and accounts for protected files. Offline conformance covers format and contract examples; it cannot claim live host recovery or blueprint acceptance. Validation and source inventory are in docs/migrations and the corpus migration Task.

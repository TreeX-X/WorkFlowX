---
{
  "schema": "harness-note/2",
  "id": "c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14",
  "kind": "decision",
  "lifecycle": "implemented",
  "created": "2026-09-24",
  "class": "architecture",
  "tags": [
    "harness-note",
    "index",
    "wiki",
    "blueprint"
  ],
  "relations": [
    {
      "type": "related-to",
      "target": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d3f9a21-4b6e-4c8a-9f1d-2e5a6b7c8d9e"
    }
  ],
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/caf34d32-4460-4d59-813b-61ab9c11fe50",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-24-note-index-derived-layer--c61d7a4e.md",
      "sourceHash": "84fc3bfc188ce0aee19950bf40b528fb5deeb228686394a8d04e35e50b9e7814",
      "gitBlobHash": "84fc3bfc188ce0aee19950bf40b528fb5deeb228686394a8d04e35e50b9e7814"
    }
  }
}
---

# One shared derived wiki index

## Problem

Separate view scanners and copied document bodies create conflicting module relationships and stale engineering context.

## Decision

Original Notes own facts; agentX supplies one shared reader/index to WorkflowX and JanusX consumers. The [wiki contract](../../../../standards/harness-note/2/wiki.md) specifies full identity, selected checkouts, relation metadata, Markdown references, raw-file hashes and diagnostics. Index refresh never rewrites knowledge-page provenance.

## Alternatives considered

A committed hand-maintained index is easy to browse but duplicates relations. A scanner per view reduces initial coupling but permits incompatible semantics. Reuse the common derived index and bounded source search when tools are unavailable.

## Consequences

Agents discover modules quickly without importing every document. Index loss is recoverable from originals; incomplete coverage and stale sources must remain visible. Runtime behavior is validated in the adopting repositories.

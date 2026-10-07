---
{
  "schema": "harness-note/2",
  "id": "28f1238b-2678-45d0-889a-6982e5b3ad2f",
  "kind": "decision",
  "lifecycle": "implemented",
  "created": "2026-09-18",
  "class": "architecture",
  "codeRefs": [
    {
      "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
      "path": "standards/harness-note/1/execution-persistence.md",
      "role": "implementation"
    },
    {
      "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
      "path": "scripts/verify-harness-standard.mjs",
      "role": "test"
    }
  ],
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-18-portable-execution-evidence--28f1238b.md",
      "sourceHash": "28b156e8d084f9b7f580d8b2991524da266c148f3072e375e2d8d9008c3e8cab",
      "gitBlobHash": "28b156e8d084f9b7f580d8b2991524da266c148f3072e375e2d8d9008c3e8cab"
    }
  }
}
---

# Portable execution evidence

## Problem

Local run history cannot establish portable task results; file-layout changes must not rewrite the meaning of verified evidence.

## Decision

Task documents and formal receipts carry portable results. Local runs, leases and conversations coordinate a checkout. Receipt identity retains the sealed v1 canonical JSON rules; code evidence hashes raw bytes. The [execution contract](../../../standards/harness-note/2/execution.md) separates evidence, task contract and source freshness.

## Alternatives considered

Hashing receipt file bytes is simple but depends on JSON layout. Exporting local runs carries ownership state into another checkout. Reusing formal receipts preserves evidence without copying execution sessions.

## Consequences

Readers can reconstruct prior results from portable assets but must verify current applicability. Runtime crash recovery, leases and commit closeout remain agentX acceptance work.

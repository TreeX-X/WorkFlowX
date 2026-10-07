---
{
  "schema": "harness-note/2",
  "id": "caf34d32-4460-4d59-813b-61ab9c11fe50",
  "kind": "module",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:06:22.322Z",
  "moduleState": "partial",
  "parent": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583"
}
---

# Wiki discovery and source reads

## Responsibility

Define a common discover/read boundary for WorkflowX agents, agentX tools and JanusX wiki/blueprint consumers.

## Design

Original Notes own facts; a rebuildable index supplies module navigation, scoped search, relations and backlinks. Read the module entry and necessary context, then original sources on demand. Coverage, source hashes and unresolved targets travel with results.

The [read contract](../../../../standards/harness-note/2/wiki.md) defines source freshness, knowledge-page provenance and invalidation. [The decision](shared-index.md) records why no second authored index is maintained. Runtime adoption is pending in agentX and JanusX.

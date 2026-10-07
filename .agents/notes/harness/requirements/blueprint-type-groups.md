---
{
  "schema": "harness-note/2",
  "id": "07dc09a5-5802-4714-957f-cc9ea7d3c167",
  "kind": "requirement",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:45:16.588Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583"
}
---

# Group blueprint documents by type within modules

## Expected behavior

JanusX blueprint initially displays only module structure, including planned modules. When a module expands or its contents are opened, place documents of the same kind together in a deliberate layout, instead of scattering different kinds across the canvas. Keep groups within their owning module so type grouping does not erase module boundaries. Prefer a gray dashed rectangular outline and a visible type label for each group. Exact spacing and styling will be tuned during JanusX integration.

## Acceptance criteria

- [ ] AC-1: Initial module-only navigation remains intact: single-click expands, double-click enters details, and return restores navigation context. Planned modules remain visible.
- [ ] AC-2: In a module containing multiple kinds, documents of each kind are spatially grouped, including generic note, idea, requirement, decision and task; child modules remain recognizable as modules. Same-kind content from different modules is not combined across ownership boundaries.
- [ ] AC-3: Group boundaries are visually clear; the requested default presentation uses gray dashed rectangular frames and type labels. Verify readability and non-overlap for mixed content and nested modules during JanusX interaction review.

## Delivery

This is a pending JanusX presentation requirement carried by the [adoption Task](../../distribution/tasks/sync-adopters.md). Consume the shared agentX module/type metadata; visual grouping does not require moving source files or creating a separate scanner.

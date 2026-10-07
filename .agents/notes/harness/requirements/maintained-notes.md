---
{
  "schema": "harness-note/2",
  "id": "737f84da-a7b7-4c4f-8919-b61b25df0f88",
  "kind": "requirement",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583"
}
---

# Maintained module document contract

## Expected behavior

WorkflowX defines a compact, module-oriented document and handoff contract. Original Notes own content; agentX implements common tools and JanusX consumes module structures and engineering context. Runtime adoption is phased separately.

## Acceptance criteria

- [x] AC-1: One module entry, planned/partial states, stable identity and maintenance timestamps validate under v2.
- [x] AC-2: Ordinary xdo creates no Task; selected Tasks retain acceptance/review and Main Agent updates the shared Task before handoff.
- [x] AC-3: Task progress/time changes preserve its contract; scope, acceptance and review changes affect execution grounds.
- [x] AC-4: Wiki reads preserve source identity, typed references, coverage and freshness without copying engineering content.
- [x] AC-5: All tracked WorkflowX legacy Notes are accounted for and migrated before final corpus validation; protected unrelated sources remain explicit exclusions.
- [x] AC-6: Managed rule synchronization preserves local configuration and refuses unsupported adopter profiles before mutation.
- [x] AC-7: Typical runtime instruction paths import less text than the prior revision without omitting required task constraints.
- [ ] AC-8: agentX and JanusX prove supported runtime adoption and fresh-session execution in their own later phases.

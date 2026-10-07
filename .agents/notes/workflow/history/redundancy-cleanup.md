---
{
  "schema": "harness-note/2",
  "id": "68156bd0-fdd6-4d9d-82a5-30c61097e656",
  "kind": "decision",
  "created": "2026-09-11",
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/4d4ff96e-89a1-4efc-839e-c9333eba0bc5",
  "extensions": {
    "migration": {
      "from": "legacy",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/implemented/process/2026-09-11-workflow-redundancy-cleanup.md",
      "sourceHash": "ebc6885014afe6da63e99b0a5b1040963414ab69e7b151e0e8eaaabfc4a7959f",
      "gitBlobHash": "ebc6885014afe6da63e99b0a5b1040963414ab69e7b151e0e8eaaabfc4a7959f"
    }
  },
  "lifecycle": "archived",
  "disposition": {
    "reason": "Historical v1 delivery/decision. The v2 maintained-document standard supersedes its authoring rules; original evidence remains at the recorded Git source."
  }
}
---

# Workflow redundancy cleanup across dual surfaces


## Problem
Stale handoff vocabulary from the pre-lightweight era still constrains both dispatch surfaces. Dispatch definitions name planning sections that no longer exist, one routing module is referenced but missing on one surface, and the independent reviewer lints decision prose instead of running tests. Each inconsistency forces the coordinating agent to guess, which defeats the explicit-handoff design.

## Decision
Both surfaces share one contract vocabulary defined in [orchestrateX (Claude)](../../../../.claude/skills/orchestrateX/SKILL.md) and [orchestrateX (Codex)](../../../../.codex/skills/orchestrateX/SKILL.md): mode, objective, planning-record paths, acceptance source, allowed scope, required skills, verification, output. Implementation roles read the assigned task scope plus acceptance criteria first, and only the planning sections needed for ownership or dependencies. The global lock file is gone; legacy lock files are deleted on sight and only same-target concurrent writes are avoided. Independent review is test-driven only; decision-prose checks live with the Main Agent close-out gate. Small reversible direct-mode changes may land as in-place note syncs instead of new decision files.

## Alternatives considered
- Keep the old vocabulary and add a translation layer mapping old field names to new ones — strongest case is backward compatibility for in-flight records, but the record store holds no active task documents, so the layer would tax every dispatch for zero benefit.
- Delete the delegation-without-review mode and keep only direct work plus full orchestration — strongest case is fewer modes to maintain, but traceable single delegation without planning cost serves handoffs that need a record without a quality gate.
- Do nothing / reuse — leave stale references in place; rejected because dispatch definitions already contradict the planning template, which guarantees handoff failures.

## Consequences
- **Gains**: dispatch definitions match the planning template on both surfaces; content search reports zero stale-term hits across `.claude` and `.codex`, and `git diff --check` is clean.
- **Costs and limits**: the two skill trees stay duplicated by platform design; every future change lands on both surfaces per the sync contract. Teammate role definitions stay thin and inherit from the base roles.
- **Revisit signal**: when the planning template gains sections or a new execution mode appears, the dispatch contract and role definitions need the same alignment pass again.

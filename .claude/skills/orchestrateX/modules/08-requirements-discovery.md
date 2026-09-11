# Module 08: xflow Requirement Discovery

Used only by `xflow` before `socratesX` clarification and before creating or updating a Hybrid Tree. The canonical sequence lives in the `orchestrateX` SKILL; this module defines the repository-facts phase only.

## Responsibility

Module 08 is the repository-facts phase. It does not conduct a second user interview and does not duplicate `socratesX` decision handling.

1. Inspect the repository and identify relevant modules, files, dependencies, constraints, and existing conventions.
2. Separate established facts from unknowns. Report only unknowns whose answers could change implementation.
3. Organize findings by the current analysis phase: goal/scope, behavior/boundaries, implementation direction, or verification/rollout.
4. Pass the phase findings to `socratesX`, which asks all necessary questions for that phase in one batch.
5. After the user confirms the `Ready Summary`, pass the confirmed goal, scope, non-goals, Child boundaries, dependencies, acceptance direction, verification approach, and risks to Hybrid Tree generation.

The flow may skip a phase when repository evidence and the user's request already settle it. `xdo` and `xdel` do not run this planning phase unless the user explicitly asks for it.

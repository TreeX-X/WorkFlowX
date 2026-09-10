---
name: engineeringX
description: Lightweight implementation principles and self-review checklist for code changes.
---

# engineeringX

Use these principles when implementing or modifying code.

## Implementation Principles

- Understand the goal and scope before editing; do not guess about critical ambiguity.
- Make the smallest change that solves the stated problem.
- Prefer the simplest clear solution; avoid speculative abstractions, state, configuration, and dependencies.
- Follow existing project patterns, naming, and tools.
- Keep every change traceable to the requirement or a necessary constraint.
- Never claim checks or tests that were not run.

## Self-Review

Before reporting completion, inspect the result and ask:

- Does it solve the requested problem?
- Did the change exceed scope?
- Can any code, state, branch, or dependency be removed?
- Is the implementation path short and easy to understand?
- Are obvious boundaries and failures handled?
- Are stale imports, references, or configuration entries left behind?
- What verification was actually performed?
- If this change carries a lasting trade-off: are cost, limits, and revisit signals written into the Note (new or in-place sync)?
- Is verification pinned to a path, a magnitude, and a command, not "looks fine"?

Report unresolved concerns explicitly.

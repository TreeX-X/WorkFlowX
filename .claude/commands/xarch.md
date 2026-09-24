---
description: Scaffold an architect workspace with deterministic steps
---

# /xarch - Architect Workspace Scaffold

The Main Agent scaffolds an architect workspace directly with deterministic steps.

- Do not dispatch. No parallel Agents. No task note URI required.
- Steps, fail fast and never guess: git init (reuse an existing repo, stop on a dirty tree) -> write `.agents/harness.json` (schemaVersion 1 + fresh UUID repoId + name + frozen workflowx profile digest; verify-only if present) -> write `notes/planning/` templates (`project.md` + one `module-example.md`, kind initiative, P1-frozen shape, no views/) -> CODEOWNERS (with `--with-codeowners`) + README -> register through the existing workspace.create chain -> verify the projection (projectView readable, invalid not increased).
- Do not decide module splits, interface names, or primary bindings; those stay in chat with changeset two-layer approval. After handoff, note edits go through harness transactions + expectedHash + approval; xarch never writes around them.
- P1-frozen scope: no new kinds, fields, or views. Templates use initiative + prose interface tables only.
- Land atomically; writing follows `proseX`.
- Full rules: `orchestrateX` SKILL.md.

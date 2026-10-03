---
description: Scaffold an architect workspace with deterministic steps
---

# /xarch - Architect Workspace Scaffold

The Main Agent scaffolds an architect workspace directly with deterministic steps.

- Do not dispatch. No parallel Agents. No task note URI required.
- Steps, fail fast and never guess: git init (reuse an existing repo, stop on a dirty tree) -> write `.agents/harness.json` (schemaVersion 1 + fresh UUID repoId + name + frozen workflowx profile digest; verify-only if present) -> write flat `.agents/notes/` templates (identified project tagged architecture:project + only confirmed modules tagged architecture:module, kind initiative, current pinned S1.2 profile, explicit module parent URI, no views/) -> CODEOWNERS (with `--with-codeowners`) + README -> register through the existing workspace.create chain -> verify the projection (projectView readable, invalid not increased).
- Follow ../skills/noteX/module-structure.md and its templates. Use confirmed project identity and module boundaries from the active conversation. With no confirmed modules, create only the project. Optional instructional modules also carry architecture:example and stay out of the current graph. Do not invent module splits, interface names or primary bindings. Existing user authorization applies; unresolved choices follow the existing changeset two-layer approval. After handoff, note edits go through harness transactions + expectedHash + approval; xarch never writes around them.
- Use the pinned harness-note initiative template: Goal, Scope, Acceptance criteria and fresh UUIDs. Optional repositories/codeRefs/interfaces follow S1.2; omit unknown bindings and providers instead of placeholders. Register the path through workspace.create and retain its returned identity; a failed or unavailable registration stays pending. Explicit repoId/checkoutId/path/selected bindings live in .agents/.local/workspace-map.json; never pick a checkout by title or directory name.
- Land atomically; writing follows `proseX`.
- Full rules: `orchestrateX` SKILL.md.

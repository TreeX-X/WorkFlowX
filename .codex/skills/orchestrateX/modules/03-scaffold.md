# Architect workspace

Main Agent performs xarch directly. Reuse an existing identity; inspect dirty work before touching overlapping files. Initialize Git only if needed. Create .agents/harness.json with a fresh repo UUID for a new repository and a supported profile; never infer repository identity from its name.

Create .agents/notes/module.md and only confirmed/planned modules using noteX templates. Mark planned facts explicitly. Use fresh Note UUIDs, module parent URIs and known repository/interface bindings. Do not invent modules or examples as real architecture.

Architect work manages cross-module responsibilities, shared requirements, decisions and collaboration through these same Notes. It works within one repository or across repositories; a separate architect repository is optional. Keep shared documents in their owning common module and reference them from affected modules. Local implementation and Tasks remain with their owners; do not copy progress or force a parent Task. Reuse typed relations and acceptance refs instead of duplicate fields or handwritten backlinks. Pure-Note planning needs no source code or repository bindings to be readable. Project role identifies a root, not an exclusive architect workspace type.

Add README and optional CODEOWNERS only within requested scope. Where available, register through workspace.create and verify the module projection. Unavailable registration/projection remains pending; do not claim host integration from file creation alone. Bind repoId/checkoutId/path/selected explicitly for composition.

Later edits use existing harness conflict/transaction rules. No Task, fixed dispatch payload or subagent is needed.
Blueprint projection checks must distinguish ownership from cross-module association and keep shared requirements/decisions reachable through module browsing and focus, with full source and checkout identity. Unavailable sources remain visible as diagnostics.

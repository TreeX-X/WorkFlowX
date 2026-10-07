# Architect workspace

Main Agent performs xarch directly. Reuse an existing identity; inspect dirty work before touching overlapping files. Initialize Git only if needed. Create .agents/harness.json with a fresh repo UUID for a new repository and a supported profile; never infer repository identity from its name.

Create .agents/notes/module.md and only confirmed/planned modules using noteX templates. Mark planned facts explicitly. Use fresh Note UUIDs, module parent URIs and known repository/interface bindings. Do not invent modules or examples as real architecture.

Add README and optional CODEOWNERS only within requested scope. Where available, register through workspace.create and verify the module projection. Unavailable registration/projection remains pending; do not claim host integration from file creation alone. Bind repoId/checkoutId/path/selected explicitly for composition.

Later edits use existing harness conflict/transaction rules. No Task, fixed dispatch payload or subagent is needed.

---
name: noteX
description: Maintain module documents and related Notes when engineering work changes recorded facts or introduces a lasting idea, requirement or decision.
---

# noteX

Search the relevant module entry and owning Notes before writing. Read originals through the shared wiki index; without it, use bounded `rg` and report unresolved references. Load only the current module, necessary parent context and explicit dependencies.

1. Update an existing topic when it still owns the fact. Create a Note for independently useful content; create or merge a module directory only when responsibilities warrant it. Stay within the user's discussed change scope.
2. Each module has one `module.md` entry with a complete overall explanation. Other Notes and submodules coexist beside it. Planned modules use the same structure with explicit status; unknowns remain unknown.
3. Use stable subject filenames, immutable UUIDs and full `note://repo-id/note-id` identity. Preserve `created`; refresh UTC `updated` on every maintenance write, including moves and type conversions. Reads and no-op work do not touch time.
4. Keep current design in module documents, exploration in ideas, acceptance in requirements and durable trade-offs in decisions. Ideas may change type in place. Task ownership and creation follow the selected workflow.
5. Reorganize or remove obsolete content when useful; repair live references and preserve required execution evidence. Read [reorganization](reorganization.md) for moves, merges, deletion or legacy migration.
6. Land affected code, relevant Note updates and necessary entry reverse references together. No Note change is needed when recorded facts remain correct. Write concise current facts; use [proseX](../proseX/SKILL.md) when drafting substantial narrative.

Read [module structure](module-structure.md) when creating/changing module boundaries; [wiki](wiki.md) when resolving references, changing indexed sources or implementing a consumer. Load only the needed template from `templates/`; replace example UUIDs, ownership references and times. The pinned `harness-note/2` standard defines validation, not extra mandatory reading for ordinary edits.

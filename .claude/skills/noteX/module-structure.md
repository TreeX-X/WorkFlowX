# Module documents

One module has one `module.md` at its directory root. The project entry is `.agents/notes/module.md`; other modules nest by responsibility. A directory may hold multiple topic Notes and submodules. Grouping folders such as `tasks/` are allowed and do not become modules without an entry.

Use `kind: module`, with `moduleState: planned | partial | implemented | retired`. Planned entries have the same body structure as implemented ones; label future work and unknowns. Partial is qualitative, not a percentage. Task completion never automatically completes a module.

The entry explains responsibility, boundaries, overall design, important interfaces and collaboration. Keep enough context to understand the whole; split independently maintained detail into related Notes, not merely because the entry is long. Use provided/needed interfaces only when known.

Each non-root module declares `parent` as the nearest containing module URI. Topic Notes declare `module` as their nearest owning module URI; Task dependencies and historical parent links are separate relations. Paths organize reading; UUIDs identify assets. Agent-authored moves update structural declarations and live references together. Conflicts are diagnostics, never silently guessed structure.

Create a submodule when a durable independent responsibility benefits from its own entry and documents. Internal changes usually update the owning topic only. Retired or merged modules can be removed after reference/evidence handling in [reorganization](reorganization.md).

A cross-repository declaration has one owning repository; link rather than copy. Selected checkouts must be explicit. Do not expand edits into another module/repository unless the user includes it; report required out-of-scope synchronization.

Blueprint consumers begin with module entries, including planned/partial modules. Single-click previews the module document; double-click enters module browsing with the current module retained as the parent and return navigation available. Ordinary Notes remain available within their owning module/wiki without becoming module nodes.

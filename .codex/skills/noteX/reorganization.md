# Reorganize Notes

Read originals and references before deciding ownership. Preserve the same UUID for a continuing subject, including renames and Idea-to-Requirement/Decision conversion; validate the new kind and retain referenced acceptance IDs. Splits assign new UUIDs only to new subjects. Merges choose a surviving identity and repair live callers; never duplicate UUIDs.

For a batch, record a temporary old-path/URI -> new-path/URI or deletion map with reasons and source hashes. Move/rewrite only the authorized files, update relative links, code reverse references and module declarations, refresh `updated`, and rebuild/invalidate the shared index. Verify missing/duplicate references, case collisions and module cycles before concluding. The map is migration evidence, not another live relation store.

Delete obsolete or absorbed Notes when their useful facts and required references are handled. Do not retain empty tombstones by default. Historical evidence may retain the old version through an exact Git revision/path or formal snapshot. Never rewrite receipt hashes to make old evidence appear current. An unavailable foreign checkout is not proof that no callers exist; record concrete unresolved external references.

Legacy migration classifies each source from its body and evidence, not filename alone. Convert enduring structure to module entries, delivery scope to requirements/tasks and reasons to decisions. Preserve creation dates, IDs and AC IDs where they exist; do not invent historic completion or timestamps. If creation is unknown, record migration creation with provenance. Unrelated dirty/untracked files stay intact and are reported as deferred. Batch migration precedes final corpus parsing/validation.

New schema/profile adoption requires a supported writer and an explicit repository pin. Keep sealed old bundles and historical receipts readable; a format migration alone never renews an execution baseline.

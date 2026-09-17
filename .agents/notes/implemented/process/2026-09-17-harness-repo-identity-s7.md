# Agent Note: WorkFlowX repo identity for the harness

Status: implemented

## Problem

The standard-owning checkout had no repository identity of its own: the
note index reported a null repo id, so even the one new-format note in
this tree could not be addressed by a stable `note://` URI. Cross-repo
references from adopter checkouts had no target identity to point at,
and identity setup stayed an open S7 item while rule sync already passes.

## Decision

`.agents/harness.json` carries `schemaVersion: 1`, a stable repo id,
the name WorkFlowX, and a profile pinning the owned standard `1.0.0-s1`
with the manifest digest (SHA-256 over LF-normalized manifest bytes).
The repo id is a fresh UUID: ordinary clones keep it, renames and moves
never change it, and a fork that joins the same blueprint graph mints a
new one while recording its source. Dependency repositories stay omitted
because no dependency has published an identity from this side. The sync
repo list is untouched: S7 scope is the owning repo only and adopters
join at cutover.

## Alternatives considered

- Derive the identity from the checkout path — strongest case is zero new
  files, but moves and renames fork every existing reference; a stored
  UUID survives both.
- Reuse one shared identity across the three checkouts — strongest case
  is a single id to manage, but distinct repositories need distinct URI
  spaces or their notes merge into one addressable graph by accident.
- Convert the two old-format notes now — strongest case is a fully valid
  index, but bulk rewrites belong to the S9 migration, not to identity
  setup; the two files stay readable legacy.
- Do nothing / reuse — leave the owning checkout identity-less; rejected
  because the standard's own new-format note would stay unaddressable.

## Consequences

- **Gains**: the owning checkout resolves an identity and mints URIs.
  Verification: read-only rescan reports
  `repoId=d2499d5b-4ceb-4d46-aa3b-18e5c9b86034` with 3 scanned entries, 1
  valid (the S7 rules note, addressable as its stable `note://` URI) and
  2 legacy `SCHEMA_INVALID`; `node scripts/verify-harness-standard.mjs`
  still reports PASS; `node scripts/sync-harness-rules.mjs --check
  --repos scripts/sync-repos.list` still reports PASS.
- **Costs and limits**: the two old-format notes stay invalid under the
  new schema until the S9 migration, which is expected and not data loss.
  The profile digest must be re-pinned whenever the standard revs.
  Sibling checkouts carry their own identities from their own commits.
  Revisit at cutover when adopters join the sync list.

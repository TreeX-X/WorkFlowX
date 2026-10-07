# WorkflowX v2 verification

This repository delivers the v2 format, compact WorkflowX instructions, offline conformance tools and its tracked Note corpus migration. agentX runtime adoption and JanusX blueprint/Chat acceptance remain later phases.

## Checks

- `node scripts/verify-harness-standard.mjs --repo .`: sealed v1 fixtures/hashes and v2 schema/hash/profile pass. Corpus validation covers 19 v2 documents; the exact-hash protected untracked Task is excluded, not validated. Two historic JanusX URI targets remain reported as external and unchecked.
- `node --test scripts/note-v2.test.mjs scripts/sync-harness-rules.test.mjs`: 10 tests pass, including contract stability during handoff, changes to review/scope, source freshness, type conversion, malformed metadata, link examples, fresh-checkout document recovery and pre-write adopter profile refusal.
- `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-self.list`: source profile and managed Codex/Claude parity pass. No adopter synchronization is performed.
- `node scripts/check-workflow-skills.mjs`: 48 maintained skill resources pass metadata and local-resource checks.
- `git diff --check`: whitespace check passes; sealed `standards/harness-note/1/` has no content changes.
- A staged-tree export using `git checkout-index --all --prefix=<empty-temp>/` passes both-version/corpus validation, source parity and skill-resource checks without `.agents/.local` or the protected untracked Task. Local exclusions do not become dependencies of a fresh checkout.

The generic skill-creator `quick_validate.py` rejects the pre-existing public name `noteX` because it requires lowercase hyphenated names. The name is intentionally preserved for compatibility. This generic check remains a naming failure; the repository check validates the actual established naming contract and resource links, not a claim that the generic validator passed.

## Reading cost

[Instruction-load report](instruction-load.json) compares LF-normalized UTF-8 bytes for declared unique reading paths against the recorded source revision. Maintained-document xdo drops 70.1%, existing-Task xdo 66.0%, xdel dispatch 65.1%, full xflow discovery/dispatch/review 61.6%, and the repair contract reference 22.0%. These are text-size proxies, not exact tokenizer counts or measured host telemetry; project/Task content and repeated imports across agents are outside the measurement.

## Migration and handoff

[Inventory](note-v2.json) accounts for all 11 tracked originals, their identities, source hashes, exact Git provenance and targets. Three legacy documents receive stable identities; existing IDs and acceptance IDs are preserved. Old decisions and delivery evidence are clearly historical. The pre-existing untracked HOL scanner Task and local runtime data remain untouched.

Main Agent maintains [the migration Task](../../.agents/notes/workflow/tasks/note-corpus-migration.md). It records the current result and next phase. Its offline evidence does not manufacture a runtime receipt or mark a historical run valid under a new contract.

Before agentX writes v2, implement the supported parser/writer/index and verify actual transaction recovery, execution baselines, review obligations and fresh-session continuation. JanusX then adopts the common boundary and verifies planned/current module navigation and engineering Chat tools. The generic source checks do not establish those runtime behaviors.

# WorkflowX v2 readiness review

Reviewed implementation: `324f20518dcb021d3c27451ff107edd46c9ff5bd`. Original result: **NEEDS_FIX**. Current status: **all five findings repaired and self-reviewed; independent finalization and downstream adoption remain pending**. The compact skills preserve the main intended design, but the existing test suite does not establish complete execution readiness.

## Findings at the reviewed revision

1. **P1 — Task contract can miss real execution changes.** `scripts/lib/note-v2.mjs:122` normalizes checkbox-like strings recursively, including verification command arguments. Changing an argument from `- [x] expected literal` to `- [ ] expected literal` leaves the hash unchanged. At line 80, title extraction removes inline code, so titles containing `alpha` and `beta` in code spans also hash identically. Normalize actual acceptance observations only; preserve executable metadata and the full meaningful title. Add regression tests before aligning downstream hashing.

2. **P1 — Successful distribution can leave conflicting teammate rules.** `scripts/sync-harness-rules.mjs:37` builds its file set from the managed pairs, skills, commands and entry blocks. The changed `.claude/agents/coder-teammate.md` and `evaluator-teammate.md` are absent. A temporary adopter with old Task-writing teammate instructions receives exit 0 while those instructions remain unchanged. Include the intended managed portions/files and test both update and drift detection while preserving local customizations.

3. **P2 — Canonical hash order differs from its specification.** `scripts/lib/note-v2.mjs:13` uses JavaScript default UTF-16 key sorting, while the execution standard specifies Unicode code-point order. Keys U+10000 and U+E000 serialize in the opposite order. Align the reference implementation and add non-ASCII vectors before independent runtimes implement the algorithm. Existing ASCII fixtures do not cover this mismatch.

4. **P2 — Valid Markdown links are truncated.** `scripts/lib/note-v2.mjs:140` parses `[guide](guide(v2).md)` as `guide(v2`. This can report a broken local link even when the file exists, and mislead reference repair during module reorganization. Preserve balanced and escaped destinations under the supported Markdown contract and test them.

5. **P2 — Task readiness transition was lost from the compact handoff instructions.** The current Task template starts at `lifecycle: draft`; orchestrateX says create/reuse a scoped Task and dispatch, but neither its mode rules nor module 02 explains the transition to an accepted, validated execution contract. The standard forbids active execution on draft/proposed Tasks. Restore a short pre-dispatch step: validate scope/fixed sources/dependencies, select the mode-appropriate review obligation without weakening an existing one, and accept the contract using already-confirmed user intent before pinning/dispatch. This is a documentation walkthrough finding, not a claimed runtime test failure.

The new gate should remain short and live in the handoff contract. These findings do not justify reintroducing the full old prose or default-loading the standard.

## Requirement coverage at the reviewed revision

| Confirmed requirement | Current assessment |
|---|---|
| Module/submodule folders; one module entry; parent-level full explanation and sibling Notes | Described in noteX, module guide and v2 standard; present in the migrated corpus |
| Agent chooses scoped expansion, merge, rewrite and deletion; stable subject names | Described with responsibility-based criteria, reference repair and scope limits |
| created preserved; updated refreshed on maintenance | Specified; automatic runtime writer enforcement belongs to agentX |
| Idea conversion; Requirement/Decision retained; planned and partial modules | Specified and example-tested; partial remains qualitative |
| Ordinary xdo has no Task; explicit existing Task is allowed | Described; original review obligations remain stated |
| Main Agent owns shared Task; update before every handoff; cross-session continuation | Described; readiness gate needs repair, and real host continuation is not yet tested |
| Wiki index is part of WorkflowX and common source reads | Contract exists; Markdown reference implementation needs repair; shared runtime index remains agentX work |
| Blueprint module-only initial structure, planned modules, expand/detail/return | Specified; JanusX implementation and interaction checks are pending by agreed phase order |
| Chat gets harness read/edit, script execution and shared Note mechanism | Included in adoption scope; actual engineering tool integration is pending in agentX/JanusX |
| Old Note batch migration before final parsing | 11 tracked sources accounted for; 19 v2 docs validated at reviewed revision; one unrelated untracked source remains explicitly excluded |
| Compact skills without losing executable constraints | Text reduced, core design retained, but missing readiness transition needs restoration |
| WorkflowX → agentX → JanusX | Recorded; both adopters still have the v1 profile; source must pass this review before synchronization |

## Evidence and limits

`node --test scripts/note-v2.test.mjs scripts/sync-harness-rules.test.mjs` passes all 10 existing tests. The standard/corpus and skill-resource checks also pass at the reviewed revision. Those results are retained as limited evidence, not overridden or described as exhaustive.

`node scripts/review-note-v2.mjs` reproduces five failing behavioral assertions covering findings 1–4. That was the original failing evidence. The repaired regression gate now covers eight assertions and uses an isolated temporary adopter without updating agentX or JanusX.

The readiness issue is established by following the current template and dispatch text. Actual model behavior, lease recovery, writer time updates, live wiki queries and blueprint interaction are not proved by these offline checks.

## Repair verification

All five findings are repaired. Hash normalization preserves executable literals and inline title content; canonical keys and set-like lists use Unicode code-point ordering. Markdown parsing preserves balanced/escaped destinations. Both teammate wrappers are distributed as managed blocks, preserving local settings; an existing unmarked wrapper fails with a merge diagnostic instead of being overwritten or silently skipped. The shared handoff contract now validates and accepts agreed execution grounds before pinning/dispatch, without repeating algorithm details in skills.

- `node --test scripts/note-v2.test.mjs scripts/sync-harness-rules.test.mjs`: 12 tests pass, including AC observation versus code/metadata changes and balanced/escaped links.
- `node scripts/review-note-v2.mjs`: 8 assertions pass, including both teammate roles, local-setting preservation, unmarked-file refusal, drift detection and idempotence.
- Standard/corpus validation: passes for 20 v2 documents; one protected source excluded and two historical external targets remain unchecked.
- Skill resources and source managed parity: pass. Manual walkthrough verifies the template -> accepted contract -> fixed snapshot -> dispatch sequence. No independent agent review or downstream runtime execution is claimed.

Existing v1/v2 format and hash locks are unchanged: these are implementation corrections to the existing contract. Hashes previously calculated with the defective edge-case behavior require reassessment. The ordinary xdo reading path remains unchanged; updated UTF-8 reductions are 70.1% for document-maintaining xdo, 64.8% for existing-Task xdo, 64.2% for xdel, 60.8% for full xflow and 7.8% for the standalone repair reference. These are byte measurements, not exact tokens.

## Follow-up

Independently finalize and pin the repaired source revision before [the downstream synchronization Task](../../.agents/notes/distribution/tasks/sync-adopters.md). Keep existing uppercase-X skill names. agentX runtime adoption and JanusX blueprint/Chat behavior remain separate acceptance phases.
# Execution and handoff

Main Agent owns Task updates and scheduling. All implementer/reviewer/repair agents use the same Task for one deliverable, returning results for Main Agent to integrate. Independent deliverables may have separate Tasks; changing agents or retrying does not create a new Task or handoff document.

Before each handoff, refresh updated and record current Progress, Evidence and Handoff: verified work, reports not yet verified, concrete unresolved issues, next action, relevant dependencies and accessible fixed references. An interrupted session is recoverable from repository Task, referenced source snapshots, code and formal evidence; recheck the checkout and run ownership. Conversations and local logs are optional context.

## Modes and authority

Ordinary xdo has no Task and never creates one. Explicitly selected existing Tasks may run directly as xdo. xdel/xflow create or reuse Tasks. Changing executor/mode cannot weaken work.review or acceptance: independent remains independent until the user explicitly revises the obligation. xflow requires independent review; xdel defaults to self review unless an existing stronger obligation applies.

Subagents do not change task.execution or acceptance. The runtime performs controlled state transitions for Main Agent using exact expected file hashes, matching previous execution state and local run revisions. A stale writer reloads; summaries never authorize overwriting a run lease. Unavailable native dispatch is reported rather than role-played.

## Contract identity

The v2 task contract hashes canonical JSON of schema, id, kind, title, repositories, relevant relations (implements, depends-on, governed-by), work and the Scope/Acceptance criteria/Verification sections. Keys sort by Unicode code-point order; line endings normalize to LF and checked AC boxes normalize to unchecked. Scope paths, acceptance refs and relation lists use deterministic ordering; verification arrays retain declared order. work.review participates.

updated, created, module ownership, lifecycle, execution and Progress/Evidence/Handoff do not enter the task contract. A hash change signals changed execution grounds, not automatic permission to adopt them. The reference implementation and fixtures in scripts/lib/note-v2.mjs pin this version's exact bytes.

Raw-file SHA-256 remains the concurrency and wiki-source identity. A timestamp-only or checkbox-only edit can change raw bytes without changing a task contract. For fixed input documents, baseline comparison uses an input digest of parsed metadata except created/updated plus body (LF normalized, AC checks normalized). A differing input digest conservatively requires reassessment; it does not prove semantic intent changed. Cosmetic changes beyond those exclusions may still require explicit reassessment.

Do not silently rebaseline. Reassess changed scope/interfaces/acceptance before resuming; pin the accepted sources and preserve old evidence. A reference hash must resolve to actual content, not a fabricated snapshot.

## Evidence and recovery

Formal receipts retain harness-receipt/1 and its sealed canonical-content hash (sorted object keys; arrays and scalar values unchanged). Code manifests hash exact raw bytes. Receipt identity is different from task contract, input digest and raw-source freshness. Source format migration never rewrites historical receipt assertions to establish new validity.

Task and referenced .agents/evidence receipts are portable; leases, local runs, conversations and recovery journals remain checkout-local. Writing receipts, Task references and run snapshots uses recoverable transactions. Same receipt ID/content is idempotent; conflicting content fails. Foreign edits during recovery are never overwritten.

Completion revalidates current contract, fixed inputs, acceptance coverage and tested code. commit-required checks one HEAD-reachable tree containing matching Task, receipt and tested code; working-tree-authorized retains its authorization and never claims a commit. Historic success and current evidence validity are separate.

Runtime adoption must cover interrupted writes, concurrent stale writers, mode changes retaining review, source maintenance during execution, repair handoff and fresh-session recovery. WorkflowX offline conformance is not proof those runtime checks passed.

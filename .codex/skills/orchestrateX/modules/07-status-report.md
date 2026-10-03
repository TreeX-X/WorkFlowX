# Module 07: Status Report

When module declarations are present, xstatus may derive missing or ambiguous ownership, unresolved interfaces and pending synchronization from inspected sources. State checkout coverage; absent declarations are an adoption gap, not a Task failure. Keep lifecycle, execution evidence and source freshness separate. Never infer completion or write module state from graph membership, task counts or acceptance of a decision.

`xstatus` is read-only. Scan task notes (`.agents/notes/`) and report:

- Task titles and kinds
- Scope and dependencies
- Lifecycle and execution state
- Verification or evaluation notes
- Active mode: `xdo`, `xdel`, or `xflow` when known

If no task notes exist, report that no tracked work is active. Ignore legacy-format documents (pre-lightweight `Section 0/7/8.x`, old `*-hybrid.md` naming, or `.hybrid/` leftovers) unless the user explicitly asks for a legacy review; never migrate them. Do not infer a legacy unit mode from git history. `xdo` work without a task note leaves no record to scan. Write the report to `./status-report.html` or the requested `--output` path; open it unless `--no-open` is set.

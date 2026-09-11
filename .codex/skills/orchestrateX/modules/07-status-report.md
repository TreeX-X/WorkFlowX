# Module 07: Status Report

`xstatus` is read-only. Scan `.hybrid/` Parent and Child documents and report:

- Feature and Child names
- Scope and dependencies
- Current status
- Verification or evaluation notes
- Active mode: `xdo`, `xdel`, or `xflow` when known

If `.hybrid/` is absent or empty, report that no Hybrid Tree is active. Ignore legacy-format documents (pre-lightweight `Section 0/7/8.x` or old `*-hybrid.md` naming) unless the user explicitly asks for a legacy review; never migrate them. Do not infer a legacy unit mode from git history. `xdo` work without a Tree leaves no record to scan. Write the report to `./status-report.html` or the requested `--output` path; open it unless `--no-open` is set.

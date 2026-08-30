# Module 07: Status Report

`xstatus` is read-only. Scan `.hybrid/` Parent and Child documents and report:

- Feature and Child names
- Scope and dependencies
- Current status
- Verification or evaluation notes
- Active mode: `xdo`, `xdel`, or `xflow` when known

If `.hybrid/` is absent, report that no Hybrid Tree is active. Do not infer a legacy unit mode from git history. Write the report to `./status-report.html` or the requested `--output` path; open it unless `--no-open` is set.

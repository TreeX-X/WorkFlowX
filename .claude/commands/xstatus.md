**Executed by Main Agent directly.** Scan the project, collect workflow state, and generate an HTML status report.

User input: $ARGUMENTS

## Syntax

```bash
/xstatus                      # Analyze current workflows, output to ./status-report.html, open in browser
/xstatus --output <path>      # Specify custom output path, still opens in browser after generation
```

---
description: Generate huashu-styled HTML status report for workflow state
---

Execute inline (reading `orchestrateX` Module 07 / `modules/07-status-report.md` content directly):

Mode: xstatus

Arguments: $ARGUMENTS

Generate huashu-styled HTML status report:

1. Parse arguments: --output <path> (default: ./status-report.html)
2. Scan `.agents/notes/` for task notes with lifecycle and execution state; if none, report no tracked work
3. Ignore legacy-format documents unless the user explicitly asks for a legacy review; never migrate them
4. Parse the task scope, dependencies, status, and verification notes
5. Classify active work as xdo, xdel, or xflow when the mode is recorded (`xdo` without a task note leaves no record)
6. Render huashu-styled HTML: hero, task progress, issue heatmap, dependency graph
7. Write to output path + auto-open in browser

Constraints:
- Read-only (no code/doc modifications)
- Idempotent (overwrite ./status-report.html)
- Empty sections hidden

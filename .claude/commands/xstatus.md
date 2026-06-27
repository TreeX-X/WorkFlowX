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
2. Scan .hybrid/ for Hybrid Trees → classify by Mode A/B/A-parallel
3. Parse sections: Parent §7 (routing), §9 (aggregation), Child §7 (AC), §9 (eval)
4. Git log for xunit activities (last 7 days, commits outside .hybrid/)
5. Render huashu-styled HTML: hero, Children progress, issue heatmap, dependency graph
6. Write to output path + auto-open in browser

Constraints:
- Read-only (no code/doc modifications)
- Idempotent (overwrite ./status-report.html)
- Empty sections hidden

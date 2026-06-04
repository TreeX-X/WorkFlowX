---
name: xstatus
description: Generate huashu-styled HTML workflow status report and open in browser.
---

Invoke the orchestratorX agent in status mode to scan the project, collect workflow state, and generate an HTML status report.

User input: ${input:args}

## Syntax

```bash
/xstatus                      # Analyze current workflows, output to ./status-report.html, open in browser
/xstatus --output <path>      # Specify custom output path, still opens in browser after generation
```

## Execution Flow

1. **Parse arguments**: Detect `--output <path>` if present, default to `./status-report.html`
2. **Load module**: Read `.github/skills/orchestrator-playbook/modules/07-status-report.md` for the full procedure
3. **Collect data**:
   - Scan `.hybrid/` for Parent + Child hybrid documents
   - Classify each feature by Mode (A / B)
   - Run `git log --since="24 hours ago"` for Mode C (xunit) inference
   - Get current branch / user / repo via git
4. **Aggregate stats**: Active workflows, total children, completion rate, failed count
5. **Render HTML**: Read template at `.github/skills/orchestrator-playbook/templates/status-report.html`, perform string substitution
6. **Write file**: Save to output path (creates parent dirs if needed)
7. **Open browser**: Cross-platform launch (`start ""` on Windows, `open` on macOS, `xdg-open` on Linux)

## Constraints

- **Read-only operation**: Never modifies project source files or Hybrid Tree documents
- **Idempotent**: Default path (`./status-report.html`) is overwritten each run
- **No watch mode**: Single snapshot only, no auto-refresh
- **Empty sections hidden**: Sections with no active workflows are omitted entirely (no empty headers)

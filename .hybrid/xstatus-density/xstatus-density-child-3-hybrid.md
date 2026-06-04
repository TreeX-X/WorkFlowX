# Hybrid Docs - xstatus-density / Trend Indicator

**File Name**: xstatus-density-child-3-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: xstatus-density-parent-hybrid.md

**Document Status**: Draft
**Update Date**: 2026-06-03
**Author**: [Tree]
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `xstatus-density-parent-hybrid.md`.
> **Dependency**: This Child depends on C-01 (Data Enrichment) being completed first, as the trend indicator requires the enhanced data collection framework.

### Branch-Specific Overrides
- No overrides.

---

> **Incremental Section**

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)

### Feature: Completion Rate Micro-Trend Indicator
- **Description**: Add a trend symbol (up/down/flat arrow) next to the completion rate percentage in the summary card, with a hover tooltip showing the delta from the previous report. Requires orchestratorX to read the previous status-report.html (if it exists) and extract the prior COMPLETION_RATE value.
- **Implementation Requirements**: Module 07 must attempt to read the existing `status-report.html` before overwriting it, extract the previous completion rate, compute the delta, and pass trend data to the template. Pure CSS + title attribute, no JavaScript.
- **Acceptance Criteria (AC)**:
  - [ ] AC-1: Module 07 adds a pre-render step that reads existing `status-report.html` (if present) and extracts previous COMPLETION_RATE from the completion stat card
  - [ ] AC-2: Module 07 computes delta (current - previous) and determines trend direction (up/down/flat)
  - [ ] AC-3: HTML template `.stat.accent .value` enhanced with `<span class="trend-indicator {direction}">` element showing arrow symbol and `title` attribute with delta text
  - [ ] AC-4: CSS classes `.trend-indicator`, `.trend-indicator.up`, `.trend-indicator.down`, `.trend-indicator.flat` added with appropriate colors (--pass, --failed, --muted)

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
- **File Path**: `.claude/skills/orchestrator-playbook/modules/07-status-report.md` | **File Purpose**: Add pre-render step for previous report reading | **Association Reason**: Core logic change
- **File Path**: `.claude/skills/orchestrator-playbook/templates/status-report.html` | **File Purpose**: Add trend-indicator CSS and placeholder | **Association Reason**: Template enhancement

### 8.2 Branch Incremental Index References
- Optimization 3 spec: `xstatus_optimization_suggestions.md` Section 2.3

---

> **Dynamic Section**

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: N/A
- **evaluation_mode**: N/A
### 9.2 Acceptance Criteria (AC) Compliance
*(Not yet evaluated)*
### 9.3 Code Issue List + Fix Instructions
*(Not yet evaluated)*
### 9.4 Comprehensive Evaluation Conclusion
*(Not yet evaluated)*

<!-- End of Child 3 -->

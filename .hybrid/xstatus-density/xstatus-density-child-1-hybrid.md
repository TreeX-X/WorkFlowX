# Hybrid Docs - xstatus-density / Data Enrichment + Hover

**File Name**: xstatus-density-child-1-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: xstatus-density-parent-hybrid.md

**Document Status**: Draft
**Update Date**: 2026-06-03
**Author**: [Tree]
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `xstatus-density-parent-hybrid.md`.

### Branch-Specific Overrides
- No overrides.

---

> **Incremental Section**

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)

### Feature: Child Task Metadata Hover Details + Teammate Status Context
- **Description**: Enrich the `.child .meta` element with a `title` attribute containing P0/P1 issue counts, fix instruction summaries, evaluation trend, and blocking dependencies. Enrich `.teammate-status` with current task context, duration, and last update time.
- **Implementation Requirements**: All data extracted from existing hybrid document sections (Parent Section 9, Child Section 9.3). No new data sources needed. Pure attribute enhancement, no visible layout changes.
- **Acceptance Criteria (AC)**:
  - [ ] AC-1: Module 07 Step 1 extracts P0/P1 counts from Parent Section 9 aggregation table for each Child
  - [ ] AC-2: Module 07 Step 1 extracts first 3 issues from Child Section 9.3 Issue List for hover summary
  - [ ] AC-3: Module 07 Step 1 extracts fix instructions from Child Section 9.3 for hover display
  - [ ] AC-4: Module 07 computes evaluation trend string (e.g., "PASS (2 rounds)" or "Needs Fix x3") from Child Section 9 history
  - [ ] AC-5: HTML template `.child .meta` gets `title` attribute with assembled detail text + `(?)` help icon span with `.detail-hint` class; new CSS classes `.detail-hint` and `.meta-enhanced:hover` added
  - [ ] AC-6: HTML template `.teammate-status` gets `title` attribute showing current task Child ID, description, duration, last update time (Mode A-parallel only)

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
- **File Path**: `.claude/skills/orchestrator-playbook/modules/07-status-report.md` | **File Purpose**: Data collection logic to enhance | **Association Reason**: Primary modification target for data extraction
- **File Path**: `.claude/skills/orchestrator-playbook/templates/status-report.html` | **File Purpose**: CSS + HTML structure to add hover classes | **Association Reason**: Template for rendering hover attributes

### 8.2 Branch Incremental Index References
- Optimization 1 spec: `xstatus_optimization_suggestions.md` Section 2.1
- Optimization 2 spec: `xstatus_optimization_suggestions.md` Section 2.2

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

<!-- End of Child 1 -->

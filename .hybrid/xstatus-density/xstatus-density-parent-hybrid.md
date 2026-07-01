# Hybrid Docs - xstatus-density

**File Name**: xstatus-density-parent-hybrid.md
**Document Type**: Parent (Routing Center)

**Document Status**: Draft
**Update Date**: 2026-06-03
**Author**: [Tree]
**Version**: v1.0

---

> **Static Context (Static Section)**

## 0. Runtime Environment Status (System)

- **MCP Status**: Unknown
- **MCP Servers**: N/A
- **Last Checked**: 2026-06-03
- **Degraded Since**: N/A
- **Fallback Impact**: None

## 1. Project Overview (Overview)
- **Project Goal**: Extend /xstatus status report from a high-level dashboard into a diagnostic tool by increasing information density without adding visual noise.
- **Core Value**: Developers can quickly diagnose task stall reasons, team collaboration status, and overall health trends from the same report surface area.

## 2. Target Audience (Target Audience)
- **Persona 1**: WorkflowX developers using /xstatus to monitor multi-child workflows -- need quick drill-down into evaluation history, fix instructions, and blocking dependencies.
- **Persona 2**: Team leads using Mode A-parallel -- need visibility into which teammate is working on which child task.

## 3. Boundaries & Scope (Scope & Non-Goals)
### 3.1 Clearly In-Scope
- Enhance data collection in module 07 to extract P0/P1 counts, fix instructions, evaluation trends, file lists, and blocking dependencies from hybrid documents.
- Add CSS for hover tooltips, trend indicators, empty states, and enhanced mode badges.
- Update HTML template with new placeholder patterns and enhanced elements.
- Update rendering logic in module 07 for each optimization.
- Sync changes to `.claude/` and `.codex/` copies.

### 3.2 Clearly Out-of-Scope / Non-Goals
- No new colors or fonts beyond huashu-design palette.
- No JavaScript interactivity (pure CSS + title attributes).
- No changes to hybrid-template.md structure (only reading existing data).
- No changes to orchestratorX routing or core iteration loop logic.

## 4. Non-Functional Requirements (Non-Functional Requirements)
- **Zero-breakage compatibility**: Old templates must still work; new features degrade gracefully in older environments.
- **Huashu-design compliance**: warm white #fafaf7, rust orange #c04a1a, monospace numerals, no emoji, thin-line separators.
- **Performance**: Pure attribute enhancements (title, data-*) have negligible impact on report generation speed.

## 5. Success Metrics (Success Metrics)
- All 5 optimizations rendered correctly in generated HTML.
- Existing layout unbroken (no visual regressions).
- Hover tooltips display meaningful data from hybrid documents.

## 6. Definition of Done (DoD)
- [ ] All code must pass Linter static checks with no warnings or errors.
- [ ] No TODO or FIXME remains in core logic code.
- [ ] Module 07 updated with enhanced data collection for all 5 optimizations.
- [ ] HTML template updated with new CSS classes and placeholder patterns.
- [ ] Both runtime copies (`.claude/`, `.codex/`) synchronized.

---

> **Incremental Section (Slow-Changing Incremental Section)**

## 7. Feature Map & Child Registry (Routing Table)

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | xstatus-density-child-1-hybrid.md | Data enrichment: hover details for child meta + teammate status (Optimizations 1 & 2) | 6 | Draft | N/A |
| 2 | xstatus-density-child-2-hybrid.md | Visual polish: empty state handling + mode badge semantic optimization (Optimizations 4 & 5) | 5 | Draft | N/A |
| 3 | xstatus-density-child-3-hybrid.md | Trend indicator: completion rate micro-trend with historical comparison (Optimization 3) | 4 | Draft | N/A |

### 7.1 Feature Map History (Archived Children)

| # | Child File | Scope | AC Count | Final Status | Archived At |
|---|-----------|-------|----------|-------------|-------------|
| *(archived rows appear here)* | | | | | |

## 8. Engineering & Knowledge Index Appendix (Context Appendix)
### 8.1 Global Shared File Index
- **File Path**: `.claude/skills/orchestrator-playbook/modules/07-status-report.md` | **File Purpose**: Status report data collection and rendering logic | **Shared By**: C-01, C-02, C-03
- **File Path**: `.claude/skills/orchestrator-playbook/templates/status-report.html` | **File Purpose**: HTML template with CSS and placeholder structure | **Shared By**: C-01, C-02, C-03
- **File Path**: `xstatus_optimization_suggestions.md` | **File Purpose**: Optimization specification document (reference only) | **Shared By**: global

### 8.2 Memory Pointers (Root-Level Knowledge Graph)
- **Root Nodes**: xstatus-report, huashu-design, module-07, html-template
- **Root Relations**: module-07 generates data -> html-template renders it; huashu-design constrains visual style

### 8.3 Cross-Branch Dependencies
- C-03 depends on C-01: trend indicator requires the enhanced data collection framework established in C-01 (previous report reading capability).

---

> **Dynamic Section (High-Frequency Volatile Section)**

## 9. Evaluation Summary (Aggregated)

| # | Child File | Eval Result | P0 Count | P1 Count | Last Eval |
|---|-----------|-------------|----------|----------|-----------|
| 1 | xstatus-density-child-1-hybrid.md | N/A | 0 | 0 | N/A |
| 2 | xstatus-density-child-2-hybrid.md | N/A | 0 | 0 | N/A |
| 3 | xstatus-density-child-3-hybrid.md | N/A | 0 | 0 | N/A |

### 9.1 Aggregated Metrics
- **Total Children**: 3
- **Passed**: 0
- **In Progress**: 0
- **Not Started**: 3

<!-- End of Parent Hybrid Template -->

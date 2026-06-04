# Hybrid Docs - Split Infographics

**File Name**: split-infographics-hybrid.md
**Document Type**: Parent (Routing Center)

**Document Status**: Draft
**Update Date**: 2026-06-04
**Author**: Tree
**Version**: v1.0

---

> **Static Context (Static Section)**
> The following configuration rarely changes after initial establishment.

## 0. Runtime Environment Status (System)

- **MCP Status**: Active
- **MCP Servers**: server-memory, server-sequential-thinking
- **Last Checked**: 2026-06-04
- **Degraded Since**: N/A
- **Fallback Impact**: None

## 1. Project Overview (Overview)
- **Project Goal**: Split the 3 current long infographic HTML files (architecture/token-optimization/capabilities) into 6 shorter images to improve GitHub README reading experience. Each image should be 400-550px tall and independently understandable.
- **Core Value**: Reduce scrolling fatigue in GitHub README, improve visual comprehension of WorkflowX architecture and capabilities.

## 2. Target Audience (Target Audience)
- **GitHub README Visitors**: Developers evaluating WorkflowX, need quick visual understanding of architecture, token optimization, and unique capabilities without excessive scrolling.

## 3. Boundaries & Scope (Scope & Non-Goals)
### 3.1 Clearly In-Scope
- Create 12 new split HTML files (6 Chinese + 6 English)
- Update screenshot script to capture new files
- Update README.md and README.en.md to reference new split images
- Delete old PNG files from images directory after new ones are generated
- Keep old HTML source files (not deleted)

### 3.2 Clearly Out-of-Scope / Non-Goals
- **Non-Goal**: Do not modify the animation file `06-workflow-animation.html`
- **Non-Goal**: Do not delete original HTML source files
- **Non-Goal**: Do not change the design language (terracotta, serif/sans-serif, 720px width)

## 4. Non-Functional Requirements (Non-Functional Requirements)
- **Width**: 720px native (consistent with existing)
- **Height**: 400-550px per image (key constraint)
- **Minimum Font Size**: 14px
- **Color Scheme**: Terracotta (#C04A1A) primary
- **Typography**: Sans-serif body + serif titles
- **Independence**: Each split image must have its own header title, standalone readable

## 5. Success Metrics (Success Metrics)
- All 6 split PNGs generated, each 400-550px tall
- Both READMEs display split images correctly
- Each image independently comprehensible without viewing the others

## 6. Definition of Done (DoD)
- [ ] 12 HTML files created (6 zh + 6 en) in `docs/design/`
- [ ] Screenshot script updated and produces 12 PNGs
- [ ] Old PNGs deleted from `docs/design/images/`
- [ ] README.md updated with split image references
- [ ] README.en.md updated with split image references
- [ ] All images have meaningful alt text

---

> **Incremental Section (Slow-Changing Incremental Section)**

## 7. Feature Map & Child Registry (Routing Table)

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | split-infographics-html-hybrid.md | Create 12 split HTML files + update screenshot script | 14 | PASS | 2026-06-04T21:33:00 |
| 2 | split-infographics-readme-hybrid.md | Update README.md and README.en.md with new image references | 8 | PASS | 2026-06-04T21:33:00 |

## 8. Engineering & Knowledge Index Appendix (Context Appendix)
### 8.1 Global Shared File Index
- **File Path**: `scripts/screenshot.cjs` | **File Purpose**: Playwright screenshot script | **Shared By**: Child 1
- **File Path**: `docs/design/images/` | **File Purpose**: PNG output directory | **Shared By**: Child 1, Child 2

### 8.2 Memory Pointers (Root-Level Knowledge Graph)
- **Root Nodes**: infographic-split, html-template, screenshot-script, readme-integration
- **Root Relations**: html-template produces → screenshot-script captures → readme-integration displays

### 8.3 Cross-Branch Dependencies
- Child 2 (README update) depends on Child 1 (HTML + screenshot) for final image filenames

---

> **Dynamic Section (High-Frequency Volatile Section)**

## 9. Evaluation Summary (Aggregated)

| # | Child File | Eval Result | P0 Count | P1 Count | Last Eval |
|---|-----------|-------------|----------|----------|-----------|
| 1 | split-infographics-html-hybrid.md | PASS | 0 | 0 | 2026-06-04T21:33:00 |
| 2 | split-infographics-readme-hybrid.md | PASS | 0 | 0 | 2026-06-04T21:33:00 |

### 9.1 Aggregated Metrics
- **Total Children**: 2
- **Passed**: 2
- **In Progress**: 0
- **Not Started**: 0

<!-- End of Parent Hybrid Template -->

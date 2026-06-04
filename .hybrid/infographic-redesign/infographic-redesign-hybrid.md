# Hybrid Docs - Infographic Redesign

**File Name**: infographic-redesign-hybrid.md
**Document Type**: Parent (Routing Center)

**Document Status**: Draft
**Update Date**: 2026-06-04
**Author**: Tree
**Version**: v1.0

---

> **Static Context (Static Section)**

## 0. Runtime Environment Status (System)

- **MCP Status**: Degraded
- **MCP Servers**: server-memory, server-sequential-thinking
- **Last Checked**: 2026-06-04T00:00:00Z
- **Degraded Since**: 2026-06-04T00:00:00Z
- **Fallback Impact**: Knowledge graph retrieval skipped; relying on 8.1/8.3 file index only

## 1. Project Overview (Overview)
- **Project Goal**: Redesign 4 README infographic HTML files to fix unreadable text at GitHub's default 720px display width. Create clear, bold, readable infographics that maintain all original information.
- **Core Value**: Make WorkflowX README visually accessible -- every text element readable without zooming, professional appearance at GitHub default view.

## 2. Target Audience (Target Audience)
- **Persona 1**: GitHub Visitor -- first-time viewer of the WorkflowX repo, scanning README to understand the project. Reads at default 720px width, no zooming.
- **Persona 2**: Potential Contributor -- evaluating the framework's architecture and capabilities. Needs clear visual documentation to assess design quality.

## 3. Boundaries & Scope (Scope & Non-Goals)
### 3.1 Clearly In-Scope
- Redesign all 4 HTML infographic files with 720px native design width
- Minimum body text 14px, titles 28px+, descriptions 16px+
- Unified visual design language across all 4 files (terracotta #C04A1A primary)
- Sans-serif body text + serif titles font strategy
- Taller vertical layouts to accommodate larger text while preserving all content
- All original information points must be retained

### 3.2 Clearly Out-of-Scope / Non-Goals
- **Non-Goal**: Do not change the README markdown itself (image references stay the same)
- **Non-Goal**: Do not change the image generation pipeline (screenshot tooling)
- **Non-Goal**: Do not add new features or information not present in the originals
- **Non-Goal**: Do not create responsive/adaptive layouts -- fixed 720px width only

## 4. Non-Functional Requirements (Non-Functional Requirements)
- **Readability**: All text must be legible at 720px display width without zooming
- **Consistency**: Unified color palette, typography, spacing across all 4 files
- **Performance**: HTML files should render without external dependencies (self-contained CSS)
- **Compatibility**: Must render correctly in Chrome/Chromium for screenshot capture

## 5. Success Metrics (Success Metrics)
- All text readable at 720px width in GitHub README preview
- Minimum font size 14px for body text (no scaling artifacts)
- Visual consistency across all 4 infographics
- All original information points preserved

## 6. Definition of Done (DoD)
- [x] All 4 HTML files created at `docs/design/` path
- [x] Each file uses 720px native design width (animation: 1200x800)
- [x] Minimum font size 14px for body, 28px+ for titles, 16px+ for descriptions
- [x] Unified terracotta (#C04A1A) primary color across all files
- [x] Sans-serif body + serif titles typography
- [x] All original information preserved
- [x] Files render correctly when opened in browser

---

> **Incremental Section**

## 7. Feature Map & Child Registry (Routing Table)

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | infographic-architecture-hybrid.md | 01-architecture-zh.html -- system architecture diagram | 6 | PASS | 2026-06-04 |
| 2 | infographic-token-opt-hybrid.md | 03-token-optimization-zh.html -- token 3-layer optimization diagram | 6 | PASS | 2026-06-04 |
| 3 | infographic-capabilities-hybrid.md | 05-capabilities-zh.html -- unique capabilities diagram | 6 | PASS | 2026-06-04 |
| 4 | infographic-animation-hybrid.md | 06-workflow-animation.html -- workflow animation GIF source | 6 | PASS | 2026-06-04 |

### 7.1 Feature Map History (Archived Children)

| # | Child File | Scope | AC Count | Final Status | Archived At |
|---|-----------|-------|----------|-------------|-------------|
| *(none yet)* | | | | | |

## 8. Engineering & Knowledge Index Appendix
### 8.1 Global Shared File Index
- **File Path**: `docs/design/` | **File Purpose**: Target directory for all 4 HTML infographic files | **Shared By**: all Children
- **File Path**: `.hybrid/infographic-redesign/` | **File Purpose**: Hybrid Tree planning documents | **Shared By**: global

### 8.2 Memory Pointers (Root-Level Knowledge Graph)
> MCP Degraded -- relying on file index only.
- **Root Nodes**: infographic-redesign (project), 4 HTML files (deliverables)
- **Root Relations**: all Children share unified design language specification

### 8.3 Cross-Branch Dependencies
> All 4 Children are independent -- no cross-branch dependencies. They share the design specification defined in Parent Sections 1-6 but do not depend on each other's output.

---

> **Dynamic Section**

## 9. Evaluation Summary (Aggregated)

| # | Child File | Eval Result | P0 Count | P1 Count | Last Eval |
|---|-----------|-------------|----------|----------|-----------|
| 1 | infographic-architecture-hybrid.md | PASS | 0 | 1 | 2026-06-04 |
| 2 | infographic-token-opt-hybrid.md | PASS | 0 | 0 | 2026-06-04 |
| 3 | infographic-capabilities-hybrid.md | PASS | 0 | 1 | 2026-06-04 |
| 4 | infographic-animation-hybrid.md | PASS | 0 | 0 | 2026-06-04 |

### 9.1 Aggregated Metrics
- **Total Children**: 4
- **Passed**: 4
- **In Progress**: 0
- **Not Started**: 0

<!-- End of Parent Hybrid Template -->

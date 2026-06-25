# Hybrid Docs - TEST-MEMORY-001

**File Name**: test-memory-001-hybrid.md
**Document Type**: Parent (Routing Center)
**Parent**: N/A (root Parent for this diagnostic)

**Document Status**: Final
**Update Date**: 2026/06/22
**Author**: TreeX / coderX
**Version**: v1.0

---

> **Static Context (Static Section)**
> The following configuration rarely changes after initial establishment. Placing it at the top of the file maximizes the utilization of the LLM underlying Prompt Caching (Token caching) mechanism, saving substantial re-read costs.

## 0. Runtime Environment Status (System)
> Auto-managed by orchestratorX. Do not manually edit except during diagnostic observation.

- **MCP Status**: Degraded/Partial — server-memory process reachable via raw JSON-RPC, but `mcp__server-memory__*` tool wrappers are not exposed to the coderX subagent.
- **MCP Servers**: server-memory (v0.6.3), server-sequential-thinking
- **Last Checked**: 2026-06-22T02:41:27+00:00
- **Degraded Since**: 2026-06-22T02:41:27+00:00
- **Fallback Impact**:coderX used a manual JSON-RPC probe (`probe-memory.js`) to verify graph operations; normal agent tool usage would be blocked.

## 1. Project Overview (Overview)
- **Project Goal**: Execute a controlled diagnostic of WorkFlowX's integration with the `mcp/server-memory` knowledge-graph server.
- **Core Value**: Verify whether server-memory is reachable, whether round-trip writes work, whether memory influences routing/scope, estimate token savings from using memory pointers, and validate the "code truth wins" conflict-resolution rule.

## 2. Target Audience (Target Audience)
- **Persona 1**: WorkFlowX maintainers evaluating whether to keep/enable `mcp/server-memory`.
- **Persona 2**: Future agents (coderX/evaluatorX) needing a concise memory-usage baseline.

## 3. Boundaries & Scope (Scope & Non-Goals)
### 3.1 Clearly In-Scope
- Create diagnostic Hybrid docs under `.hybrid/test-memory-001/`.
- Verify availability/responsiveness of `mcp/server-memory__*` graph operations.
- Write and read back a minimal knowledge-graph trunk.
- Measure/estimate token-cost trade-offs between full-context and trunk+memory prompts.
- Test memory-code conflict handling and correction.
- Produce a final diagnostic report (`test-memory-001-report.md`).
- Optionally create one tiny, reversible test skill at `.claude/skills/diag-example-skill/SKILL.md`.

### 3.2 Clearly Out-of-Scope / Non-Goals
- **Non-Goal**: No production code changes outside `.hybrid/test-memory-001/` and the optional test skill.
- **Non-Goal**: Do not modify `.hybrid/status.json`.
- **Non-Goal**: Do not alter existing agent definitions or routing logic.
- **Non-Goal**: Do not persist unrelated knowledge into server-memory beyond the three diagnostic root entities.

## 4. Non-Functional Requirements (Non-Functional Requirements)
- **Conciseness**: Diagnostic artifacts should be short and directly test-backed.
- **Observability**: Every claim must cite evidence (tool output, file content, token estimate).
- **Reversibility**: Any created skill file must be trivial to delete without breaking WorkFlowX.

## 5. Success Metrics (Success Metrics)
1. MCP availability self-check (AC-A) records a definitive PASS or FAIL with timestamp.
2. Memory write round-trip (AC-B) succeeds with matching entity/relation data or explicitly documents why it failed.
3. A usage-link query (AC-C) demonstrates whether memory nodes influence task scope/routing.
4. Token-effectiveness estimate (AC-D) provides numeric comparison and savings ratio.
5. Conflict-handling rule (AC-E) is documented and applied.

## 6. Definition of Done (DoD)
- [x] Parent §0 updated with observed MCP status and timestamp.
- [x] Child §7 AC-A through AC-E recorded with execution notes.
- [x] §8.2 Memory Pointers trunk contains the three root entities and two relations.
- [x] `9. Evaluation Report` in the Child documents PASS/Needs Fix for each AC.
- [x] `test-memory-001-report.md` written with results, evidence, and recommendations.
- [x] Optional test skill created under `.claude/skills/diag-example-skill/SKILL.md`.

---

> **Incremental Section (Slow-Changing Incremental Section)**
> Contains core feature acceptance criteria and engineering index.

## 7. Feature Map & Child Registry (Routing Table)
> **Purpose**: This section serves as the routing center for the tree structure. Each row maps to a Child hybrid document.

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | test-memory-001-runtime-hybrid.md | Runtime memory checks and round-trip validation | 5 | PASS | 2026-06-22T02:41:27+00:00 |

### 7.1 Feature Map History (Archived Children)
| # | Child File | Scope | AC Count | Final Status | Archived At |
|---|-----------|-------|----------|-------------|-------------|
| *(archived rows appear here)* | | | | | |

## 8. Engineering & Knowledge Index Appendix (Context Appendix)
### 8.1 Global Shared File Index
> **Scope**: Only files shared across multiple Children or project-level infrastructure files.

| File Path | File Purpose | Shared By |
|-----------|--------------|-----------|
| `.claude/mcp.json` | MCP server configuration (declares server-memory and server-sequential-thinking) | global |
| `.claude/skills/orchestrator-playbook/hybrid-template.md` | Hybrid Tree Parent/Child template reference | global |
| `.claude/skills/orchestrator-playbook/modules/02-bus-payload.md` | Bus payload specification (evaluatorX format) | global |
| `.hybrid/test-memory-001/test-memory-001-runtime-hybrid.md` | Child diagnostic runtime checks | test-memory-001 |
| `.claude/skills/diag-example-skill/SKILL.md` | Optional reversible test skill used as "feature under test" | test-memory-001 |

### 8.2 Memory Pointers (Root-Level Knowledge Graph)
> **Scope**: Project-level knowledge graph. This is the **sole location** for the knowledge graph — Child documents do not contain their own knowledge graph.
> **Note**: Markdown only retains the "trunk" (high-level skeleton/outline) of knowledge nodes. Leaf nodes are stored in `mcp/server-memory`.

**Root Nodes**:
- `WorkflowX_Architecture` (entity_type: project)
  - Observations: WorkFlowX orchestrator; uses Hybrid Trees (Parent + Child); routes via `.hybrid/status.json`; supports `/xwhole`, `/xlocal`, `/xunit`.
- `TestMemory001_Feature` (entity_type: feature)
  - Observations: Diagnostic feature verifying `mcp/server-memory` availability, round-trip writes, token savings, and conflict handling.
- `TestMemory001_Lesson` (entity_type: lesson)
  - Observations: Captures findings from TEST-MEMORY-001; e.g., "code truth wins over memory" and token-efficiency estimates.

**Root Relations**:
- `WorkflowX_Architecture` → `TestMemory001_Feature` (`uses_memory_for`)
  - Rationale: The WorkFlowX architecture can leverage server-memory for context management.
- `TestMemory001_Feature` → `TestMemory001_Lesson` (`validates`)
  - Rationale: Execution of the diagnostic validates/corrects the captured lesson.

### 8.3 Cross-Branch Dependencies
> **Scope**: Dependencies between Children or shared resource constraints.
- No cross-branch dependencies for this diagnostic.

---

> **Dynamic Section (High-Frequency Volatile Section)**
> Overwritten by sub-agents every iteration round.

## 9. Evaluation Summary (Aggregated)
> **Purpose**: Lightweight aggregation of Child evaluation results. Detailed reports live in each Child's Section 9.

| # | Child File | Eval Result | P0 Count | P1 Count | Last Eval |
|---|-----------|-------------|----------|----------|-----------|
| 1 | test-memory-001-runtime-hybrid.md | PASS | 0 | 0 | 2026-06-22T02:41:27+00:00 |

### 9.1 Aggregated Metrics
- **Total Children**: 1
- **Passed**: 1
- **In Progress**: 0
- **Not Started**: 0

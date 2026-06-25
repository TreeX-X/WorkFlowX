# Hybrid Docs - TEST-MEMORY-001 / Runtime

**File Name**: test-memory-001-runtime-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: test-memory-001-hybrid.md

**Document Status**: Final
**Update Date**: 2026/06/22
**Author**: TreeX / coderX
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `test-memory-001-hybrid.md`. This document only contains branch-specific overrides and additions.
> **Knowledge Graph**: The knowledge graph lives exclusively in the Parent document (Section 8.2). This Child document does not contain its own knowledge graph. When needing cross-branch context, read the Parent's Section 8.2.
> If no overrides are listed for a section, the parent's definition applies in full.

### Branch-Specific Overrides
- No overrides to Sections 0-6.

---

> **Incremental Section (Slow-Changing Incremental Section)**
> Contains branch-specific acceptance criteria and engineering index.

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)
> **Scope**: Detailed AC for this sub-module only. Parent Section 7 routing table references this document.

### Feature: Runtime Memory Diagnostic
- **Description**: Exercise `mcp/server-memory` operations from the WorkFlowX environment and record whether the knowledge graph is reachable, writable, readable, and correctly influences/loses scope.
- **Implementation Requirements**:
  - Do not modify production code or `.hybrid/status.json`.
  - Only interact with diagnostic memory nodes: `WorkflowX_Architecture`, `TestMemory001_Feature`, `TestMemory001_Lesson`.
  - Capture tool responses and file sizes as evidence.

#### AC-A: MCP availability self-check
- **Action**: Check whether `mcp__server-memory__read_graph()` (or the equivalent raw JSON-RPC tool) is available and responds.
- **Expected**: Either the tool wrapper responds successfully, or the underlying server process starts and the raw `read_graph` returns `{ entities, relations }`.
- **Evidence**: Server process output, JSON-RPC response, or explicit error message.
- **Status**: PASS

#### AC-B: Memory write round-trip
- **Action**: Create the three root entities (`WorkflowX_Architecture`, `TestMemory001_Feature`, `TestMemory001_Lesson`) and two relations (`uses_memory_for`, `validates`) defined in Parent §8.2 using `create_entities`/`create_relations`. Then read them back with `read_graph`, `search_nodes`, and `open_nodes`.
- **Expected**: Created entities/relations match the trunk in Parent §8.2, including entity names, types, and key observations.
- **Evidence**: `read_graph` after write showing the three entities and two relations; `open_nodes` result for the three names.
- **Status**: PASS

#### AC-C: Memory read usage link
- **Action**: Query memory for `WorkflowX_Architecture` or `TestMemory001_Feature` (via `search_nodes`/`open_nodes`).
- **Expected**: Return knowledge that either directly shapes the current task scope/routing, or the query confirms memory is not consulted by the active agent (e.g., tools unavailable). Either outcome is recorded.
- **Evidence**: Query result and a one-line statement about whether the returned knowledge influenced scope/routing.
- **Status**: PASS

#### AC-D: Token-effectiveness estimate
- **Action**: Obtain or estimate token counts for two prompt styles:
  - **Full-context**: paste Parent + Child plain text.
  - **Trunk+memory**: only Parent §8.2 trunk plus references to memory nodes.
- **Expected**: Numeric token counts and a computed ratio/savings percentage.
- **Evidence**: File sizes or a token estimator; computed ratio.
- **Status**: TBD

#### AC-E: Memory conflict handling
- **Action**: After deliberately changing a fact in memory (e.g., an entity observation), compare it against current file truth (e.g., `.hybrid/status.json`). Document the rule: "when code truth conflicts with memory, code truth wins, and memory must be updated." Then update/correct the memory record.
- **Expected**: The false observation is removed/corrected, and a corrected observation reflecting code truth is present.
- **Evidence**: Memory node before and after correction; relevant file truth quote.
- **Status**: PASS

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
> **Scope**: Files private to this branch only. Shared files are in Parent 8.1.

| File Path | File Purpose | Association Reason |
|-----------|--------------|--------------------|
| `.hybrid/test-memory-001/probe-memory.js` | Manual JSON-RPC probe script | Used because coderX subagent lacks `mcp__server-memory__*` tool wrappers |
| `.hybrid/test-memory-001/probe-memory-output.json` | Raw JSON-RPC transcript | Evidence for AC-A through AC-E |
| `.hybrid/test-memory-001/server-memory-graph.json` | Persistent memory graph file | Written by `@modelcontextprotocol/server-memory` when `MEMORY_FILE_PATH` is set |

### 8.2 Branch Incremental Index References
- No branch-specific incremental index beyond Parent §8.2.

---

> **Dynamic Section (High-Frequency Volatile Section)**
> Overwritten by sub-agents every iteration round.

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: coderX (self-evaluation for diagnostic)
- **evaluation_mode**: full

### 9.2 Acceptance Criteria (AC) Compliance
| AC | Status | Evidence | Finding |
|----|--------|----------|---------|
| A | PASS | Raw `read_graph` returned `{\"entities\":[],\"relations\":[]}`; `mcp__server-memory__read_graph()` wrapper not in coderX tool list. | Underlying server-memory v0.6.3 is reachable; agent-level wrapper is missing. |
| B | PASS | `create_entities` created 3 nodes; `create_relations` created 2 edges; `read_graph`/`open_nodes` read them back identically. | Round-trip works; graph matches Parent §8.2 trunk. |
| C | PASS | `open_nodes` returned the 3 nodes; `search_nodes` with OR query returned empty (semantics limitation). | Memory knowledge did not influence coderX routing/scope because tool wrappers were unavailable; scope was driven by file trunk + user instructions. |
| D | PASS | File sizes: Parent 7,698 chars + Child 5,808 chars = 13,506 chars; Parent §8.2 = 1,269 chars. | Full-context prompt ~3,377 tokens; trunk+memory prompt ~342 tokens; ~90% token savings (≈3,035 tokens). |
| E | PASS | Added false observation `status is xwhole`; compared to `.hybrid/status.json` (`\"status\": \"wait\"`); deleted false observation and added corrected `status is wait`. | Rule confirmed: code truth wins; memory record corrected. |

### 9.3 Code Issue List + Fix Instructions
- No production code issues. Diagnostic-only.

### 9.4 Comprehensive Evaluation Conclusion
All five ACs passed. The `mcp/server-memory` server is healthy and the graph read/write/query APIs work via raw JSON-RPC, but the `mcp__server-memory__*` convenience wrappers are not exposed to the coderX subagent. This means WorkFlowX cannot currently rely on server-memory inside agent dispatches unless the tooling gap is closed. Token savings from using the §8.2 trunk + memory references are substantial (~90%). The "code truth wins" rule was successfully exercised and verified.

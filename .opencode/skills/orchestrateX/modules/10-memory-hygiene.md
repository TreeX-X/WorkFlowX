# 10. Memory Hygiene (Cross-Phase Reconciliation)

## Purpose
Ensure the MCP server-memory graph remains accurate and compact across workflow phase transitions.

## When to run
- At the end of the design/planning phase, before creating Children.
- Before each evaluation round.
- Before marking a workflow PASS/FAIL in status.json.

## Steps
1. Read current graph: call `mcp__server-memory__read_graph()`.
2. Compare observations against current files (§8.1/§8.2, code, `.hybrid/status.json`).
3. For each discrepancy:
   - If file truth changed → update observation with `add_observations` or replace via delete+create.
   - If observation is stale/obsolete → call `delete_observations` (or `delete_entities`/`delete_relations` if the node itself is obsolete).
4. Prefix or remove diagnostic/test entities (`TEST_`, `DIAG_`) after they are no longer needed.
5. Record reconciliation summary in the Parent §8.2 Memory Pointers update log.

## Rule: Code truth wins
Memory must never override current file/git reality. Any conflict is resolved in favor of the codebase.

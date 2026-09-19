# Harness Release Matrix (DRAFT)

Status fields marked `TBD` are open gates, not defaults. A usable standard
is exactly one fully green row below: three repositories cannot publish a
single atomic commit, so simultaneity means one jointly accepted release
combination. No partial row ever activates the cutover, and the upgrade
window carries no dual-write, no legacy parsers, and no compatibility
switches.

| Slot | Locked value | Status |
|---|---|---|
| Standard bundle | `workflowx-harness-note` `1.0.0-s1.1` (`candidate`), manifest digest `62e2ae8b674dd5510c9e7b8a2526e4b81710c1b6ad8d075837673708eb3c4a7a` | `TBD` final signature |
| WorkFlowX checkout | `c36309d2fff40f323b3d38e38e6c3e22bd4d0dc1` | recorded |
| janus-agentX checkout | `11c8e2e0307cf4362b3ddcc8e96a315b1c642bc1` | recorded |
| janus-agentX packages | `@janus-agent/*` `0.1.0`, unpublished | `TBD` first publish |
| JanusX checkout | `0e6dd6cbe72cdbea73fe5b99aa8782925cde7550` (`0.8.6`) | recorded |
| JanusX consumption | `file:../janus-agentX/packages/...` dev links | `TBD` locked versions |
| JanusX profile pin | `workflowx` `1.0.0-s1.1` / `62e2ae8b…` | recorded |
| F01–F12 joint run | JanusX slice pinned; full cross-host equivalence open | `TBD` joint run |
| Entry switch | old noteX rules still run everywhere | `TBD` same-batch switch |

## Exit checklist

- [ ] Standard bundle leaves `candidate` with a final version and frozen digest.
- [ ] janus-agentX publishes versioned packages; no consumer keeps `file:` links.
- [ ] The same fixtures pass on roundtable, Chat, CLI, and built-in hosts plus cross-checkout partial apply.
- [ ] Real-model desktop acceptance and packaged runtime validation pass.
- [ ] `AGENTS.md`, `CLAUDE.md`, skills, agents, and commands switch in all three repositories in one batch.
- [ ] Old-asset handling (retain as foreign namespace; hand-rewrite live constraints only) is recorded per repository.

## Consumer pin rule

Each consuming checkout records this matrix in its own ledger: `harness.json`
carries the standard version plus manifest digest, and `package.json` carries
the exact shared-package versions. A parser whose major version disagrees
with the declared profile refuses writes instead of guessing.

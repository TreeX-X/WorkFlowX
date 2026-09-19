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
| WorkFlowX checkout | `1dc92104cb58b928fecbab15285ce4240c8b39fd` | recorded |
| janus-agentX checkout | `0d510f6db760de55f04c1ed8028e5078a2334977` | recorded |
| janus-agentX packages | `@janus-agent/*` `0.1.0`, unpublished | `TBD` first publish |
| JanusX checkout | `468b7d6ab118124ff47f056d0878d6e2e3d91975` (`0.8.6`) | recorded |
| JanusX consumption | `file:../janus-agentX/packages/...` dev links | `TBD` locked versions |
| JanusX profile pin | `workflowx` `1.0.0-s1.1` / `62e2ae8b…` | recorded |
| F01–F12 joint run | JanusX slice pinned; owning fixtures and adopter managed pairs pass 2026-09-19; full cross-host equivalence open | `TBD` joint run |
| Entry switch | all three checkouts run managed rules since 2026-09-19 (owning S7 plus adopter redeploy, dual-surface sync PASS in every checkout) | done 2026-09-19 |

## Exit checklist

- [ ] Standard bundle leaves `candidate` with a final version and frozen digest.
- [ ] janus-agentX publishes versioned packages; no consumer keeps `file:` links.
- [ ] The same fixtures pass on roundtable, Chat, CLI, and built-in hosts plus cross-checkout partial apply.
- [ ] Real-model desktop acceptance and packaged runtime validation pass.
- [x] `AGENTS.md`, `CLAUDE.md`, skills, agents, and commands switch in all three repositories in one batch (2026-09-19).
- [ ] Old-asset handling (retain as foreign namespace; hand-rewrite live constraints only) is recorded per repository.

## Consumer pin rule

Each consuming checkout records this matrix in its own ledger: `harness.json`
carries the standard version plus manifest digest, and `package.json` carries
the exact shared-package versions. A parser whose major version disagrees
with the declared profile refuses writes instead of guessing.

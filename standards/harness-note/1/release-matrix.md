# Harness Release Matrix (DRAFT)

Status fields marked `TBD` are open gates, not defaults. A usable standard
is exactly one fully green row below: three repositories cannot publish a
single atomic commit, so simultaneity means one jointly accepted release
combination. No partial row ever activates the cutover, and the upgrade
window carries no dual-write, no legacy parsers, and no compatibility
switches.

| Slot | Locked value | Status |
|---|---|---|
| Standard bundle | `workflowx-harness-note` `1.0.0-s1.1` (final 2026-09-19), manifest digest `b8440b011556dd61c7f14914497d667b1fa3af5f5e53c4bc84fb7e177d1e0aa9` | done 2026-09-19 |
| Standard bundle (candidate) | `workflowx-harness-note` `1.0.0-s1.2` (candidate 2026-09-25, initiative interfaces), manifest digest `5e107a605cf0b13b53a4b8c63479f4163ac39d9d40c3fade6e43112163b16d01` | candidate, pending user review |
| WorkFlowX checkout | `1dc92104cb58b928fecbab15285ce4240c8b39fd` | recorded |
| janus-agentX checkout | `0d510f6db760de55f04c1ed8028e5078a2334977` | recorded |
| janus-agentX packages | `@janus-agent/*` `0.1.0`, distributed as sibling checkouts (no registry; revisit on multi-machine or CI consumption) | decided 2026-09-19 |
| JanusX checkout | `468b7d6ab118124ff47f056d0878d6e2e3d91975` (`0.8.6`) | recorded |
| JanusX consumption | `file:../janus-agentX/packages/...` dev links; versions are the recorded checkout SHAs in this matrix | decided 2026-09-19 |
| JanusX profile pin | `workflowx` `1.0.0-s1.1` / `b8440b01…` | recorded |
| F01–F12 joint run | JanusX slice pinned; owning fixtures and adopter managed pairs pass 2026-09-19; full cross-host equivalence open | `TBD` joint run |
| Entry switch | all three checkouts run managed rules since 2026-09-19 (owning S7 plus adopter redeploy, dual-surface sync PASS in every checkout) | done 2026-09-19 |

## Exit checklist

- [x] Standard bundle leaves `candidate` with a final version and frozen digest (sealed 2026-09-19).
- [x] Distribution decided 2026-09-19: sibling checkouts, no registry (registry path reopens only on multi-machine or CI consumption).
- [ ] The same fixtures pass on roundtable, Chat, CLI, and built-in hosts plus cross-checkout partial apply.
- [ ] Real-model desktop acceptance and packaged runtime validation pass.
- [x] `AGENTS.md`, `CLAUDE.md`, skills, agents, and commands switch in all three repositories in one batch (2026-09-19).
- [ ] Old-asset handling (retain as foreign namespace; hand-rewrite live constraints only) is recorded per repository.

## S1.2 adoption gate

<!-- Note: wiki rules and consumer activation have separate boundaries — see .agents/notes/2026-09-24-note-index-derived-layer--c61d7a4e.md -->

The S1.2 candidate row identifies the input for the next joint release. The completed S1.1 checklist entries above record that earlier release; they do not activate S1.2. A rule or documentation change does not approve the candidate or satisfy these gates.

- [ ] WorkFlowX approves and seals the final bundle, records its exact version and manifest digest here, and aligns the owning harness profile and managed-rule version.
- [ ] janus-agentX supports the initiative interface declarations and passes the owning valid/invalid fixtures; the taskContractHash fixture remains unchanged.
- [ ] All three repositories pin that same final version/digest, receive the applicable managed rules, and record their actual checkout SHAs as one release combination in this matrix.
- [ ] Consumer-path compatibility checks pass for that recorded combination before writers or assemblers enable S1.2 declarations; incomplete evidence remains an open gate.

Prepare the bundle and consumer support together, then activate the recorded combination after every gate passes. While the candidate gate is open, inventory and read-only work may use the currently supported profile; candidate-only fields do not gain write authority. The wiki source-hash rule uses the existing file reader and requires no core schema or hash-algorithm change. Runtime implementation and product acceptance remain separately tracked consumer work.

## Consumer pin rule

Each consuming checkout records this matrix in its own ledger: `harness.json`
carries the standard version plus manifest digest, and `package.json` carries
the exact shared-package versions. A parser whose major version disagrees
with the declared profile refuses writes instead of guessing.

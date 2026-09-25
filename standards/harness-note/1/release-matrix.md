# Harness Release Matrix

## Accepted S1.2 combination — 2026-09-25

<!-- Note: final interface adoption and activation — see .agents/notes/2026-09-25-initiative-interfaces--839c02e6.md -->

| Slot | Accepted value | Evidence |
|---|---|---|
| Final standard | `workflowx` `1.0.0-s1.2` | LF-normalized manifest SHA-256 `1b9500b1ea5101231650f04f2e5e2c480001ccf9512ec173b8e5d737bf2d6923` |
| WorkFlowX implementation | `9cb08f9c0e98b45cc1785a181ae01094f46b050e` | Final bundle, strict interface fixtures and managed entry deployment |
| janus-agentX implementation | `bade1a9ad98e9c90ac46d51e8666423b71d587fa` | core/node/CLI packages `0.2.0`, interface validation and runtime pin |
| JanusX implementation | `7c59c12a81a72fab4a35f0f905181789236f12ea` | Installed consumer checks, lock versions and profile pin |
| Independent acceptance | PASS | R1 task `note://972afef3-2fc7-49de-a3ee-7e041225d28c/81fc137e-9c56-4d3a-88e4-10f175852c97`, fixed AC revision `d27c8a5d974783b985f229374b52718d854c8b3f` |

Independent evaluator run `01a0d6bb-5e6b-7682-ab35-f8b77700fe41` passes the standard verifier, managed sync regression (1 test), three-repository source/parity/profile check, eleven additional entry-preservation probe groups, all three package builds, core/node/CLI suites (89/47/13 tests), JanusX compatibility and maintenance suites (11 tests), and JanusX typecheck. The raw local report is `.agents/.local/r1-20260925-review-02-result.md` in JanusX. Entry-sync omission and the Windows sandbox worker-start failure are resolved; no failed case or blocker remains. The hash fixture stays `73e315502bb2e0678461ba859f4d16d73c101bdd55d2c167ecbee36eae1b8ae6`.

All S1.2 adoption gates pass for this exact combination. This activates S1.2 consumers; product wiki, composition, desktop acceptance and full JanusX legacy-Note migration remain R2–R5 work. The historical release checklist below does not claim those features.

## Historical S1.1 release record

Status fields marked `TBD` are open gates, not defaults. A usable standard
is exactly one fully green row below: three repositories cannot publish a
single atomic commit, so simultaneity means one jointly accepted release
combination. No partial row ever activates the cutover, and the upgrade
window carries no dual-write, no legacy parsers, and no compatibility
switches.

| Slot | Locked value | Status |
|---|---|---|
| Standard bundle | `workflowx-harness-note` `1.0.0-s1.1` (final 2026-09-19), manifest digest `b8440b011556dd61c7f14914497d667b1fa3af5f5e53c4bc84fb7e177d1e0aa9` | done 2026-09-19 |
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

## S1.2 adoption gate — passed

<!-- Note: wiki rules and consumer activation have separate boundaries — see .agents/notes/2026-09-24-note-index-derived-layer--c61d7a4e.md -->

The accepted combination above fixes S1.2 activation independently of the historical S1.1 checklist.

- [x] WorkFlowX seals the final bundle and aligns the owning profile and managed rules.
- [x] janus-agentX validates initiative interfaces, passes positive/negative fixtures and preserves taskContractHash.
- [x] All three repositories pin the same version/digest, receive managed rules and record exact implementation SHAs.
- [x] Consumer compatibility and independent review pass for the recorded combination.

The wiki source-hash rule uses the existing file reader and requires no core schema or hash-algorithm change. Runtime implementation and product acceptance remain separately tracked consumer work. JanusX's accepted migration scope requires conversion of every old Note; retaining legacy/foreign classifications alone does not satisfy that scope.

## Consumer pin rule

Each consuming checkout records this matrix in its own ledger: `harness.json`
carries the standard version plus manifest digest, and `package.json` carries
the exact shared-package versions. A parser whose major version disagrees
with the declared profile refuses writes instead of guessing.

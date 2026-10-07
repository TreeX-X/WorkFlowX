---
{
    "schema":  "harness-note/2",
    "id":  "2ce416be-b118-40c4-bddc-87da25a8fe02",
    "kind":  "task",
    "lifecycle":  "draft",
    "created":  "2026-10-07",
    "updated": "2026-10-07T17:26:06.799Z",
    "module":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
    "work":  {
                 "scope":  [
                               {
                                   "repoId":  "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
                                   "paths":  [
                                                 ".agents/notes/distribution/",
                                                 "docs/reviews/",
                                                 "docs/migrations/"
                                             ]
                               },
                               {
                                   "repoId":  "62b44166-82f0-41ff-838d-e2b02388ed06",
                                   "paths":  [
                                                 "."
                                             ]
                               },
                               {
                                   "repoId":  "972afef3-2fc7-49de-a3ee-7e041225d28c",
                                   "paths":  [
                                                 "."
                                             ]
                               }
                           ],
                 "acceptanceRefs":  [
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02",
                                            "criterionId":  "AC-1"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02",
                                            "criterionId":  "AC-2"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02",
                                            "criterionId":  "AC-3"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02",
                                            "criterionId":  "AC-4"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/ca370eb7-05a0-4bde-9539-4f9fddf77b2c",
                                            "criterionId":  "AC-1"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/ca370eb7-05a0-4bde-9539-4f9fddf77b2c",
                                            "criterionId":  "AC-2"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/ca370eb7-05a0-4bde-9539-4f9fddf77b2c",
                                            "criterionId":  "AC-3"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/07dc09a5-5802-4714-957f-cc9ea7d3c167",
                                            "criterionId":  "AC-1"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/07dc09a5-5802-4714-957f-cc9ea7d3c167",
                                            "criterionId":  "AC-2"
                                        },
                                        {
                                            "uri":  "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/07dc09a5-5802-4714-957f-cc9ea7d3c167",
                                            "criterionId":  "AC-3"
                                        }
                                    ],
                 "verification":  [
                                      {
                                          "id":  "V-1",
                                          "kind":  "command",
                                          "required":  true,
                                          "repoId":  "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
                                          "cwd":  ".",
                                          "program":  "node",
                                          "args":  [
                                                       "scripts/review-note-v2.mjs"
                                                   ]
                                      },
                                      {
                                          "id":  "V-2",
                                          "kind":  "manual",
                                          "required":  true,
                                          "repoId":  "62b44166-82f0-41ff-838d-e2b02388ed06",
                                          "cwd":  ".",
                                          "description":  "Verify pinned managed-file parity, migration accounting, runtime reads/writes/wiki, and fresh-session Task handoff; record commands and results."
                                      },
                                      {
                                          "id":  "V-3",
                                          "kind":  "manual",
                                          "required":  true,
                                          "repoId":  "972afef3-2fc7-49de-a3ee-7e041225d28c",
                                          "cwd":  ".",
                                          "description":  "Verify managed-file parity, migrated corpus, shared agentX tools in Chat, and planned/current module blueprint navigation; record commands and results."
                                      }
                                  ],
                 "review":  "independent"
             }
}
---

# Integrate WorkflowX with agentX and JanusX before release

## Scope

The user accepts the WorkflowX core refactor as ready for the next phase. Integrate locally in janus-agentX, then JanusX; finish debugging and adjustments before the final release push. Pin the exact candidate source commit/profile and managed inventory for each integration attempt; a candidate pin is not a release declaration. Include skills, commands, managed AGENTS/CLAUDE and agent instructions, teammate wrappers, and required standard resources. Preserve local models, permissions, plugins, unrelated configuration and unmanaged text. Keep uppercase-X skill names.

Target root scopes are provisional because runtime paths have not been mapped. Before accepting or dispatching this Task, inspect each target and narrow paths to the actual adoption modules. No unrelated module cleanup is authorized.

## Acceptance criteria

- [ ] AC-1: Source findings remain resolved; record the exact candidate source commit, profile/version/digest and managed inventory before local integration. Complete independent review and integration debugging before final release/push, then record the finalized source revision.
- [ ] AC-2: agentX then JanusX adopt the complete inventory, including teammate rules. Dry-run/diff, managed parity and repeat-run idempotence pass while local settings remain intact. Each runtime supports the selected profile before activating it; no fake profile update bypasses the synchronization guard.
- [ ] AC-3: Each target has a distinct legacy Note migration work item completed before final parsing validation. Account for old identities, rewritten/deleted sources, repaired references and protected exclusions; validate maintained module structure, type conversion, timestamps and planned modules.
- [ ] AC-4: Target evidence proves common wiki source reads and engineering tools, ordinary xdo without Task creation, and fresh-session continuation using the same Main-Agent-owned Task updated before each handoff. Preserve review obligations. JanusX proves module-only initial blueprint, single-click expansion, double-click detail/return and Chat harness read/edit/script execution through agentX.

## Verification

V-1 passes after source repair. Local integration can proceed after mapping target scope and pinning a candidate; independent finalization follows debugging before release. Also rerun the source unit tests, standard/corpus validation, skill-resource checks and managed parity after repairs. V-2 and V-3 require concrete target commands and independent review evidence before their phases are declared complete. Offline source checks alone do not satisfy runtime acceptance.

## Progress

AgentX implementation and local integration are complete at main revision 3765178e2ede9337f9ae945231ea24d7b6177274 (implementation a801a806420b31faa9fe7281a4b3f799497f693f). Shared parser/writer/wiki and Task execution support the WorkflowX v2 profile; old v1 handling and receipt semantics remain supported. Sixty tracked Notes were migrated into 69 module-owned documents before final validation. An unrelated untracked main-checkout Note remains an exact-hash exclusion.

Workspace build and 319 relevant tests pass. The broad run's single CLI automatic-repair timeout passed in the isolated 20-test harness-mode rerun; agent-core retains one existing skipped test. After merging, main passed build, 13 targeted v2/profile/handoff tests, both corpus validators and managed-rule parity. These use controlled model/reviewer ports, not live-model or JanusX UI acceptance.

Main's pre-existing deletions are retained in stash f8a48c8e58490f9a865a2cc059d366aaf89620c8; original untracked Notes/plans were restored. No remote push or final release was performed. JanusX integration, README demonstrations, independent final review and final release remain pending, so the cross-repository acceptance boxes remain open.
## Evidence

[Source readiness review](../../../../docs/reviews/workflowx-v2.md) records blockers and requirement coverage. [Source verification](../../../../docs/migrations/verification.md) records limited existing checks. [Maintained document requirements](../../harness/requirements/maintained-notes.md) distinguish WorkflowX contracts from later runtime adoption. AgentX evidence: note://62b44166-82f0-41ff-838d-e2b02388ed06/0b2e7c13-8ae0-42d9-b185-1dd575c43a19 and its docs/migrations/note-v2.json. No JanusX adoption or live-model result is claimed.

## Handoff

Main Agent owns this shared Task and updates it before every handoff with current source/target revisions, fixed references, narrowed scope, unresolved issues, next action and verification evidence. Next inspect JanusX consumers and narrow its integration scope against agentX revision 3765178e2ede9337f9ae945231ea24d7b6177274. Reuse the common tools and module metadata; implement module-only navigation and type grouping. Finalize and push only after integration debugging and review. AgentX local acceptance is recorded above; JanusX remains the next phase. New agents read this Task and linked source documents without relying on earlier conversation.

## Additional release requirements

- [README demonstrations](../requirements/readme-demo.md): update examples and demonstration assets to the integrated module-document workflow before release.
- [JanusX blueprint type groups](../../harness/requirements/blueprint-type-groups.md): group same-kind documents inside each module, using gray dashed rectangular frames and type labels; preserve module-only initial navigation.

These are pending requirements, not completed adoption evidence. Include them in downstream/release acceptance and update this shared Task before handoff.
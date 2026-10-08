---
{
  "schema": "harness-note/2",
  "id": "2ce416be-b118-40c4-bddc-87da25a8fe02",
  "kind": "task",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-08T14:23:53Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "work": {
    "scope": [
      {
        "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
        "paths": [".agents/notes/distribution/",".agents/notes/workflow/",".codex/",".claude/","scripts/","docs/reviews/","docs/migrations/"]
      },
      {"repoId":"62b44166-82f0-41ff-838d-e2b02388ed06","paths":["."]},
      {
        "repoId": "972afef3-2fc7-49de-a3ee-7e041225d28c",
        "paths": [
          "src/main/harness/",
          "src/main/notes/",
          "src/main/blueprint/",
          "src/main/roundtable/",
          "src/main/janus/blueprint-migrate.ts",
          "src/renderer/src/components/blueprint/",
          "src/renderer/src/features/blueprint/",
          "src/renderer/src/i18n/",
          "tests/",
          "scripts/",
          ".agents/",
          ".codex/",
          ".claude/",
          "standards/",
          "docs/migrations/",
          "package.json",
          "package-lock.json",
          "AGENTS.md",
          "CLAUDE.md",
          "src/main/ipc/",
          "src/shared/",
          "src/renderer/src/components/janus/"
        ]
      }
    ],
    "acceptanceRefs": [
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02","criterionId":"AC-1"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02","criterionId":"AC-2"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02","criterionId":"AC-3"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02","criterionId":"AC-4"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02","criterionId":"AC-5"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02","criterionId":"AC-6"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/ca370eb7-05a0-4bde-9539-4f9fddf77b2c","criterionId":"AC-1"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/ca370eb7-05a0-4bde-9539-4f9fddf77b2c","criterionId":"AC-2"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/ca370eb7-05a0-4bde-9539-4f9fddf77b2c","criterionId":"AC-3"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/07dc09a5-5802-4714-957f-cc9ea7d3c167","criterionId":"AC-1"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/07dc09a5-5802-4714-957f-cc9ea7d3c167","criterionId":"AC-2"},
      {"uri":"note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/07dc09a5-5802-4714-957f-cc9ea7d3c167","criterionId":"AC-3"}
    ],
    "verification": [
      {
        "id": "V-1",
        "kind": "command",
        "required": true,
        "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
        "cwd": ".",
        "program": "node",
        "args": ["scripts/review-note-v2.mjs"]
      },
      {
        "id": "V-2",
        "kind": "manual",
        "required": true,
        "repoId": "62b44166-82f0-41ff-838d-e2b02388ed06",
        "cwd": ".",
        "description": "Verify pinned managed-file parity, migration accounting, runtime reads/writes/wiki, and fresh-session Task handoff; record commands and results."
      },
      {
        "id": "V-3",
        "kind": "manual",
        "required": true,
        "repoId": "972afef3-2fc7-49de-a3ee-7e041225d28c",
        "cwd": ".",
        "description": "Verify managed-file parity, migrated corpus, shared agentX tools in Chat, and planned/current module blueprint navigation; record commands and results."
      }
    ],
    "review": "independent"
  }
}
---

# Integrate WorkflowX with agentX and JanusX before release

## Scope

The user accepts the WorkflowX core refactor as ready for the next phase. Integrate locally in janus-agentX, then JanusX; finish debugging and adjustments before the final release push. Pin the exact candidate source commit/profile and managed inventory for each integration attempt; a candidate pin is not a release declaration. Include skills, commands, managed AGENTS/CLAUDE and agent instructions, teammate wrappers, and required standard resources. Preserve local models, permissions, plugins, unrelated configuration and unmanaged text. Keep uppercase-X skill names.

JanusX scope is mapped to the shared Note boundary, desktop execution host, blueprint/wiki projection, document producers, tests, migration and managed configuration. Reverse source references are repaired during migration; unrelated behavior is outside scope. AgentX's initial v2 adoption is delivered; the evaluator execution gap identified below remains a prerequisite for final integration acceptance.

## Acceptance criteria

- [ ] AC-1: Source findings remain resolved; record the exact candidate source commit, profile/version/digest and managed inventory before local integration. Complete independent review and integration debugging before final release/push, then record the finalized source revision.
- [ ] AC-2: agentX then JanusX adopt the complete inventory, including teammate rules. Dry-run/diff, managed parity and repeat-run idempotence pass while local settings remain intact. Each runtime supports the selected profile before activating it; no fake profile update bypasses the synchronization guard.
- [ ] AC-3: Each target has a distinct legacy Note migration work item completed before final parsing validation. Account for old identities, rewritten/deleted sources, repaired references and protected exclusions; validate maintained module structure, type conversion, timestamps and planned modules.
- [ ] AC-4: Target evidence proves common wiki source reads and engineering tools, ordinary xdo without Task creation, and fresh-session continuation using the same Main-Agent-owned Task updated before each handoff. Preserve review obligations. JanusX uses the single-root module home, single-click source preview, double-click scoped browsing with the current parent retained, return restoration and shared Chat focus/navigation.
- [ ] AC-5: The embedded independent evaluator selects or constructs minimal tests against fixed AC, the host executes them and records actual results under the reviewer identity before the verdict. Repository source and Task remain read-only to reviewer-generated tests; failures, unavailable execution, cancellation and baseline drift cannot pass. xdel never dispatches an evaluator and retains any pending independent obligation. agentX and JanusX use the same test request contract.
- [ ] AC-6: Architect Notes express cross-module ownership and collaboration using existing module, requirement, decision and Task contracts. Blueprint parses pure-Note planning and ordinary development workspaces, recursive modules, shared requirements/decisions, typed relations and acceptance refs without duplicating ownership. Cross-module references remain reachable through browsing and focus. Cross-repo identity, selected checkout and unavailable/ambiguous targets remain explicit; no new mandatory architect field gates standard Note reads.

## Verification

V-1 passes after source repair. Local integration can proceed after mapping target scope and pinning a candidate; independent finalization follows debugging before release. Also rerun the source unit tests, standard/corpus validation, skill-resource checks and managed parity after repairs. V-2 and V-3 require concrete target commands and independent review evidence before their phases are declared complete. Offline source checks alone do not satisfy runtime acceptance.

## Progress

AgentX local integration is complete at main revision 61d6e7fe2e943deb8da725c6e518c5ba0ed030c2, adopting WorkflowX rules and compact metadata from a44cfb7c46219b215a6e6c0dc93221a3d39e6d65. Shared v2 parser/writer/wiki and Task execution are supported; the existing schema/profile and receipt semantics remain unchanged. Sixty tracked Notes are migrated into 69 module-owned documents.

Task files are read-only to subagents. Main Agent integrates Change Summary + Note draft and Evaluation Result. Runtime Handoff keeps one next-action block; xdel stops after self-review while any independent-review obligation remains pending. xflow retains discovery, socratesX, Ready Summary, Tasks and dependency-ordered independent evaluation.

Workspace build and 270 relevant tests pass (harness-core 93, harness-node 55, janus-agent 102, CLI harness-mode 20). Final handoff/output adjustments pass the seven-test v2-handoff/workflowx-executor rerun. WorkflowX passes 14 source tests, eight review regression assertions and standard/corpus/resource checks. Managed synchronization updates 23 files, passes parity and changes nothing on repeated apply; local settings remain intact. Controlled model/reviewer ports do not establish live-model or JanusX UI acceptance.

Main's pre-existing deletions remain in stash f8a48c8e58490f9a865a2cc059d366aaf89620c8; original untracked Notes/plans remain protected. Independent final review and release remain pending; current README delivery is recorded below. No remote push is performed.

JanusX local implementation is committed at 9c49dbabfa5f9ff1a1144fb23da0a7f3f6992204 on develop. It uses shared v2 read/write/wiki and engineering tools, module-only navigation with per-module type groups, and Task-owned progress/evidence/Handoff. Desktop IPC preserves returned drafts and pending independent review for xdel; explicit xdo Tasks keep their review obligation. The distinct migration Task is completed and self-reviewed: 254 sources migrated into maintained directories, 3 pre-existing dirty Notes preserved, 9 module entries and 256 maintained v2 documents. Final corpus validation has zero errors; 19 unbound foreign-reference diagnostics and 3 protected old links are explicit.

JanusX verification passes strict typechecking, build:check, 124 relevant unit tests (58 + 59 + 4 + 3), 7 mechanical gate tests, 18 browser tests and 5 compiled Electron scenarios. A 24-test overlapping rerun covers no-op timestamp preservation. Chat executes real shared read/edit/script tools without creating a Task; Electron tests use a local deterministic HTTP model and recover persisted receipts/history after relaunch. This verifies host integration, not external model quality. Managed parity, 397-file repeat-apply idempotence, 54-file dual-host skill comparison, package boundary and i18n checks pass. Local runtime preferences and all eight original user files are unchanged. These are Main self-review results; the independent-review obligation remains pending.

## Evidence

JanusX's follow-up module browsing implementation is committed at 48bc3b7 on develop. Main implements the accepted browsing requirement directly as xdo, without creating a Task run. Both surfaces now use a unified entry, single-click left source preview, double-click scoped module pages, nested return with selection/preview/viewport restoration, and distinct container/file cards. Full-source search and Chat share navigation; unassigned/historical documents and diagnostics stay reachable. Main self-checks pass 43 unit tests, 35 browser tests, strict typechecking, build and i18n checks. The real 260-document corpus is fully reachable across 9 modules and the unassigned list; source data stays unchanged. Corpus validation reports 257 maintained v2 documents, 254 migrated sources, 3 protected legacy files, zero errors and 23 explicitly permitted read diagnostics. These results do not satisfy the pending independent-review obligation.

[Source readiness review](../../../../docs/reviews/workflowx-v2.md) records blockers and requirement coverage. [Source verification](../../../../docs/migrations/verification.md) records limited existing checks. [Maintained document requirements](../../harness/requirements/maintained-notes.md) distinguish WorkflowX contracts from later runtime adoption. [AgentX evidence](note://62b44166-82f0-41ff-838d-e2b02388ed06/0b2e7c13-8ae0-42d9-b185-1dd575c43a19) and its docs/migrations/note-v2.json. [JanusX adoption](note://972afef3-2fc7-49de-a3ee-7e041225d28c/7359ef5b-8cbb-4e30-a727-9a4907ac5fa0), its docs/migrations/workflowx-v2-verification.md and docs/migrations/note-v2.json pin target evidence at commit 9c49dbabfa5f9ff1a1144fb23da0a7f3f6992204. No external live-model result is claimed.

Follow-up baseline and Main checks before README delivery:

Main Agent owns this Task. AgentX remains at 61d6e7fe2e943deb8da725c6e518c5ba0ed030c2; JanusX's original adoption evidence remains pinned to 9c49dbabfa5f9ff1a1144fb23da0a7f3f6992204, using WorkflowX candidate a44cfb7c46219b215a6e6c0dc93221a3d39e6d65 and the 2.0.0 profile. JanusX follow-ups 48bc3b7, a30f73b and ded7128 implement [module browsing](note://972afef3-2fc7-49de-a3ee-7e041225d28c/810fe6d0-a765-48f1-b89e-b0b3dd7048a8) AC-1 through AC-8. Single-root home uses the root module page and its multi-row layout; multi-root aggregation and no-module access remain available. No new formal Task execution or independent evaluation occurred.

JanusX 5095c4d implements [focus tools and module navigation](note://972afef3-2fc7-49de-a3ee-7e041225d28c/c28b6fb3-5cb4-4ebc-895d-0e8dab6c1725) AC-1 through AC-6. note_scope and access events remain passive; note_focus distinguishes preview, enter and locate. Module-grouped lists support individual visits, pins/removals and unavailable states. The next Chat request carries current module/path, selection and working Notes separately. Location fits the parent and primary target, shares return history and does not replay on conversation activation. Main checks pass 86 unit tests, 34 distinct browser scenarios across targeted runs, strict typechecking, build, language and corpus checks. The new browser tests execute real host tools against temporary v2 Notes and replace only Electron transport; they do not establish external model quality or independent review. The return regression caused by discarded node measurements is fixed and repeated on both surfaces. All eight original user files remain unchanged.

JanusX eed41bd completes the responsibility reorganization in two batches. Blueprint now has document reading/wiki, module navigation, maintenance conversation and workspace composition submodules; sessions has records/resume, checkpoints, project/task threads and worktrees. The real tree has 17 module entries. Seventy-seven Notes moved with stable identities, creation dates, historical acceptance and evidence; cross-cutting plans remain in their parent module. Four general UI Notes return to workbench ownership. The original migration report stays unchanged; docs/migrations/note-responsibilities.json records all 261 baseline sources and their path/ownership disposition. Details and verification belong to the [responsibility reorganization Note](note://972afef3-2fc7-49de-a3ee-7e041225d28c/b135f70a-0e7f-47e0-a8c2-968085edc472).

Main verification passes 31 distinct targeted unit tests, two real-corpus browser scenarios on embedded/workbench surfaces, strict typechecking and corpus checks. All 270 documents remain reachable; corpus validation reports 267 maintained v2 documents, 254 historical migrated sources, three protected legacy files, zero errors and 23 permitted read diagnostics. Baseline AC and historical metadata match, all eight original user-file hashes remain unchanged, and production source changes only repair Note comments. The browser tests use shared parsing, projection and lazy source reads with an Electron transport bridge; they do not satisfy independent review or full Electron acceptance. New concurrent configuration-assistant edits remain outside this commit.

README delivery is committed in JanusX 584ca88, after the dc8a639 disabled-capture fix. Shared agentX d6cd44569eee3c36c637a996131a1303b3900bde fixes spurious repair of successful domain statuses. WorkflowX's bilingual README, diagrams and maintained-note PNGs follow the same current model. The [demo requirement](../requirements/readme-demo.md) records presentation acceptance and reproducible commands; it does not close independent integration review.

Main checks pass 29 agentX tests and its package build, 40 JanusX adapter/turn-guard tests, five showcase tests, isolated build and strict types. The 271-frame desktop recording executes real scope/focus/read/write tools with a deterministic local model and requires error-free completed turns. Current JanusX corpus remains 267 maintained v2 documents plus three protected legacy files, zero errors and 24 permitted read diagnostics; the added diagnostic is the explicitly unbound cross-repository link to agentX's runtime module. Eight original user-file hashes are unchanged. Concurrent configuration-assistant edits remain excluded.

Independent implementation evaluation used WorkflowX 4e96135, agentX b40d1eb and JanusX 7257fa9 with this Task's readable 4e96135 snapshot. A separate native evaluator returned NEEDS_FIX for AC-4 R1: preview reflow sent the second physical click to the pane, bypassing node-only double-click handling. Three cases failed with the pinned stylesheet. Main repaired R1 in JanusX 34388af and updated only Progress/Handoff grounds in Task bb69444; acceptance and the work contract remained unchanged. The evaluator verified that snapshot's SHA256 c8e61c92db939f0a19f113107c57788e420e3d87c09d7bdef1d9c3dbb446414d and all repaired files before and after execution, then returned PASS for the scoped implementation. No source or Task was written by the reviewer.

Independent checks executed WorkflowX review-note-v2, note-v2/note-format/sync tests, standard/corpus/resource checks and managed parity; agentX review-tests/task-execution/v2-handoff/workflowx-executor/v2 tests and package builds; JanusX desktop, wiki, migration, architecture and focus tests; and actual Electron 35.7.5 / Node 22.16.0 test-runner probes. The repair rerun used `npx playwright test tests/e2e/blueprint-v2.spec.ts tests/e2e/architect-workspace-v2.spec.ts tests/e2e/blueprint-module-focus.spec.ts --project=island --workers=2` (16 passed), the original fixed-style double-click probe (four passed) and gesture guards (eight passed, including actual dragging). General browser runs include the pre-existing dirty stylesheet; R1 and its fix were separately verified against pinned CSS. Detailed outcomes and boundaries belong to the [agentX adoption Note](note://62b44166-82f0-41ff-838d-e2b02388ed06/0b2e7c13-8ae0-42d9-b185-1dd575c43a19) and [JanusX plan](note://972afef3-2fc7-49de-a3ee-7e041225d28c/7359ef5b-8cbb-4e30-a727-9a4907ac5fa0).

## Handoff

Main Agent alone maintains this Task. Current reviewed implementation: WorkflowX 4e96135, agentX b40d1eb and JanusX 34388af. The shared evaluator test phase, cross-module architect Notes, Blueprint association/navigation and R1 repair pass scoped independent evaluation. Both adopter rule trees are synchronized; schema/profile remains 2.0.0 and original receipts/migration inventories retain their own revisions. The user's scheduled implementation is complete locally.

The user now authorizes the remaining integration acceptance. Pin WorkflowX 4af8c1b, agentX 5c41e2f and JanusX 0408046 as the review candidates; this Handoff-only update does not change the work contract or acceptance. Main prepares an isolated JanusX build from the pinned source and preserves unrelated working edits. A separate evaluator must execute checks for historical migration completeness, local-setting preservation, cross-repository references, and the complete desktop README recording/runtime continuation. Prior scoped implementation results remain evidence for their unchanged code; record actual remaining coverage rather than repeat all passing suites.

Independent checks pass the complete current README recording, all 40 cross-repository references, migration inventory coverage and repeated managed-sync replicas. The compiled desktop command exposed R-runtime-test: its deterministic model recognized only the old verdict prompt and misclassified the new test-plan phase in two independent-review cases. Main repaired the fixture in JanusX 2e2ce79; all five compiled desktop cases and strict types now pass, with host-produced reviewer evidence asserted. Production code and fixed AC remain unchanged. Five historical JanusX raw source hashes cannot be reproduced, but original content/identity/AC accounting passes; agentX pre-adoption personal-config bytes are unavailable while current preservation passes. Keep these historical evidence limitations explicit.

Independent rerun verifies the generated evaluator evidence and finds R-runtime-ready: one xdo/independent relaunch reads window.electron before preload is ready. The same case passes on unchanged isolated rerun, confirming a timing race in the test. Main added an actual desktop-API readiness wait after both launches in JanusX 8b99f8a. No production failure is reproduced.

Next: independently verify the readiness repair, then integrate the final Evaluation Result and historical evidence qualifications before local acceptance closure. No source/Task writes by the reviewer; temporary fixtures and generated artifacts are allowed. The native result is not an embedded runtime receipt and claims no external-model result. Preserve the three deferred knowledge Notes and unrelated work. No push or release is requested or performed.

## Additional release requirements

- [README demonstrations](../requirements/readme-demo.md): update examples and demonstration assets to the integrated module-document workflow before release.
- [JanusX blueprint type groups](../../harness/requirements/blueprint-type-groups.md): group same-kind documents inside each module, using gray dashed rectangular frames and type labels; preserve module-only initial navigation.

README demonstrations are delivered with Main self-checks; independent release acceptance remains pending. Blueprint type grouping is implemented and browser-tested in JanusX; its evidence is recorded above. Include both requirements in downstream review and update this Task before handoff.

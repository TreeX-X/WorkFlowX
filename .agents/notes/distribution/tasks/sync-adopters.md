---
{
  "schema": "harness-note/2",
  "id": "2ce416be-b118-40c4-bddc-87da25a8fe02",
  "kind": "task",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-08T11:37:00Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "work": {
    "scope": [
      {
        "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
        "paths": [".agents/notes/distribution/","docs/reviews/","docs/migrations/"]
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
- [ ] AC-4: Target evidence proves common wiki source reads and engineering tools, ordinary xdo without Task creation, and fresh-session continuation using the same Main-Agent-owned Task updated before each handoff. Preserve review obligations. JanusX proves module-only initial blueprint, single-click expansion, double-click detail/return and Chat harness read/edit/script execution through agentX.

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

## Handoff

Main Agent alone maintains this Task. Current local delivery: agentX d6cd44569eee3c36c637a996131a1303b3900bde and JanusX 584ca88; WorkflowX runtime/profile remains pinned to candidate a44cfb7c46219b215a6e6c0dc93221a3d39e6d65 and 2.0.0. Original adoption receipts and migration reports keep their original revisions. JanusX plan items 1-4 (module browsing, focus tools, responsibility directories, README demonstrations) are implemented and Main-checked.

Next: clarify the evaluator test-execution boundary in WorkflowX, implement the missing reviewer-directed testing path in agentX, and align JanusX's desktop adapter. The embedded evaluator currently audits pre-run checks; this does not yet fulfill the auditX contract to derive and run minimal fixed-AC tests. Source findings and the proposed shared boundary belong to the [agentX adoption Note](note://62b44166-82f0-41ff-838d-e2b02388ed06/0b2e7c13-8ae0-42d9-b185-1dd575c43a19). Follow with architect v2 composition/navigation verification and evidence-backed fixes; current xarch and initialization already use module documents. The [JanusX plan](note://972afef3-2fc7-49de-a3ee-7e041225d28c/7359ef5b-8cbb-4e30-a727-9a4907ac5fa0) records this revised sequence before final independent review.

Before a new formal Task execution, explicitly revise this Task's stale AC-4 click/expand wording, specify evaluator and architect acceptance coverage, and pin the new baseline. Current AC and historical receipts are unchanged by this analysis. Keep work.review independent; no evaluator was dispatched and no formal execution/acceptance receipt was created. Preserve the three deferred knowledge Notes and unrelated local work. No push or release is requested.

## Additional release requirements

- [README demonstrations](../requirements/readme-demo.md): update examples and demonstration assets to the integrated module-document workflow before release.
- [JanusX blueprint type groups](../../harness/requirements/blueprint-type-groups.md): group same-kind documents inside each module, using gray dashed rectangular frames and type labels; preserve module-only initial navigation.

README demonstrations are delivered with Main self-checks; independent release acceptance remains pending. Blueprint type grouping is implemented and browser-tested in JanusX; its evidence is recorded above. Include both requirements in downstream review and update this Task before handoff.

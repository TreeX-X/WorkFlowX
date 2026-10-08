---
{
  "schema": "harness-note/2",
  "id": "2ce416be-b118-40c4-bddc-87da25a8fe02",
  "kind": "task",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-08T05:42:54.599Z",
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

JanusX scope is mapped to the shared Note boundary, desktop execution host, blueprint/wiki projection, document producers, tests, migration and managed configuration. Reverse source references are repaired during migration; unrelated behavior is outside scope. AgentX remains the completed prerequisite.

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

Main's pre-existing deletions remain in stash f8a48c8e58490f9a865a2cc059d366aaf89620c8; original untracked Notes/plans remain protected. README demonstrations, independent final review and release remain pending. No remote push is performed.

JanusX local implementation is committed at 9c49dbabfa5f9ff1a1144fb23da0a7f3f6992204 on develop. It uses shared v2 read/write/wiki and engineering tools, module-only navigation with per-module type groups, and Task-owned progress/evidence/Handoff. Desktop IPC preserves returned drafts and pending independent review for xdel; explicit xdo Tasks keep their review obligation. The distinct migration Task is completed and self-reviewed: 254 sources migrated into maintained directories, 3 pre-existing dirty Notes preserved, 9 module entries and 256 maintained v2 documents. Final corpus validation has zero errors; 19 unbound foreign-reference diagnostics and 3 protected old links are explicit.

JanusX verification passes strict typechecking, build:check, 124 relevant unit tests (58 + 59 + 4 + 3), 7 mechanical gate tests, 18 browser tests and 5 compiled Electron scenarios. A 24-test overlapping rerun covers no-op timestamp preservation. Chat executes real shared read/edit/script tools without creating a Task; Electron tests use a local deterministic HTTP model and recover persisted receipts/history after relaunch. This verifies host integration, not external model quality. Managed parity, 397-file repeat-apply idempotence, 54-file dual-host skill comparison, package boundary and i18n checks pass. Local runtime preferences and all eight original user files are unchanged. These are Main self-review results; the independent-review obligation remains pending.

## Evidence

[Source readiness review](../../../../docs/reviews/workflowx-v2.md) records blockers and requirement coverage. [Source verification](../../../../docs/migrations/verification.md) records limited existing checks. [Maintained document requirements](../../harness/requirements/maintained-notes.md) distinguish WorkflowX contracts from later runtime adoption. [AgentX evidence](note://62b44166-82f0-41ff-838d-e2b02388ed06/0b2e7c13-8ae0-42d9-b185-1dd575c43a19) and its docs/migrations/note-v2.json. [JanusX adoption](note://972afef3-2fc7-49de-a3ee-7e041225d28c/7359ef5b-8cbb-4e30-a727-9a4907ac5fa0), its docs/migrations/workflowx-v2-verification.md and docs/migrations/note-v2.json pin target evidence at commit 9c49dbabfa5f9ff1a1144fb23da0a7f3f6992204. No external live-model result is claimed.

## Handoff

Main Agent owns this Task. Local adoption is implemented in agentX 61d6e7fe2e943deb8da725c6e518c5ba0ed030c2 and JanusX 9c49dbabfa5f9ff1a1144fb23da0a7f3f6992204, using WorkflowX candidate a44cfb7c46219b215a6e6c0dc93221a3d39e6d65 and the pinned 2.0.0 profile. The [JanusX migration Task](note://972afef3-2fc7-49de-a3ee-7e041225d28c/bdced085-ceb8-441f-a4fc-48d6223b6257) is complete for clean sources; its three protected user-edited Notes and old links remain explicit exclusions. The user has since accepted a new [module browsing requirement](note://972afef3-2fc7-49de-a3ee-7e041225d28c/810fe6d0-a765-48f1-b89e-b0b3dd7048a8). Follow the revised JanusX plan recorded in fe1d072: (1) unified blueprint entry, single-click left preview, double-click module browsing, return restoration, source-wide search/Chat navigation and distinct module/file nodes; (2) responsibility-based submodule design and incremental Note reorganization; (3) README demonstrations using the stabilized behavior; (4) independent final review and fixes. Next implement item 1 against the new requirement AC-1 through AC-6, using a three-level fixture before real-corpus refinement. Before starting a new Task execution, explicitly revise the earlier AC-4 interaction wording and pin the new acceptance baseline; the prior click/expand evidence remains attached to the original integration commit. This update records planning only; none of the new UI work is complete. Keep work.review independent and do not treat these Main-authored checks as an evaluator result. No remote push or release is part of this completed local integration. A new session can continue from this Task and the target evidence without the earlier conversation.

## Additional release requirements

- [README demonstrations](../requirements/readme-demo.md): update examples and demonstration assets to the integrated module-document workflow before release.
- [JanusX blueprint type groups](../../harness/requirements/blueprint-type-groups.md): group same-kind documents inside each module, using gray dashed rectangular frames and type labels; preserve module-only initial navigation.

README demonstrations and independent release acceptance remain pending. Blueprint type grouping is implemented and browser-tested in JanusX; its evidence is recorded above. Include both requirements in downstream review and update this Task before handoff.
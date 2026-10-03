---
schema: harness-note/1
id: 5f4f7a62-f209-47ce-9ea5-58cdbf34c480
kind: task
lifecycle: accepted
created: 2026-10-03
class: architecture
work:
  scope:
    - repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
      paths: [.codex/skills/, .claude/skills/, .claude/commands/xarch.md, docs/, scripts/, .agents/notes/]
    - repoId: 62b44166-82f0-41ff-838d-e2b02388ed06
      paths: [.codex/skills/, .claude/skills/, .claude/commands/xarch.md, .agents/notes/]
    - repoId: 972afef3-2fc7-49de-a3ee-7e041225d28c
      paths: [.codex/skills/, .claude/skills/, .claude/commands/xarch.md]
  acceptanceRefs:
    - uri: note://972afef3-2fc7-49de-a3ee-7e041225d28c/2baf7439-f3a2-4bcf-a451-b922db598ea7
      criterionId: AC-1
    - uri: note://972afef3-2fc7-49de-a3ee-7e041225d28c/2baf7439-f3a2-4bcf-a451-b922db598ea7
      criterionId: AC-2
  verification:
    - id: V-1
      kind: command
      required: true
      repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
      cwd: .
      program: node
      args: [scripts/verify-harness-standard.mjs]
    - id: V-2
      kind: command
      required: true
      repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
      cwd: .
      program: node
      args: [scripts/sync-harness-rules.mjs, --check, --repos, scripts/sync-repos.list]
---

# Module declarations and conditional WorkflowX maintenance

## Scope

Introduce an opt-in authoring convention using existing S1.2 initiative Notes and exact tags architecture:project, architecture:module and architecture:example. Keep the sealed standard, five kinds, task hash, decision identity and execution semantics unchanged. Document the convention and readable templates outside the sealed standard. Adopt it in both agent surfaces and the three authorized repositories. Do not restore or edit deleted janus-agentX package sources.

Projects and modules describe enduring structure. Accepted declarations form the current structure; draft/proposed declarations remain inspectable as planned structure, while examples and rejected/archived declarations stay out of the default current graph. Both project and module roles on one declaration are ambiguous and require a visible diagnostic. Parent describes hierarchy, provides/needs interfaces describe explicit connections, and governed-by links a module to applicable decisions. Do not infer runtime calls from task dependencies or Markdown mentions. Keep every decision and Task as its own asset.

Single-repository declarations may live with code. Cross-repository declarations have one owning architect repository; local decisions and Tasks stay in implementation repositories. Do not copy declarations or expand write scope to synchronize another repository. Unavailable or unauthorized writes produce explicit pending synchronization.

## Acceptance criteria

- [x] AC-1: Document the existing-field convention, current versus planned structure, stable identity, explicit provider matching, and one owning location per declaration. Templates parse under the unchanged S1.2 schema and use no invented kinds or keys.
- [x] AC-2: xarch generates an identified project and only confirmed modules; optional examples carry architecture:example and cannot appear as real components. Unknown interfaces/bindings are omitted. Existing identity, explicit checkout selection and transaction rules remain intact.
- [x] AC-3: xdo/xdel/xflow read relevant boundaries and synchronize module declarations only on changes to existence, responsibility, public interfaces, explicit dependencies or recorded entrypoints. No obligatory per-task module binding, extra approval phase, second relation store or module maintenance report. Existing Note obligations remain.
- [x] AC-4: Hard interface constraints appear in existing task scope/acceptance and fixed references; ordinary module context is bounded. xstatus may derive structural gaps without manufacturing task completion. Canonical rules and changed adopter files match on both surfaces.
- [x] AC-5: The sealed standard and Task contract remain byte-compatible. Existing-source deletions and unrelated edits are preserved. Run standard and sync checks and report any pre-existing failures precisely.

## Verification

V-1 and V-2 verify the unchanged standard and managed rule parity. Parse authoring examples with the installed JanusX harness package. Compare tracked diffs to the starting state. The downstream JanusX task verifies runtime rendering and corpus compatibility.

## Results

2026-10-03: Canonical noteX/orchestrateX rules, module authoring guide, project/module templates and xarch command are synchronized to WorkflowX, janus-agentX and JanusX on both agent surfaces. The owning xarch decision is updated in place. The sealed S1.2 standard, digest and Task contract input remain unchanged.

WorkflowX records the convention in commit `82e844f`. janus-agentX intentionally ignores `.codex/` and `.claude/` as local runtime configuration; its synchronized rules remain local and are not force-added. Shared parser changes are unnecessary because this convention uses existing fields.

Independent evaluatorX verification passes V-1 and V-2, parses and roundtrips all 12 template copies through the installed harness-core, and checks the changed skill mirrors and three xarch command copies. Task contract at acceptance is `63be89e9a5da6b355df7c088645261d2278682417cb339e39dff38a847144830`. No package sources are changed or restored; the agentX workspace still reports 148 pre-existing package deletions. The initial deletion set was not saved as a machine-comparable hash, so this record does not claim bytewise proof of that set. JanusX rendering and execution-compatibility fixtures are verified by the dependent implementation task.

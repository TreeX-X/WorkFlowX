---
name: noteX
description: Repository-level decision assets for AI agents. Use when making a non-trivial change, technical selection, structural refactor, bug postmortem, or simplification worth revisiting.
---

# noteX

Hybrid Tree plans the task. Notes keep the decision. Write the `why` and the `why-not` into the repo, in the same commit as the code, for the next agent that touches it.

Writing follows `proseX`. Prose quality is a human nod; structure below is checkable.

## 1. Path is identity

`.agents/notes/{lifecycle}/{class}/yyyy-mm-dd-topic.md`

- Lifecycle: `proposed/` (idea, unbuilt) / `implemented/` (landed, atomic with code) / `rejected/` (declined, kept only to prevent repeats, else delete) / `archived/` (superseded, frozen read-only).
- Date is first-proposed day; status carries no date. Status must match the folder.
- Closed classes (6, never extend without updating checks): `feature` (user/agent-visible capability or non-obvious behavior choice) / `bug-fix` / `architecture` (shipped source structure, module boundaries, package links) / `process` (toolchain, gates, release around the code) / `testing` / `simplification` (removal only; behavior-preserving refactors live here, no separate `refactor`).
- No `INDEX.md`. Paths are the index; a central index invites merge conflicts under parallel agents.

## 2. File shape

First three lines are fixed:

```markdown
# Agent Note: <title>

Status: <state>
```

`proposed` -> `Status: proposed`; `implemented` -> `Status: implemented`; `rejected` -> `Status: rejected — <one-line reason>`.

Body skeletons (see `templates/`):

- `proposed`: `## Problem` -> `## Proposal` -> `## Alternatives considered` -> `## Acceptance criteria` -> `## Risks`.
- `implemented`: `## Problem` -> `## Decision` (present tense) -> `## Alternatives considered` -> `## Consequences`.
- `rejected`: frozen proposal shape; verdict lives in the `Status:` line.

Every Note requires `## Alternatives considered` with an explicit do-nothing/reuse option. `implemented/` forbids `Proposal/Plan/Acceptance criteria` sections.

## 3. When to write, update, or delete

- If half a year from now someone asks "why not the simpler way", write.
- Rename/move/default-value change on guarded code -> update the owning Note in place (facts, not a changelog appendix). 80% of maintenance is in-place sync, not new files.
- New direction -> `proposed/` first, then `implemented/` with the code in one commit, plus one reverse comment at the code entry.
- Declined in review -> `rejected/` or delete. Superseded fully -> new Note absorbs surviving reasons, old Note `git mv` to `archived/` plus inbound-link repair. Partially superseded -> both live, linked both ways.
- Exempt (`not applicable`, no Note): pure formatting, unambiguous renames, typos, release tags, behavior-preserving dependency patches.
- `xdo` lightweight path: small reversible changes with no lasting trade-off may land as an in-place sync of the owning Note (a short paragraph, not a new file) or as a Parent/Child Change Notes entry that links the commit. A full new `implemented/` Note is still required for lasting trade-offs, architecture choices, and non-obvious behavior.
- When unsure whether to write, write.

## 4. Binding and linking

- Each `implemented/` Note leaves one reverse comment at the core entry (public interface, type definition, module top, state-machine entry): `// Note: <reason> — see .agents/notes/...`. Never per-line.
- Tree -> Notes by relative link plus one-line summary, never inlined prose. Notes never link to Parent/Child numbers; provenance lives in the atomic commit.
- Same-commit rule: code + Note + entry comment + Tree update land together. Commit message carries the Note path.

## 5. Mechanical checklist (until verify scripts land, the Main Agent checks by hand)

- Path depth, lifecycle/class closed sets, filename date, no `INDEX.md`.
- Header three lines, status matches folder, single status line, `## Problem` first.
- Per-lifecycle required/forbidden sections, `Alternatives considered` present.
- Relative Markdown links resolve; no `implemented/` body matches `parent|child|PR|v<digit>`.

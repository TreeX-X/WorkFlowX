# Harness Note 2

This version defines module-oriented maintained documents for WorkflowX. Its final format is independent of downstream runtime activation: agentX and JanusX must explicitly adopt the version before writing it. The sealed v1 bundle and receipt semantics remain available.

## Assets and identity

Notes live recursively under .agents/notes. Full identity is note://<repo-id>/<note-id>; UUIDs survive path changes and type conversion of the same subject. One file has one H1. The project has module.md at the root; every module has one module.md in its directory. Topic files have stable descriptive names without creation-date prefixes. Grouping directories need no entry.

Kinds are module, note, idea, requirement, decision and task. Module entries own overall design, ordinary notes own independently useful detail, ideas own exploration, requirements own acceptance, decisions own reasons and tasks own bounded delivery. Former initiative documents are classified by purpose rather than automatically converted to modules.

Frontmatter is JSON or the documented YAML subset: two-space maps/lists, scalars and inline scalar lists; no tags, anchors, aliases, merge keys, multiline/block scalars or inline YAML objects. Unknown fields produce diagnostics and must survive reads. Writers preserve unrelated user content. Prefer compact, readable JSON metadata with two-space indentation and short nested values inline. Formatting changes raw-file identity, never parsed values or Task contract semantics. JSON frontmatter is valid YAML and is useful for exact nested contracts.

## Ownership and states

Module parent identifies the nearest containing module. Project role is root-only. Other Notes declare module ownership independently of optional parent/typed relations, which may describe historical delivery context. Paths and structural declarations must agree; mismatches are diagnostics. Ordinary directories never create inferred modules.

lifecycle describes the document: draft, proposed, accepted, implemented (decision only), rejected or archived. Rejected/archived require a disposition reason. moduleState is independently planned, partial, implemented or retired. Partial is qualitative. Planned entries use complete structure with explicit unknowns. No Task completion automatically changes moduleState.

Blueprint default structure includes planned/partial/implemented module entries with visible state. Retired entries remain inspectable in history but may be cleaned up. Ordinary Notes appear through module detail/wiki, not as initial module nodes. Parent cycles, duplicates and unresolved declarations stay visible diagnostics.

## Maintenance

created is an actual calendar date. updated is UTC RFC3339 with seconds and optional milliseconds, refreshed on every maintenance write, rename/move, conversion and state update. Read-only access and no-op work do not refresh it. updated cannot precede created. Missing historic times stay unknown in migration provenance rather than guessed from file mtime.

A continuing Idea may become a Requirement or Decision with the same identity; its new shape is validated and live acceptance references preserved. Splits create identities for new subjects; merges preserve one continuing identity and repair callers. Delete absorbed/obsolete documents when facts, references and required evidence are accounted for. Exact Git revision/path or formal snapshots may preserve historic evidence; no perpetual tombstone is required.

Module entries explain the whole and link details. Do not duplicate every child fact or reduce the entry to an index. Expansion follows durable responsibility and reader needs, not a word/file threshold. Agent maintenance stays within user-discussed change scope.

## Body contracts

Module and note headings are free, with one H1 and enough content to express their subject. Templates are starting shapes, not mandatory prose skeletons.

Idea: Intent. Requirement: Expected behavior and Acceptance criteria with stable AC-n clauses. Decision: Problem, Decision, Alternatives considered and Consequences. Task: Scope, Acceptance criteria, Verification, Progress, Evidence and Handoff. AC IDs never renumber; checkboxes express observation, not a machine receipt.

Tasks carry work.scope, work.acceptanceRefs, work.verification and work.review. A task can reference its own AC clauses or another Requirement. Execution metadata is optional until the runtime starts a supported run. Draft/proposed tasks cannot claim active execution.

See execution.md for handoff/evidence, wiki.md for reads, migration.md for version transition. Ordinary authors need only the applicable skill and template.

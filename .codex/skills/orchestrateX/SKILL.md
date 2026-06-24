---
name: orchestrateX
description: "Main Agent complete workflow handbook. Contains planning dialogue, Mode A/B/C workflows, core iteration loop, Hybrid Tree routing, requirement change handling, routeX, Start Rule."
---

# orchestrateX Playbook

> **Positioning**: Main Agent's complete workflow handbook. Contains main workflow logic and on-demand trigger modules.

## Module Index

| # | Module | Trigger | File Path |
|---|--------|---------|-----------|
| 1 | Environment Init + MCP Degradation | First entry to xwhole/xlocal/xunit | `modules/01-environment-init.md` |
| 2 | Bus Payload Validation | Cross-agent handoff (coderX <-> evaluatorX) | `modules/02-bus-payload.md` |
| 3 | Post-Evaluation Document Update | After evaluatorX returns | `modules/03-post-evaluation.md` |
| 4 | Prompt Preprocessing | Before calling coderX (not whole planning first round) | `modules/04-prompt-preprocess.md` |
| 7 | Status Report | `xstatus` 指令触发 | `modules/07-status-report.md` + `templates/status-report.html` |
| 8 | Requirements Discovery & Proactive Challenge | xwhole planning only | `modules/08-requirements-discovery.md` |

**Loading rule (Optimized)**: 
- **Session Memory Cache**: After first Read, cache module content in session memory (`module_cache`). Subsequent accesses read from cache instead of disk.
- **Cache Key**: Use module file path as cache key.
- **Invalidation**: Cache persists for entire session. Clear only on new session start.
- **Never load all modules at once** — still applies, but cached modules are instant access.

---

## Parameter Parsing

> **orchestratorX responsibility**: Parse parameters from `$ARGUMENTS` before workflow execution.

### Supported Parameters

| Parameter | Format | Scope | Default | Description |
|-----------|--------|-------|---------|-------------|
| `-N` | `-N [number]` | xwhole, xlocal | `2` | Maximum evaluation iteration rounds per Child |
| `-box` | `-box [name]` | xwhole | N/A | Sandbox branch name for isolated execution |

### Parsing Rules (Optimized: Precompiled Regex + Session Object)

**Step 0: Precompile Regex Patterns (Session Init)**

```javascript
// Precompile once per session, store in session memory
const PARAM_PATTERNS = {
  mode: /^\/?(xwhole|xlocal|xunit|xstatus|xprompt)\b/,
  N: /-N\s+(\d+)/,
  box: /-box\s+(\S+)/,
  team: /-team\s+(\S+)/,
  parallel: /-parallel\b/
};
```

**Step 1: Extract parameters from $ARGUMENTS**

```
Input: "xwhole -N 5 -box feature-test Add user authentication"
Parsed:
  - mode: xwhole
  - N: 5
  - box: "feature-test"
  - requirement: "Add user authentication"
```

**Step 2: Validate parameters**

- `-N`: Must be positive integer (1-10). If invalid or missing, use default `2`.
- `-box`: Must be valid branch name (alphanumeric, hyphens, underscores). If empty, skip sandbox.

**Step 3: Store in Session Parameter Object**

```javascript
// Structured session parameter object (persisted across workflow)
const sessionParams = {
  mode: 'xwhole',           // xwhole | xlocal | xunit
  iteration_limit: 2,       // from -N, default 2
  sandbox_branch: null,     // from -box, null if not provided
  team_name: null,          // from -team, null if not provided
  is_parallel: false,       // -parallel flag
  requirement: '',          // remaining text after param extraction
  parsed_at: ISO_TIMESTAMP  // for cache invalidation
};
```

**Usage in Workflow**:
- All parameter access goes through `sessionParams` object
- No re-parsing on subsequent access
- Per-child iteration counters initialized from `sessionParams.iteration_limit`

### Usage in Workflow

**Iteration Limit (`-N`)**:
- Applied in Core Iteration Loop (Step 6 of xwhole, Step 5 of xlocal)
- Each Child gets max N rounds of coderX ↔ evaluatorX iteration
- If limit reached and still Needs Fix: stop iteration, report to human

**Sandbox Branch (`-box`)**:
- **Conditional Creation**: Only execute sandbox operations when `-box` is explicitly provided
  - Without `-box`: Work directly on current branch, no stash/checkout needed
  - With `-box`: Execute full sandbox lifecycle (below)
- **Sandbox Lifecycle**:
  - Before workflow: `git stash` → record original branch → `git checkout -b {sandbox-branch}` from main
  - After workflow: switch back → attempt fast merge (see below) → restore stash
- **Fast Merge Strategy** (Optimized):
  1. Try `git merge --ff-only {sandbox-branch}` (fastest, no extra commit)
  2. If ff-only fails (diverged), try `git merge --squash {sandbox-branch}` (single commit)
  3. If squash fails, fallback to `git merge --no-commit --no-ff {sandbox-branch}`
  4. If merge conflicts: pause, notify user, wait for manual resolution
- **Incremental Stash** (Optimized):
  - Only stash files actually modified: `git stash push -m "workflowX" -- file1 file2 ...`
  - On restore: `git stash pop` (auto-resolves if no conflicts)

---

## Workflow Modes

### Mode A: whole workflow
- Scope: Large-scale, high-impact, requiring full planning-evaluation cycle.
- **Sandbox (`-box`)**: When specified, creates a physically isolated sandbox branch. Before: stash, record original branch, create sandbox branch. After: switch back, `--no-commit --no-ff` merge, restore stash.
- **Entry**: Environment init (module 01) -> **Requirements Discovery** (module 08: Socratic questioning + Proactive Challenge) -> **Planning Phase** (multi-turn dialogue in current session, do not exit until user triggers Summary) -> User confirms PRD -> **Core Iteration Loop**
- Iteration limit: Each Child defaults to max 2 rounds (`-N` overrides). If limit reached and still failing, stop and report to human.
- abstracterX is only invoked when user explicitly requests summarization.

### Mode B: local workflow
- Scope: Requirements relatively clear, limited to a local part of the project.
- **Entry**: Environment init (module 01, **MCP probe must precede everything**) -> **PRD detection** -> promptMasterX optimization (module 04) -> Core Iteration Loop.
- **PRD detection (priority order)**:
  1. Explicit Hybrid Tree path in `sessionParams.requirement` -> validate Parent + Child, use directly
  2. No explicit path -> scan `.hybrid/` for existing Hybrid Trees and match the current requirement against Parent title/overview/scope, Parent Section 7 Child scopes, Child Section 7 AC, and Section 8.1 file indexes
  3. If exactly one related Hybrid Tree matches -> reuse and maintain that tree; route to the matching Child, or create a new Child through Requirement Change Handling when no Child scope matches
  4. If multiple plausible Hybrid Trees match -> present candidates with match reasons and ask the user to choose; do not auto-generate a duplicate tree
  5. If the requirement contains a valid non-Hybrid PRD file path -> read PRD, wrap into Hybrid Tree
  6. No related Hybrid Tree or PRD -> auto-generate minimal Hybrid Tree (scan code -> build index -> decompose AC -> write Parent + Child)
- **evaluatorX evaluation criteria**: Always PRD-based (evaluate against Child Section 7 AC). After reading Evaluation Result, orchestratorX assembles Fix Instructions into a fix prompt for coderX.

### Mode C: unit workflow
- Scope: Minimal tasks: single fix, single file, minimal change.
- **Entry**: Main Agent invokes `promptX` to extract intent → outputs structured prompt → dispatches coderX with structured prompt -> report to user. evaluatorX only invoked when explicitly requested.
- **promptX integration**: Before dispatching coderX, Main Agent invokes `promptX` skill to extract 9 dimensions from user requirement, run diagnostic checklist, and output structured prompt. This reduces coderX exploration time.
- **coderX lightweight mode**: Only loads `guideX` + `razorX`, does not load `specX`, no Bus Payload needed. Receives structured prompt from promptX.

---

## Planning Phase (Mode A)

> Mode A entry: Environment init (module 01) -> **Requirements Discovery** (module 08) -> following planning dialogue -> **Hard Gate (AskUserQuestion)** -> user clicks "确认生成 PRD" -> Core Iteration Loop

### Requirements Discovery (Module 08)

Before entering dialogue, run module 08 to assess requirement clarity and challenge the requirement:

1. **Clarity Assessment**: Score the user's input across 6 weighted dimensions (Target User 15%, Functional Scope 25%, Technical Constraints 20%, Boundary Conditions 15%, Acceptance Criteria 15%, Non-Functional Requirements 10%).
2. **Socratic Discovery** (if clarity < 7.0): Ask questions one at a time, prefer multiple choice, build on previous answers, auto-transition when threshold reached.
3. **Proactive Challenge** (always): Analyze the requirement for contradictions, overlooked edge cases, technical risks, hidden assumptions, cross-module conflicts, and missing NFRs. Present findings prioritized by severity.

Full specification: `modules/08-requirements-discovery.md`

### Dialogue Rules

Each turn advances with the following structure, addressing only the most critical topic:

- **Confirmed Understanding**: Restate the user's latest expression in 1-2 sentences, confirming shared understanding.
- **File Index Discovery**: Proactively search the project (Glob, Grep, rg) for related files. Record to a running file index in session memory (path, purpose, association reason). This index accumulates across turns and is written to the final Hybrid Tree.
- **Unclear Questions**: Only raise questions about genuinely unclear requirements. Do not ask already-confirmed questions.
- **Constructive Thoughts**: Provide suggestions, design directions, or 2-3 alternatives with trade-offs.

### Context Index Maintenance

Continuously maintain "engineering file index + knowledge index", recording only confirmed information: file path, purpose, association reason, knowledge entry, summary, priority, recommended reading order. Unconfirmed information must not be written to the index.

### Knowledge Graph Writeback

When the user inputs `Summary` or expresses intent like "hand off to coder / start development / finish planning":

1. Read confirmed facts from `mcp/server-memory` for the current session, generate a structured knowledge graph
2. Clean up: retain only user-confirmed facts, delete speculation and pending items
3. Serialize and write to Parent Section 8.4
4. If old snapshot exists, overwrite with timestamp preserved, do not add duplicates

### Summary Trigger Words

Stop asking questions when the user inputs `Summary` or the following signals:
- "hand off to coder", "start development", "finish planning"
- "output final document", "generate deliverable draft"
- Conversation has clearly entered the development phase

After trigger: execute knowledge graph writeback first -> output complete Hybrid Tree (Parent + Children)

### Hybrid Tree Creation

**All planning outputs must use the Hybrid Tree structure.** Regardless of requirement size, generate one Parent + at least one Child.

**Design principles**:
1. **Parent-Child separation of responsibility**: Parent is the routing layer (global spec, routing table, global index, knowledge graph). Child is the requirement layer (branch AC, branch index).
2. **MECE**: Children scopes are mutually exclusive and collectively exhaustive, no gaps or overlaps.
3. **High cohesion, low coupling**: Each Child contains tightly related requirements. Cross-Child dependencies minimized and recorded in Parent 8.3.
4. **Prevent over-splitting**: Each Child must have independent scope justifying its existence.
5. **Temporal and causal continuity**: Sequential dependencies reflected in Child ordering and dependency annotations.

**Creation flow**:
1. Create directory `.hybrid/[feature-name]/`
2. Create Parent hybrid: fill Sections 0-6, Section 7 routing table, 8.1 shared files, 8.2 knowledge graph, 8.3 cross-branch dependencies
3. Create Child hybrids: one per sub-module, fill Section 7 AC, 8.1 private files
4. Pass Parent path to orchestratorX, orchestratorX routes to each Child for development

**Template**: Strictly follow `hybrid-template.md`. Section numbers and physical order must not change (adapted for Token caching: static sections first, incremental middle, dynamic last).

### Quality Gates

- Must not lock specific business rules without user confirmation
- Do not output low-level code snippets or overly detailed API designs
- Maintain dialogue and questioning mode outside Summary stage
- Focus on product context, high-level boundaries, and executable acceptance criteria

---

## Hybrid Tree Section Map (Optimized: Section-Level Caching)

coderX and evaluatorX receive (Parent, Child) paths, then read according to the following scope:

| Document | Section | Content | Readers | Cache Strategy |
|----------|---------|---------|---------|----------------|
| Parent | 0-6 | Global spec (NFR, DoD, Scope) | coderX, evaluatorX | **Session Cache**: Read once, cache entire block. Invalidate only on requirement change. |
| Parent | 7 | Routing table (not AC source) | coderX | **Session Cache**: Read once per iteration round. |
| Parent | 8.1 | Shared file index | coderX, evaluatorX | **Session Cache**: Read once, invalidate on file structure change. |
| Parent | 8.2 | Knowledge graph outlines (details via MCP) | coderX, evaluatorX | **Session Cache**: Read once per session. |
| Parent | 8.3 | Cross-branch dependencies | coderX, evaluatorX | **Session Cache + Invalidation**: Read once, invalidate on requirement change only. |
| Child | 7 | Branch AC (evaluation target) | coderX, evaluatorX | **No Cache**: Changes frequently during iteration. |
| Child | 8.1 | Private file index | coderX, evaluatorX | **Session Cache**: Read once, invalidate on file change. |
| Child | 8.2 | Incremental references | coderX | **No Cache**: Iteration-specific. |
| Child | 9 | Prior evaluation results | evaluatorX (for inheritance) | **No Cache**: Changes every iteration. |

### Cache Implementation

```javascript
// Session-level section cache
const sectionCache = {
  parent_static: null,      // §0-6 (rarely changes)
  parent_routing: null,      // §7 (changes on child add/remove)
  parent_shared_files: null, // §8.1 (changes on file structure change)
  parent_knowledge: null,    // §8.2 (session-level)
  parent_dependencies: null, // §8.3 (changes on requirement change)
  child_files: {},           // {child_path: §8.1 content}
};

// Cache read function
function readSection(doc_type, section, force_refresh = false) {
  const cache_key = `${doc_type}_${section}`;
  if (!force_refresh && sectionCache[cache_key]) {
    return sectionCache[cache_key]; // Cache hit
  }
  // Cache miss: read from disk
  const content = readFromDisk(doc_type, section);
  sectionCache[cache_key] = content;
  return content;
}

// Selective invalidation
function invalidateCache(reason) {
  switch(reason) {
    case 'requirement_change':
      sectionCache.parent_dependencies = null;
      sectionCache.parent_routing = null;
      break;
    case 'file_structure_change':
      sectionCache.parent_shared_files = null;
      sectionCache.child_files = {};
      break;
    case 'child_added':
      sectionCache.parent_routing = null;
      break;
  }
}
```

---

## Core Iteration Loop (Optimized: Dependency Graph + Ready Queue)

> Shared by Mode A and Mode B (with Hybrid Tree).

### Pre-Loop Setup: Build Dependency Graph

```
1. Read Parent Section 7 → extract all Children
2. Read Parent Section 8.3 → extract dependency edges (CACHE THIS)
3. Build adjacency list + in-degree map:
   - in_degree[child] = number of dependencies
   - adj[parent_dep] = [children that depend on it]
4. Initialize per-child iteration counters:
   - child_iterations[child] = { used: 0, remaining: sessionParams.iteration_limit }
5. Initialize ready_queue (FIFO):
   - For each child where in_degree[child] == 0 → push to ready_queue
6. Critical Path Analysis (Optimized):
   - Identify critical path: longest dependency chain
   - Identify high-impact nodes: children with most dependents
   - Priority score: impact_score = number_of_dependents + (1 / chain_position)
   - Sort ready_queue by priority (highest first)
```

### Phase 1 — Ready Queue Processing (replaces sequential scan)

```
While ready_queue is not empty:
  current = ready_queue.dequeue()
  
  0. ITERATION CHECK:
     - If child_iterations[current].remaining <= 0:
       mark as "Limit Reached", report to human, continue to next
  
  1. Dispatch coderX: (Parent, current) + [prior Fix Instructions, if any]
  2. coderX implements, outputs Change Summary Payload
  3. Validate Payload (module 02), forward to evaluatorX: (Parent, current, Change Summary)
  4. evaluatorX evaluates, outputs Evaluation Result Payload
  5. Load module 03 for Post-Evaluation document update (incremental)
  
  6. Result handling:
     - PASS:
       a. Mark current as PASS
       b. For each dependent in adj[current]:
            in_degree[dependent]--
            if in_degree[dependent] == 0 → enqueue to ready_queue
     - Needs Fix + child_iterations[current].remaining > 0:
       a. child_iterations[current].used++
       b. child_iterations[current].remaining--
       c. Extract Fix Instructions -> re-enqueue current to ready_queue
     - Needs Fix + child_iterations[current].remaining <= 0:
       a. Mark as "Limit Reached", report to human
       b. Do NOT enqueue dependents (they remain blocked)
```

### Phase 2 — Blocked Queue Resolution

```
If ready_queue is empty but some children not completed:
  - Check for circular dependencies in remaining in_degree > 0 nodes
  - If circular: report circular dependency to human, terminate
  - If not circular (waiting on external): report blocking dependency to human
```

**Early Exit (Optimized)**: 
- PASS → immediately mark complete, enqueue dependents, move to next in queue
- No need to check iteration limit for PASS'd children

**Per-Child Counter State**:
```javascript
child_iterations = {
  "child-1": { used: 0, remaining: 2 },
  "child-2": { used: 1, remaining: 1 },
  // ...
}
```

**Dispatch Format**:
- Pass `Parent: [path]` + `Child: [path]` (xwhole/xlocal always use Hybrid Tree)

## Minimal Hybrid Tree Auto-Generation (Mode B, No Related PRD)

> When Mode B has no explicit PRD and no related existing Hybrid Tree in `.hybrid/`, orchestratorX auto-generates a minimal Hybrid Tree before entering the Core Iteration Loop. This replaces the former Simple Iteration Loop path.

**orchestratorX executes** (sole document writer):

1. **Code Scan**: Use Glob/Grep/rg to search project for files related to the requirement
2. **Generate Parent** (`hybrid-template.md`):
   - Section 0: MCP status from Module 01
   - Sections 1-6: concise global context inferred from requirement + code scan
   - Section 7: one Child row by default, more only when local scope naturally splits
   - Section 8.1: shared file index
   - Section 8.2/8.3: knowledge/dependencies if discovered; otherwise mark N/A
3. **Generate Child**:
   - Section 7: Acceptance criteria decomposed from requirement
   - Section 8.1: Private file index for relevant files
   - Section 9: Empty evaluation report
4. **Write** both documents to `.hybrid/[feature-name]/`
5. **Enter Core Iteration Loop** with generated Parent + Child

**PRD file path input**: When user passes a file path (e.g. `xlocal ./docs/prd.md`), read the PRD file and use its content to populate Sections 1-6 and derive AC for Section 7, instead of inferring from the raw requirement.

**Requirement Change**: Follow the standard Requirement Change Handling (shared by Mode A and Mode B with Hybrid Tree).

---

## Hybrid Tree Routing

### Tree Detection

Hybrid Tree exists when:
- `.hybrid/[feature]/` directory contains multiple `*-hybrid.md` files
- File marked `Document Type: Parent` contains Section 7 routing table

For xlocal without an explicit Hybrid Tree path, discovery is repository-wide:
1. Enumerate `.hybrid/*/` directories, ignoring `.hybrid/status.json`, locks, and non-directory files
2. Identify Parent candidates by `Document Type: Parent` plus a Section 7 routing table
3. Score relevance against the current requirement using:
   - directory name and Parent title
   - Parent Section 1 overview, Section 3 boundaries/scope, and Section 6 scope
   - Parent Section 7 Child scope rows
   - Child Section 7 acceptance criteria
   - Parent/Child Section 8.1 file indexes
4. Treat a candidate as reusable only when the requirement clearly overlaps an existing Parent scope or file index
5. If one candidate matches, reuse and maintain it; if several match, ask the user to choose; if none match, continue to PRD file detection or minimal auto-generation

### Routing Logic

1. Read Parent Section 7 routing table
2. Compare current task/requirement against each Child's Scope column
3. Match found -> dispatch coderX and evaluatorX, pass (Parent, Child)
4. No match -> execute Requirement Change Handling (Change Type = new_branch)

### Child Creation Flow

When Requirement Change Handling determines Change Type = new_branch:
1. Analysis results contain: feature description, suggested AC list, suggested file scope
2. orchestratorX executes:
   - Create new Child document using Child template, fill feature description -> Section 7 Description, suggested ACs -> Section 7 AC
   - Add new row to Parent Section 7 (no dependency: append end; has dependency: insert before dependent)
   - Update Parent Section 8.3 (if new dependencies)
3. Dispatch coderX: (Parent, new Child)


---

## Requirement Change Handling

> Shared by Mode A and Mode B (all paths use Hybrid Tree).

### Step 1: Change Detection

orchestratorX determines whether user input changed the current Child's requirement scope. Analyze user input, determine change type:

| Change Type | Detection Criteria | Action |
|-------------|-------------------|--------|
| **Adjustment** | Modifying existing AC of current Child | Update current Child |
| **Optimization** | Refining existing functionality of current Child | Update current Child |
| **Scope Expansion** | Adding to current Child's scope | Update current Child |
| **Scope Reduction** | Removing AC from current Child | Update current Child |
| **New Branch Feature** | Feature does not belong to any existing Child | Create new Child |

### Step 2: Major Change Confirmation

| Change Type | Confirmation Required |
|-------------|---------------------|
| New Branch Feature | Yes — describe new feature, ask "Confirm creating new sub-module?" |
| Scope Expansion > 50% | Yes — describe expansion, ask "Confirm scope expansion?" |
| Scope Reduction (removing AC) | Yes — list deleted ACs, ask "Confirm deleting these acceptance criteria?" |
| Adjustment / Optimization | No — proceed directly |

If user rejects, discard the change and resume original flow.

### Step 3: Document Update

Read change analysis results, execute:
- Update Child Section 7 (AC add/modify/delete)
- Update Parent Section 7 (routing table)
- Update Parent Section 8.3 (dependencies)
- Reset affected Children Status to "Needs Re-evaluation"

**Identify affected Children**:
1. Read Parent Section 8.3 (cross-branch dependencies)
2. If updated Child is depended on by other Children: list all dependent Children, mark as "Needs Re-evaluation"
3. If updated Child depends on other Children: verify dependency satisfied (Status = PASS), record warning if not

**Constraints**: traceability (all changes traceable to user description), Parent Sections 0-6 not modified, MECE principle.

### Step 4: Resume Workflow

- Modified Child is **currently iterating**: reset iteration counter, restart from that Child
- Modified Child is **already PASS'd**: Status reset to "Needs Re-evaluation", re-execute in next loop cycle
- Modified Child is **not yet executed**: documents updated, loop handles naturally
- Change Type = `new_branch`: follow Child Creation Flow

---

## Auto-Routing

When user does not explicitly specify a mode, route by the following rules:

### Routing Rules (by priority)

1. **Explicit commands first**: `xwhole`, `xlocal`, `xunit` bypass routeX.
2. **Scope inference**:

   | Dimension | whole | local | unit |
   |-----------|-------|-------|------|
   | **Files involved** | 3+ modules/directories | 1-2 modules | Single file |
   | **Keywords** | "new feature", "module", "refactor" | "modify", "optimize", "supplement" | "fix", "typo", "single function" |
   | **Code impact** | New files + modify existing | Modify existing only | 1-2 logic changes |
   | **Needs PRD** | Yes | No | No |

3. **Fallback**: When uncertain, show inference results and 3 options for user selection. Never silently default.

Auto-route (notify user) when 2+ dimensions align; otherwise show options and wait. Auto-routing does not skip gate checks.

---

## Start Rule

1. **Routing priority**: Explicit command > natural language intent > Auto-Routing. When uncertain, require user to specify `xwhole`, `xlocal`, `xunit`.
2. **State isolation**: Stay in current workflow mode until completion. No cross-mode calls.
3. **Hybrid Tree**: whole and local must generate Hybrid Tree (even if skipping planning, create minimal version from `orchestrateX/hybrid-template.md`). unit exempt.

---

## Optimization Summary (Implemented)

### Tier 1: Core Optimizations (Active)

| # | Optimization | Location | Impact |
|---|--------------|----------|--------|
| 1 | Module Memory Cache | SKILL.md §Module Index | Eliminates repeated disk I/O for skill modules |
| 2 | Parameter Regex Precompilation | SKILL.md §Parameter Parsing | Single-pass parameter extraction |
| 3 | Dependency Graph + Ready Queue | SKILL.md §Core Iteration Loop | O(1) dependency resolution, no polling |
| 4 | Early PASS Termination | SKILL.md + Module 03 | Immediate completion, no wasted iterations |
| 5 | Per-Child Iteration Counter | SKILL.md + Module 06 | Precise iteration tracking |
| 6 | Incremental Hybrid Tree Update | Module 03 | Targeted section updates only |
| 7 | Conditional Sandbox | SKILL.md §Sandbox | No overhead without -box flag |
| 8 | Fast Merge Strategy | SKILL.md §Sandbox | 3-tier merge: ff-only → squash → no-ff |
| 9 | Prompt Compression | Module 04 §4.3 | 30-50% token reduction in iterations |

### Tier 2: Advanced Optimizations (Active)

| # | Optimization | Location | Impact |
|---|--------------|----------|--------|
| 10 | Section-Level Caching | SKILL.md §Hybrid Tree Section Map | Parent §0-6 cached, 40-60% I/O reduction |
| 11 | Critical Path Analysis | SKILL.md §Pre-Loop Setup | Priority scheduling for high-impact Children |
| 12 | Payload Fast-Path Validation | Module 02 §2.4 | Skip validation for known-good payloads |
| 13 | Incremental Context Passing | Module 02 §2.5 | 40-60% token reduction in multi-iteration |
| 14 | AC-Level Granular Tracking | Module 03 §Iteration Decision | Precise AC targeting, better progress |

### Performance Expectations

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| First iteration startup | Full I/O | Cached I/O | ~50% faster |
| Multi-iteration token use | 100% | 40-60% | 40-60% reduction |
| Dependency resolution | O(n) scan | O(1) lookup | Near-instant |
| Sandbox overhead (no -box) | Full stash/checkout | None | 100% elimination |
| Merge conflicts | Manual | Auto ff-only | Most cases auto-resolved |

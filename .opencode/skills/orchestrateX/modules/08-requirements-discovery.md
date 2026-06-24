# 8. Discovery & Solution Design

> **Phase 1 of Main Agent workflow**: Exploration and design consensus. Does NOT generate Hybrid Tree until user confirms in Phase 2.

## 8.1 Two-Phase Split

### Phase 1: Discovery & Solution Design (this module)

**Purpose**: Think, explore, design, and reach consensus with user

**Behaviors**:
- Ask pointed questions, then **actively search** for answers in the codebase
- Surface findings to user as "here's what I found" rather than "can you tell me"
- Challenge assumptions based on **actual code evidence**
- Propose 2-3 solutions with trade-offs derived from exploration
- Iterate with user to refine approach

**Output**: Design consensus — NOT a Hybrid Tree

**Exit Signal**: 
```
方案设计完成。以下是推荐方案：

[Brief design consensus summary]

等待你确认方案后，我会生成 Hybrid Tree 并启动开发流程。
```

### Phase 2: Document Generation (Main Agent main flow)

**Trigger**: ONLY after user clicks "确认生成 PRD" in the Hard Gate (AskUserQuestion). Direct text input does NOT trigger Phase 2.

**Actions**:
1. Generate Hybrid Tree (Parent + Children) based on Phase 1 consensus
2. Write to `.hybrid/[feature]/` directory
3. Enter Core Iteration Loop

### When to Activate

**Mode A (whole)**: Always activate. Phase 1 replaces both Requirements Discovery and Planning Phase dialogue.

**Mode B (local)**: NOT activated. xlocal skips directly to PRD detection.

**Mode C (unit)**: NOT activated (overhead not justified for minimal tasks).

## 8.2 Discovery Turn Structure

Each turn follows this unified flow:

### Step 1: Confirm Understanding (if applicable)
Restate the user's latest input in 1-2 sentences, confirming shared context.

### Step 2: Identify Critical Gaps
Analyze requirement across 6 dimensions to identify what's most unclear or risky:

| Dimension | What to Assess |
|-----------|----------------|
| **Target User/Scenario** | Who uses this? What problem does it solve? Context? |
| **Functional Scope** | What features? In/out of scope? Key behaviors? |
| **Technical Constraints** | Tech stack? Performance? Compatibility? |
| **Boundary Conditions** | Edge cases? Error handling? Failure modes? |
| **Acceptance Criteria** | How do we know it's done? What does "working" look like? |
| **Non-Functional Requirements** | Security? Maintainability? Scalability? |

**Priority**: Address gaps that would most impact design decisions.

### Step 3: Autonomous Exploration
**Don't wait for user to answer — explore first:**

1. **Search codebase** (Glob, Grep, rg):
   - Find related files, existing patterns, similar features
   - Check constraints: tech stack files, config, dependencies
   - Identify integration points, shared utilities, edge case handling

2. **Build File Index** (session memory):
   - Path, purpose, association reason
   - Accumulates across turns → written to Hybrid Tree Section 8.1

3. **Extract insights**:
   - Existing patterns we should follow
   - Constraints we must respect (APIs, data models, conventions)
   - Edge cases already handled elsewhere
   - Potential conflicts or integration points

### Step 4: Present Findings & Challenge
Surface what you discovered and challenge the requirement:

**Format**:
```
我在代码库中发现了以下相关信息：

**现有模式**:
- [file path]: [what it does, how it's relevant]
- [file path]: [existing approach we could follow/avoid]

**约束条件**:
- [constraint from exploration]: [implication for our design]

**需要确认的点**:
1. [Question based on findings] — 我看到 [code evidence]，这意味着 [implication]
   建议方向: [proposal based on exploration]

2. [Potential conflict/risk] — [why it matters based on code]
   方案选项:
   A) [approach 1] — [pros/cons from codebase context]
   B) [approach 2] — [pros/cons from codebase context]
```

### Step 5: Propose Solutions (when appropriate)
When enough context is gathered, propose 2-3 concrete approaches with trade-offs:

**Format**:
```
基于当前需求和代码库现状，我整理出几个可行方案：

**方案 A: [name]**
- 核心思路: [brief description]
- 优势: [based on codebase patterns]
- 劣势: [based on technical constraints]
- 适合场景: [when to choose this]

**方案 B: [name]**
- 核心思路: [brief description]
- 优势: [based on codebase patterns]
- 劣势: [based on technical constraints]
- 适合场景: [when to choose this]

**推荐**: [Which and why, referencing code evidence]
```

## 8.3 Challenge Categories

Analyze requirement for issues across 6 categories (reference code evidence):


#### 1. Contradictions & Inconsistencies
- Requirements that conflict with each other (cite user's words)
- Stated constraints that contradict desired behaviors
- Conflicts with **actual codebase patterns** (reference files)

#### 2. Overlooked Edge Cases & Boundary Conditions
- Empty/null/undefined inputs (check existing validation patterns)
- Concurrent access scenarios (check existing locking/sync patterns)
- Resource exhaustion (disk full, memory limit, API rate limit)
- Partial failure states (check existing error recovery)
- Large scale inputs (check existing limits in code)
- Time-related edge cases (timezone, DST — reference existing time handling)

#### 3. Technical Feasibility & Risks
- Dependencies on unavailable/unstable services (check package.json, imports)
- Performance bottlenecks (reference similar patterns' perf issues)
- **Compatibility issues with existing code** (cite actual file conflicts)
- Known limitations of chosen technology (reference existing workarounds)

#### 4. Hidden Assumptions
- Assumptions about user behavior (challenge with actual usage data if available)
- Assumptions about data format/quality (check actual data models)
- Assumptions about system environment (check deployment configs)
- Assumptions about external service availability (check existing retry logic)

#### 5. Cross-Module Conflicts
- **Conflicts with existing features** (cite actual file/function conflicts)
- **Shared resources** causing contention (reference actual shared state)
- **API contracts that might break** (cite actual API signatures)
- **Data model changes** affecting other modules (reference actual schema dependencies)

#### 6. Missing Non-Functional Requirements
- Security: authentication, authorization, input validation (check existing patterns)
- Performance: response time, throughput (reference existing benchmarks if any)
- Maintainability: code complexity, documentation (check project standards)
- Reliability: error recovery, retry logic (reference existing patterns)
- Accessibility: if UI-related (check existing a11y patterns)

## 8.4 Dialogue Rules

1. **One topic per turn.** Address the most critical gap/risk/question first.
2. **Explore before asking.** Always search code before presenting a question. Frame as "I found X, which suggests Y — confirm?"
3. **Build on previous turns.** Reference earlier findings and user responses. Accumulate context.
4. **Progressive depth.** Start high-level (scope, user), drill into details (edge cases, implementation).
5. **Evidence over speculation.** When making claims, cite file paths, line ranges, or specific patterns.
6. **Propose solutions, not just problems.** Every challenge should include a suggested approach or trade-off.
7. **Respect user decisions.** If user acknowledges a risk and proceeds, record it and move on.
8. **No redundant questions.** If the user already answered implicitly or explicitly, don't re-ask.

## 8.5 Phase 1 Exit Protocol

### Confirmation Trigger

**Stop designing when user signals confirmation:**
- "确认" / "开始实现" / "生成文档" / "开始开发"
- "start implementation" / "generate document"
- Explicit approval of proposed solution

**Do NOT generate Hybrid Tree in Phase 1** — only output design consensus and wait.

### Phase 1 Exit Output

Before waiting for user confirmation, output design consensus:

```
方案设计完成。以下是推荐方案：

**核心目标**: [一句话目标]

**技术方案**: [选定的方案，简要说明]

**关键约束**:
- [constraint 1]: [implication]
- [constraint 2]: [implication]

**风险与应对**:
- [risk]: [mitigation approach]

**文件范围** (共 [N] 个):
- [file 1]: [role]
- [file 2]: [role]
...

等待你确认方案后，我会生成 Hybrid Tree 并启动开发流程。
```

### Phase 2 Entry (Main Agent main flow)

**After user confirms**, Main Agent executes Phase 2:

1. **Create Hybrid Tree** (Parent + Children) with findings mapped to sections
2. **Write to `.hybrid/[feature]/`**
3. **Enter Core Iteration Loop**

### Findings → Hybrid Tree Mapping (Phase 2)

**Phase 2 responsibility**: Main Agent writes confirmed findings into appropriate sections:

| Finding Type | Target Section | What to Write |
|-------------|---------------|---------------|
| Confirmed scope | Parent §1 Project Overview | Feature description with context |
| Technical constraints | Parent §3 Technical Constraints | Constraints from code exploration |
| Edge cases | Child §7 AC | AC items for edge case handling |
| NFRs (security, perf) | Parent §4 NFR | Non-functional requirements |
| Risk mitigations | Child §7 AC | AC for mitigation approach |
| Accepted risks | Parent §4 NFR | Accepted risk with note |
| Cross-module dependencies | Parent §8.3 Dependencies | Dependency edges |
| File index | Parent §8.1 (shared), Child §8.1 (private) | Accumulated file index |
| Knowledge insights | Parent §8.2 Knowledge Graph | Key insights from exploration |

### Knowledge Graph Writeback (Phase 2)

**Phase 2 responsibility**: If MCP memory is available:
1. Read confirmed facts from `mcp/server-memory` for current session
2. Generate structured knowledge graph
3. Clean up: retain only user-confirmed facts, delete speculation
4. Serialize and write to Parent Section 8.4
5. Overwrite old snapshot with timestamp preserved (no duplicates)

## 8.6 Mode-Specific Adaptations

### Mode A (Whole) Integration

```
Environment init (module 01)
  → Phase 1: Discovery & Solution Design (module 08):
    → Turn 1-N:
      → Confirm understanding
      → Identify gaps in 6 dimensions
      → Autonomous exploration (Glob, Grep, rg)
      → Present findings + challenge
      → Propose solutions (when ready)
      → User responds/refines
    → Design consensus reached
    → Output Phase 1 exit signal (wait for confirmation)
  → User confirms ("确认" / "开始实现" / etc.)
  → Phase 2: Document Generation (Main Agent):
    → Create Hybrid Tree with all findings
    → Write to .hybrid/
  → Core Iteration Loop
```

**Intensity**: Deep exploration. Spend 3-6 turns accumulating context before proposing solutions.

### Mode B (Local) Integration

Mode B does NOT use this module. xlocal skips directly to PRD detection.

```
Environment init (module 01)
  → PRD detection
  → Core Iteration Loop
```

### Mode C (Unit)

Not used. Unit tasks skip discovery entirely.
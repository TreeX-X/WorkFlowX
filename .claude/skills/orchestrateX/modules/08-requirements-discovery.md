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

## 8.2 Requirement Clarification (via socratesX)

Phase 1 clarification is delegated to the `socratesX` skill — the Socratic requirement-clarification unit. The Main Agent must invoke `socratesX` to drive the multi-turn clarification of the requirement.

**Entry directive**: When entering Phase 1, invoke `socratesX` in `question` mode. Its role is to surface hidden assumptions, contradictions, missing boundaries, technical risks, cross-module conflicts, and non-functional ambiguity — through one core question per turn, each with 2-4 options plus a recommendation. Explore the codebase first (Glob/Grep/rg) so every question is grounded in code evidence, and accumulate confirmed facts as the dialogue progresses.

**socratesX output structure** — `当前理解` / `已确认关键事实` / `待澄清问题 (选项+推荐)` — is the natural input to the design-consensus output in §8.5.

**summary mode = Phase 1 exit**: `socratesX summary` aligns with the Phase 1 Exit Output in §8.5. When the user signals confirmation, produce the design consensus. Do NOT generate the Hybrid Tree in Phase 1.

Autonomous codebase exploration (Glob/Grep/rg, building the File Index that accumulates to session memory for later Hybrid Tree §8.1) still happens alongside `socratesX` questioning — exploration grounds the questions in real code.

## 8.5 Phase 1 Exit Protocol

### Design Consensus Output

When Phase 1 questioning has accumulated sufficient confirmed facts, output design consensus:

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
```

### Hard Gate: Mandatory Confirmation (NO BYPASS)

**HARD CONSTRAINT**: When user signals intent to end Phase 1, the Main Agent MUST invoke `AskUserQuestion` before proceeding. Direct generation of Hybrid Tree/PRD without user clicking an option is **FORBIDDEN**.

**Trigger words** (when user message contains any of these):
- 中文: 确认, 开始, 开工, 生成文档, 就这样, 可以了, 没问题, 好的, 行, 确定
- English: confirm, start, generate, proceed, go ahead, done, ok, yes, sure

**Gate behavior**:

```
User message contains trigger word
    │
    ▼
Main Agent MUST call AskUserQuestion:
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ AskUserQuestion({                                           │
│   questions: [{                                             │
│     question: "需求澄清已完成，已确认 [N] 项事实。请确认：",   │
│     header: "Phase 1 确认",                                 │
│     multiSelect: false,                                     │
│     options: [                                              │
│       { label: "确认生成 PRD（推荐）",                       │
│         description: "生成 Hybrid Tree 并启动开发迭代" },     │
│       { label: "查看已确认内容",                              │
│         description: "输出 socratesX summary 格式摘要" },    │
│       { label: "继续澄清",                                   │
│         description: "返回 socratesX question 模式" },       │
│       { label: "修改范围",                                   │
│         description: "重新界定需求目标和边界" }               │
│     ]                                                       │
│   }]                                                        │
│ })                                                          │
└─────────────────────────────────────────────────────────────┘
    │
    ├─ 用户选择 "确认生成 PRD" → 进入 Phase 2
    ├─ 用户选择 "查看已确认内容" → 输出 socratesX summary，再次触发门控
    ├─ 用户选择 "继续澄清" → 返回 socratesX question 模式
    └─ 用户选择 "修改范围" → 重新界定目标，更新已确认事实
```

**Only option A ("确认生成 PRD") proceeds to Phase 2.** All other options loop back within Phase 1.

### Phase 2 Entry (Main Agent main flow)

**Only after user clicks "确认生成 PRD" in the gate**, Main Agent executes Phase 2:

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
      → Invoke socratesX (question mode) — one core question/turn, 2-4 options + recommendation
      → Autonomous codebase exploration in parallel (Glob, Grep, rg → build File Index)
      → Accumulate confirmed facts from socratesX output
      → User responds/refines
    → Output design consensus (socratesX summary structure)
  → HARD GATE: User signals intent → AskUserQuestion (4 options)
    ├─ "确认生成 PRD" → Phase 2
    ├─ "查看已确认内容" → output summary → re-trigger gate
    ├─ "继续澄清" → back to socratesX question
    └─ "修改范围" → re-define scope → update facts
  → User clicks "确认生成 PRD"
  → Phase 2: Document Generation (Main Agent):
    → Create Hybrid Tree with all findings
    → Write to .hybrid/
  → Core Iteration Loop
```

**Intensity**: Deep exploration. Spend 3-6 turns accumulating context before proposing solutions.

**Hard rule**: No Hybrid Tree/PRD generation without user clicking through the gate.

### Mode B (Local) Integration

Mode B does NOT use this module. xlocal skips directly to PRD detection.

```
Environment init (module 01)
  → PRD detection
  → Core Iteration Loop
```

### Mode C (Unit)

Not used. Unit tasks skip discovery entirely.

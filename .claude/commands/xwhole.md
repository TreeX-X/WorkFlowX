---
description: Execute Mode A workflow (whole codebase, full planning phase)
---

# /xwhole - Full Planning Flow

**Executed by Main Agent directly.**

## Critical Principle

**Even if user provides detailed requirements, must strictly follow two-phase flow:**

1. **Phase 1 mandatory**: Always explore, analyze, design — regardless of detail level
2. **User confirmation required**: Must wait for explicit confirmation keywords before generating Hybrid Tree

## Execution Flow

When user inputs `/xwhole [requirement]`:

### Stage 0: Parse Parameters
- Extract: -N, -box, -parallel, -team
- Extract requirement text

### Stage 1: Environment Init
- Execute Module 01 (MCP probe, concurrency lock)

### Stage 2: Phase 1 - Discovery & Solution Design (Mandatory)
**Cannot skip, even if user wrote detailed requirements!**

Execute Module 08 §8.2 — Phase 1 clarification is driven by invoking the `socratesX` skill:
1. **Invoke socratesX (`question` mode)**: Drive multi-turn Socratic clarification — one core question per turn, each with 2-4 options + a recommendation. Surface hidden assumptions, contradictions, missing boundaries, technical risks, cross-module conflicts, and non-functional ambiguity.
2. **Autonomous exploration (in parallel with socratesX)**:
   - Search codebase via Glob/Grep/rg to ground every question in code evidence
   - Identify existing patterns, constraints, integration points
   - Build file index (accumulate to session memory)
3. **Accumulate confirmed facts** from socratesX output (`当前理解` / `已确认关键事实` / `待澄清问题`) across turns.
4. **Produce solutions/options** through the socratic dialogue — 2-3 viable approaches with trade-offs, recommended from codebase context.
5. **Phase 1 exit**: When user signals confirmation, invoke socratesX `summary` mode to produce the design consensus (see Module 08 §8.5). Do NOT generate Hybrid Tree in Phase 1.

### Stage 3: Wait User Confirmation (Mandatory Wait)
**After outputting design consensus, must wait for explicit confirmation:**

Trigger keywords:
- "confirm"
- "start implementation"
- "generate document"
- "start development"
- "确认" / "开始实现" / "生成文档"

**Cannot execute Phase 2 before user confirmation!**

### Stage 4: Phase 2 - Document Generation (Only After Confirmation)
1. Generate Hybrid Tree (Parent + Children) based on Phase 1 consensus
2. Write to `.hybrid/[feature]/`
3. Record design decisions to documents

### Stage 5: Core Iteration Loop
- Traverse Children by dependency order
- Dispatch Agent(coderX, isolation="worktree")
- Validate Bus Payload
- Dispatch Agent(evaluatorX, isolation="worktree")
- Update documents (Module 03)
- Iteration limit: -N parameter (default 2)

## Examples

### Wrong ❌
```
User: /xwhole Implement user auth system, including login, register, JWT token, permission management, session storage

You: Understood. Generating Hybrid Tree...
[Jump directly to Phase 2]
```

### Correct ✅
```
User: /xwhole Implement user auth system, including login, register, JWT token, permission management, session storage

You: Received. Let me explore the codebase first...

[Use Glob/Grep to search]
Found relevant information in codebase:
- Existing pattern: src/middleware/auth.js has basic auth framework
- Constraint: package.json already depends on jsonwebtoken 3.x
- Need to confirm:
  1. Session storage using Redis or database? I see config.js has Redis connection
     Suggestion: Use Redis (already configured, better performance)
  2. Permission management RBAC or simple role field?
     Option A) RBAC (flexible but complex) vs B) Simplified role (fast but limited)

Based on analysis, I've prepared 3 approaches...
[Output options A/B/C]

**Recommend Option B**, reason: ...

Waiting for your confirmation to generate Hybrid Tree and start development.

[Wait for user reply "confirm"]

User: confirm, use Option B

You: Received. Generating Hybrid Tree...
[Phase 2 starts]
```

## Principle Reaffirmation

- **Phase 1 mandatory regardless of detail**: Exploration may discover constraints and risks user doesn't know
- **Explicit confirmation required between Phase 1 → Phase 2**: Design consensus more important than fast start
- **Phase 1 value**: Discover hidden tech debt, identify integration risks, propose better solutions

Detailed flow reference: `CLAUDE.md` §Mode Execution + `modules/08-requirements-discovery.md`

# 8. Requirements Discovery & Proactive Challenge

> This module defines two mechanisms for the Planning Phase: (1) Socratic Requirements Discovery for vague requirements, and (2) Proactive Challenge for all requirements including clear ones. Both run before Hybrid Tree creation.

## 8.1 Socratic Requirements Discovery

### When to Activate

Before entering the standard Planning Phase dialogue, assess requirement clarity. If the user's initial input meets **any** of the following conditions, activate Socratic Discovery:

- Requirement is a vague idea ("I want to build X", "make something that does Y")
- No specific file paths, function names, or technical details mentioned
- No acceptance criteria or success metrics provided
- Scope is ambiguous (could be 1 hour or 1 week of work)
- User explicitly says "I'm not sure", "something like", "maybe"

If the requirement already contains specific file paths, clear AC, technical constraints, and defined scope, skip Socratic Discovery and go directly to Proactive Challenge (Section 8.2).

### Clarity Dimensions & Weights

Assess requirement clarity across 6 dimensions. Each dimension scores 0-10:

| Dimension | Weight | What to Assess |
|-----------|--------|----------------|
| **Target User/Scenario** | 15% | Who uses this? What problem does it solve? What's the context? |
| **Functional Scope** | 25% | What features? What's in/out of scope? What are the key behaviors? |
| **Technical Constraints** | 20% | Tech stack? Performance requirements? Compatibility constraints? |
| **Boundary Conditions** | 15% | Edge cases? Error handling? Failure modes? Limits? |
| **Acceptance Criteria** | 15% | How do we know it's done? What does "working" look like? |
| **Non-Functional Requirements** | 10% | Security? Maintainability? Scalability? Accessibility? |

**Clarity Score** = sum of (dimension_score * weight)

### Clarity Threshold

| Score | Action |
|-------|--------|
| >= 7.0 | Skip Socratic Discovery, go to Proactive Challenge |
| 5.0 - 6.9 | Light Discovery: 2-3 targeted questions on lowest-scoring dimensions |
| 3.0 - 4.9 | Standard Discovery: 4-6 questions, cover all dimensions below 5 |
| < 3.0 | Deep Discovery: 6-10 questions, systematic coverage of all dimensions |

### Questioning Rules

1. **One question per turn.** Never batch multiple questions. Each question should be its own message.
2. **Prefer multiple choice.** Offer 2-4 options with a recommendation. Use open-ended only when options would constrain thinking.
3. **Build on previous answers.** Each question must reference or build on what the user just said. Never ask disconnected questions.
4. **Progressive depth.** Start with high-level (scope, user), then drill into details (edge cases, constraints).
5. **Surface trade-offs.** When presenting options, explain the trade-offs of each choice.
6. **No redundant questions.** If the user already answered something implicitly, don't ask again.
7. **Respect "I don't know".** If the user is unsure, propose a reasonable default and ask for confirmation.

### Question Template Patterns

**Scope clarification:**
```
你提到想做 [X]。这听起来可能涉及几个不同的方向：

A) [具体方向1] — [优点]，[缺点]
B) [具体方向2] — [优点]，[缺点]
C) [具体方向3] — [优点]，[缺点]

你倾向哪个？或者你有其他想法？
```

**Boundary probing:**
```
关于 [X] 的边界情况：当 [具体场景] 发生时，你期望的行为是？

A) [行为1] — 简单但可能丢失 [某东西]
B) [行为2] — 更完善但增加复杂度
```

**Hidden assumption surfacing:**
```
我注意到你的需求隐含了一个假设：[假设内容]。
这个假设在 [某场景] 下可能不成立。我们需要考虑这种情况吗？

A) 是，需要处理这种情况
B) 否，当前假设成立即可
```

### Auto-Transition

After each user answer, re-evaluate the clarity score. When the score reaches the threshold (>= 7.0), output a brief summary of the discovered requirements and transition to Proactive Challenge:

```
需求清晰度已达阈值。以下是确认的需求摘要：

- **目标**: [一句话]
- **范围**: [关键功能列表]
- **约束**: [技术/业务约束]
- **验收标准**: [初步AC]

接下来我会分析这个需求中可能存在的问题和遗漏。
```

## 8.2 Proactive Challenge Mechanism

### When to Activate

**Always activate** after Socratic Discovery completes (or is skipped), before Hybrid Tree creation. This mechanism runs even when the user provides a clear, detailed requirement.

### Challenge Categories

Analyze the requirement across 6 categories. For each category that has findings, present them to the user:

#### 1. Contradictions & Inconsistencies
- Requirements that conflict with each other
- Stated constraints that contradict desired behaviors
- Scope that conflicts with timeline or resources

#### 2. Overlooked Edge Cases & Boundary Conditions
- Empty/null/undefined inputs
- Concurrent access scenarios
- Resource exhaustion (disk full, memory limit, API rate limit)
- Partial failure states (half-completed operations)
- Large scale inputs (what happens with 10x expected data?)
- Time-related edge cases (timezone, DST, leap seconds)

#### 3. Technical Feasibility & Risks
- Dependencies on unavailable or unstable services
- Performance bottlenecks in the proposed approach
- Compatibility issues with existing codebase
- Known limitations of chosen technology

#### 4. Hidden Assumptions
- Assumptions about user behavior
- Assumptions about data format or quality
- Assumptions about system environment
- Assumptions about external service availability

#### 5. Cross-Module Conflicts
- Potential conflicts with existing features
- Shared resources that might cause contention
- API contracts that might break
- Data model changes that affect other modules

#### 6. Missing Non-Functional Requirements
- Security: authentication, authorization, input validation, data protection
- Performance: response time, throughput, resource usage
- Maintainability: code complexity, documentation, testability
- Reliability: error recovery, retry logic, graceful degradation
- Accessibility: if UI-related

### Challenge Output Format

Present challenges in a structured but conversational format. Prioritize by severity:

```
我分析了你的需求，发现以下几个需要确认的点：

**需要确认 (可能导致方案调整):**
1. [问题描述] — [为什么重要] — [建议]

**值得考虑 (不阻塞但建议纳入):**
2. [问题描述] — [影响范围]

**低风险提示 (可忽略):**
3. [问题描述]
```

### Challenge Rules

1. **Be specific, not generic.** Don't say "consider security" — say "这个 API 端点没有输入验证，可能导致 SQL 注入"。
2. **Reference actual code.** When pointing out conflicts with existing code, cite file paths and line numbers.
3. **Propose solutions, not just problems.** For each challenge, suggest a concrete approach or trade-off.
4. **Respect user decisions.** If the user acknowledges a risk and decides to proceed, record it but don't block.
5. **Don't over-warn.** Only flag issues that are genuinely likely to cause problems. Don't be a "Chicken Little".
6. **Prioritize P0 issues.** Contradictions and feasibility blockers are P0 — these must be resolved before proceeding.

### User Response Handling

After presenting challenges:

- **User resolves all P0 issues** → Proceed to Hybrid Tree creation
- **User wants to adjust requirement** → Re-enter Socratic Discovery for the changed parts, re-challenge
- **User acknowledges risks and proceeds** → Record acknowledged risks in Parent Section 4 (Non-Functional Requirements) as accepted risks, proceed to Hybrid Tree creation
- **User disagrees with challenge** → Accept user's judgment, record the decision, proceed

### Challenge Findings → Hybrid Tree Mapping

When Proactive Challenge findings are confirmed or acknowledged by the user, write them into the appropriate Hybrid Tree sections:

| Finding Category | Target Section | What to Write |
|-----------------|---------------|---------------|
| Contradictions resolved | Child §7 AC | Updated AC reflecting the resolution |
| Edge cases acknowledged | Child §7 AC | New AC items for edge case handling |
| Technical risks accepted | Parent §4 NFR | Accepted risk with mitigation note |
| Technical risks mitigated | Child §7 AC | AC for the mitigation approach |
| Hidden assumptions confirmed | Parent §1 (Project Overview) | Clarified assumptions in scope description |
| Hidden assumptions invalidated | Child §7 AC | AC addressing the invalidated assumption |
| Cross-module conflicts | Parent §8.3 Dependencies | Dependency edge between affected Children |
| Missing NFRs added | Parent §4 NFR | New non-functional requirement |

For Mode B (no Hybrid Tree yet): findings are held in session memory and incorporated during PRD detection / Hybrid Tree auto-generation.

## 8.3 Integration with Planning Phase

### Mode A (Whole) Integration

```
Environment init (module 01)
  → Requirements Discovery (module 08):
    → Clarity assessment
    → Socratic Discovery (if needed)
    → Proactive Challenge (always)
  → Planning Phase dialogue (existing rules)
    → Confirmed Understanding
    → File Index Discovery
    → Unclear Questions
    → Constructive Thoughts
  → User confirms PRD (Summary trigger)
  → Hybrid Tree creation
  → Core Iteration Loop
```

### Mode B (Local) Integration

```
Environment init (module 01)
  → Requirements Discovery (module 08):
    → Clarity assessment (quick)
    → Socratic Discovery (only if clarity < 5.0)
    → Proactive Challenge (always)
  → PRD detection (findings from discovery inform PRD validation/AC decomposition)
  → promptMasterX optimization (module 04)
  → Core Iteration Loop
```

For Mode B, Requirements Discovery runs **before** PRD detection so that:
- If an existing PRD is found, discovery findings serve as supplementary validation
- If no PRD exists, discovery findings inform the auto-generated Hybrid Tree's AC decomposition
- Socratic Discovery is lighter (skipped if clarity >= 5.0) since Mode B assumes "requirements relatively clear"
- Proactive Challenge always runs regardless of clarity score

### Mode C (Unit) Integration

Mode C does **not** use Requirements Discovery. Unit tasks are minimal and the overhead is not justified.

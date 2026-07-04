# 8. Requirements Discovery & Proactive Challenge

This module defines two planning mechanisms:

1. Socratic Requirements Discovery for vague requirements.
2. Proactive Challenge for requirements that may contain hidden risks.

Both run before Hybrid Tree creation in Mode A. Mode B may use a lighter version when required by the main workflow.

## 8.1 Socratic Requirements Discovery

### When To Activate

Before entering the standard Planning Phase dialogue, assess requirement clarity. Activate Socratic Discovery if the user's initial input meets any of these conditions:

- The requirement is a vague idea, such as "I want to build X" or "make something that does Y".
- No specific file paths, function names, or technical details are mentioned.
- No acceptance criteria or success metrics are provided.
- Scope is ambiguous and could mean either a small task or a multi-day feature.
- The user explicitly says "I'm not sure", "something like", or "maybe".

If the requirement already includes specific files, clear acceptance criteria, technical constraints, and defined scope, skip Socratic Discovery and go directly to Proactive Challenge.

### Clarity Dimensions

Assess requirement clarity across 6 dimensions. Each dimension scores 0-10.

| Dimension | Weight | What to assess |
|---|---:|---|
| Target User/Scenario | 15% | Who uses this? What problem does it solve? What is the context? |
| Functional Scope | 25% | What features? What is in/out of scope? What are the key behaviors? |
| Technical Constraints | 20% | Tech stack, performance, compatibility, integration limits |
| Boundary Conditions | 15% | Edge cases, errors, failure modes, limits |
| Acceptance Criteria | 15% | How do we know it is done? What does "working" mean? |
| Non-Functional Requirements | 10% | Security, maintainability, scalability, accessibility |

`Clarity Score = sum(dimension_score * weight)`.

### Clarity Threshold

| Score | Action |
|---:|---|
| >= 7.0 | Skip Socratic Discovery, go to Proactive Challenge |
| 5.0 - 6.9 | Light Discovery: ask 2-3 targeted questions |
| 3.0 - 4.9 | Standard Discovery: ask 4-6 questions |
| < 3.0 | Deep Discovery: ask 6-10 questions |

### Questioning Rules

1. Ask one question per turn. Do not batch questions.
2. Prefer multiple choice with 2-4 options and one recommendation.
3. Build on the user's previous answer.
4. Start with high-level scope and then drill into edge cases and constraints.
5. Surface tradeoffs for each option.
6. Do not ask redundant questions.
7. If the user is unsure, propose a reasonable default and ask for confirmation.

### Question Templates

Scope clarification:

```text
You mentioned wanting to do [X]. This could mean a few different directions:

A) [Direction 1] - Pros: [...]. Cons: [...]
B) [Direction 2] - Pros: [...]. Cons: [...]
C) [Direction 3] - Pros: [...]. Cons: [...]

Which direction do you prefer, or do you have another version in mind?
```

Boundary probing:

```text
For [X], when [specific scenario] happens, what behavior do you expect?

A) [Behavior 1] - simpler, but may lose [tradeoff]
B) [Behavior 2] - more complete, but adds [complexity]
```

Hidden assumption:

```text
I see a hidden assumption in the requirement: [assumption].
That may not hold when [scenario] happens. Should we handle that case?

A) Yes, handle it.
B) No, the current assumption is acceptable.
```

### Auto-Transition

After each user answer, re-evaluate the clarity score. When score reaches `>= 7.0`, output a brief summary and transition to Proactive Challenge:

```markdown
The requirement is clear enough to proceed.

- Goal: [one sentence]
- Scope: [key functions/features]
- Constraints: [technical/business constraints]
- Initial AC: [acceptance criteria]

Next I will check for contradictions, overlooked risks, and missing edge cases.
```

## 8.2 Proactive Challenge Mechanism

### When To Activate

Run after Socratic Discovery completes or is skipped. This is mandatory for Mode A. For Mode B, use the lighter version defined by the main workflow when applicable.

### Challenge Categories

Analyze the requirement across these categories:

#### 1. Contradictions & Inconsistencies

- Requirements that conflict with each other.
- Stated constraints that contradict desired behavior.
- Scope that conflicts with timeline or resources.

#### 2. Overlooked Edge Cases & Boundary Conditions

- Empty/null/undefined inputs.
- Concurrent access.
- Resource exhaustion such as disk full, memory limit, or API rate limit.
- Partial failure states.
- 10x expected data volume.
- Time-related edge cases such as timezone, DST, leap seconds.

#### 3. Technical Feasibility & Risks

- Dependencies on unavailable or unstable services.
- Performance bottlenecks.
- Compatibility issues with existing code.
- Known limitations of the chosen technology.

#### 4. Hidden Assumptions

- Assumptions about user behavior.
- Assumptions about data format or quality.
- Assumptions about system environment.
- Assumptions about external service availability.

#### 5. Cross-Module Conflicts

- Conflicts with existing features.
- Shared resources that may cause contention.
- API contracts that may break.
- Data model changes affecting other modules.

#### 6. Missing Non-Functional Requirements

- Security: authentication, authorization, validation, data protection.
- Performance: response time, throughput, resource usage.
- Maintainability: complexity, docs, testability.
- Reliability: recovery, retry, graceful degradation.
- Accessibility for UI work.

### Challenge Output Format

Present challenges in a structured but conversational format:

```markdown
I found a few points that should be confirmed before implementation:

**Needs Confirmation**
1. [Issue] - Why it matters: [...] - Suggested approach: [...]

**Worth Considering**
2. [Issue] - Impact: [...]

**Low-Risk Note**
3. [Issue]
```

### Challenge Rules

1. Be specific. Do not say "consider security"; name the concrete API, input, or data risk.
2. Reference actual code when pointing out conflicts with existing code.
3. Propose solutions, not just problems.
4. Respect user decisions. If the user accepts a risk, record it and proceed.
5. Do not over-warn. Only flag issues likely to matter.
6. Prioritize P0 issues. Contradictions and feasibility blockers must be resolved before proceeding.

### User Response Handling

- User resolves all P0 issues -> proceed to Hybrid Tree creation.
- User adjusts the requirement -> re-enter discovery for the changed part, then challenge again.
- User acknowledges risks and proceeds -> record accepted risks in Parent Section 4 and continue.
- User disagrees with a challenge -> accept the user's judgment, record the decision, and proceed.

### Challenge Findings To Hybrid Tree Mapping

| Finding category | Target section | What to write |
|---|---|---|
| Contradictions resolved | Child Section 7 AC | Updated AC reflecting the resolution |
| Edge cases acknowledged | Child Section 7 AC | New AC items for the edge case |
| Technical risks accepted | Parent Section 4 NFR | Accepted risk with mitigation note |
| Technical risks mitigated | Child Section 7 AC | AC for the mitigation |
| Hidden assumptions confirmed | Parent Section 1 | Clarified assumptions |
| Hidden assumptions invalidated | Child Section 7 AC | AC addressing the invalid assumption |
| Cross-module conflicts | Parent Section 8.3 | Dependency edge between affected Children |
| Missing NFRs added | Parent Section 4 NFR | New non-functional requirement |

For Mode B without an existing Hybrid Tree, keep findings in session memory and incorporate them during PRD detection or minimal Hybrid Tree generation.

## 8.3 Integration

### Mode A

```text
Environment init
  -> Requirements Discovery
     -> Clarity assessment
     -> Socratic Discovery if needed
     -> Proactive Challenge
  -> Planning Phase dialogue
     -> Confirmed Understanding
     -> File Index Discovery
     -> Unclear Questions
     -> Constructive Thoughts
  -> User confirms PRD
  -> Hybrid Tree creation
  -> Core Iteration Loop
```

### Mode B

```text
Environment init
  -> Requirements Discovery quick pass
     -> Clarity assessment
     -> Socratic Discovery only if clarity < 5.0
     -> Proactive Challenge
  -> PRD detection
  -> promptMasterX optimization when needed
  -> Core Iteration Loop
```

Mode B uses discovery findings to validate an existing PRD or inform minimal Hybrid Tree generation. Mode C does not use Requirements Discovery because unit tasks are too small for the overhead.

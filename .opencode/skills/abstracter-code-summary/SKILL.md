---
name: abstracter-code-summary
description: Code & engineering analysis skill for abstracter agents. Use this skill whenever the user asks to summarize code, analyze project structure, review a module or subsystem, produce a structured Markdown analysis report, or evaluate code quality, risks, and improvement suggestions — even if they only provide a file path or directory name.
---

# Abstracter Code Summary Playbook

Use this skill as the code analysis execution specification for the abstracter agent.

## 1. Objectives

- Quickly understand engineering structure, core logic, and module relationships.
- Identify key implementation points, data flows/call chains, configuration, and build methods.
- Summarize results in clear, reusable Markdown output to help users read, review, and make decisions.

## 2. Input Types

- Single-file or multi-file code snippets
- Specified directories/modules/subsystems
- Complete engineering repositories
- Additional user concerns (e.g., architecture, performance, risks, maintainability, test coverage, improvement suggestions)

## 3. Working Method

1. **Deep Thinking & Analysis**: For large engineering excerpts or complex business logic, it is recommended to use the `mcp/server-sequential-thinking` tool for multi-step progressive code reading, verification, and logical reasoning summaries to ensure accuracy.
2. First extract context: project language, directory structure, entry points, core dependencies, and runtime methods.
3. Then focus on the main thread: core module responsibilities, key functions/classes, call relationships, and data flows.
4. Supplement with quality perspectives: exception handling, boundary conditions, potential risks, technical debt, and optimizable points.
5. Finally provide conclusions: summary, priority recommendations, and next action items.

## 4. Output Requirements

- Always output structured Markdown.
- Use tables moderately to display module responsibilities, risk grading, or improvement priorities.
- Provide "source references" (file paths, function names, class names, or configuration items) for important conclusions.
- Keep language concise with high information density; avoid vague descriptions.

### Output Template (Must follow and include at least the following sections)

~~~markdown
# Overview
- Project Goal:
- Tech Stack:
- Current Summary Scope:

## Engineering Structure & Module Responsibilities
| Module/Directory | Primary Responsibility | Key Files |
|---|---|---|
|  |  |  |

## Core Implementation & Workflow
1. ...
2. ...

## Key Code Interpretation
- `path/to/file`: Description
- `ClassOrFunction`: Description

## Risks & Issues
| Risk Item | Impact | Evidence | Priority |
|---|---|---|---|
|  |  |  | High/Medium/Low |

## Optimization Suggestions
1. Suggestion:
   - Expected Benefit:
   - Change Cost:
   - Applicable Scope:

## Conclusion & Next Steps
- Conclusion:
- Recommended Priority Actions:
~~~

## 5. Behavioral Constraints

- Do not speculate on information that has not appeared; explicitly mark as "Pending Confirmation" when uncertain.
- Prioritize code and configuration facts; avoid generic suggestions detached from context.
- When multiple viable approaches exist, provide pros/cons comparison and recommended approach.
- If the input scope is too large, provide a layered summary (global -> module -> key points) before expanding into details.

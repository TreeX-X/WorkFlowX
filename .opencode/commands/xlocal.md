---
description: Local module workflow: PRD detection -> promptX -> coderX -> evaluatorX loop
agent: orchestratorX
subtask: true
---

Invoke the orchestratorX agent in local mode (Mode B: local) to execute the following requirement.

User input: $ARGUMENTS

**Execution flow:**
1. Parse parameters from $ARGUMENTS (see orchestrateX Parameter Parsing section)
2. Load runtime environment (Module 01)
3. PRD detection (priority order):
   a. Check `.hybrid/[feature]/` directory → if Hybrid Tree exists, use directly, skip to step 5
   b. Check $ARGUMENTS for file path (e.g. `/xlocal ./docs/prd.md`) → if valid file, read PRD and wrap into Hybrid Tree (Parent + Child), skip to step 5
   c. No PRD found → auto-generate minimal Hybrid Tree:
      - Scan project code (Glob, Grep, rg) for files related to the requirement
      - Generate Parent: fill Sections 0-6 (minimal from requirement), Section 7 routing table (single Child), 8.1 file index, 8.2 knowledge graph outline, 8.3 empty
      - Generate Child: fill Section 7 AC (decomposed from requirement), 8.1 private file index
      - Write to `.hybrid/[feature-name]/`
4. Invoke promptX to extract intent and output structured prompt (Module 04)
5. Enter Core Iteration Loop: dispatch coderX → bus payload validation (Module 02) → evaluatorX → post-evaluation update (Module 03)
6. If fixes needed, loop steps 5-6 (max iterations determined by -N parameter, default 2). **Early exit**: if evaluatorX returns `Evaluation Result: PASS`, terminate iteration immediately

Supported parameters (parsed from $ARGUMENTS):
- `-N [number]`: Set the maximum number of evaluation iteration rounds (default: 2, range: 1-10)

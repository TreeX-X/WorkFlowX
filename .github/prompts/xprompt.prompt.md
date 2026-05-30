---
name: xprompt
description: Only invoke promptMasterX for prompt optimization, without triggering any development workflow
---

Please invoke the promptMasterX agent to optimize the following prompt only, without triggering any development workflow.

Original prompt: ${input:args}

Output requirements:
- Output the optimized production-grade prompt
- Annotate the target tool and optimization rationale
- Ready for the user to copy and use directly

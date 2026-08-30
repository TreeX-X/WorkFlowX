# Module 05: Explicit Parallel Development

Parallel work is enabled only when the user explicitly requests it.

- `xdo`: Main Agent splits independent work and uses native parallel Agents; no fixed harness is required.
- `xflow`: Main Agent may execute independent Children in parallel when dependencies allow; implementations follow `engineeringX` and evaluations follow the mode rule.
- `xdel`: remains one-shot delegation unless the user explicitly expands the request.

The Main Agent owns scope boundaries, shared-file coordination, integration, and final review.

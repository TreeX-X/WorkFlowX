---
name: razorX
description: "Code aesthetics framework guided by two eternal questions: Can the path be shorter? Can cognitive load be lower? Dual-mode operation — Review mode: surgical line-by-line scan, every issue tagged with file + line number + actionable fix, no filler. Generation mode: internalizes aesthetics into code instinct — declarative first, stdlib first, eliminate special cases, small composable functions. Use for code review, refactoring, simplification, optimization, removing duplication, reducing tech debt, improving readability, clean code, DRY, design patterns, and whenever the user complains 'this code is messy' or similar."
---

# razorX — author: TreeX

You possess code aesthetics instinct. Always ask two questions: **Can the path be shorter? Can cognitive load be lower?**

## Elegance: Shortest Path from Problem to Solution

> The best code isn't "short" — it minimizes the number of mental steps a reader needs to grasp intent. Fewer steps = more elegant.

- **Declarative > Imperative**: Tell the machine *what* you want, not *how* to do it (unless control flow is complex enough that imperative is actually clearer)
- **Let the language work for you**: stdlib > third-party > roll your own
- **One expression > multi-step process**: If one line suffices, don't split into three (but chained calls over 80 chars should be broken up)
- **Eliminate special cases**: Use data structures/types to remove branches instead of stacking if-else
- **Composable > Monolithic**: Small function composition beats large function decomposition

**Example — Eliminating special cases:**
```js
// Before: stacked if-else
if (type === 'admin') return 1;
else if (type === 'editor') return 2;
else if (type === 'viewer') return 3;
else return 0;

// After: data structure removes branching
const roleLevel = { admin: 1, editor: 2, viewer: 3 };
return roleLevel[type] ?? 0;
```

## Subtraction: Remove Information the Reader Must Retain

> Subtraction doesn't reduce line count — it reduces the state a reader must hold in their head. If removing something means the reader has less to remember, it should go.

- **Dead code**: unused imports, commented-out code, unreachable branches, deprecated feature flags
- **Over-abstraction**: single-implementation interfaces, pass-through wrappers, factories with only one product
- **Redundant state**: don't store what can be derived; don't manually sync what can be computed (unless derivation cost warrants caching)
- **Redundant parameters**: collapse parameters that almost always have the same value into defaults
- **Duplicated logic**: extract when readers can spot the pattern — two similar blocks → extract function; three+ with the same shape → higher-order abstraction
- **Pointless intermediates**: inline variables used only once that aren't clearer than the expression itself

**Example — Removing duplicated logic:**
```js
// Before: two similar transforms
const fullName1 = user1.first.trim() + ' ' + user1.last.trim();
const fullName2 = user2.first.trim() + ' ' + user2.last.trim();

// After: extract function
const fullName = (u) => `${u.first.trim()} ${u.last.trim()}`;
```

## Review Mode

Activate when the user submits existing code for review. Scan dimension by dimension, report only issues that actually exist — never pad. Output sorted by impact:

```
### razorX Review
#### Removable
- `file.ts:42` unused `lodash` import → delete line
#### Simplifiable
- `utils.ts:15-28` 3 similar data transforms → extract to `transformRecord()`
#### Mergeable
- `a.ts:10` and `b.ts:25` duplicate validation logic → extract to `validate.ts`
```

Every issue must include: **file name + line number**, the dimension violated, and an **executable code fix** (not vague suggestions like "consider optimizing").

## Generation Mode

Activate when the user requests new code. Internalize aesthetic constraints into every decision:

1. **Choose implementation**: declarative first, stdlib first, one line if one line suffices
2. **Self-review after writing**: What can be deleted? Any branches that can merge? Do variable names convey intent?
3. **If you violate a principle**, explain why (e.g., "imperative here because the state transition has 5 branches — declarative would be less readable")

## Boundaries

- Performance optimization and security review are separate concerns outside this skill's scope — but flag aesthetic-performance tradeoffs on critical paths
- 3 clear lines > 1 obscure line — readability always wins over line count

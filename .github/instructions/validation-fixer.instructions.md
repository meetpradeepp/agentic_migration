# Validation Fixer Agent Instructions for GitHub Copilot

## Overview

The validation-fixer agent automatically fixes validation failures found by qa-validator, including linting errors, formatting issues, security vulnerabilities, and simple test failures.

## When to Invoke

Invoke validation-fixer agent when:
- qa-validator returns validation_status = "rejected" or "conditional"
- validation_results.json contains fixable issues
- User asks to "fix validation errors", "auto-fix issues", "fix linting"
- After implementation validation fails

## Invocation Pattern

```markdown
@validation-fixer I need to fix validation failures:

**Validation Status**: rejected
**Issues Found**: [From validation_results.json.issues_found]

Please fix:
1. Linting errors
2. Formatting issues
3. Security issues
4. Console errors
5. Simple test failures

Then re-run @qa-validator to verify fixes.
```

## Inputs Required

1. **validation_results.json** - Must contain issues_found array
2. **spec.md** - Optional, for context on expected behavior

## Expected Output

The agent:
1. Fixes code files (linting, formatting, security, tests)
2. Verifies fixes worked
3. Instructs to re-run qa-validator

No structured output file, just fixed code.

## Validation After Invocation

After validation-fixer completes:

```bash
# Re-run all checks
npm run lint && echo "✓ Linting passed"
npx prettier --check src/ && echo "✓ Formatting passed"
npx tsc --noEmit && echo "✓ Type checking passed"
npm test && echo "✓ Tests passed"

# Re-invoke qa-validator
@qa-validator Re-validate after fixes
```

## Integration with Other Agents

### Workflow Position

```
validation_results.json (status: rejected)
       ↓
[validation-fixer] ← YOU ARE HERE
       ↓
Fixed code
       ↓
qa-validator (re-validate)
       ↓
validation_results.json (status: approved)
```

### Feedback Loop

```markdown
Loop:
  @qa-validator → validation_results.json
  IF rejected:
    @validation-fixer → fix issues
    Re-run @qa-validator
  UNTIL approved
```

## Fix Phases

### Phase 1: Linting
```bash
# Auto-fix
npx eslint src/ --fix

# Verify
npm run lint 2>&1 | tee lint_output.txt

# Manual fix for remaining
# Example: Remove unused variable
```

### Phase 2: Formatting
```bash
# Auto-format
npx prettier --write src/

# Verify
npx prettier --check src/
```

### Phase 3: Security
```bash
# Find sensitive data in logs
grep -rn "console.log.*password\|console.log.*token" src/ --include="*.ts"

# Remove or redact
# Example: console.log("User:", user.email, user.password) 
#       → console.log("User:", user.email)
```

### Phase 4: Runtime Errors
```bash
# Add null/undefined checks
# Example: user.id → user?.id ?? 'unknown'
# Example: user.profile.name → user?.profile?.name
```

### Phase 5: Test Failures
```bash
# Fix import paths
# Example: import { X } from './utils' → import { X } from '../utils/validation'

# Fix assertions
# Example: expect(result).toBe({}) → expect(result).toEqual({})
```

### Phase 6: Type Errors
```bash
# Run type check
npx tsc --noEmit 2>&1 | tee typecheck.txt

# Add missing types
# Example: const handleClick = (e) => {...}
#       → const handleClick = (e: React.MouseEvent) => {...}
```

## Auto-Fixable vs Manual

### Auto-Fixable ✅
- Most linting errors (unused vars, import order)
- All formatting issues
- console.log with sensitive data
- Missing null checks
- Wrong import paths
- Simple type annotations

### Requires Manual Fix ❌
- Complex logic bugs
- Missing functionality
- Architecture decisions
- Breaking API changes
- Complex test failures

**Strategy**: Fix all auto-fixable, flag manual issues for review.

## Common Issues and Solutions

| Issue | Fix Strategy |
|-------|-------------|
| Linting errors | Run `eslint --fix`, then manual fix remaining |
| Formatting issues | Run `prettier --write` |
| Password in logs | Remove sensitive data from console.log |
| Undefined error | Add optional chaining `obj?.prop` |
| Test import wrong | Update import path |
| Type error | Add type annotation or fix type mismatch |
| Doubled path error | Check pwd, use relative paths |

## Path Confusion Prevention

🚨 **Critical for monorepos**

```bash
# ALWAYS check working directory first
pwd

# If in /workspace/apps/frontend:
# CORRECT:
git add src/file.ts

# WRONG (doubles path):
git add apps/frontend/src/file.ts
```

## Orchestrator Usage

In the orchestrator workflow (Workflow 9 - Validation Loop):

```markdown
**Phase 1: Initial Validation**
@qa-validator Validate implementation

**Phase 2: Fix Issues (if needed)**
IF validation_status == "rejected":
  @validation-fixer Fix issues from validation_results.json
  
  Auto-fix:
  - Linting (eslint --fix)
  - Formatting (prettier --write)
  - Security (remove sensitive logs)
  - Simple runtime errors (add null checks)
  - Simple test fixes (imports, assertions)

**Phase 3: Re-validate**
@qa-validator Re-validate after fixes

**Phase 4: Repeat Until Approved**
Loop phases 2-3 until validation_status == "approved"
```

## Quality Expectations

High-quality fixing should:
- ✅ Use auto-fixers first (eslint --fix, prettier --write)
- ✅ Fix issues incrementally (one category at a time)
- ✅ Verify each fix category before moving to next
- ✅ Preserve existing functionality
- ✅ Add null/undefined guards defensively
- ✅ Re-run tests after each fix
- ✅ Flag complex issues for manual review
- ✅ Check working directory before git commands

## Example Scenarios

### Scenario 1: Linting and Formatting

**Input**: validation_results.json with 5 linting errors, 3 formatting issues

**Process**:
1. Run `npx prettier --write src/` → fixes 3 formatting issues
2. Run `npx eslint src/ --fix` → fixes 4 linting errors
3. Manually remove 1 unused variable
4. Verify with `npm run lint` → all pass

**Output**: All linting and formatting fixed

### Scenario 2: Security Issue

**Input**: validation_results.json with security issue "Password in logs at auth.service.ts:67"

**Process**:
1. Read auth.service.ts:67
2. Find: `console.log("User login:", user.email, user.password)`
3. Fix: `console.log("User login:", user.email)`
4. Verify: `grep -rn "console.log.*password" src/` → no results

**Output**: Security issue fixed

### Scenario 3: Runtime Error

**Input**: validation_results.json with console error "Cannot read property 'id' of undefined at UserProfile.tsx:45"

**Process**:
1. Read UserProfile.tsx:45
2. Find: `const userId = user.id`
3. Fix: `const userId = user?.id ?? 'unknown'`
4. Verify: Re-run app, check console → no error

**Output**: Runtime error fixed

### Scenario 4: Test Failure

**Input**: validation_results.json with test failure "Import error in auth.test.ts:3"

**Process**:
1. Read auth.test.ts:3
2. Find: `import { validateEmail } from './utils'`
3. Fix: `import { validateEmail } from '../utils/validation'`
4. Verify: `npm test -- auth.test.ts` → test passes

**Output**: Test fixed

## Tips for Effective Usage

1. **Auto-fix first**: Always run eslint --fix and prettier --write before manual edits
2. **Verify incrementally**: Check each fix category before moving to next
3. **Path awareness**: Always pwd before git commands in monorepos
4. **Preserve functionality**: Don't change logic unless you understand it
5. **Flag complex issues**: Don't guess on complex logic bugs
6. **Re-run QA**: Always invoke qa-validator after fixing

## DO

✅ Use auto-fixers before manual edits
✅ Fix one category at a time (lint → format → security → tests)
✅ Verify each fix works before moving to next
✅ Check working directory before git commands
✅ Add defensive null checks
✅ Re-run tests after each fix
✅ Flag complex issues for manual review

## DON'T

❌ Batch all fixes then test (fix incrementally)
❌ Change logic without understanding it
❌ Use absolute paths in monorepos (causes doubled paths)
❌ Remove code to "fix" errors (understand root cause)
❌ Skip verification after fixes
❌ Attempt to fix complex architecture issues
❌ Ignore path confusion warnings

## Fix Priority Order

Recommended order for best results:

1. **Formatting** (always safe, no logic changes)
2. **Linting** (mostly auto-fixable)
3. **Security** (high priority, usually simple)
4. **Type checking** (prevents runtime errors)
5. **Runtime errors** (add null/undefined guards)
6. **Test failures** (if simple and clear)

## Validation Risk Considerations

Adjust fix confidence based on validation_risk from requirements.json:

- **trivial/low**: Aggressive auto-fixes okay
- **medium**: Verify each fix category
- **high/critical**: More conservative, flag uncertainties

## Success Criteria

Successful fix session results in:
- ✅ All auto-fixable issues resolved
- ✅ All checks passing (lint, format, types, tests)
- ✅ Complex issues flagged for manual review
- ✅ Re-validation by qa-validator shows "approved" status

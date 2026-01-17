# QA Validator Agent Instructions for GitHub Copilot

## ⚡ AUTO-CONTINUATION RULE

**CRITICAL: After validation, you MUST automatically continue the workflow.**

✅ **REQUIRED: Auto-invoke next agent based on validation results**

**If validation PASSES and UI code changed (*.tsx, *.jsx, *.css):**
```
✅ Functional validation passed!

🎨 UI code detected - continuing to visual validation...
```
Call to subagent ui-validator
```
```

**If validation PASSES and no UI code:**
```
✅ Functional validation passed!

🔒 Continuing to security analysis...
```
Call to subagent security-analyst
```
```

**If validation FAILS:**
```
❌ Validation failed!

🔧 Continuing to automated fixes...
```
Call to subagent validation-fixer
```
```

❌ **Do NOT stop after validation** - workflow must continue automatically
❌ **Do NOT wait for user confirmation** - auto-execute the entire workflow

---

## Overview

The qa-validator agent validates implementation completeness, correctness, and production-readiness by running tests, checking QA criteria, and ensuring code quality standards.

## When to Invoke

Invoke qa-validator agent when:
- Implementation is complete (all subtasks marked "completed" in implementation_plan.json)
- Need to validate code before deployment
- User asks to "validate implementation", "run QA checks", "check if ready for production"
- After implementation phase, before final sign-off

## Invocation Pattern

```markdown
@qa-validator I need to validate the implementation for this task:

**Feature**: [From implementation_plan.json]
**Subtasks Status**: All completed

Please validate against:
1. spec.md (QA Acceptance Criteria section)
2. implementation_plan.json (subtask completion)
3. requirements.json (acceptance criteria)

Run all tests, check code quality, verify runtime health, and generate validation_results.json.
```

## Inputs Required

1. **spec.md** - Must contain "## QA Acceptance Criteria" section
2. **implementation_plan.json** - Must have subtasks with status
3. **requirements.json** - Must have acceptance_criteria

## Expected Output

The agent generates **validation_results.json** containing:

```json
{
  "validation_status": "approved|rejected|conditional",
  "validated_at": "ISO timestamp",
  "validation_summary": {
    "total_checks": 15,
    "passed": 12,
    "failed": 2,
    "pass_rate": "80%"
  },
  "subtask_verification": {...},
  "test_results": {
    "unit_tests": {...},
    "integration_tests": {...},
    "e2e_tests": {...}
  },
  "qa_criteria_results": [...],
  "code_quality_checks": {...},
  "runtime_checks": {...},
  "security_checks": [...],
  "issues_found": [...],
  "approval_decision": {
    "approved": false,
    "reason": "string",
    "next_steps": "string"
  }
}
```

## Validation After Invocation

After qa-validator completes:

```bash
# Verify validation_results.json exists
test -f validation_results.json && echo "✓ validation_results.json created"

# Validate JSON
python3 -c "import json; json.load(open('validation_results.json'))" && echo "✓ Valid JSON"

# Check validation status
STATUS=$(cat validation_results.json | jq -r '.validation_status')
echo "Validation Status: $STATUS"

# Check for critical issues
CRITICAL=$(cat validation_results.json | jq '[.issues_found[] | select(.severity=="critical")] | length')
echo "Critical Issues: $CRITICAL"
```

## Integration with Other Agents

### Workflow Position

```
implementation_plan.json (all subtasks completed)
       ↓
[qa-validator] ← YOU ARE HERE
       ↓
validation_results.json
       ↓
[CONDITIONAL: ui-validator if frontend changes]
       ↓
IF approved: DONE
IF rejected: validation-fixer → re-validate
```

### Handoff to validation-fixer

If validation fails:

```markdown
@validation-fixer I found issues during QA validation that need fixing:

**Issues**: [From validation_results.json.issues_found]

Please fix:
- Test failures
- Linting errors
- Console errors
- Security issues

Then re-run qa-validator to verify fixes.
```

## Validation Phases

### Phase 1: Subtask Verification
```bash
# Check all subtasks are complete
cat implementation_plan.json | jq '[.phases[].subtasks[] | select(.status!="completed")] | length'
# Should be 0
```

### Phase 2: Test Execution
```bash
# Find and run tests
npm test 2>&1 | tee test_output.txt
npm run test:integration 2>&1 | tee integration_output.txt
npm run test:e2e 2>&1 | tee e2e_output.txt
```

### Phase 3: QA Criteria Verification
```bash
# Extract criteria from spec
sed -n '/## QA Acceptance Criteria/,/## [A-Z]/p' spec.md

# Verify each criterion against tests or manual checks
```

### Phase 4: Code Quality
```bash
# Linting
npm run lint

# Formatting
npx prettier --check src/

# Type checking
npx tsc --noEmit
```

### Phase 5: Runtime Checks
```bash
# Build
npm run build

# Start services
npm run dev &

# Health checks
curl http://localhost:3000/health
```

### Phase 6: Security Checks
```bash
# Input validation
grep -r "zod\|yup" src/ --include="*.ts"

# Sensitive data in logs
grep -r "console.log.*password" src/ --include="*.ts"
```

## Approval Decision Logic

The agent decides approval status based on:

| Pass Rate | Critical Issues | High Issues | Status |
|-----------|----------------|-------------|--------|
| ≥95% | 0 | 0 | approved |
| 80-95% | 0 | 0-2 | conditional |
| <80% | 0 | Any | rejected |
| Any | >0 | Any | rejected |

**Approval Rules**:
- **approved**: Ready for production (95%+ pass rate, no critical/high issues)
- **conditional**: Minor fixes acceptable (80-95% pass rate, no critical issues)
- **rejected**: Must fix issues (critical issues or <80% pass rate)

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Cannot find test command | Check package.json scripts, README for test instructions |
| Tests timeout | Increase test timeout, check for hanging processes |
| Services won't start | Check ports available, kill conflicting processes |
| Missing QA criteria in spec | Request spec-writer to add QA criteria section |
| E2E tests not applicable | Mark as "not_applicable", focus on unit/integration |

## Orchestrator Usage

In the orchestrator workflow (Workflow 9 - Validation):

```markdown
**Phase 1: QA Validation**

@qa-validator Validate implementation for: [feature_name]

Inputs:
- spec.md (QA criteria)
- implementation_plan.json (subtasks)
- requirements.json (acceptance criteria)

Output: validation_results.json

**Phase 2: Decision**

IF validation_status == "approved":
  Mark feature as complete
ELIF validation_status == "rejected":
  @validation-fixer Fix issues from validation_results.json
  Re-run @qa-validator
ELSE:
  Manual review for conditional approval
```

## Quality Expectations

High-quality validation should:
- ✅ Run ALL available test suites (unit, integration, E2E)
- ✅ Verify EVERY QA criterion from spec.md
- ✅ Document specific failure locations (file:line)
- ✅ Include error messages from test failures
- ✅ Check code quality (linting, formatting, types)
- ✅ Verify runtime health (build, services running)
- ✅ Flag security concerns
- ✅ Provide actionable recommendations
- ✅ Make clear approval decision

## Example Scenarios

### Scenario 1: All Tests Pass

**Input**: implementation_plan.json with 8 completed subtasks

**Validation Results**:
- Unit tests: 45/45 passed
- Integration tests: 12/12 passed
- E2E tests: 5/5 passed
- All QA criteria: pass
- No linting errors
- Services healthy

**Output**: validation_status = "approved", ready for deployment

### Scenario 2: Test Failures

**Input**: implementation_plan.json with 8 completed subtasks

**Validation Results**:
- Unit tests: 43/45 passed (2 failures)
- Integration tests: 12/12 passed
- E2E tests: 5/5 passed
- QA criteria: 1 failure (password reset email)
- 2 linting errors
- 1 console error

**Output**: validation_status = "rejected", invoke validation-fixer

### Scenario 3: Minor Issues

**Input**: implementation_plan.json with 8 completed subtasks

**Validation Results**:
- Unit tests: 45/45 passed
- Integration tests: 12/12 passed
- E2E tests: 5/5 passed
- All QA criteria: pass
- 3 linting warnings (not errors)
- Services healthy

**Output**: validation_status = "conditional", can approve with warnings addressed

## Tips for Effective Usage

1. **Ensure spec has QA criteria**: spec-writer must include "## QA Acceptance Criteria" section
2. **All subtasks complete**: Don't invoke until all subtasks marked "completed"
3. **Services must be runnable**: Ensure dependencies installed, environment configured
4. **Review test output**: Check actual test failures, not just counts
5. **Security is critical**: Always flag security issues even if tests pass
6. **Document everything**: Record all checks, not just failures

## DO

✅ Run ALL available tests (unit, integration, E2E)
✅ Verify every QA criterion from spec.md
✅ Check code quality (linting, formatting, types)
✅ Verify services actually run (not just build)
✅ Flag security concerns immediately
✅ Provide specific locations for failures
✅ Make clear approval decision with reasoning
✅ **Auto-invoke ui-validator if frontend code changed**

**Conditional UI Validation**: After completing functional tests, check if UI validation needed:

```bash
# Check if frontend files were modified
git diff --name-only HEAD~1 | grep -E "\\.(tsx|jsx|vue|css|scss|html)$"

# If frontend files changed:
if [ $? -eq 0 ]; then
  echo "Frontend changes detected - invoking UI validator"
  # Signal to invoke ui-validator
fi
```

**Auto-invoke ui-validator when**:
- Frontend framework detected (React, Vue, Angular, Svelte)
- UI component files modified (*.tsx, *.jsx, *.vue)
- Styling changed (*.css, *.scss, *.sass)
- spec.md has UI/UX requirements section

**Skip ui-validator when**:
- Backend-only changes (API, database, services)
- No frontend code in project
- Configuration or documentation updates
- Pure logic/utilities with no UI

## DON'T

❌ Skip tests because they're slow
❌ Approve with critical issues
❌ Ignore warnings (they often indicate problems)
❌ Assume code works without running it
❌ Accept generic QA criteria verification
❌ Miss security checks
❌ Make approval decision without full validation

## Validation Risk Levels

Based on requirements.json validation_risk:

- **trivial**: Basic smoke tests only
- **low**: Unit tests required
- **medium**: Unit + integration tests required
- **high**: Unit + integration + E2E tests required
- **critical**: All tests + manual security review required

Adjust validation depth based on risk level.

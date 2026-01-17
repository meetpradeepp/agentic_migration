# Coder Agent Instructions for GitHub Copilot

## Overview

The coder agent implements code based on implementation plans, executing subtasks one at a time with verification and incremental commits.

## When to Invoke

Invoke coder agent when:
- implementation_plan.json exists with pending subtasks
- Need to execute planned implementation work
- After specification and planning phases are complete
- User asks to "implement the plan", "start coding", "execute subtasks"

## Invocation Pattern

```markdown
@coder I need to implement the code based on the plan:

**Feature**: [From implementation_plan.json]
**Total Subtasks**: X pending
**First Subtask**: [First pending subtask description]

Please execute subtasks systematically:
1. Find next pending subtask
2. Implement following project patterns
3. Verify each subtask works
4. Commit after successful verification
5. Continue to next subtask

Inputs available:
- implementation_plan.json (subtasks to execute)
- spec.md (requirements and context)
- context.json (file patterns and conventions)
```

## Inputs Required

1. **implementation_plan.json** - Must have phases with subtasks
2. **spec.md** - Must contain requirements and implementation details
3. **context.json** - Optional but recommended for patterns

## Expected Output

The agent:
1. Modifies/creates code files per subtask
2. Creates git commits (one per subtask)
3. Updates implementation_plan.json status fields
4. Appends to build-progress.txt session log

No single output file - continuous implementation with commits.

## Validation After Invocation

After each subtask:

```bash
# Check subtask marked complete
COMPLETED=$(jq '[.phases[].subtasks[] | select(.status=="completed")] | length' implementation_plan.json)
echo "Completed subtasks: $COMPLETED"

# Check git commit created
git log --oneline -1

# Verify app still works
npm run build && npm test
```

## Integration with Other Agents

### Workflow Position

```
implementation_plan.json (from planner)
       ↓
[coder] ← YOU ARE HERE (implements each subtask)
       ↓
Updated implementation_plan.json (all completed)
       ↓
qa-validator (validate implementation)
```

### Handoff to QA Validator

When all subtasks complete:

```markdown
@qa-validator Implementation is complete. Please validate:

**Feature**: [feature name]
**Subtasks**: All X subtasks completed
**Commits**: Y commits created

Run comprehensive validation:
- All tests (unit, integration, E2E)
- QA criteria from spec.md
- Code quality checks
- Runtime and security validation

Generate validation_results.json with approval status.
```

## Implementation Workflow

### Step 1: Get Bearings
```bash
pwd
cat implementation_plan.json
cat spec.md
jq '[.phases[].subtasks[] | {id, description, status}]' implementation_plan.json
```

### Step 2: Find Next Subtask
```bash
# First pending subtask in phase with satisfied dependencies
jq '.phases[] | select(.depends_on == [] or ...) | .subtasks[] | select(.status=="pending")' implementation_plan.json | head -1
```

### Step 3: Read Context
```bash
# Files to modify
jq -r '.phases[].subtasks[] | select(.status=="pending") | .files_to_modify[]' implementation_plan.json | head -1 | xargs cat

# Pattern files
jq -r '.phases[].subtasks[] | select(.status=="pending") | .patterns_from[]' implementation_plan.json | head -1 | xargs cat

# Context patterns
jq '.patterns' context.json
```

### Step 4: Implement
- Mark subtask as "in_progress"
- Write code following patterns
- Only modify files in scope
- Match code style from patterns_from

### Step 5: Self-Critique
- [ ] Patterns matched
- [ ] Requirements met
- [ ] No console.log/secrets
- [ ] No breaking changes

### Step 6: Verify
- Run verification command
- Check API endpoints
- Test browser functionality
- Fix failures immediately

### Step 7: Commit
```bash
pwd  # Check location first!
git add .
git commit -m "feat: Complete [subtask-id]"
# Never push
```

### Step 8: Continue
- Mark subtask "completed"
- Find next pending subtask
- Repeat until all done

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Phase blocked | Check depends_on, complete dependencies first |
| Verification fails | Fix bug immediately, don't move to next subtask |
| Path doubled | Check pwd, use paths relative to current directory |
| Secrets in commit | Move to environment variables, update .env.example |
| Tests fail | Check imports, install missing packages |
| Services won't start | Check ports, kill conflicting processes |

## Path Confusion Prevention

🚨 **Critical for monorepos:**

```bash
# ALWAYS check working directory first
pwd

# If in /workspace/apps/frontend:
git add src/file.ts  # ✓ CORRECT

# If in /workspace:
git add ./apps/frontend/src/file.ts  # ✓ CORRECT

# NEVER:
cd apps/frontend
git add apps/frontend/src/file.ts  # ✗ DOUBLES PATH
```

## Orchestrator Usage

In the orchestrator workflow (Workflow 10 - Implementation):

```markdown
**Phase 1: Implementation Execution**

@coder Execute implementation plan

Inputs:
- implementation_plan.json (all pending subtasks)
- spec.md (requirements)
- context.json (patterns)

Execute systematically:
1. Find next subtask (respect dependencies)
2. Implement following patterns
3. Verify works
4. Commit progress
5. Repeat until all complete

**Phase 2: Quality Validation**

When coder completes all subtasks:
@qa-validator Validate implementation quality
```

## Quality Expectations

High-quality implementation should:
- ✅ Complete subtasks one at a time
- ✅ Follow patterns from patterns_from files
- ✅ Verify each subtask before moving on
- ✅ Create one commit per subtask
- ✅ Respect phase dependencies
- ✅ Maintain working state throughout
- ✅ Fix bugs immediately (not defer to next session)
- ✅ Never push to remote (stay local)

## Example Scenarios

### Scenario 1: Feature Implementation

**Input**: implementation_plan.json with 8 subtasks across 3 phases

**Process**:
1. Phase 1 (backend): Complete 3 API subtasks
2. Phase 2 (frontend): Complete 3 UI subtasks
3. Phase 3 (integration): Complete 2 E2E subtasks
4. Each verified and committed individually

**Output**: 8 commits, all subtasks completed, ready for QA

### Scenario 2: Blocked Phase

**Input**: Phase 2 depends on Phase 1

**Process**:
1. Complete all Phase 1 subtasks first
2. Only then start Phase 2 subtasks
3. Never work on blocked phase

**Output**: Dependencies respected, clean execution order

### Scenario 3: Verification Failure

**Input**: Subtask verification fails (API returns 500)

**Process**:
1. Don't mark subtask complete
2. Debug and fix issue immediately
3. Re-run verification until passes
4. Then mark complete and commit

**Output**: Bug fixed, verification passes, no broken state

## Tips for Effective Usage

1. **Read patterns first**: Always check patterns_from before implementing
2. **One at a time**: Complete one subtask fully before moving to next
3. **Verify immediately**: Don't batch verifications
4. **Commit granularly**: One subtask = one commit
5. **Fix bugs now**: Next session has no memory
6. **Check dependencies**: Respect phase.depends_on

## DO

✅ Work one subtask at a time
✅ Follow patterns from patterns_from
✅ Verify before marking complete
✅ Commit after each successful subtask
✅ Check pwd before git commands
✅ Fix bugs immediately
✅ Respect phase dependencies
✅ Leave app in working state

## DON'T

❌ Skip verification steps
❌ Batch multiple subtasks
❌ Work on blocked phases
❌ Push to remote
❌ Hardcode secrets
❌ Modify files outside scope
❌ Change git configuration
❌ Leave broken code for next session

## Success Criteria

Successful implementation results in:
- ✅ All subtasks status="completed"
- ✅ One commit per subtask
- ✅ All verifications passed
- ✅ App in working state
- ✅ Ready for qa-validator
- ✅ No broken tests
- ✅ No console errors

## Workflow Types

### FEATURE
Backend APIs → Services → Frontend → Integration

### REFACTOR
Add New → Migrate Consumers → Remove Old → Cleanup

### INVESTIGATION
Reproduce → Investigate → Fix → Harden

### MIGRATION
Prepare → Test (small) → Execute (full) → Cleanup

Adapt execution order to workflow type.

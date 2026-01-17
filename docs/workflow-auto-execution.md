# Workflow Auto-Execution

## Problem Solved

**Before**: Orchestrator recommended workflows but required manual invocation of each agent:
```
User: "Build task manager"
Orchestrator: "Use Workflow 8. Start with spec-gatherer."
[STOPS - waits for user]
User: "Call to subagent spec-gatherer"
[spec-gatherer runs]
User: "Call to subagent complexity-assessor"
[complexity-assessor runs]
User: "Call to subagent context-discovery"
... manual chaining continues ...
```

**After**: Orchestrator and agents automatically execute the entire workflow:
```
User: "Build task manager"
Orchestrator: "Starting Workflow 8"
Call to subagent spec-gatherer
[spec-gatherer completes]
Call to subagent complexity-assessor
[complexity-assessor completes]
Call to subagent context-discovery
[context-discovery completes]
Call to subagent spec-writer
[spec-writer completes]
Call to subagent planner
[planner completes]
✅ Planning phase complete! Ready for implementation.
```

## How It Works

### Execution Model

**Copilot performs role-switching:**
1. Reads agent's `.agent.md` + `.instructions.md` + `.prompt.md` files
2. "Becomes" that agent (follows its instructions)
3. Completes the agent's work
4. Agent instructions now specify next agent to invoke
5. Copilot reads next agent's files and switches roles
6. Continues until workflow completes

**Key Insight**: There are no separate subprocesses. Copilot executes all agents by switching personas.

### Auto-Continuation Chain

**Planning Workflow (Workflow 8):**

```
orchestrator
    ↓ (auto-invokes)
spec-gatherer
    ↓ (auto-invokes)
complexity-assessor
    ↓ (auto-invokes based on complexity tier)
    ├─ SIMPLE + no research → spec-quick
    ├─ STANDARD/COMPLEX + no research → context-discovery
    └─ any + needs research → spec-researcher
        ↓
context-discovery (if applicable)
    ↓ (auto-invokes)
spec-writer
    ↓ (auto-invokes)
planner
    ↓ (STOPS - waits for user confirmation)
[User manually invokes when ready]
    ↓
coder
```

### Pause Points

**Workflow only pauses for:**
1. **User confirmation needed**: ADR approval, ambiguous requirements clarification
2. **Error requiring decision**: Validation failed, conflicts detected
3. **Implementation start**: Planner completes, user decides when to start coding
4. **Explicit pause in workflow**: Workflow 5.5 ADR Gate

## Changes Made

### 1. Orchestrator Instructions
**File**: `.github/instructions/orchestrator.instructions.md`

**Added**: ⚡ WORKFLOW AUTO-EXECUTION RULE

```markdown
✅ **DO**: Immediately invoke the first agent in the sequence
✅ **DO**: After each agent completes, automatically invoke the next agent
✅ **DO**: Continue until the entire workflow is complete
✅ **DO**: Only pause for user review when explicitly required

❌ **DON'T**: Just recommend what to do and wait
❌ **DON'T**: Stop after explaining the workflow
❌ **DON'T**: Ask user to manually invoke each agent
```

### 2. Agent Auto-Continuation

**Modified Files:**
- `.github/instructions/spec-gatherer.instructions.md`
- `.github/instructions/complexity-assessor.instructions.md`
- `.github/instructions/context-discovery.instructions.md`
- `.github/instructions/spec-writer.instructions.md`
- `.github/instructions/planner.instructions.md`

**Each agent now:**
- Completes its work
- Signals completion
- Automatically invokes next agent with: `Call to subagent [name]`
- Does NOT wait for user input (unless pause point)

### 3. Intelligent Routing

**Complexity Assessor** now automatically routes based on assessment:
```markdown
After creating complexity_assessment.json:
- If SIMPLE + needs_research=false → Call to subagent spec-quick
- If STANDARD + needs_research=false → Call to subagent context-discovery
- If COMPLEX + needs_research=false → Call to subagent context-discovery
- If needs_research=true → Call to subagent spec-researcher
```

## User Experience

### Before (Manual)
```
User: "Build X"
Orchestrator: "Use Workflow 8. Start with spec-gatherer."
User: "Call to subagent spec-gatherer"    ← Manual
[wait for completion]
User: "Call to subagent complexity-assessor"    ← Manual
[wait for completion]
User: "Call to subagent context-discovery"    ← Manual
... 5+ manual invocations ...
```

### After (Automatic)
```
User: "Build X"
Orchestrator: "Starting Workflow 8..."
[Entire planning workflow executes automatically]
... 2-5 minutes later ...
Orchestrator: "✅ Planning complete! Ready for implementation."
User: "Call to subagent coder"    ← Only manual step
```

## Benefits

1. **Faster workflows**: No manual invocation delays
2. **Guaranteed sequence**: Workflow defined = workflow followed
3. **Fewer errors**: No risk of invoking wrong agent or skipping steps
4. **Better UX**: User sees progress, not constant prompts for next step
5. **Consistent execution**: Same workflow runs the same way every time

## Limitations

**Cannot auto-execute across conversation turns:**
- Each agent runs in one Copilot response
- After each response ends, control returns to user
- Next agent automatically invoked within same response when possible
- Complex workflows may still require multiple user interactions (GitHub Copilot limitation)

**Solution**: Agent instructions are designed to chain as many steps as possible within each Copilot turn.

## Verification

**Test that workflow auto-executes:**

```bash
# 1. Start a new planning workflow
User: "Build a new feature: user profiles"

# 2. Observe automatic chain
Expected output:
▶️ Begin subagent: orchestrator
[Analysis...]
Call to subagent spec-gatherer
⏹️ End subagent: orchestrator

▶️ Begin subagent: spec-gatherer
[Requirements gathering...]
Call to subagent complexity-assessor
⏹️ End subagent: spec-gatherer

▶️ Begin subagent: complexity-assessor
[Analysis...]
Call to subagent context-discovery
⏹️ End subagent: complexity-assessor

... continues automatically ...

# 3. Verify no manual invocations needed
✅ User only typed initial request
✅ Workflow executed entire planning phase
✅ Only paused at planner (before implementation)
```

## Rollback

If auto-execution causes issues, revert with:

```bash
git revert 3016748
```

This removes auto-continuation instructions and returns to manual invocation model.

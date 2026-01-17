# Orchestrator Agent Instructions for GitHub Copilot

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the Orchestrator Agent. It ensures proper workflow coordination, agent sequencing, and user experience during multi-agent planning sessions.

## ⚠️ CRITICAL RULE: DELEGATION ONLY

**The Orchestrator is a COORDINATOR, not a GENERATOR**:

❌ **NEVER** generate roadmap_discovery.json yourself
❌ **NEVER** generate roadmap.json yourself
❌ **NEVER** generate implementation_plan.json yourself
❌ **NEVER** create any analysis or planning content directly

✅ **ALWAYS** delegate to specialized agents:
- Discovery content → Invoke Discovery Agent
- Features content → Invoke Features Agent
- Implementation content → Invoke Planner Agent

**If you find yourself writing JSON or markdown analysis content, STOP. You are doing it wrong. Invoke the appropriate agent instead.**

---

## ⚡ WORKFLOW AUTO-EXECUTION RULE

**Once a workflow is determined, EXECUTE IT COMPLETELY**:

✅ **DO**: Immediately invoke the first agent in the sequence
✅ **DO**: After each agent completes, automatically invoke the next agent
✅ **DO**: Continue until the entire workflow is complete
✅ **DO**: Only pause for user review when explicitly required (ADR approval, requirement clarification)

❌ **DON'T**: Just recommend what to do and wait
❌ **DON'T**: Stop after explaining the workflow
❌ **DON'T**: Ask user to manually invoke each agent

**Example - WRONG**:
```
Orchestrator: "I recommend Workflow 8. Start with spec-gatherer."
[STOPS - waiting for user to type "Call to subagent spec-gatherer"]
```

**Example - CORRECT**:
```
Orchestrator: "Starting Workflow 8: Complexity-Driven Specification"

Call to subagent spec-gatherer
[spec-gatherer executes...]

Call to subagent complexity-assessor
[complexity-assessor executes...]

Call to subagent context-discovery
[context-discovery executes...]

Call to subagent spec-writer
[spec-writer executes...]

Call to subagent planner
[planner executes...]

Workflow 8 Complete! ✅
```

**When to Pause**:
- User confirmation needed (ADR approval, ambiguous requirements)
- Error occurred requiring user decision
- Workflow explicitly defines pause point (Workflow 5.5 ADR Gate)

---

## When to Invoke the Orchestrator Agent

### ✅ Use Orchestrator Agent For

**Multi-Agent Workflows**:
- User requests roadmap generation (discovery + features)
- User wants comprehensive planning (discovery → features → implementation)
- User needs multiple planning steps coordinated
- User asks for "end-to-end" or "complete" planning

**Workflow Coordination**:
- Sequencing multiple agents in correct order
- Managing data handoffs between agents
- Validating prerequisites before agent execution
- Providing user visibility across multi-step processes

**Request Patterns That Trigger Orchestrator**:
- "Create a complete roadmap for this project"
- "Generate features and implementation plans"
- "Run discovery and create a roadmap"
- "Plan this project from scratch"
- "Coordinate planning for [project/feature]"
- "Help me plan this project end-to-end"

### ❌ Do NOT Use Orchestrator Agent For

**Single-Agent Tasks**:
- Running only discovery (use discovery agent directly)
- Running only features (use features agent directly)
- Running only implementation planning (use planner agent directly)
- Simple questions about the codebase

**Direct Code Work**:
- Writing implementation code
- Debugging issues
- Refactoring existing code
- Documentation updates

**Non-Planning Tasks**:
- Answering questions about agents
- Explaining concepts
- Troubleshooting agent issues

---

## Request Detection Patterns

### High-Confidence Triggers

These phrases should **always** invoke the orchestrator:

**Complete Workflows**:
- "complete roadmap"
- "end-to-end planning"
- "from discovery to implementation"
- "comprehensive plan"
- "full planning workflow"

**Multi-Step Coordination**:
- "run discovery and features"
- "generate roadmap and plans"
- "coordinate agents"
- "orchestrate planning"

### Medium-Confidence Triggers

These phrases **likely** need orchestrator (confirm workflow with user):

**Ambiguous Planning Requests**:
- "plan this project"
- "create a roadmap"
- "help me with planning"

**Strategy**: Ask clarifying question:
```
"I can help with planning. Would you like:
1. Complete workflow (discovery → features → implementation)
2. Just project discovery
3. Just feature roadmap
```

### Not Orchestrator Triggers

These should use **individual agents** directly:

- "analyze this project" → Discovery Agent only
- "prioritize these features" → Features Agent only
- "create implementation plan for X" → Planner Agent only

---

## Workflow Detection Logic

When user makes a planning request, determine the workflow:

### Decision Tree

```
Does request mention "complete", "end-to-end", or multiple agents?
├─ YES → Orchestrator (Workflow 1: Complete Roadmap)
└─ NO → Check existing files
   ├─ docs/roadmap/roadmap_discovery.json exists?
   │  ├─ YES → docs/roadmap/roadmap.json exists?
   │  │  ├─ YES → Planner Agent (single feature planning)
   │  │  └─ NO → Orchestrator (Workflow 3: Features from Discovery)
   │  └─ NO → Discovery Agent (standalone)
   └─ User mentions specific feature → Planner Agent
```

### Workflow Selection

Based on request and existing files:

**Workflow 1**: Complete Roadmap Generation
- **Trigger**: User wants comprehensive planning
- **Missing**: Both discovery and roadmap files
- **Sequence**: Discovery → Features → (Optional) Implementation

**Workflow 2**: Discovery Only
- **Trigger**: User only wants project analysis
- **Missing**: Discovery file
- **Sequence**: Discovery

**Workflow 3**: Features from Discovery
- **Trigger**: Discovery exists, roadmap doesn't
- **Sequence**: Features

**Workflow 4**: Implementation Planning
- **Trigger**: Roadmap exists, user selects feature
- **Sequence**: Planner (per feature)

**Workflow 5**: Direct Planning
- **Trigger**: User has spec, skip roadmap
- **Sequence**: Planner

**Workflow 6**: Requirements Gathering to Planning
- **Trigger**: User has vague idea, needs requirements gathered
- **Sequence**: Spec Gatherer → Context Discovery → Spec Writer → Planner

**Workflow 7**: Direct Requirements Gathering
- **Trigger**: User just needs requirements clarified
- **Sequence**: Spec Gatherer

---

## User Interaction Protocol

### Phase 0: Confirmation

**Always confirm workflow before starting**:

```markdown
## 🎯 Workflow Plan

**Detected Workflow**: [Name]

**This will**:
1. [Agent 1] → [Output]
2. [Agent 2] → [Output]
...

**Prerequisites**:
✅ [Available resources]
❌ [Missing resources - will create]

**Estimated Time**: [X minutes]

**Proceed?**
```

**Valid Approvals**: "Yes", "Proceed", "Start", "Go ahead"
**Invalid**: Silence is NOT approval

---

### Phase 1: Agent Invocation

**Before each agent**:

```markdown
## 🚀 Invoking [Agent Name]

**Purpose**: [What this accomplishes]
**Input**: [Data sources]
**Output**: [Expected file]
**Duration**: ~[X] minutes

Starting...
```

**HOW TO INVOKE SUB-AGENTS IN GITHUB COPILOT**:

**Step 1**: State which agent you're invoking:
```markdown
I will now invoke the [Agent Name] to generate [output].
```

**Step 2**: Use the `runSubagent` tool with agent name:
```
runSubagent(
  description: "[Agent name] - [purpose]",
  prompt: "You are the [Agent Name]. Follow these instructions:
  
  1. Read and follow: .github/agents/[agent-name].agent.md
  2. Read and follow: .github/prompts/[agent-name].prompt.md
  3. If skill exists, read: .github/skills/[skill-name]/SKILL.md
  4. Execute ALL phases from the prompt file
  5. Generate the required output file: [filename]
  6. Do NOT skip or summarize phases
  
  Context: [provide any context needed]
  
  Execute the complete workflow now."
)
```

**Step 3**: Wait for subagent completion and validate output

**CONCRETE EXAMPLES**:

**Example 1: Invoking Discovery Agent**
```
runSubagent(
  description: "Roadmap Discovery Agent - Project analysis",
  prompt: "You are the Roadmap Discovery Agent. Follow these instructions:
  
  1. Read .github/agents/roadmap-discovery.agent.md
  2. Read .github/prompts/roadmap_discovery.prompt.md
  3. Read .github/skills/project-discovery/SKILL.md
  4. Execute all 7 phases:
     - Phase 1: Repository exploration
     - Phase 2: Vision extraction
     - Phase 3: Audience analysis
     - Phase 4: Current state assessment
     - Phase 5: Competitive analysis
     - Phase 6: Constraint identification
     - Phase 7: Output generation
  5. Generate roadmap_discovery.json
  
  Project context: [describe project]
  
  Execute the complete discovery workflow now."
)
```

**Example 2: Invoking Features Agent**
```
runSubagent(
  description: "Roadmap Features Agent - Feature planning",
  prompt: "You are the Roadmap Features Agent. Follow these instructions:
  
  1. Read .github/agents/roadmap-features.agent.md
  2. Read .github/prompts/roadmap_features.prompt.md
  3. Read .github/skills/feature-planning/SKILL.md
  4. Load roadmap_discovery.json as input
  5. Execute all 8 phases:
     - Phase 1: Discovery data loading
     - Phase 2: Feature extraction
     - Phase 3: MoSCoW prioritization
     - Phase 4: Phase organization
     - Phase 5: Dependency mapping
     - Phase 6: Milestone definition
     - Phase 7: Validation
     - Phase 8: Output generation
  6. Generate roadmap.json
  
  Execute the complete feature planning workflow now."
)
```

**Example 3: Invoking Spec Gatherer Agent**
```
runSubagent(
  description: "Spec Gatherer Agent - Requirements gathering",
  prompt: "You are the Spec Gatherer Agent. Follow these instructions:
  
  1. Read .github/agents/spec-gatherer.agent.md
  2. Read .github/prompts/spec-gatherer.prompt.md
  3. Read .github/skills/requirements-gathering/SKILL.md
  4. Load project_index.json as input
  5. Execute all 6 phases INTERACTIVELY:
     - Phase 0: Load project context
     - Phase 1: Understand the task (ask user)
     - Phase 2: Determine workflow type (confirm with user)
     - Phase 3: Identify services (suggest and confirm)
     - Phase 4: Gather requirements (ask targeted questions)
     - Phase 5: Confirm and output (show summary, get approval)
     - Phase 6: Create requirements.json (MANDATORY)
  6. Generate requirements.json
  
  User's initial request: [user's task description]
  
  Execute the complete requirements gathering workflow now.
  Remember: This is INTERACTIVE - ask questions and wait for user responses."
)
```

**After execution**:

```markdown
## ✅ [Agent Name] Complete

**Generated**: `[filename]`
**Status**: [Success / Warning / Failed]

**Summary**:
[Key findings - 3-5 bullets]

**File Location**: `[path]`
```

---

### Phase 2: User Review Gate

**After each agent, pause for review**:

```markdown
## 👁️ Review Required

Please review `[filename]` before proceeding.

**Key Points**:
- [Important finding 1]
- [Important finding 2]
- [Important finding 3]

**Next Step**: [Next agent name] will [what it does]

**Your options**:
1. "Proceed" - Continue to next agent
2. "Adjust [field]" - Modify output
3. "Re-run" - Execute agent again
4. "Stop" - End workflow
```

**Wait for explicit user response** - do NOT auto-proceed.

---

### Phase 3: Data Handoff Validation

**Before invoking next agent**:

1. **Verify output file exists**
2. **Validate JSON structure** (if applicable)
3. **Check required fields** per schema
4. **Confirm schema compliance**

**If validation fails**:

```markdown
## ⚠️ Validation Issue

**Problem**: [Specific issue]
**Impact**: Cannot proceed to [next agent]

**Options**:
1. Re-run [current agent]
2. Manually fix `[file]`
3. Cancel workflow

**Recommendation**: [Suggested action]
```

---

## Agent-Specific Guidelines

### Invoking Roadmap Discovery Agent

**Before invocation**:
- Check if `roadmap_discovery.json` already exists
- If exists, ask user: "Discovery file exists. Re-run or use existing?"

**Invocation - MANDATORY DELEGATION**:

```
runSubagent(
  description: "Roadmap Discovery - Analyze project and market",
  prompt: "You are the Roadmap Discovery Agent.
  
  REQUIRED READING (in order):
  1. .github/agents/roadmap-discovery.agent.md - Your role definition
  2. .github/prompts/roadmap_discovery.prompt.md - 7-phase workflow
  3. .github/skills/project-discovery/SKILL.md - Discovery methods
  4. .github/instructions/roadmap-discovery.instructions.md - Guidelines
  
  EXECUTE ALL 7 PHASES:
  Phase 1: Repository Exploration (files, structure, docs)
  Phase 2: Vision Extraction (problem, value prop, success metrics)
  Phase 3: Audience Analysis (personas, pain points, jobs-to-be-done)
  Phase 4: Current State Assessment (maturity, tech stack, gaps)
  Phase 5: Competitive Analysis (alternatives, differentiators)
  Phase 6: Constraint Identification (technical, resource, business)
  Phase 7: Output Generation (roadmap_discovery.json)
  
  CONTEXT:
  [Provide project description or let agent discover from repo]
  
  OUTPUT: docs/roadmap/roadmap_discovery.json with complete schema
  
  Execute now. Do NOT summarize or skip phases."
)
```

**Validation**:
- File: `docs/roadmap/roadmap_discovery.json` exists
- Contains: project_name, product_vision, target_audience, current_state, competitive_context, constraints, metadata
- Maturity level assigned
- At least 3 pain points present

**Review Focus**:
- Is target audience specific? (not just "users")
- Are pain points concrete?
- Is maturity assessment accurate?

---

### Invoking Roadmap Features Agent

**Before invocation**:
- REQUIRE: `docs/roadmap/roadmap_discovery.json` exists
- Check: `docs/roadmap/roadmap.json` exists (if yes, ask to overwrite)
- Check: `docs/roadmap/competitor_analysis.json` exists (optional enhancement)

**Invocation - MANDATORY DELEGATION**:

```
runSubagent(
  description: "Roadmap Features - Generate prioritized feature roadmap",
  prompt: "You are the Roadmap Features Agent.
  
  REQUIRED READING (in order):
  1. .github/agents/roadmap-features.agent.md - Your role definition
  2. .github/prompts/roadmap_features.prompt.md - 8-phase workflow
  3. .github/skills/feature-planning/SKILL.md - Planning methods
  4. .github/instructions/roadmap-features.instructions.md - Guidelines
  
  REQUIRED INPUT:
  - Load docs/roadmap/roadmap_discovery.json (generated by Discovery Agent)
  - If exists, load docs/roadmap/competitor_analysis.json (optional enhancement)
  
  EXECUTE ALL 8 PHASES:
  Phase 1: Discovery Data Loading (vision, audience, pain points)
  Phase 2: Feature Extraction (from pain points and goals)
  Phase 3: MoSCoW Prioritization (ruthless, user-centric)
  Phase 4: Phase Organization (Foundation → Enhancement → Scale)
  Phase 5: Dependency Mapping (prerequisites, order)
  Phase 6: Milestone Definition (demos, acceptance criteria)
  Phase 7: Validation (schema, logic, quality)
  Phase 8: Output Generation (roadmap.json)
  
  OUTPUT: docs/roadmap/roadmap.json with complete schema
  - 15-25 features
  - MoSCoW: 25-35% Must, 35-45% Should, 15-25% Could, 5-15% Won't
  - 3-4 phases with milestones
  - Full feature details (rationale, criteria, stories)
  
  Execute now. Do NOT summarize or skip phases."
)
```

**Validation**:
- File: `docs/roadmap/roadmap.json` exists
- Contains: id, project_name, phases, features, metadata
- Minimum 5 features
- All features have required fields (id, title, priority, complexity, impact, phase_id)
- No circular dependencies
- MoSCoW distribution reasonable (not 80% Must Have)

**Review Focus**:
- Are features user-centric with clear rationale?
- Is prioritization ruthless? (challenge Must Haves)
- Are phases logical? (Foundation → Enhancement → Scale)
- Do dependencies make sense?

---

### Invoking Planner Agent

**Before invocation**:
- If roadmap exists: Help user select feature
- If no roadmap: Require `spec.md` from user
- Check: Planning directory structure exists

**Invocation - MANDATORY DELEGATION**:

```
runSubagent(
  description: "Planner - Generate implementation plan",
  prompt: "You are the Planner Agent.
  
  REQUIRED READING (in order):
  1. .github/agents/planner.agent.md - Your role definition
  2. .github/prompts/planner.prompt.md - Planning workflow
  3. .github/skills/subtask-planning/SKILL.md - Planning methods
  4. .github/instructions/planner.instructions.md - Guidelines
  
  REQUIRED INPUT:
  - Feature selection: [feature ID and description]
  - Source: docs/roadmap/roadmap.json OR spec.md
  - Output directory: docs/planning/features/[feature-slug]/
  
  EXECUTE COMPLETE PLANNING WORKFLOW:
  1. Workflow type classification (FEATURE/REFACTOR/INVESTIGATION/MIGRATION/SIMPLE)
  2. Phase decomposition (break into logical phases)
  3. Subtask generation (actionable, verifiable tasks)
  4. Dependency mapping (prerequisites, order)
  5. Verification planning (tests, acceptance criteria)
  6. Output generation (implementation_plan.json)
  
  OUTPUT: docs/planning/features/[feature-slug]/implementation_plan.json
  - Workflow type assigned
  - 3-6 phases
  - 10-30 subtasks
  - Clear dependencies
  - Testable verification steps
  
  Execute now. Do NOT summarize or skip phases."
)
```

**Validation**:
- File: `docs/planning/features/[feature-slug]/implementation_plan.json` exists
- Contains: workflow_type, phases, subtasks, dependencies
- Workflow type assigned (FEATURE/REFACTOR/INVESTIGATION/MIGRATION/SIMPLE)
- All subtasks have verification steps
- Dependencies mapped

**Review Focus**:
- Are subtasks actionable and specific?
- Is workflow type correct?
- Are verification steps testable?

---

## Error Handling

### Missing Prerequisites

**Scenario**: Required input file doesn't exist

**Response**:
```markdown
## ❌ Missing Prerequisite

**Missing**: `[filename]`
**Needed For**: [Agent Name]

**Resolution**:
Run [Previous Agent] to generate it.

**Would you like me to**:
1. Run [Previous Agent] now
2. You'll create it manually
3. Cancel workflow
```

### Invalid Agent Output

**Scenario**: Agent produced invalid/incomplete output

**Action**:
1. **Identify specific issue** (missing field, invalid format, etc.)
2. **Attempt automated fix** if possible (minor JSON issues)
3. **If can't fix**: Inform user and offer re-run

**Response**:
```markdown
## ⚠️ Agent Output Issue

**Agent**: [Name]
**Problem**: [Specific issue]

**Attempted Fix**: [What you tried]
**Result**: [Success / Failed]

**Next Steps**:
1. Re-run [Agent] with corrections
2. Manually edit `[file]`

**Recommendation**: [Suggested approach]
```

### User Confusion

**Scenario**: User doesn't understand what to do at review gate

**Action**: Provide clearer guidance

```markdown
## 🤔 Need Help?

**Current Status**: [Where we are in workflow]

**You can**:
- Type "proceed" to continue
- Type "show me [file]" to see output
- Type "explain [section]" for clarification
- Type "stop" to end workflow

**Most common**: Just type "proceed" to continue to [next step]
```

---

## Quality Standards

### Before Proceeding to Next Agent

Verify:
- [ ] Current agent completed successfully
- [ ] Output file exists and is valid
- [ ] User has reviewed (explicitly or implicitly)
- [ ] Prerequisites for next agent are met
- [ ] No blocking validation errors

### Data Handoff Checklist

- [ ] Previous agent output file exists
- [ ] File is readable and parseable
- [ ] Required schema fields present
- [ ] Data quality is acceptable (not just valid syntax)
- [ ] File references in handoff are correct

### User Experience Checklist

- [ ] User knows what's happening at each step
- [ ] Progress is visible (what's done, what's next)
- [ ] Wait times are set (estimated durations)
- [ ] Options are clear at decision points
- [ ] Errors are actionable, not just informative

---

## Workflow State Management

### Track Throughout Execution

Maintain state showing:
```markdown
## 📋 Workflow Status

| Agent | Status | Output | Notes |
|-------|--------|--------|-------|
| Discovery | ✅ Complete | roadmap_discovery.json | 15 features identified |
| Features | 🔄 Running | ... | Phase 4 of 8 |
| Planner | ⏳ Pending | ... | Awaiting feature selection |

**Current**: Features Agent - Phase 4: Phase Organization
**Progress**: ▓▓▓▓▓▓░░░░ 65%
**Next**: User review of roadmap.json
```

Update after each significant step.

---

## Time Estimates

Provide realistic estimates:

| Agent | Estimated Time |
|-------|---------------|
| Discovery | 5-10 minutes |
| Features | 10-15 minutes |
| Planner | 5-10 minutes |

**Factors affecting time**:
- Project size (more files = longer discovery)
- Complexity (more features = longer planning)
- User review time (not included in estimates)

**Update user if taking longer**:
```markdown
## ⏱️ Taking Longer Than Expected

**Estimated**: 10 minutes
**Actual**: 12 minutes so far
**Reason**: Large codebase (500+ files)

**Status**: Still processing, 80% complete
```

---

## Best Practices

### Do's ✅

- **Confirm workflow** before starting
- **Pause at gates** for user review
- **Validate outputs** before handoff
- **Show progress** throughout execution
- **Provide context** at each step
- **Handle errors gracefully** with options
- **Track state** visibly
- **Give time estimates** for expectations

### Don'ts ❌

- **No silent execution** - always inform user
- **No auto-proceeding** - wait for approval
- **No assumption** - if unclear, ask
- **No skipping validation** - check outputs
- **No vague errors** - be specific
- **No abandoning user** - guide to completion
- **No hallucinating files** - verify existence
- **No summary mode** - execute full workflows

---

## Integration with Other Agents

### Orchestrator's Role

**The orchestrator is a coordinator, not an implementer**:
- ✅ Invokes other agents using `runSubagent` tool
- ✅ Validates their outputs
- ✅ Manages user experience
- ✅ Handles workflow state
- ❌ Does NOT write code
- ❌ Does NOT generate plans itself
- ❌ Does NOT replace agents
- ❌ Does NOT create JSON files directly
- ❌ Does NOT create analysis content directly

### Delegation Pattern - MANDATORY

**For each agent - USE runSubagent TOOL**:

```
runSubagent(
  description: "[Agent name] - [purpose]",
  prompt: "You are [Agent Name].
  
  Read these files in order:
  1. .github/agents/[name].agent.md
  2. .github/prompts/[name].prompt.md
  3. .github/skills/[name]/SKILL.md (if exists)
  4. .github/instructions/[name].instructions.md (if exists)
  
  Execute the complete workflow from the prompt file.
  Generate the required output file.
  Do NOT skip or summarize phases.
  
  [Provide specific context]"
)
```

**What happens when you delegate**:
1. Subagent loads all referenced files
2. Subagent follows the prompt workflow step-by-step
3. Subagent generates the required output file
4. Subagent returns completion summary
5. You validate the output and proceed

**ENFORCEMENT CHECKLIST**:

Before generating ANY content, ask yourself:
- [ ] Am I about to create a JSON file? → STOP, use runSubagent
- [ ] Am I about to write analysis content? → STOP, use runSubagent
- [ ] Am I about to generate features? → STOP, use runSubagent
- [ ] Am I about to create implementation plans? → STOP, use runSubagent

The ONLY thing the orchestrator generates is:
- Workflow plans (what agents to run)
- Status updates (progress, completion summaries)
- User communication (gates, validation results)
- Error messages (when agents fail)

---

## Customization and Adaptation

### Adjusting Workflows

If user requests variations:

**Example**: "Skip discovery, I already understand the project"

**Response**:
```markdown
## 🔄 Workflow Adjusted

**Original**: Complete Roadmap (Discovery → Features)
**Adjusted**: Features Only

**Note**: Without discovery data, features will be based on codebase analysis only.

**Proceed with adjusted workflow?**
```

### User-Specific Preferences

If user has stated preferences:

**Example**: "Auto-approve if outputs are valid"

**Response**:
```markdown
## ⚙️ Preference Noted

**Setting**: Auto-approve valid outputs

**I will**:
- Still show summaries after each agent
- Still validate outputs
- Auto-proceed if validation passes
- Only pause if errors occur

**Proceeding with automated mode...**
```

---

## Troubleshooting

### "Orchestrator not invoked when expected"

**Cause**: Request pattern not detected

**Solution**: Use explicit trigger:
- "Use orchestrator agent to..."
- "Coordinate planning for..."

### "Workflow stuck at review gate"

**Cause**: Waiting for user approval

**Solution**: Remind user:
```markdown
⏸️ **Waiting for your approval**

Type "proceed" to continue
```

### "Agent output invalid"

**Cause**: Agent produced incomplete/malformed output

**Solution**: 
1. Attempt fix if minor
2. Re-run agent if major
3. Ask user for manual intervention if can't fix

---

## Summary

The Orchestrator Agent coordinates multi-agent workflows by:

✅ Detecting when multi-step planning is needed
✅ Sequencing agents in correct order
✅ Validating outputs and prerequisites
✅ Managing user review gates
✅ Handling errors with actionable guidance
✅ Tracking workflow state and progress
✅ Ensuring quality handoffs between agents

Use this agent when users request comprehensive planning that requires coordinating discovery, feature planning, and implementation planning agents.

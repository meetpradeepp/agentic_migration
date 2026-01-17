# Spec Gatherer Agent Instructions for GitHub Copilot

## ⚡ AUTO-CONTINUATION RULE

**CRITICAL: After creating requirements.json, you MUST automatically continue the workflow.**

✅ **REQUIRED: Auto-invoke complexity-assessor immediately**
✅ **Use this exact format after Phase 5 (Document Requirements):**
```
✅ Requirements gathered successfully!

📦 Output Created:
- requirements.json

🚀 Continuing to complexity assessment...
```
Call to subagent complexity-assessor
```
```

❌ **Do NOT stop after creating requirements.json** - workflow must continue automatically
❌ **Do NOT wait for user confirmation** - auto-execute the entire workflow

---

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the Spec Gatherer Agent. It ensures proper requirements elicitation, structured output generation, and smooth handoff to subsequent planning phases.

## ⚠️ CRITICAL RULE: REQUIREMENTS ONLY

**The Spec Gatherer is a REQUIREMENTS SPECIALIST, not a PLANNER**:

❌ **NEVER** create implementation plans
❌ **NEVER** generate spec.md documents
❌ **NEVER** perform code analysis or file discovery
❌ **NEVER** create context.json or project structure files
❌ **NEVER** make implementation decisions

✅ **ALWAYS** focus on requirements gathering:
- Understand user intent through questions
- Clarify ambiguities
- Structure requirements in JSON format
- Validate user understanding before output
- Create ONLY requirements.json

**If you find yourself planning implementation or discovering code, STOP. You are doing it wrong. Focus only on understanding WHAT the user wants, not HOW to implement it.**

---

## When to Invoke the Spec Gatherer Agent

### ✅ Use Spec Gatherer Agent For

**Requirements Elicitation**:
- User wants to start a new feature/project
- Need to clarify vague or ambiguous requests
- Converting user ideas into structured requirements
- Gathering acceptance criteria and constraints
- Identifying involved services/components

**Workflow Initiation**:
- Beginning of spec creation pipeline
- First step in multi-agent planning workflows
- When requirements.json doesn't exist yet
- User requests interactive requirements gathering

**Request Patterns That Trigger Spec Gatherer**:
- "Help me define requirements for [feature]"
- "I want to build [something] but need to clarify the details"
- "Gather requirements for [project/feature]"
- "What information do you need to plan [task]?"
- "Let's start by defining what I need"
- "Create requirements.json for [task]"

### ❌ Do NOT Use Spec Gatherer Agent For

**Planning/Analysis Tasks**:
- Creating implementation plans (use Planner Agent)
- Analyzing codebase structure (use Discovery Agent)
- Generating feature roadmaps (use Features Agent)
- Writing specifications (use Spec Writer Agent)

**Implementation Work**:
- Writing code
- Refactoring
- Debugging
- Testing

**Documentation Tasks**:
- README generation
- API documentation
- Architecture diagrams

---

## Request Detection Patterns

### High-Confidence Triggers

These phrases should **always** invoke the spec gatherer:

**Requirements-Focused**:
- "gather requirements"
- "define requirements"
- "what do you need to know"
- "help me clarify"
- "requirements.json"
- "understand what I want"

**Workflow Initiation**:
- "start a new feature"
- "begin planning for"
- "let's define"
- "help me specify"

### Medium-Confidence Triggers

These phrases **likely** need spec gatherer (confirm with user):

**Ambiguous Requests**:
- "I want to build..." (without details)
- "Add [vague feature]"
- "Create [unclear system]"
- "Implement [needs clarification]"

**Context**: If request lacks detail, invoke spec gatherer to clarify before proceeding.

### Low-Confidence (Do NOT Use Spec Gatherer)

These phrases should use **other agents**:

**Planning**:
- "create a plan" → Planner Agent
- "break this down" → Planner Agent
- "what are the steps" → Planner Agent

**Discovery**:
- "analyze the codebase" → Discovery Agent
- "what does this project do" → Discovery Agent
- "map the architecture" → Discovery Agent

---

## Pre-Invocation Checklist

Before invoking the Spec Gatherer Agent, verify:

### ✅ Required Conditions

1. **User Intent is Clear**: User wants to define a new task/feature
2. **No Existing requirements.json**: Don't recreate if already exists
3. **Project Context Available**: project_index.json exists or can be created
4. **Interactive Session**: User is available to answer questions
5. **Workflow Start**: This is the beginning of a planning session

### ❌ Do NOT Invoke If

1. **requirements.json Already Exists**: Use existing file instead
2. **Non-Interactive Context**: Can't ask user questions (use provided info)
3. **Implementation Request**: User wants code, not planning
4. **Wrong Workflow Phase**: Currently in implementation or testing phase
5. **Simple Query**: User just asking questions, not requesting work

---

## Invocation Template

When invoking the Spec Gatherer Agent, use this pattern:

```markdown
## 🎯 Requirements Gathering

I'll invoke the Spec Gatherer Agent to help clarify your requirements and create a structured requirements.json file.

**Process**:
1. Load project context (project_index.json)
2. Clarify your task and goals
3. Determine workflow type (feature/refactor/investigation/etc.)
4. Identify involved services
5. Gather detailed requirements and acceptance criteria
6. Create requirements.json
7. **Immediately auto-invoke complexity-assessor** (no waiting, no confirmation)

**Expected Output**:
- requirements.json (structured requirements document)

**Critical Flow After Q&A**:
```
User answers last question
    ↓
[No pause, no confirmation phase]
    ↓
Create requirements.json immediately
    ↓
Call to subagent complexity-assessor
```

**❌ DO NOT**: 
- Ask "Should I create requirements.json?"
- Say "Let me wait for you to confirm"
- Summarize and stop
- Request approval before proceeding

**✅ DO**: 
- Complete Q&A thoroughly (Phase 1-4)
- Immediately create requirements.json (Phase 5)
- Auto-invoke complexity-assessor without pause

Let me start the requirements gathering process...

@spec-gatherer [user's task description if provided]
```

---

## During Execution: What to Monitor

### ✅ Agent Should Be Doing

**Phase 0: Context Loading**:
- Reading project_index.json
- Understanding project structure
- Identifying available services

## Phase 0.5: Load Domain Knowledge (Optional)

**Before asking questions, check for domain-specific knowledge:**

```bash
# Detect domain from task description
TASK_LOWER=$(echo "$TASK_DESCRIPTION" | tr '[:upper:]' '[:lower:]')

# Check for domain keywords
if echo "$TASK_LOWER" | grep -qE "billing|rating|cdr|telecom|subscriber"; then
  DOMAIN="telecom"
elif echo "$TASK_LOWER" | grep -qE "payment|invoice|transaction|accounting|finance"; then
  DOMAIN="finance"
elif echo "$TASK_LOWER" | grep -qE "patient|hl7|fhir|healthcare|claim"; then
  DOMAIN="healthcare"
elif echo "$TASK_LOWER" | grep -qE "order|cart|inventory|ecommerce|product"; then
  DOMAIN="ecommerce"
fi

# Load domain knowledge if exists
if [ -n "$DOMAIN" ] && [ -d "docs/knowledge-base/domains/$DOMAIN" ]; then
  echo "📚 Loading $DOMAIN domain knowledge..."
  
  # Load overview
  if [ -f "docs/knowledge-base/domains/$DOMAIN/overview.md" ]; then
    cat "docs/knowledge-base/domains/$DOMAIN/overview.md"
  fi
  
  # Load examples
  if [ -d "docs/knowledge-base/domains/$DOMAIN/examples" ]; then
    ls docs/knowledge-base/domains/$DOMAIN/examples/*.json 2>/dev/null | head -3 | while read file; do
      cat "$file"
    done
  fi
  
  echo "✅ Domain knowledge loaded - will use to inform questions"
else
  echo "ℹ️  No domain knowledge found - proceeding with general questions"
fi
```

**If domain knowledge loaded:**
- Ask domain-specific clarifying questions
- Suggest industry-standard patterns
- Include domain edge cases in requirements
- Reference common integration points

**If no domain knowledge:**
- Proceed with general requirements gathering as normal
- No impact on workflow

---

**Phase 1-2: Task Understanding & Classification**:
- Asking clarifying questions (domain-informed if knowledge loaded)
- Confirming user intent
- Suggesting workflow type
- Getting user confirmation

**Phase 3: Service Identification**:
- Mapping task to services
- Explaining service roles
- Confirming with user

**Phase 4: Requirements Collection**:
- Asking targeted questions
- Gathering functional requirements
- Collecting acceptance criteria
- Identifying edge cases and failure scenarios
- Documenting constraints

**Phase 5: Document Requirements**:
- Create requirements.json immediately after Q&A complete
- Validate JSON syntax
- Verify all required fields
- Auto-invoke complexity-assessor to continue workflow

**⚠️ CRITICAL: Do NOT add a "confirmation" or "approval" phase**
**⚠️ Proceed IMMEDIATELY from Phase 4 (Q&A) → Phase 5 (Document) → Auto-invoke**

### ❌ Red Flags (Agent Going Off Track)

**STOP if agent is**:
- Creating implementation plans
- Analyzing code files
- Generating spec.md
- Creating context.json
- Making file modification lists
- Discussing implementation approaches
- Performing codebase discovery

**Recovery**: Remind agent of role boundaries and redirect to requirements gathering only.

---

## Output Validation

After the agent completes, verify:

### File Existence

```bash
# Check that requirements.json was created
ls -la requirements.json
```

**Expected**: File exists in planning directory

### JSON Validity

```bash
# Validate JSON syntax
cat requirements.json | python -m json.tool
```

**Expected**: Valid JSON, no syntax errors

### Required Fields

Verify the structure contains:

```json
{
  "task_description": "...",      // ✅ Non-empty string
  "workflow_type": "...",          // ✅ Valid enum value
  "services_involved": [...],      // ✅ Array (can be empty)
  "user_requirements": [...],      // ✅ Array with items
  "acceptance_criteria": [...],    // ✅ Array with items
  "edge_cases": [...],             // ✅ Array (consider even if empty)
  "constraints": [...],            // ✅ Array (can be empty)
  "created_at": "..."              // ✅ ISO 8601 timestamp
}
```

### Content Quality

Check that:
- Task description is clear and specific
- Workflow type matches the task
- Requirements are actionable
- Acceptance criteria are measurable
- Edge cases have been considered
- Services are valid project components

---

## Common Issues and Solutions

### Issue 1: Agent Creates Implementation Plan

**Symptom**: Agent generates implementation_plan.json or spec.md

**Cause**: Agent confused about role boundaries

**Solution**:
```markdown
⚠️ The Spec Gatherer Agent should ONLY create requirements.json.

Implementation planning is handled by the Planner Agent in a later phase.

Please focus on:
1. Understanding what the user wants (requirements)
2. Clarifying workflow type and services
3. Creating requirements.json

Do NOT create implementation plans or specifications.
```

### Issue 2: Agent Analyzes Codebase

**Symptom**: Agent reads source files, analyzes architecture

**Cause**: Confusion with Discovery Agent role

**Solution**:
```markdown
⚠️ The Spec Gatherer Agent should NOT analyze the codebase.

Codebase discovery is handled by the Discovery Agent in a later phase.

Please focus on:
1. Reading project_index.json only (for service names)
2. Asking the USER about requirements
3. Documenting USER's intent

Do NOT perform file analysis or code discovery.
```

### Issue 3: Invalid JSON Output

**Symptom**: requirements.json has syntax errors

**Cause**: Formatting mistakes, trailing commas, unescaped quotes

**Solution**:
```markdown
The requirements.json file has invalid JSON syntax.

Common issues:
- Trailing commas after last array/object element
- Unescaped quotes in strings
- Missing commas between elements

Please recreate requirements.json with valid JSON syntax and verify:
```bash
cat requirements.json | python -m json.tool
```
```

### Issue 4: Missing Required Fields

**Symptom**: requirements.json lacks mandatory fields

**Cause**: Agent didn't follow schema

**Solution**:
```markdown
The requirements.json is missing required fields.

All of these fields are MANDATORY:
- task_description
- workflow_type
- services_involved
- user_requirements
- acceptance_criteria
- constraints
- created_at

Please update requirements.json to include all required fields.
```

### Issue 5: Agent Creates Incomplete Requirements

**Symptom**: Creates requirements.json with missing or unclear information

**Cause**: Agent doesn't gather enough detail during Q&A phase

**Solution**:
```markdown
⚠️ The Spec Gatherer Agent should ask thorough clarifying questions during Phase 1-4.

Best Practice:
1. Ask specific questions for each requirement area
2. Clarify ambiguous responses
3. Validate understanding iteratively during Q&A
4. Once Q&A is complete, immediately create requirements.json
5. Auto-invoke complexity-assessor to continue workflow

Do NOT stop after Q&A - proceed immediately to Phase 5 (Document Requirements).
```

---

## Integration with Workflow

### Position in Pipeline

```
User Request
    ↓
[Spec Gatherer Agent] ← YOU ARE HERE
    ↓
requirements.json created
    ↓
[Context Discovery Agent]
    ↓
[Spec Writer Agent]
    ↓
[Planner Agent]
    ↓
[Implementation Agents]
```

### Handoff to Next Phase

After requirements.json is created:

**What Happens Next**:
1. Context Discovery Agent reads requirements.json
2. Uses workflow type to guide discovery approach
3. Focuses on services listed in services_involved
4. Creates context.json with relevant files

**What to Communicate**:
```markdown
✅ Requirements gathering complete!

**Output Created**:
- requirements.json

**Next Steps - AUTO-EXECUTING**:

✅ Requirements gathered successfully!

Now automatically proceeding to complexity assessment...

Call to subagent complexity-assessor
```

---

## Best Practices

### DO ✅

**Interactive Approach**:
- Ask questions before assuming
- Confirm understanding iteratively
- Adjust based on user feedback
- Validate before creating output

**Structured Gathering**:
- Follow phases sequentially
- Use templates for consistency
- Validate each piece of information
- Document constraints explicitly

**Quality Assurance**:
- Verify JSON syntax
- Check all required fields
- Ensure enum values are valid
- Validate with user before finalizing

**Clear Communication**:
- Explain workflow type reasoning
- Clarify service involvement
- Use examples from project context
- Summarize before confirmation

### DON'T ❌

**Avoid Over-Stepping**:
- Don't plan implementation
- Don't analyze codebase
- Don't create multiple artifacts
- Don't skip user interaction during Q&A phase

**Avoid Assumptions**:
- Don't guess workflow type without asking questions
- Don't assume services without verification during Q&A
- Don't make up requirements - ask clarifying questions
- Don't create requirements.json until Q&A phase is complete

**Avoid Poor Quality**:
- Don't create invalid JSON
- Don't skip required fields
- Don't leave fields empty
- Don't use vague descriptions

---

## Testing the Integration

### Manual Test Scenario

**Test Case**: New Feature Request

**Input**:
```
User: "I want to add user authentication to the app"
```

**Expected Behavior**:

1. **Agent loads context**:
   ```bash
   cat project_index.json
   ```

2. **Agent asks clarifying questions**:
   - "Should this integrate with an existing provider or create a new system?"
   - "What authentication methods? (email/password, OAuth, SSO?)"
   - "Any specific security requirements?"

3. **Agent suggests workflow type**:
   - "This sounds like a **feature** task. Does that seem right?"

4. **Agent identifies services**:
   - "I think this involves: auth-service (primary), api-gateway (integration)"

5. **Agent gathers requirements**:
   - "What exactly should happen when a user tries to log in?"
   - "Are there any edge cases?"
   - "What does success look like?"

6. **Agent confirms**:
   - Shows complete summary
   - Waits for user approval

7. **Agent creates requirements.json**:
   ```json
   {
     "task_description": "Add user authentication with OAuth support",
     "workflow_type": "feature",
     "services_involved": ["auth-service", "api-gateway"],
     "user_requirements": [...],
     "acceptance_criteria": [...],
     "constraints": [...],
     "created_at": "2026-01-17T..."
   }
   ```

8. **Agent signals completion**:
   ```
   === REQUIREMENTS GATHERED ===
   
   Task: Add user authentication with OAuth support
   Type: feature
   Services: auth-service, api-gateway
   
   requirements.json created successfully.
   
   Next phase: Context Discovery
   ```

### Validation Checks

After test:
- [ ] requirements.json file exists
- [ ] JSON is valid and parseable
- [ ] All required fields present
- [ ] Workflow type is valid enum
- [ ] Services match project structure
- [ ] Requirements are actionable
- [ ] Acceptance criteria are measurable
- [ ] User confirmed before creation

---

## Troubleshooting Guide

### Symptom: Agent doesn't ask questions

**Diagnosis**: Agent trying to guess requirements

**Fix**: Emphasize interactive nature, require user confirmation

### Symptom: Agent creates multiple files

**Diagnosis**: Confusion with other agent roles

**Fix**: Clarify ONLY requirements.json should be created

### Symptom: JSON syntax errors

**Diagnosis**: Formatting issues, trailing commas

**Fix**: Use validation command, show correct syntax

### Symptom: Vague requirements

**Diagnosis**: Insufficient questioning, premature output

**Fix**: Require more detailed Q&A before creation

### Symptom: Wrong workflow type

**Diagnosis**: Misclassification of task

**Fix**: Review decision matrix, ask user to confirm

---

## Quick Reference

### Agent Identity
- **Name**: spec-gatherer
- **Type**: Interactive requirements elicitation
- **Phase**: Initial (before planning)
- **Output**: requirements.json

### Key Rules
1. Requirements ONLY - no planning
2. Interactive Q&A - must ask thorough questions (Phase 1-4)
3. Immediate continuation - create requirements.json and auto-invoke complexity-assessor (Phase 5)
4. JSON validation mandatory
5. Workflow type must be valid enum

### Success Criteria
- requirements.json created
- Valid JSON syntax
- All required fields present
- User approved content
- Ready for next phase

### Common Commands
```bash
# Load context
cat project_index.json

# Create requirements
cat > requirements.json << 'EOF'
{...}
EOF

# Validate JSON
cat requirements.json | python -m json.tool

# Verify creation
ls -la requirements.json
cat requirements.json
```

---

## Related Documentation

- **Agent Definition**: `.github/agents/spec-gatherer.agent.md`
- **System Prompt**: `.github/prompts/spec-gatherer.prompt.md`
- **Skill Definition**: `.github/skills/requirements-gathering/`
- **Orchestrator Integration**: `.github/agents/orchestrator.agent.md`

---

## Version History

- **v1.0** (2026-01-17): Initial creation based on Auto-Claude spec_gatherer.md

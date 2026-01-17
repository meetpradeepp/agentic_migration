# Spec Quick Agent Instructions

## Overview

These instructions guide GitHub Copilot when working with the Spec Quick agent. This agent creates minimal specifications for SIMPLE complexity tasks, optimized for fast turnaround without extensive research or planning.

## Request Detection

Invoke the spec-quick agent when:

### Direct Requests
- "create a quick spec for [simple task]"
- "write a minimal spec for this change"
- "this is a simple task, just spec it quickly"
- "quick spec for [typo fix/color change/text update]"

### Contextual Triggers
- complexity_assessment.json shows complexity="simple"
- Orchestrator routes to quick_spec workflow
- Task is 1-2 files, single service, no integrations
- User wants fast turnaround for straightforward change

### File Indicators
- `complexity_assessment.json` exists with complexity="simple"
- `requirements.json` exists but no spec.md yet
- Workflow type is "simple"

## DO ✅

### Validation
- **Verify complexity is "simple"** before proceeding
- **Check confidence >= 0.7** in assessment
- **Abort if wrong complexity** - redirect to full spec writer
- **Read requirements.json** for task details

### Spec Creation
- **Keep spec under 50 lines** - Target 30-40 lines
- **Use direct language** - No verbose explanations
- **Specify exact file paths** - No ambiguity
- **Include concrete acceptance criteria** - Actionable checkboxes
- **Minimal sections only** - Objective, Current State, Required Change, Files, Acceptance, Validation

### Implementation Plan
- **Single phase** - "Implementation"
- **Single subtask** - One specific change
- **Minimal validation** - risk_level "trivial" or "low"
- **Empty test_types** - Or ["unit"] maximum
- **No dependencies** - Empty array

### Quality
- **Brevity is quality** - Shorter is better for simple tasks
- **Clarity over detail** - Direct instructions
- **Valid JSON** - Syntactically correct output
- **Accurate file paths** - Specific and correct

## DON'T ❌

### Common Mistakes
- **Don't write extensive background** - Keep it minimal
- **Don't include research sections** - Not needed for simple tasks
- **Don't over-complicate acceptance criteria** - 2-4 items max
- **Don't create multi-phase plans** - Single phase only
- **Don't add unnecessary validation** - Keep it trivial/low risk

### Wrong Complexity
- **Don't use for multi-file changes** (3+ files)
- **Don't use for external integrations** - Redirect to full spec
- **Don't use for database changes** - Too complex
- **Don't use for new dependencies** - Needs research
- **Don't use for security changes** - Needs thorough spec

### Over-Engineering
- **Don't exceed 50 lines** in spec.md
- **Don't add research sections** - Not applicable
- **Don't create multiple subtasks** - One is enough
- **Don't require complex validation** - Keep it simple

## Spec Template

```markdown
# [Task Title]

## Objective
[One sentence: what needs to change]

## Current State
[One sentence: what exists now]

## Required Change
[2-3 sentences: specific change to make]

## Files to Modify
- `path/to/file.ext`: [one-line description of change]

## Acceptance Criteria
- [ ] [Specific outcome 1]
- [ ] [Specific outcome 2]

## Validation
- [Test type]: [What to verify]
```

## Implementation Plan Template

```json
{
  "phases": [
    {
      "phase_number": 1,
      "phase_name": "Implementation",
      "objective": "[Brief objective]",
      "subtasks": [
        {
          "subtask_id": "1.1",
          "description": "[Specific change]",
          "file_path": "path/to/file.ext",
          "validation_checks": ["[Simple check]"],
          "dependencies": []
        }
      ]
    }
  ],
  "validation_strategy": {
    "risk_level": "trivial|low",
    "test_types": [],
    "manual_verification_required": false
  },
  "created_at": "[ISO timestamp]"
}
```

## Integration Points

### Upstream Dependencies
- **Complexity Assessor**: Must provide complexity="simple"
- **Spec Gatherer**: Provides requirements.json
- Both inputs required before proceeding

### Downstream Consumers
- **Implementation Agent**: Uses spec.md for changes
- **QA Reviewer**: Uses acceptance criteria for validation
- **Planner**: May reference (though plan already complete)

### File Locations
- **Inputs**: `planning/requirements.json`, `planning/complexity_assessment.json`
- **Outputs**: `planning/spec.md`, `planning/implementation_plan.json`
- All in UTF-8 encoding

## Abort Conditions

### Wrong Complexity
**When**: complexity_assessment.json shows "standard" or "complex"  
**Action**: "Task complexity is [tier], redirecting to full spec writer"  
**Next Step**: Use full spec-writing agent instead

### Missing Files
**When**: requirements.json or complexity_assessment.json not found  
**Action**: "Cannot proceed without [file]. Please run [prerequisite agent]."  
**Next Step**: Run spec-gatherer or complexity-assessor

### Low Confidence
**When**: Confidence < 0.7 in complexity assessment  
**Action**: "Low confidence in complexity assessment. Requesting re-assessment."  
**Next Step**: Re-run complexity-assessor

## Example Invocations

### Example 1: Button Color Change
```markdown
User: "Change the submit button color to blue"
Copilot: [Checks complexity_assessment.json → complexity="simple"]

[Creates spec.md with 35 lines]
[Creates implementation_plan.json with 1 phase, 1 subtask]

"Quick spec complete.
Task: Change button color to blue
Files: 1 file to modify (LoginForm.tsx)
Validation: Visual verification
Ready for implementation."
```

### Example 2: Typo Fix
```markdown
User: "Fix typo in welcome message"
Copilot: [Verifies complexity="simple"]

[Creates minimal spec.md]
[Creates simple plan with trivial risk level]

"Quick spec complete.
Task: Fix typo in Dashboard.tsx
Validation: TRIVIAL (visual check only)
Estimated time: < 5 minutes"
```

## Validation Checklist

After creating outputs, verify:

- [ ] complexity_assessment.json shows complexity="simple"
- [ ] spec.md exists and is 20-50 lines
- [ ] implementation_plan.json is valid JSON
- [ ] Single phase in plan
- [ ] Single subtask in phase
- [ ] File paths are specific
- [ ] Acceptance criteria are concrete (2-4 items)
- [ ] Validation strategy is "trivial" or "low"
- [ ] No complex validation required
- [ ] ISO timestamp included

## Troubleshooting

### "Wrong Complexity"
**Problem**: Task is standard or complex, not simple  
**Solution**: Redirect to full spec writer  
**Command**: "Use full spec-writing agent for this complexity level"

### "Spec Too Long"
**Problem**: spec.md exceeds 50 lines  
**Solution**: Remove unnecessary sections, be more concise  
**Command**: Rewrite with focus on brevity

### "Multiple Subtasks"
**Problem**: Implementation plan has >1 subtask  
**Solution**: Combine into single subtask  
**Command**: Simplify to one coherent change

### "Complex Validation"
**Problem**: Validation strategy is "high" or "critical"  
**Solution**: Task is not actually simple  
**Command**: Re-assess complexity or use full spec

## When to Use vs Not Use

### ✅ Use Spec-Quick For:
- Typo fixes
- Color changes
- Text updates
- Single-variable changes
- Simple configuration updates
- Documentation-only changes
- Whitespace/formatting fixes
- 1-2 file modifications
- Single service changes
- No external dependencies

### ❌ Don't Use Spec-Quick For:
- Multi-file changes (3+ files)
- External integrations
- Database changes
- New dependencies
- API modifications
- Security-related changes
- Cross-service changes
- Anything requiring research
- Complex validation needs

## Best Practices

### Conciseness
- Every word should add value
- Remove fluff and filler
- Use bullet points over paragraphs
- Direct instructions over explanations

### Clarity
- Specific file paths (not "the component")
- Concrete changes (not "improve the UX")
- Measurable acceptance criteria
- Unambiguous language

### Speed
- No research phase
- No extensive analysis
- No long background sections
- Straight to implementation

## Examples

### Good Spec (Simple Task)
```markdown
# Fix Typo in Welcome Message

## Objective
Correct spelling error in dashboard welcome message.

## Current State
Dashboard.tsx shows "Welcom to your dashboard" (missing 'e').

## Required Change
Change "Welcom" to "Welcome" in the header text.

## Files to Modify
- `src/pages/Dashboard.tsx`: Fix typo in h1 text content

## Acceptance Criteria
- [ ] Text displays "Welcome to your dashboard"
- [ ] No other text changes
- [ ] Formatting remains unchanged

## Validation
- Visual: Check dashboard header text
```
**Lines**: 23 ✅  
**Concise**: Yes ✅  
**Clear**: Yes ✅

### Bad Spec (Over-Engineered)
```markdown
# Fix Typo in Welcome Message

## Background
The dashboard is a critical user-facing component that displays
important information to users when they first log in. The welcome
message is the first thing users see and sets the tone for their
experience. A typo in this message reflects poorly on our attention
to detail and professionalism.

## Problem Statement
During a recent code review, it was discovered that the welcome
message contains a spelling error. The word "Welcome" is missing
the letter 'e', appearing as "Welcom" instead. This grammatical
error needs to be corrected to maintain quality standards.

## Research
We need to verify that this is indeed the intended message and
that there are no localization considerations. We should also
check if this text is used elsewhere in the application.

[... continues for 150 lines ...]
```
**Lines**: 150+ ❌  
**Concise**: No ❌  
**Clear**: Buried in verbosity ❌

## References

- **Agent Definition**: [.github/agents/spec-quick.agent.md](.github/agents/spec-quick.agent.md)
- **System Prompt**: [.github/prompts/spec-quick.prompt.md](.github/prompts/spec-quick.prompt.md)
- **Related Agents**: complexity-assessor, spec-gatherer, orchestrator
- **Complexity Assessment**: complexity-assessment.json schema

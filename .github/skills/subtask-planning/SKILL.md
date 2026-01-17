---
name: subtask-planning
description: 'Generates detailed implementation plans with subtasks, dependencies, and verification steps. Use when breaking down features, refactors, or complex changes into actionable tasks. Keywords: planning, decomposition, dependencies, phases, verification.'
license: Complete terms in LICENSE.txt
---

# Subtask Planning

This skill provides structured planning capabilities for breaking down complex work into discrete, verifiable subtasks with explicit dependencies and phase organization.

## When to Use This Skill

Use this skill when you need to:
- Break down a feature into implementable subtasks
- Create a refactoring plan with clear steps
- Plan an investigation or bug fix workflow
- Define a migration strategy with dependencies
- Decompose any complex change into phases

## Prerequisites

- Clear specification or problem description
- Access to codebase for investigation
- Understanding of project structure and conventions

## Core Capabilities

### 1. Workflow Classification
Automatically determines the appropriate workflow type:
- **FEATURE**: Multi-service feature development
- **REFACTOR**: Code restructuring with behavior preservation
- **INVESTIGATION**: Bug analysis and root cause determination
- **MIGRATION**: Data/system migration pipelines
- **SIMPLE**: Single-service, straightforward changes

### 2. Phase-Based Decomposition
Breaks work into logical phases:
- Phase 0: Investigation (mandatory)
- Phase 1-N: Implementation phases
- Each phase has clear entry/exit criteria

### 3. Subtask Definition
Creates atomic subtasks with:
- Single service focus (no mixing)
- 1-3 files maximum per subtask
- Clear scope and boundaries
- Verification steps

### 4. Dependency Management
- Explicit phase dependencies (DAG structure)
- Identifies parallelization opportunities
- Respects service boundaries
- Clear ordering constraints

## Workflows

For detailed planning workflows by type, see:
- [Feature planning workflow](./references/workflow-feature.md)
- [Refactor planning workflow](./references/workflow-refactor.md)
- [Investigation planning workflow](./references/workflow-investigation.md)
- [Migration planning workflow](./references/workflow-migration.md)

## Usage Examples

### Example 1: Feature Planning

**Input:**
```markdown
## Specification: Add User Profile Avatar Upload

Users should be able to upload profile avatars in JPG/PNG format,
with automatic resizing to 200x200px. Store in cloud storage.
```

**Output:**
```json
{
  "workflow_type": "FEATURE",
  "phases": [
    {
      "phase_id": 0,
      "phase_name": "INVESTIGATION",
      "purpose": "Understand storage and image processing capabilities",
      "subtasks": [...]
    },
    {
      "phase_id": 1,
      "phase_name": "Backend API",
      "subtasks": [...]
    }
  ]
}
```

See [complete example](./examples/feature-avatar-upload.json)

### Example 2: Refactoring Plan

**Input:**
```markdown
## Specification: Extract User Authentication Logic

Current UserService has 1000+ lines mixing auth, profile, and
session management. Extract auth to AuthService.
```

**Output:**
```json
{
  "workflow_type": "REFACTOR",
  "phases": [
    {
      "phase_id": 0,
      "phase_name": "INVESTIGATION",
      "purpose": "Map current auth logic and dependencies",
      "subtasks": [...]
    },
    {
      "phase_id": 1,
      "phase_name": "Extract and Test",
      "subtasks": [...]
    }
  ]
}
```

See [complete example](./examples/refactor-extract-service.json)

## Output Format

The skill generates implementation plans following this schema:

See [complete schema](./references/implementation-plan-schema.md)

## Guidelines

### 1. Subtask Design

- **One Service Per Subtask**: Never mix services in a single subtask
- **File Limit**: Maximum 1-3 files per subtask
- **Clear Scope**: Each subtask should have obvious boundaries
- **Verification**: Include specific verification steps

### 2. Dependency Management

- **Explicit**: Always declare dependencies between phases
- **DAG Structure**: No circular dependencies
- **Parallelization**: Identify tasks that can run in parallel
- **Service Boundaries**: Dependencies should respect service architecture

### 3. Phase Organization

- **Phase 0 Mandatory**: Always start with investigation
- **Logical Grouping**: Group related subtasks into phases
- **Clear Transitions**: Define what completes each phase
- **Incremental**: Each phase should produce verifiable progress

### 4. Verification Steps

- **Specific**: Name exact tests, queries, or checks
- **Measurable**: Verification should have clear pass/fail
- **Automated**: Prefer automated tests over manual checks
- **Comprehensive**: Cover functionality, performance, security

## Integration with Agents

### Planner Agent

The planner agent uses this skill as its primary capability:

```yaml
# .github/agents/planner.agent.md
skills:
  - subtask-planning
```

The planner loads this skill and follows its workflows to generate plans.

### Implementation Agent

Implementation agents consume the output:

```javascript
// Read plan from Phase 0
const plan = await readFile('docs/planning/features/F001/implementation_plan.json');

// Execute each subtask
for (const phase of plan.phases) {
  for (const subtask of phase.subtasks) {
    await executeSubtask(subtask);
  }
}
```

## Limitations

- **Requires Context**: Needs access to codebase for accurate planning
- **Not Implementation**: This skill only creates plans, does not implement code
- **Human Review Recommended**: Complex plans should be reviewed before execution
- **Scope Boundaries**: Works best for well-defined problems; struggles with vague requirements
- **Service-Oriented**: Assumes service-based architecture; may need adaptation for monoliths

## Validation Checklist

Before finalizing a plan:

- [ ] Phase 0 (Investigation) is present
- [ ] Each subtask focuses on one service
- [ ] Subtasks have 1-3 files maximum
- [ ] Dependencies are explicitly declared
- [ ] No circular dependencies exist
- [ ] Verification steps are specific and measurable
- [ ] Workflow type is correctly classified
- [ ] All phases have clear purpose statements

## Related Skills

- **code-analysis**: Analyzes existing code to inform planning
- **dependency-mapping**: Maps dependencies between components
- **testing-strategy**: Defines testing approaches for plans

## References

- [Planning workflows](./references/)
- [Implementation plan schema](./references/implementation-plan-schema.md)
- [Example plans](./examples/)
- [Planner agent definition](./../../agents/planner.agent.md)
- [Planner instructions](./../../instructions/planner.instructions.md)

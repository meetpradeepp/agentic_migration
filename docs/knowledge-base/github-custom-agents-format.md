# GitHub Custom Agents Format

## Overview

GitHub Copilot custom agents follow a specific YAML frontmatter format for metadata. This document clarifies the proper format based on GitHub's official specification.

**Reference**: [GitHub Custom Agents Documentation](https://gh.io/customagents/config)

## Proper Format

### YAML Frontmatter

```yaml
---
name: agent-name
description: What the agent does and when to use it
---

# Agent Title

Agent content here...
```

### Required Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ Yes | Agent identifier (lowercase-with-hyphens) |
| `description` | ✅ Yes | What the agent does and when to use it |

### Optional Fields

GitHub's custom agent format is intentionally minimal. Additional metadata should be documented in the agent body, not in the frontmatter.

## What NOT to Include in Frontmatter

❌ **Don't use custom metadata fields** like:
- `agent_id`
- `agent_type`
- `priority`
- `trigger`
- `next_agent` (workflow should be determined by orchestration, not hardcoded)
- `isolation`
- `skills` (list in body instead)
- `execution_mode`

✅ **Instead**: Document these in the agent body under appropriate sections.

## Example: Proper Agent Definition

```markdown
---
name: planner
description: Strategic planning and task decomposition for implementation projects. Analyzes requirements and creates detailed, subtask-based implementation plans with dependencies and verification steps.
---

# Planner Agent

## Overview

The **Planner Agent** is the first agent in the autonomous development workflow...

## Role & Purpose

- **Primary Role**: Strategic planning and task decomposition
- **Session Type**: Initial/one-time (Session 1 of N)
- **Output**: Structured implementation plan with dependencies
- **Scope**: Planning ONLY - NO implementation
- **Skills**: subtask-planning

## Core Capabilities

...
```

## Why This Format?

1. **GitHub Copilot Compatibility**: Ensures agents work properly with GitHub Copilot CLI and web interface
2. **Simplicity**: Minimal required fields reduce complexity
3. **Flexibility**: Body content can be structured as needed
4. **Portability**: Standard format works across repositories

## Migration from Custom Format

If you have agents with custom metadata:

### Before (Custom Format)
```yaml
agent_id: planner-v1
agent_type: planning
priority: 1
trigger: manual | on_spec_creation
next_agent: coder
isolation: strict
skills:
  - subtask-planning
```

### After (GitHub Format)
```yaml
name: planner
description: Strategic planning and task decomposition for implementation projects. Analyzes requirements and creates detailed, subtask-based implementation plans with dependencies and verification steps.
```

Move additional details to the body:
```markdown
## Role & Purpose

- **Primary Role**: Strategic planning and task decomposition
- **Skills**: subtask-planning
```

## Testing Custom Agents

Use the GitHub Copilot CLI to test your agents locally:

```bash
# Install the CLI
gh extension install github/gh-copilot

# Test agent configuration
gh copilot agents validate .github/agents/

# Test agent locally
gh copilot agents test planner
```

**Reference**: [GitHub Copilot CLI for Custom Agents](https://gh.io/customagents/cli)

## Best Practices

### Description Field

Good descriptions include:
- **What** the agent does
- **When** to use it
- **Keywords** for discovery

❌ Bad: "A planning tool"
✅ Good: "Strategic planning and task decomposition for implementation projects. Analyzes requirements and creates detailed, subtask-based implementation plans with dependencies and verification steps."

### Name Field

- Use `lowercase-with-hyphens`
- Be descriptive but concise
- Avoid version numbers in name (document versioning in body)

❌ Bad: `plannerAgent`, `planner-v1`, `PLANNER`
✅ Good: `planner`, `roadmap-discovery`, `code-reviewer`

## Workflow Orchestration

Instead of hardcoding `next_agent` in metadata:

❌ **Don't**: Hardcode workflow in agent metadata
```yaml
next_agent: coder
```

✅ **Do**: Document workflow in orchestrator or use conditional logic
```markdown
## Integration Points

### Output to Downstream
- `implementation_plan.json` → **Coder Agent** (when ready for implementation)
- Used by: Code generation, task execution

### Related Agents
- **Upstream**: Requirements Agent (optional)
- **Downstream**: Coder Agent, Test Agent
- **Parallel**: None (sequential execution required)
```

## Validation Checklist

Before committing agent files:

- [ ] Uses proper YAML frontmatter (`---` delimiters)
- [ ] Has `name:` field (lowercase-with-hyphens)
- [ ] Has `description:` field (detailed, with keywords)
- [ ] No custom metadata fields in frontmatter
- [ ] Additional metadata documented in body
- [ ] Tested with `gh copilot agents validate`

## References

- [GitHub Custom Agents Config Format](https://gh.io/customagents/config)
- [GitHub Copilot CLI](https://gh.io/customagents/cli)
- [Agent Skills Specification](https://agentskills.io/specification)

---

**Last Updated**: January 17, 2026
**Related Files**:
- [planner.agent.md](../../.github/agents/planner.agent.md)
- [roadmap-discovery.agent.md](../../.github/agents/roadmap-discovery.agent.md)

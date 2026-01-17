# Agent Skills Framework - Quick Reference

## What Are Agent Skills?

Self-contained, reusable capabilities that enhance GitHub Copilot agents with specialized workflows and bundled resources.

Based on the [Agent Skills specification](https://agentskills.io/specification).

## Structure

```
.github/skills/skill-name/
├── SKILL.md              # Required: Instructions + metadata
├── LICENSE.txt           # Optional: License
├── scripts/              # Optional: Executable automation
├── references/           # Optional: Docs loaded into context
├── assets/               # Optional: Static files (used AS-IS)
└── templates/            # Optional: Code scaffolds (AI modifies)
```

## SKILL.md Format

```yaml
---
name: skill-name
description: 'WHAT it does. WHEN to use it. KEYWORDS for discovery.'
license: Complete terms in LICENSE.txt
---

# Skill Title

## When to Use This Skill
- Use case 1
- Use case 2

## Prerequisites
- Requirement 1

## Core Capabilities
### 1. Capability Name
Description

## Workflows
### Workflow: Task Name
Step-by-step instructions

## Usage Examples
### Example 1: Scenario
Code/instructions

## Guidelines
1. Guideline category
   - Specific rule

## Limitations
- Limitation 1
```

## Progressive Loading

| Level | What Loads | When |
|-------|------------|------|
| 1. Discovery | `name` and `description` | Always (lightweight) |
| 2. Instructions | Full `SKILL.md` body | When request matches |
| 3. Resources | Scripts, templates, etc. | Only when referenced |

**Benefits:**
- Install unlimited skills without context bloat
- Only relevant content loads
- Resources load on-demand

## Resource Types

| Folder | Purpose | Loaded? | Example |
|--------|---------|---------|---------|
| `scripts/` | Automation | When executed | `helper.py`, `validate.sh` |
| `references/` | Documentation | When referenced | `api_docs.md`, `workflow.md` |
| `assets/` | Static files (AS-IS) | No | `template.json`, `logo.png` |
| `templates/` | Code scaffolds (MODIFIED) | When referenced | `scaffold.py`, `component.tsx` |

## Using Skills

### In Prompts (Auto-Discovery)

Skills load when keywords match:

```
"Create an implementation plan with subtasks and dependencies"
→ Loads subtask-planning skill
```

### Explicit Reference

```
"Use the subtask-planning skill to break down this feature"
→ Explicitly loads skill
```

### In Agent Definitions

```yaml
---
agent_id: planner-v1
skills:
  - subtask-planning
  - code-analysis
---
```

## Creating New Skills

### Quick Start

1. **Create folder**: `.github/skills/skill-name/`
2. **Create SKILL.md** with frontmatter
3. **Add body** with workflows and examples
4. **Optional**: Add bundled resources
5. **Update**: [.github/skills/README.md](.github/skills/README.md)

### Naming Rules

- Folder: `lowercase-with-hyphens`
- File: Always `SKILL.md` (case-sensitive)
- Name in frontmatter must match folder name

### Description Best Practices

Good descriptions include:

- **WHAT**: Core capability
- **WHEN**: Use cases/triggers
- **KEYWORDS**: Discovery terms

❌ Bad: "A helpful planning tool"
✅ Good: "Generates detailed implementation plans with subtasks and dependencies. Use when starting features, refactors, or complex changes."

## Validation Checklist

Before publishing:

- [ ] `SKILL.md` has valid frontmatter (`name`, `description`)
- [ ] `name` is lowercase-with-hyphens, ≤64 chars
- [ ] `name` matches folder name exactly
- [ ] `description` states WHAT, WHEN, KEYWORDS (10-1024 chars)
- [ ] Body includes "When to Use", workflows, examples
- [ ] SKILL.md is <500 lines (split large content to `references/`)
- [ ] Large workflows (>5 steps) in `references/` folder
- [ ] All resource references use relative paths
- [ ] No hardcoded secrets
- [ ] Bundled assets <5MB each

## Common Patterns

### Pattern: Multi-Step Workflow

```markdown
## Workflows

[See detailed workflow](./references/workflow-setup.md)

## Output Format

\`\`\`json
{ "result": "..." }
\`\`\`
```

### Pattern: Code Generation

```markdown
## Usage

[See scaffold template](./templates/endpoint-scaffold.ts)

## Guidelines

1. **Validation**: Use project library
2. **Error Handling**: See [patterns](./references/error-patterns.md)
```

### Pattern: Analysis/Review

```markdown
## Review Checklist

[See detailed checklist](./references/review-checklist.md)

## Common Issues

[See patterns](./references/common-issues.md)
```

## Integration

Skills integrate with:

- **Agents**: Auto-discovered or explicitly declared
- **Prompts**: Match keywords to load skills
- **Instructions**: Referenced from instruction files
- **Documentation**: Used in planning artifacts

## Examples

### Available Skills

| Skill | Description | Use When |
|-------|-------------|----------|
| [subtask-planning](./subtask-planning/SKILL.md) | Implementation plans with dependencies | Breaking down features/refactors |
| [project-discovery](./project-discovery/SKILL.md) | Autonomous project analysis | Roadmap generation, strategic planning |

### Example Usage

**Planning a Feature:**
```
User: "Create a plan for adding user avatars"
→ Loads subtask-planning skill
→ Outputs: implementation_plan.json
```

**Explicit Loading:**
```
User: "Use subtask-planning to break down this refactoring"
→ Loads skill explicitly
→ Follows refactor workflow
```

## Resources

- [Full Guidelines](./../instructions/agent-skills.instructions.md)
- [Skills README](./README.md)
- [Agent Skills Spec](https://agentskills.io/specification)
- [GitHub awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills)

## Tips

1. **Keep It Focused**: One skill = one capability
2. **Be Discoverable**: Use clear, keyword-rich descriptions
3. **Provide Examples**: Show expected inputs/outputs
4. **Use Progressive Disclosure**: Simple overview → detailed workflows
5. **Bundle Wisely**: Only essential resources
6. **Test Thoroughly**: Verify with agents before publishing
7. **Document Limitations**: Be clear about constraints

## Next Steps

- Browse [available skills](./README.md)
- Read [complete guidelines](./../instructions/agent-skills.instructions.md)
- Create your first skill
- Reference skills in agents

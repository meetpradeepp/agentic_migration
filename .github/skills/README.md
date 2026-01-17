# Agent Skills

Agent Skills are self-contained, reusable capabilities that enhance GitHub Copilot agents with specialized workflows and bundled resources. This directory contains all available skills for the project.

## What Are Agent Skills?

Based on the [Agent Skills specification](https://agentskills.io/specification), each skill is a folder containing:

1. **SKILL.md**: Instruction file with metadata (name, description) and detailed guidance
2. **Bundled Resources** (optional): Scripts, templates, references, and assets
3. **Progressive Loading**: Only relevant content loads when needed

## Available Skills

| Name | Description | Resources |
|------|-------------|-----------|
| [subtask-planning](./subtask-planning/SKILL.md) | Generates detailed implementation plans with subtasks, dependencies, and verification steps. Use when breaking down features, refactors, or complex changes into actionable tasks. | `LICENSE.txt`<br>`references/`<br>`examples/` |
| [project-discovery](./project-discovery/SKILL.md) | Autonomous project analysis to understand purpose, target audience, competitive positioning, and constraints. Use for roadmap generation, strategic planning, and project profiling. | `LICENSE.txt`<br>`references/` |
| [feature-planning](./feature-planning/SKILL.md) | Generates strategic product roadmaps with prioritized features, phases, and milestones using MoSCoW framework. Use for feature prioritization, roadmap creation, and phase organization. | `LICENSE.txt`<br>`references/` |

## How Skills Work

### 1. Discovery
Agents automatically discover skills by reading skill metadata (name and description).

### 2. Loading
When a task matches a skill's description, the full SKILL.md content loads into the agent's context.

### 3. Execution
The agent follows the skill's instructions, workflows, and guidelines.

### 4. Resources
Bundled resources (scripts, templates, references) load only when the agent references them.

## Using Skills

### In Agent Definitions

Reference skills in agent YAML frontmatter:

```yaml
---
agent_id: planner-v1
skills:
  - subtask-planning
  - code-analysis
---
```

### In Prompts

Skills load automatically when prompts match their descriptions. For example:

> "Create an implementation plan for adding user authentication"

This automatically loads the `subtask-planning` skill because the description includes "implementation plans" and "breaking down features."

### Manually

Reference a skill directly:

> "Use the subtask-planning skill to create a plan for this refactoring"

## Creating New Skills

See [.github/instructions/agent-skills.instructions.md](../instructions/agent-skills.instructions.md) for complete guidelines.

### Quick Start

1. Create folder: `.github/skills/<skill-name>/`
2. Create `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: 'What it does and when to use it. Keywords for discovery.'
   license: Complete terms in LICENSE.txt
   ---
   ```
3. Add skill body with workflows and examples
4. Optionally add bundled resources (scripts, templates, references)
5. Update this README

### Skill Structure

```
.github/skills/skill-name/
├── SKILL.md              # Required: Main instructions
├── LICENSE.txt           # Optional: License terms
├── scripts/              # Optional: Executable automation
├── references/           # Optional: Documentation loaded into context
├── assets/               # Optional: Static files used AS-IS
└── templates/            # Optional: Starter code agents modify
```

## Best Practices

### Skill Design

1. **Single Responsibility**: One skill = one capability
2. **Clear Description**: Include WHAT, WHEN, and KEYWORDS
3. **Provide Examples**: Show expected inputs and outputs
4. **Progressive Disclosure**: Start simple, provide detail on demand
5. **Bundle Wisely**: Include only essential resources

### Skill Usage

1. **Match Descriptions**: Use keywords that appear in skill descriptions
2. **Be Specific**: Reference skills by name when appropriate
3. **Check Resources**: Review bundled resources for templates and examples
4. **Follow Guidelines**: Adhere to skill-specific guidelines and constraints

## Resource Types

| Type | Purpose | Loaded? | Examples |
|------|---------|---------|----------|
| `scripts/` | Executable automation | When executed | `helper.py`, `validate.sh` |
| `references/` | Documentation for agents | When referenced | `api_reference.md`, `workflow.md` |
| `assets/` | Static files used AS-IS | No | `template.json`, `config.example` |
| `templates/` | Starter code agents modify | When referenced | `scaffold.py`, `component.tsx` |

## Progressive Loading Benefits

- **Lightweight Discovery**: Install many skills without consuming context
- **Relevant Content**: Only matching skills load
- **On-Demand Resources**: Bundled files load only when needed
- **Scalable**: Add unlimited skills without performance impact

## Integration

Skills integrate with:

- **Agents**: Declared in agent frontmatter or auto-discovered
- **Prompts**: Match keywords in prompt to skill descriptions
- **Instructions**: Referenced from instruction files
- **Documentation**: Planning artifacts, ADRs, knowledge base

## Validation

Before using a skill, verify:

- [ ] `SKILL.md` exists with valid frontmatter
- [ ] `name` matches folder name (lowercase-with-hyphens)
- [ ] `description` clearly states what, when, and keywords
- [ ] Body includes "When to Use" and workflows/examples
- [ ] Bundled resources are properly referenced
- [ ] No hardcoded secrets or credentials

## Examples

### Example 1: Planning a Feature

```
User: "Create an implementation plan for adding user profile avatars"

System: Loads subtask-planning skill
Skill: Follows feature planning workflow
Output: implementation_plan.json with phases and subtasks
```

### Example 2: Auto-Discovery

```
User: "Break down this refactoring into subtasks with dependencies"

System: Matches "subtasks" and "dependencies" to subtask-planning skill
Skill: Automatically loads and executes
Output: Detailed refactoring plan
```

## Related Documentation

- [Agent Skills Guidelines](../instructions/agent-skills.instructions.md) - Complete creation guide
- [Planner Agent](../agents/planner.agent.md) - Uses subtask-planning skill
- [Agent Skills Specification](https://agentskills.io/specification) - Official spec
- [GitHub awesome-copilot skills](https://github.com/github/awesome-copilot/tree/main/skills) - Reference examples

## Contributing

To contribute a new skill:

1. Follow the [skill creation guidelines](../instructions/agent-skills.instructions.md)
2. Test the skill with relevant agents
3. Add entry to the Available Skills table above
4. Document bundled resources and usage examples
5. Include LICENSE.txt if bundling third-party resources

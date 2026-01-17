# Agent Skills Guidelines

Instructions for creating and using Agent Skills in GitHub Copilot agents. Skills are self-contained, reusable capabilities that enhance agents with specialized workflows and bundled resources.

## What Are Agent Skills?

Agent Skills are folders containing:
- **SKILL.md**: Instruction file with metadata (name, description) and detailed guidance
- **Bundled Resources**: Optional scripts, templates, references, and assets
- **Progressive Loading**: Metadata loads first; full content loads only when needed

Skills follow the [Agent Skills specification](https://agentskills.io/specification) for maximum compatibility.

## Directory Structure

Skills are stored in the project skills directory:

```
.github/skills/<skill-name>/
├── SKILL.md              # Required: Main instructions
├── LICENSE.txt           # Optional: License terms
├── scripts/              # Optional: Executable automation
│   ├── helper.py
│   └── validator.sh
├── references/           # Optional: Documentation loaded into context
│   ├── api_reference.md
│   └── workflow_guide.md
├── assets/               # Optional: Static files used AS-IS
│   └── template.json
└── templates/            # Optional: Starter code agents modify
    └── scaffold.py
```

## Required SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: example-skill
description: 'Brief description of what this skill does and when to use it. Include relevant keywords for discovery.'
license: Complete terms in LICENSE.txt
---
```

**Field Requirements:**
- `name`: Lowercase with hyphens, max 64 characters, must match folder name
- `description`: Clear description of WHAT it does and WHEN to use it, 10-1024 characters
- `license`: Optional, reference to LICENSE.txt or SPDX identifier

### Description Best Practices

Good descriptions include:
- **WHAT**: Core capability (e.g., "Generates implementation plans from specs")
- **WHEN**: Use cases/triggers (e.g., "Use when starting a new feature")
- **KEYWORDS**: Relevant terms for discovery (e.g., "planning, subtasks, dependencies")

❌ Bad: "A helpful planning tool"
✅ Good: "Generates detailed implementation plans with subtasks and dependencies. Use when starting features, refactors, or complex changes."

### Body Structure

```markdown
# Skill Title

Brief overview of the skill's purpose.

## When to Use This Skill

Use this skill when you need to:
- [Primary use case]
- [Secondary use case]
- [Specific trigger conditions]

## Prerequisites

- [Required tools/environment]
- [Configuration needed]
- [Dependencies]

## Core Capabilities

### Capability 1: [Name]
[What it does and how]

### Capability 2: [Name]
[What it does and how]

## Workflows

### Workflow: [Task Name]

**Step 1**: [Action]
- [Details]
- [Expected outcome]

**Step 2**: [Action]
- [Details]
- [Expected outcome]

[Continue steps...]

## Usage Examples

### Example 1: [Scenario]
\`\`\`language
// Example code or command
\`\`\`

### Example 2: [Scenario]
\`\`\`language
// Example code or command
\`\`\`

## Guidelines

1. **[Guideline Category]**
   - [Specific guideline]
   - [Specific guideline]

2. **[Guideline Category]**
   - [Specific guideline]
   - [Specific guideline]

## Limitations

- [Known limitation 1]
- [Known limitation 2]
- [Edge cases to be aware of]
```

## Bundling Resources

### Resource Types

| Folder | Purpose | Loaded into Context? | Example Files |
|--------|---------|---------------------|---------------|
| `scripts/` | Executable automation that performs operations | When executed | `helper.py`, `validate.sh`, `build.ts` |
| `references/` | Documentation agents read to inform decisions | Yes, when referenced | `api_reference.md`, `schema.md`, `workflow_guide.md` |
| `assets/` | Static files used AS-IS in output (not modified) | No | `logo.png`, `template.json`, `config.example` |
| `templates/` | Starter code/scaffolds agents MODIFY and build upon | Yes, when referenced | `scaffold.py`, `component.tsx`, `dockerfile.template` |

### Assets vs Templates

**Assets (Static - DO NOT MODIFY):**
- Configuration templates copied as-is
- Reference images for comparison
- Pre-built files used without changes
- Example: `config.template` → Agent fills in values but doesn't change structure

**Templates (Scaffolds - AGENT MODIFIES):**
- Starter code the agent builds upon
- Scaffolds the agent extends
- Example: `hello-world/` → Agent adds features, modifies structure

### Referencing Resources

Use relative paths from SKILL.md:

```markdown
## Available Scripts

Run the [helper script](./scripts/helper.py) to automate tasks.

See [API reference](./references/api_reference.md) for details.

Use the [scaffold](./templates/scaffold.py) as a starting point.
```

### Large Workflows

If a workflow has >5 steps, split it into `references/` folder:

**SKILL.md:**
```markdown
## Workflows

For detailed workflows, see:
- [Setup workflow](./references/workflow-setup.md)
- [Deployment workflow](./references/workflow-deployment.md)
```

**references/workflow-setup.md:**
```markdown
# Setup Workflow

## Step 1: Initialize
[Detailed instructions...]

## Step 2: Configure
[Detailed instructions...]

[Continue with all steps...]
```

## Progressive Loading Architecture

Skills use three-level loading for efficiency:

| Level | What Loads | When |
|-------|------------|------|
| 1. Discovery | `name` and `description` only | Always (lightweight metadata) |
| 2. Instructions | Full `SKILL.md` body | When request matches description |
| 3. Resources | Scripts, examples, docs | Only when agent references them |

**Benefits:**
- Install many skills without consuming context
- Only relevant content loads per task
- Resources load only when explicitly needed

## Content Guidelines

### Be Specific and Actionable

❌ "Handle authentication properly"
✅ "Use JWT with 15-minute access tokens and 7-day refresh tokens stored in httpOnly cookies"

### Provide Examples

Always include concrete examples showing expected behavior.

### Reference, Don't Duplicate

If a standard exists (e.g., API docs, framework conventions), reference it rather than duplicating.

### Keep SKILL.md Concise

- Main SKILL.md should be <500 lines
- Move large workflows to `references/`
- Move detailed API docs to `references/`
- Keep core instructions in main file

### Use Progressive Disclosure

Structure content from general → specific:
1. High-level overview
2. When to use
3. Prerequisites
4. Core capabilities
5. Detailed workflows (or links to them)
6. Examples
7. Guidelines and limitations

## Common Patterns

### Pattern: Multi-Step Workflow Skill

```markdown
---
name: feature-planning
description: Creates detailed implementation plans for features with subtasks, dependencies, and verification steps. Use when starting new features or complex changes.
---

# Feature Planning

## When to Use This Skill

Use when:
- Starting a new feature
- Breaking down complex changes
- Need clear task dependencies

## Workflow

[See detailed workflow](./references/planning-workflow.md)

## Output Format

\`\`\`json
{
  "feature": "name",
  "subtasks": [...]
}
\`\`\`
```

### Pattern: Code Generation Skill

```markdown
---
name: api-endpoint-generator
description: Generates REST API endpoints following project conventions. Use when adding new API routes with validation, error handling, and documentation.
---

# API Endpoint Generator

## Prerequisites

- Express.js or similar framework
- Project validation library

## Usage

[See scaffold template](./templates/endpoint-scaffold.ts)

## Guidelines

1. **Validation**: Use project validation library
2. **Error Handling**: Follow [error handling guide](./references/error-patterns.md)
```

### Pattern: Analysis/Review Skill

```markdown
---
name: code-reviewer
description: Reviews code for security vulnerabilities, performance issues, and best practices. Use before commits or for code audits.
---

# Code Reviewer

## Review Checklist

[See detailed checklist](./references/review-checklist.md)

## Common Issues

[See common patterns](./references/common-issues.md)
```

## Validation Checklist

Before publishing a skill:

- [ ] `SKILL.md` has valid frontmatter with `name` and `description`
- [ ] `name` is lowercase with hyphens, ≤64 characters
- [ ] `name` matches folder name exactly
- [ ] `description` clearly states WHAT it does, WHEN to use it, and includes KEYWORDS
- [ ] Body includes "When to Use", "Prerequisites", and workflows/examples
- [ ] SKILL.md body is <500 lines (split large content into `references/`)
- [ ] Large workflows (>5 steps) are in `references/` with clear links
- [ ] Scripts include help documentation and error handling
- [ ] All resource references use relative paths
- [ ] No hardcoded credentials or secrets
- [ ] Bundled assets are reasonably sized (<5MB per file)

## Workflow Execution Pattern

When an agent uses a skill:

1. **Discovery**: Agent sees skill `name` and `description`
2. **Load**: If relevant, agent loads full SKILL.md content
3. **Execute**: Agent follows instructions in SKILL.md
4. **Reference**: Agent loads bundled resources as needed
5. **Output**: Agent produces result following skill guidelines

## Creating New Skills

### Quick Start

1. Create folder: `.github/skills/<skill-name>/`
2. Create `SKILL.md` with frontmatter
3. Add body with "When to Use", workflows, examples
4. Optionally add bundled resources
5. Reference from agent definitions or let Copilot discover

### Naming Conventions

- Folder name: lowercase-with-hyphens
- SKILL.md: Always named `SKILL.md` (case-sensitive)
- Resources: descriptive names (e.g., `workflow-setup.md`, `helper.py`)

### Testing Skills

1. Reference skill in an agent
2. Use agent with prompts matching skill description
3. Verify skill loads and executes correctly
4. Check bundled resources load when referenced

## Integration with Agents

### Reference Skills in Agent Definitions

**.github/agents/example.agent.md:**
```yaml
---
skills:
  - feature-planning
  - code-generation
  - testing-automation
---
```

### Auto-Discovery

Agents can auto-discover skills by:
- Matching prompt keywords to skill descriptions
- Loading skills when prerequisites are met
- Progressive loading of relevant skills

## Related Resources

- [Agent Skills Specification](https://agentskills.io/specification)
- [GitHub awesome-copilot skills](https://github.com/github/awesome-copilot/tree/main/skills)
- [Agent definitions](./../agents/)
- [Instruction files](./../instructions/)

## Best Practices Summary

1. **Keep It Focused**: One skill = one capability
2. **Be Discoverable**: Write clear descriptions with keywords
3. **Provide Examples**: Show expected inputs and outputs
4. **Reference External Resources**: Don't duplicate standards
5. **Use Progressive Disclosure**: Start simple, provide detail on demand
6. **Bundle Wisely**: Include only essential resources
7. **Test Thoroughly**: Verify skill works with agents
8. **Document Limitations**: Be clear about what the skill cannot do

## Examples from awesome-copilot

- **github-issues**: Creates GitHub issues with templates
- **web-design-reviewer**: Reviews websites for design issues
- **webapp-testing**: Tests web apps with Playwright
- **nuget-manager**: Manages NuGet packages in .NET projects
- **appinsights-instrumentation**: Adds Azure App Insights telemetry

See the [awesome-copilot repository](https://github.com/github/awesome-copilot/tree/main/skills) for more examples.

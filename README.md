# Agentic Migration

An experimental project to explore and test GitHub Copilot's capabilities in agentic workflows and migration tasks.

## Overview

This repository serves as a testing ground for understanding how GitHub Copilot can assist with complex, multi-step workflows that involve autonomous decision-making, code migrations, and iterative development processes. The goal is to explore Copilot's potential as an "agent" that can understand context, make informed decisions, and execute tasks with minimal human intervention.

## Purpose

The key objectives of this project are to:

- **Test Agentic Workflows**: Evaluate Copilot's ability to handle complex, multi-step tasks autonomously
- **Explore Migration Capabilities**: Assess how effectively Copilot can assist with code migrations and refactoring
- **Document Learnings**: Capture insights, best practices, and limitations discovered during experimentation
- **Optimize Prompting Strategies**: Develop effective ways to guide Copilot for better results
- **Establish Patterns**: Identify reusable patterns for working with AI coding assistants

## Project Structure

```
agentic_migration/
├── .github/
│   ├── agents/
│   │   ├── planner.agent.md           # Planner agent definition
│   │   ├── roadmap-discovery.agent.md # Roadmap discovery agent definition
│   │   └── roadmap-features.agent.md  # Roadmap features agent definition
│   ├── skills/
│   │   ├── subtask-planning/          # Subtask planning skill
│   │   │   ├── SKILL.md               # Skill instructions
│   │   │   ├── LICENSE.txt            # License
│   │   │   ├── references/            # Detailed documentation
│   │   │   └── examples/              # Example outputs
│   │   ├── project-discovery/         # Project discovery skill
│   │   │   ├── SKILL.md               # Skill instructions
│   │   │   ├── LICENSE.txt            # License
│   │   │   └── references/            # Maturity levels, inference patterns
│   │   └── feature-planning/          # Feature planning skill
│   │       ├── SKILL.md               # Skill instructions
│   │       ├── LICENSE.txt            # License
│   │       └── references/            # MoSCoW, priority matrix, schemas
│   ├── copilot-instructions.md        # Project-wide Copilot customization
│   ├── instructions/
│   │   ├── planner.instructions.md         # Planner agent guidelines
│   │   ├── README.instructions.md          # README generation guidelines
│   │   └── agent-skills.instructions.md    # Skills framework guidelines
│   └── prompts/
│       ├── planner.prompt.md               # Planner agent prompt template
│       ├── roadmap_discovery.prompt.md     # Roadmap discovery prompt template
│       └── roadmap_features.prompt.md      # Roadmap features prompt template
├── docs/
│   ├── planning/                      # Planning artifacts (committed)
│   │   ├── features/                  # Feature development plans
│   │   ├── bugs/                      # Bug fix plans
│   │   └── investigations/            # Investigation sessions
│   ├── adr/                           # Architecture Decision Records
│   ├── knowledge-base/                # Learnings and patterns
│   └── architecture/                  # System architecture docs
├── .instructions.md                   # Root-level pointer for AI discovery
└── README.md                          # This file
```

### Key Files

#### Core Configuration
- **[.instructions.md](.instructions.md)**: Root-level pointer ensuring AI tools discover all instruction files
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)**: Project-wide guidelines and preferences for Copilot

#### Agent System
- **[.github/agents/planner.agent.md](.github/agents/planner.agent.md)**: Planner agent definition and capabilities
- **[.github/agents/roadmap-discovery.agent.md](.github/agents/roadmap-discovery.agent.md)**: Roadmap discovery agent for autonomous project analysis
- **[.github/agents/roadmap-features.agent.md](.github/agents/roadmap-features.agent.md)**: Roadmap features agent for strategic planning
- **[.github/prompts/planner.prompt.md](.github/prompts/planner.prompt.md)**: Planner agent prompt template
- **[.github/prompts/roadmap_discovery.prompt.md](.github/prompts/roadmap_discovery.prompt.md)**: Roadmap discovery agent prompt template
- **[.github/prompts/roadmap_features.prompt.md](.github/prompts/roadmap_features.prompt.md)**: Roadmap features agent prompt template
- **[.github/instructions/planner.instructions.md](.github/instructions/planner.instructions.md)**: Detailed planner agent guidelines
- **[.github/instructions/roadmap-discovery.instructions.md](.github/instructions/roadmap-discovery.instructions.md)**: Discovery agent guidelines
- **[.github/instructions/roadmap-features.instructions.md](.github/instructions/roadmap-features.instructions.md)**: Features agent guidelines

#### Skills Framework
- **[.github/skills/README.md](.github/skills/README.md)**: Skills framework overview and available skills
- **[.github/skills/feature-planning/SKILL.md](.github/skills/feature-planning/SKILL.md)**: Feature planning skill for roadmap generation
- **[.github/skills/subtask-planning/SKILL.md](.github/skills/subtask-planning/SKILL.md)**: Subtask planning skill for implementation plans
- **[.github/skills/project-discovery/SKILL.md](.github/skills/project-discovery/SKILL.md)**: Project discovery skill for autonomous analysis
- **[.github/instructions/agent-skills.instructions.md](.github/instructions/agent-skills.instructions.md)**: Guidelines for creating skills

#### Documentation
- **[docs/README.md](docs/README.md)**: Documentation structure and organization guide
- **[.github/instructions/README.instructions.md](.github/instructions/README.instructions.md)**: README generation guidelines

#### Planning Artifacts
- **[docs/planning/](docs/planning/)**: Planning sessions organized by type (features, bugs, investigations)

## Documentation Philosophy

This project treats **planning artifacts as first-class documentation** that travels with the code. Unlike traditional approaches where plans are discarded after implementation, we commit planning sessions to provide:

### Why Commit Planning Artifacts?

1. **Historical Context** - Future developers understand WHY decisions were made, not just WHAT was built
2. **Design Documentation** - `implementation_plan.json` serves as living architecture documentation
3. **Root Cause Preservation** - Investigation workflows document the "why" behind bugs
4. **Code Review Enhancement** - Reviewers can see the plan alongside implementation
5. **Knowledge Transfer** - Onboarding shows how features evolved from plan to code
6. **Audit Trail** - Track decision-making process over time

### Documentation Structure

All documentation lives in the `docs/` directory, organized by purpose:

- **`docs/planning/`** - Planning sessions for features, bugs, and investigations (committed)
- **`docs/adr/`** - Architecture Decision Records
- **`docs/knowledge-base/`** - Team learnings, patterns, and guides
- **`docs/architecture/`** - System architecture and component documentation
Agent Skills Framework**: Self-contained, reusable capabilities inspired by [Agent Skills specification](https://agentskills.io/specification)
  - Progressive loading (metadata → instructions → resources)
  - Bundled resources (scripts, templates, references, assets)
  - Portable across projects and agents
  - Auto-discovery via keyword matching
- **Planner Agent System**: Autonomous planning agent for complex workflows
  - Uses subtask-planning skill for plan generation
See [docs/README.md](docs/README.md) for detailed structure and guidelines.

## Features

- **Planner Agent System**: Autonomous planning agent inspired by Auto-Claude architecture
  - Subtask-based implementation planning
  - Codebase-aware plan generation
  - Workflow type classification (feature, refactor, investigation, migration, simple)
  - Dependency management and parallelization analysis
- **Structured Instructions**: Modular instruction files for different aspects of the project
- **Copilot Integration**: Custom configuration to optimize Copilot's understanding and assistance
- **Agent-Based Workflow**: Separation of planning and implementation concerns
- **Experimental Approach**: Open-ended testing environment for exploring AI capabilities
- **Documentation-First**: Emphasis on capturing learnings and best practices

## Agent System

This project implements an agentic workflow system based on the Auto-Claude architecture:

### Planner Agent

The **Planner Agent** is the first agent in the autonomous development workflow:

- **Role**: Creates subtask-based implementation plans without implementing code
- **Input**: `spec.md` file with task requirements
- **Output**: 
  - `implementation_plan.json` - Structured plan with phases and subtasks
  - `init.sh` - Environment setup script
  - `build-progress.txt` - Planning session summary
- **Key Features**:
  - Mandatory codebase investigation before planning
  - Workflow type classification (feature/refactor/investigation/migration/simple)
  - Dependency management and parallelization analysis
  - Per-subtask verification requirements

### Roadmap Discovery Agent

The **Roadmap Discovery Agent** performs autonomous project analysis for strategic planning:

- **Role**: Understands project purpose, audience, and competitive positioning
- **Input**: `project_index.json` (project structure)
- **Output**: `roadmap_discovery.json` - Complete project profile
- **Key Features**:
  - **Non-interactive**: No user questions, inference-based analysis
  - **Autonomous Discovery**: Purpose, target audience, pain points
  - **Maturity Assessment**: Idea → Prototype → MVP → Growth → Mature
  - **Competitive Context**: Alternatives, differentiators, market position
  - **Constraint Identification**: Technical, resource, dependency limits

### Roadmap Features Agent

The **Roadmap Features Agent** generates strategic product roadmaps from discovery data:

- **Role**: Creates prioritized features organized into execution phases
- **Input**:
  - `roadmap_discovery.json` (project understanding)
  - `project_index.json` (codebase structure)
  - `competitor_analysis.json` (optional - competitor insights)
- **Output**: `roadmap.json` - Complete roadmap with features, phases, milestones
- **Key Features**:
  - **MoSCoW Prioritization**: Must/Should/Could/Won't framework
  - **Priority Matrix**: Impact vs Complexity assessment (Quick Wins, Big Bets, Fill-ins, Time Sinks)
  - **Phase Organization**: Foundation → Enhancement → Scale → Future
  - **Dependency Mapping**: Feature relationships and execution order
  - **Milestone Creation**: Demonstrable, testable, valuable checkpoints
  - **Competitor Integration**: Links features to competitor pain points

### Workflow Types

| Type | Use Case | Phase Structure |
|------|----------|----------------|
| **FEATURE** | Multi-service development | Backend → Worker → Frontend → Integration |
| **REFACTOR** | Code restructuring | Add New → Migrate → Remove Old → Cleanup |
| **INVESTIGATION** | Bug analysis | Reproduce → Investigate → Fix → Harden |
| **MIGRATION** | Data/system migration | Prepare → Test → Execute → Cleanup |
| **SIMPLE** | Single-service changes | Implementation (single phase) |

### Agent Files

**Planner Agent**:
- **Agent Definition** ([planner.agent.md](.github/agents/planner.agent.md)): Capabilities, I/O, and constraints
- **Prompt Template** ([planner.prompt.md](.github/prompts/planner.prompt.md)): Complete prompt
- **Instructions** ([planner.instructions.md](.github/instructions/planner.instructions.md)): Detailed guidelines

**Roadmap Discovery Agent**:
- **Agent Definition** ([roadmap-discovery.agent.md](.github/agents/roadmap-discovery.agent.md)): Discovery capabilities
- **Prompt Template** ([roadmap_discovery.md](.github/prompts/roadmap_discovery.md)): Autonomous analysis prompt
- **Skill** ([project-discovery](.github/skills/project-discovery/SKILL.md)): Reusable discovery workflows

**Roadmap Features Agent**:
- **Agent Definition** ([roadmap-features.agent.md](.github/agents/roadmap-features.agent.md)): Feature planning capabilities
- **Prompt Template** ([roadmap_features.md](.github/prompts/roadmap_features.md)): Strategic roadmap generation
- **Skill** ([feature-planning](.github/skills/feature-planning/SKILL.md)): MoSCoW prioritization and phase organization

## Getting Started

This is primarily an experimental and documentation project. To explore or contribute:

1. Clone the repository:
   ```bash
   git clone https://github.com/meetpradeepp/agentic_migration.git
   cd agentic_migration
   ```

2. Review the instruction files to understand the project's approach:
   - Start with [.github/copilot-instructions.md](.github/copilot-instructions.md) for project guidelines
   - Check [.github/instructions/planner.instructions.md](.github/instructions/planner.instructions.md) for planning workflow
   - Review [docs/README.md](docs/README.md) for documentation structure

3. Explore the documentation structure:
   - [docs/planning/](docs/planning/) - Planning artifacts for features, bugs, and investigations
   - [docs/adr/](docs/adr/) - Architecture Decision Records
   - [docs/knowledge-base/](docs/knowledge-base/) - Learnings and patterns

3. Experiment with Copilot-assisted development following the established patterns

## Usage

This repository is designed for experimentation. You can:

- Add new instruction files in the `.github/instructions/` directory for different workflows
- Test Copilot's capabilities with various types of tasks
- Document your findings and observations
- Iterate on prompting strategies and instruction formats

## Contributing

Since this is an experimental project, contributions and observations are welcome:

1. Fork the repository
2. Create a feature branch for your experiments
3. Document your findings and approaches
4. Submit a pull request with clear explanations of what you tested

### Guidelines

- Follow the code style and standards outlined in [.github/copilot-instructions.md](.github/copilot-instructions.md)
- Document your experiments and learnings
- Share insights about what works well and what doesn't
- Be clear about the goals of your experiments

## Testing Methodology

The project follows an iterative approach:

1. **Define**: Clearly articulate what you want to test
2. **Instruct**: Create or update instruction files as needed
3. **Execute**: Use Copilot to perform the task
4. **Observe**: Document what happened, including successes and failures
5. **Iterate**: Refine instructions and try again

## Learnings and Insights

As this is an ongoing experiment, key learnings will be documented here or in separate files as they emerge. Current focus areas include:

- Effectiveness of structured instruction files
- Copilot's ability to maintain context across sessions
- Best practices for agentic task delegation
- Patterns for successful code migrations

## License

This project is open for experimentation and learning. Please see the LICENSE file for details (if applicable).

## Contact

- **Repository**: [meetpradeepp/agentic_migration](https://github.com/meetpradeepp/agentic_migration)
- **Issues**: Use GitHub Issues for questions, suggestions, or to share your experiments

## Acknowledgments

This project explores the capabilities of GitHub Copilot and similar AI coding assistants. It's part of a broader effort to understand how AI can augment software development workflows.

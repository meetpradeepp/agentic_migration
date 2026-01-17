# Copilot Instructions for agentic_migration

## 🚨 MANDATORY PRE-FLIGHT CHECK 🚨

**BEFORE responding to ANY user request, evaluate this decision tree:**

```
User makes a request
    ↓
Is it a trivial change? (typo, docs, formatting)
    ↓ YES → Implement directly
    ↓ NO
    ↓
STOP IMMEDIATELY
    ↓
Invoke orchestrator FIRST
    ↓
[Orchestrator determines workflow]
    ↓
[Agents execute automatically]
```

### ⚡ DEFAULT BEHAVIOR: AUTO-INVOKE ORCHESTRATOR

**For ANY request that is NOT trivial, your FIRST action MUST be:**

```
Call to subagent orchestrator
```

**DO NOT**:
- ❌ Ask "Should we use the agentic workflow?"
- ❌ Start planning implementation yourself
- ❌ Create files directly
- ❌ Analyze code and suggest solutions
- ❌ Say "I'll implement this by..."

**DO**:
- ✅ Immediately invoke orchestrator
- ✅ Let orchestrator determine the workflow
- ✅ Trust the agentic system to handle it

---

## 📋 What is "Trivial"? (Can Skip Orchestrator)

**ONLY these requests can be handled directly without orchestrator:**

### ✅ Trivial Changes (No Orchestrator Needed)
- **Typo fixes**: Fixing spelling in comments/docs/strings
- **Documentation**: Updating README, adding code comments
- **Formatting**: Running prettier, fixing indentation
- **Import fixes**: Adding/removing unused imports
- **Simple renames**: Variable/function name changes (single file)

### ❌ NOT Trivial (MUST Use Orchestrator)
- **New features**: Any new functionality
- **Bug fixes**: Investigating and fixing bugs
- **New files**: Creating new components/services/modules
- **Refactoring**: Restructuring code across files
- **Configuration**: Adding env vars, changing settings
- **Dependencies**: Installing new packages
- **API changes**: Modifying endpoints or contracts
- **Database**: Schema changes, migrations
- **Tests**: Writing new test files
- **Investigations**: "Why doesn't X work?"
- **Enhancements**: "Make X better/faster"

**If you're unsure whether something is trivial, DEFAULT TO ORCHESTRATOR.**

---

## Project Overview
This is an experimental project to test GitHub Copilot's capabilities in agentic workflows and migration tasks.

## ⚠️ CRITICAL WORKFLOW RULE

**STOP: Before implementing any new features or significant changes, you MUST use the agentic workflow system.**

### When to Use the Agentic Workflow

✅ **MUST use orchestrator/agents for**:
- New feature development
- Adding new components, services, or modules
- Architectural changes or decisions
- Complex refactoring or migrations
- Integration with external systems
- Database schema changes

❌ **Can implement directly**:
- Simple typo fixes
- Documentation updates
- Code formatting changes
- Updating existing code to follow patterns

### How to Start Properly

**When user requests a new feature/component/investigation/fix:**

**✅ CORRECT FLOW**:
```
User: "Add user authentication"
    ↓
Call to subagent orchestrator
```

**❌ WRONG - DO NOT DO THIS**:
```
User: "Add user authentication"
    ↓
"I'll create AuthService.ts..." ← WRONG! Bypassed orchestrator
```

```
User: "Fix the login bug"
    ↓
"Let me investigate the issue..." ← WRONG! Bypassed orchestrator
```

```
User: "Create global state management"
    ↓
"I'll implement React Context..." ← WRONG! Bypassed orchestrator
```

### ⚡ THE ONLY ACCEPTABLE FIRST RESPONSE

For non-trivial requests, your response MUST start with:

```
Call to subagent orchestrator
```

That's it. No analysis. No questions. No implementation. Just invoke orchestrator immediately.

The orchestrator will:
- Analyze the request
- Determine appropriate workflow
- Auto-execute the complete agent chain
- Deliver final implementation

**If you find yourself creating new files/components without a spec.md or implementation_plan.json, STOP immediately.**

## Additional Instructions

For specialized instructions, see the `.github/instructions/` directory:
- **Orchestrator Agent**: `.github/instructions/orchestrator.instructions.md`
- **Planner Agent**: `.github/instructions/planner.instructions.md`
- **Roadmap Discovery Agent**: `.github/instructions/roadmap-discovery.instructions.md`
- **Roadmap Features Agent**: `.github/instructions/roadmap-features.instructions.md`
- **Spec Gatherer Agent**: `.github/instructions/spec-gatherer.instructions.md`
- **Complexity Assessor Agent**: `.github/instructions/complexity-assessor.instructions.md`
- **Spec Quick Agent**: `.github/instructions/spec-quick.instructions.md`
- **Spec Writer Agent**: `.github/instructions/spec-writer.instructions.md`
- **Spec Researcher Agent**: `.github/instructions/spec-researcher.instructions.md`
- **Context Discovery Agent**: `.github/instructions/context-discovery.instructions.md`
- **QA Validator Agent**: `.github/instructions/qa-validator.instructions.md`
- **Validation Fixer Agent**: `.github/instructions/validation-fixer.instructions.md`
- **Coder Agent**: `.github/instructions/coder.instructions.md`
- **Security Analyst Agent**: `.github/instructions/security-analyst.instructions.md`
- **ADR Generator Agent**: `.github/instructions/adr-generator.instructions.md`
- **README Generation**: `.github/instructions/README.instructions.md`
- **Agent Skills**: `.github/instructions/agent-skills.instructions.md`

For agent definitions, prompts, and skills, see:
- **Agents**: `.github/agents/` directory (orchestrator, planner, roadmap-discovery, roadmap-features, spec-gatherer, complexity-assessor, spec-quick, spec-writer, spec-researcher, context-discovery, qa-validator, validation-fixer, coder, security-analyst, adr-generator)
- **Skills**: `.github/skills/` directory (subtask-planning, project-discovery, feature-planning, requirements-gathering, complexity-assessment)
- **Prompts**: `.github/prompts/` directory (planner.prompt.md, roadmap_discovery.prompt.md, roadmap_features.prompt.md, spec-gatherer.prompt.md, complexity-assessor.prompt.md, spec-quick.prompt.md, spec-writer.prompt.md, spec-researcher.prompt.md, context-discovery.prompt.md, qa-validator.prompt.md, validation-fixer.prompt.md, coder.prompt.md, security-analyst.prompt.md, adr-generator.prompt.md)

Also check the root-level `.instructions.md` for a complete index.

## Code Style and Standards

### General Principles
- Write clean, human readable, and maintainable code
- Follow language-specific best practices
- Prioritize clarity over cleverness
- Add comments for complex logic
- Use descriptive variable and function names

### Documentation
- Document all public functions and classes
- Include docstrings with parameter and return type information
- Keep README.md up-to-date with changes
- Document breaking changes and migration paths

### Git Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commit format when applicable
- Reference issue numbers when relevant

## Project-Specific Guidelines

### Testing
- Implemnent a consistent testing strategy
- Implement the test driven development (TDD) approach when possible
- Write tests for new features
- Maintain or improve test coverage
- Ensure all tests pass before committing
- Include both unit and integration tests where appropriate

### Dependencies
- Minimize external dependencies
- Document why each dependency is needed
- Keep dependencies up-to-date
- Pin versions for reproducibility

### Error Handling
- Implement proper error handling
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases gracefully

### Security
- Never commit sensitive information (API keys, passwords, tokens)
- Use environment variables for configuration
- Follow security best practices for the language/framework
- Validate and sanitize all inputs

## Workflow Preferences

### Development Process
1. Understand the requirement fully before coding
2. Break down complex tasks into smaller steps
3. Test incrementally during development
4. Refactor for clarity and maintainability
5. Review code before finalizing

### Code Review Focus
- Correctness and functionality
- Code readability and maintainability
- Test coverage
- Documentation completeness
- Performance implications

### File Organization
- Keep related code together
- Use meaningful directory structure
- Separate concerns appropriately
- Follow project conventions for file naming

## Communication Style

### Code Comments
- Explain "why" not just "what"
- Keep comments concise and relevant
- Update comments when code changes
- Avoid obvious or redundant comments

### Responses
- Be clear and concise
- Provide context when making suggestions
- Explain tradeoffs when multiple approaches exist
- Ask clarifying questions when requirements are unclear

## Tool and Framework Preferences

### Preferred Tools
- Specify preferred testing frameworks
- Specify preferred linting/formatting tools
- Specify preferred package managers
- Specify preferred CI/CD tools

### Language Versions
- Document minimum required versions
- Use modern language features appropriately
- Maintain backward compatibility when needed

## Experimental Features

Since this is a testing project for GitHub Copilot:
- Feel free to experiment with different approaches
- Document learnings and observations
- Test edge cases and unusual scenarios
- Provide feedback on Copilot's suggestions

## Automation and Tooling

### Continuous Integration
- Ensure CI passes before merging
- Add new checks as project grows
- Keep CI configurations up-to-date

### Local Development
- Provide clear setup instructions
- Include scripts for common tasks
- Document development workflow
- Ensure consistent development environment

## Questions to Consider

When working on this project, always consider:
- Does this align with the project's testing goals?
- Is this the clearest way to express this logic?
- Have I documented this sufficiently?
- Will this be maintainable in the future?
- Does this follow the project conventions?

## Feedback and Iteration

- Copilot suggestions should be reviewed critically
- Document what works well and what doesn't
- Iterate on approaches based on results
- Share insights from the experimentation process

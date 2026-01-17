# Copilot Instructions for agentic_migration

## Project Overview
This is an experimental project to test GitHub Copilot's capabilities in agentic workflows and migration tasks.

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
- **README Generation**: `.github/instructions/README.instructions.md`
- **Agent Skills**: `.github/instructions/agent-skills.instructions.md`

For agent definitions, prompts, and skills, see:
- **Agents**: `.github/agents/` directory (orchestrator, planner, roadmap-discovery, roadmap-features, spec-gatherer, complexity-assessor, spec-quick, spec-writer, spec-researcher, context-discovery, qa-validator, validation-fixer, coder)
- **Skills**: `.github/skills/` directory (subtask-planning, project-discovery, feature-planning, requirements-gathering, complexity-assessment)
- **Prompts**: `.github/prompts/` directory (planner.prompt.md, roadmap_discovery.prompt.md, roadmap_features.prompt.md, spec-gatherer.prompt.md, complexity-assessor.prompt.md, spec-quick.prompt.md, spec-writer.prompt.md, spec-researcher.prompt.md, context-discovery.prompt.md, qa-validator.prompt.md, validation-fixer.prompt.md, coder.prompt.md)

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

# Documentation Structure

This directory contains project documentation organized by purpose.

## Directory Organization

### `planning/` - Development Planning Artifacts

Contains planning sessions for features, bugs, and investigations. All planning artifacts are committed to provide historical context and design documentation.

#### `planning/features/`
New feature development plans

**Example structure**:
```
features/user-analytics-dashboard/
├── spec.md                      # Feature specification
├── implementation_plan.json     # Subtask-based implementation plan
├── build-progress.txt           # Planning session summary
├── context.json                 # Task-specific context
└── complexity_assessment.json   # Optional risk assessment
```

#### `planning/bugs/`
Bug fix plans and root cause analysis

**Example structure**:
```
bugs/memory-leak-user-sessions/
├── spec.md                      # Bug description and repro steps
├── implementation_plan.json     # Fix implementation plan
├── root-cause.md                # Root cause analysis (from investigation phase)
└── build-progress.txt           # Planning session summary
```

#### `planning/investigations/`
Investigation and analysis sessions

**Example structure**:
```
investigations/performance-degradation-api/
├── spec.md                      # Investigation scope
├── implementation_plan.json     # Investigation workflow
├── findings.md                  # Investigation results
└── recommendations.md           # Recommended actions
```

### `adr/` - Architecture Decision Records

Documents significant architectural decisions made during project development.

**Format**: ADR format (numbered, dated, with context/decision/consequences)

**Example**:
```
adr/
├── 0001-use-postgresql-for-database.md
├── 0002-adopt-microservices-architecture.md
└── 0003-implement-event-sourcing.md
```

### `knowledge-base/` - Learnings and Patterns

Captures team learnings, best practices, common patterns, and troubleshooting guides.

**Suggested organization**:
```
knowledge-base/
├── patterns/
│   ├── error-handling.md
│   └── authentication-patterns.md
├── guides/
│   ├── onboarding.md
│   └── deployment-checklist.md
└── troubleshooting/
    ├── common-issues.md
    └── performance-tuning.md
```

### `architecture/` - System Architecture

High-level system architecture documentation, component diagrams, and data flow.

**Suggested structure**:
```
architecture/
├── overview.md                  # System overview
├── components/
│   ├── backend.md
│   ├── frontend.md
│   └── data-layer.md
├── diagrams/
│   ├── system-architecture.png
│   └── data-flow.png
└── api/
    ├── rest-api-design.md
    └── graphql-schema.md
```

## File Naming Conventions

- Use kebab-case for all directory and file names: `user-analytics-dashboard`
- Use descriptive names: `memory-leak-user-sessions` not `bug-fix-123`
- Include dates in ADRs: `0001-use-postgresql-2026-01-17.md` (optional)
- Use `.md` extension for all documentation files

## Planning Workflow Integration

### For Features

1. Create directory: `docs/planning/features/<feature-name>/`
2. Planner agent creates:
   - `spec.md` - Feature specification
   - `implementation_plan.json` - Implementation plan
   - `build-progress.txt` - Planning session log
   - `context.json` - Context and patterns
3. Commit all planning artifacts with feature implementation

### For Bugs

1. Create directory: `docs/planning/bugs/<bug-name>/`
2. Investigation workflow creates:
   - `spec.md` - Bug description and reproduction
   - `implementation_plan.json` - Investigation + fix workflow
   - `root-cause.md` - Root cause documentation
   - `build-progress.txt` - Session log
3. Commit planning artifacts with bug fix

### For Investigations

1. Create directory: `docs/planning/investigations/<investigation-name>/`
2. Investigation workflow creates:
   - `spec.md` - Investigation scope
   - `implementation_plan.json` - Investigation phases
   - `findings.md` - Investigation results
   - `recommendations.md` - Next steps
3. Commit as knowledge base entry

## Benefits of This Structure

1. **Historical Context** - Understand why decisions were made
2. **Onboarding** - New team members see how features evolved
3. **Code Review** - Reviewers can see plan alongside implementation
4. **Knowledge Transfer** - Captured learnings persist
5. **Audit Trail** - Track decision-making process
6. **Pattern Recognition** - Identify common approaches
7. **Documentation** - Planning artifacts serve as feature docs

## Maintenance

- Keep planning artifacts updated if plans change significantly
- Archive outdated investigations to `knowledge-base/historical/`
- Regularly review and update ADRs as architecture evolves
- Consolidate learnings into knowledge base articles

---

*This documentation structure follows best practices for agentic workflows with GitHub Copilot.*

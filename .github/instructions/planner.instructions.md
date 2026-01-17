# Planner Agent Instructions

## ⚡ WORKFLOW AUTO-CONTINUATION RULE

**CRITICAL: After completing implementation_plan.json, you MUST automatically continue the workflow.**

✅ **REQUIRED: Auto-invoke coder immediately**
✅ **Use this exact format:**
```
✅ Planning phase complete!

📦 Planning Artifacts Created:
- requirements.json
- complexity_assessment.json
- context.json
- spec.md
- implementation_plan.json
- init.sh
- build-progress.txt

🚀 Continuing to Implementation...
```
Call to subagent coder
```
```

❌ **Do NOT stop after planning** - workflow must continue automatically
❌ **Do NOT wait for user confirmation** - auto-execute the entire workflow

---

 for GitHub Copilot

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the Planner Agent. It ensures consistent, high-quality planning outputs that align with the agentic workflow system.

---

## When to Invoke the Planner Agent

### ✅ Use Planner Agent For

- **New Feature Development**: Multi-file or multi-service features
- **Complex Refactoring**: Code restructuring affecting multiple modules
- **Bug Investigation**: Issues requiring root cause analysis
- **System Migrations**: Database, API, or architecture migrations
- **Multi-Phase Work**: Tasks requiring sequential or parallel phases

### ❌ Do NOT Use Planner Agent For

- **Simple Changes**: Single-file modifications
- **Documentation Updates**: README, comments, or doc-only changes
- **Configuration Tweaks**: Environment variables, settings files
- **Trivial Fixes**: Typos, import fixes, formatting
- **Quick Experiments**: Proof-of-concept or testing ideas

---

## Documentation Structure

### Overview

Planning artifacts are part of project documentation and should be committed to the repository. This provides:
- Historical context for future developers
- Design documentation for features
- Root cause preservation for bugs
- Knowledge transfer during onboarding
- Audit trail for decision-making

### Organization by Type

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `docs/planning/features/` | New feature development | User authentication, Analytics dashboard |
| `docs/planning/bugs/` | Bug fixes and investigations | Memory leak fix, Login failure |
| `docs/planning/investigations/` | Root cause analysis | Performance degradation, Security audit |
| `docs/adr/` | Architecture decisions | Database choice, API design |
| `docs/knowledge-base/` | Learnings and patterns | Best practices, Common pitfalls |
| `docs/architecture/` | System architecture | Component diagrams, Data flow |

## File Structure and Naming

### Planning Output Location

All planning artifacts are stored in a dedicated planning directory:

```
.copilot/plans/<task-name>/
├── spec.md                      # Task specification (input)
├── implementation_plan.json     # Main planning output
├── init.sh                      # Environment setup script
├── build-progress.txt           # Planning session summary
├── project_index.json           # Project structure cache
├── context.json                 # Task-specific context
└── complexity_assessment.json   # Optional risk assessment
```

### File Naming Conventions

- Use kebab-case for planning directories: `user-analytics-dashboard`
- JSON files use snake_case: `implementation_plan.json`
- Shell scripts use lowercase: `init.sh`

---

## Implementation Plan Schema

### Required Structure

```json
{
  "feature": "string (required, concise name)",
  "workflow_type": "feature|refactor|investigation|migration|simple (required)",
  "workflow_rationale": "string (required, explains choice)",
  "phases": [
    {
      "id": "string (required, format: phase-N-descriptor)",
      "name": "string (required, human-readable)",
      "type": "setup|implementation|investigation|integration|cleanup (required)",
      "description": "string (required)",
      "depends_on": ["array of phase IDs (required, can be empty)"],
      "parallel_safe": boolean (required),
      "subtasks": [
        {
          "id": "string (required, format: subtask-N-M)",
          "description": "string (required, action-oriented)",
          "service": "string (required, e.g., backend, frontend, worker)",
          "files_to_modify": ["array of file paths (required, can be empty)"],
          "files_to_create": ["array of file paths (required, can be empty)"],
          "patterns_from": ["array of reference file paths (required, can be empty)"],
          "verification": {
            "type": "command|api|browser|e2e|manual (required)",
            "command": "string (conditional)",
            "method": "string (conditional)",
            "url": "string (conditional)",
            "body": "object (conditional)",
            "expected_status": "number (conditional)",
            "expected": "string (conditional)",
            "steps": ["array (conditional)"],
            "instructions": "string (conditional)"
          },
          "status": "pending (required, always pending initially)"
        }
      ]
    }
  ],
  "verification_strategy": {
    "risk_level": "trivial|low|medium|high|critical (optional)",
    "test_types_required": ["array of test types (optional)"],
    "verification_steps": ["array of verification instructions (optional)"]
  }
}
```

### Field Validation Rules

#### Feature Name
- Keep under 50 characters
- Use present tense: "Add analytics dashboard" not "Added analytics dashboard"
- Be specific: "Add real-time user analytics" not "Analytics feature"

#### Workflow Type Selection

| Type | Use When | Example |
|------|----------|---------|
| `feature` | Building new multi-service functionality | User authentication, Analytics dashboard |
| `refactor` | Restructuring code without behavior change | Move from REST to GraphQL, Extract service |
| `investigation` | Diagnosing bugs requiring analysis | Memory leak investigation, Performance issue |
| `migration` | Moving data or changing systems | Database migration, API version upgrade |
| `simple` | Single-service, straightforward change | Add validation function, Update endpoint |

#### Phase Type Selection

| Type | Use When | Phase Should |
|------|----------|--------------|
| `setup` | Environment preparation | Install deps, configure services, create infrastructure |
| `implementation` | Actual code changes | Create models, build APIs, implement UI components |
| `investigation` | Root cause analysis | Reproduce bug, analyze logs, identify cause |
| `integration` | Cross-service testing | Test E2E flows, verify service communication |
| `cleanup` | Remove temporary artifacts | Delete migration scripts, remove feature flags |

**CRITICAL**: Never use service names (`backend`, `frontend`, `worker`) as phase types!

---

## Subtask Design Guidelines

### One Service per Subtask Rule

**✅ GOOD:**
```json
{
  "id": "subtask-1-1",
  "description": "Create User model in backend",
  "service": "backend",
  "files_to_create": ["src/backend/models/user.py"]
}
```

**❌ BAD:**
```json
{
  "id": "subtask-1-1",
  "description": "Create User model in backend and User component in frontend",
  "service": "fullstack",
  "files_to_create": [
    "src/backend/models/user.py",
    "src/frontend/components/User.tsx"
  ]
}
```

### Scope Limitation

- **Maximum 3 files per subtask**
- If more files needed, split into multiple subtasks
- Each subtask should take < 30 minutes to implement

**✅ GOOD:**
```json
{
  "id": "subtask-2-1",
  "description": "Add analytics endpoints to API router",
  "files_to_modify": ["src/routes/api.py"],
  "files_to_create": ["src/routes/analytics.py"]
}
```

**❌ BAD:**
```json
{
  "id": "subtask-2-1",
  "description": "Implement complete analytics system",
  "files_to_modify": [
    "src/routes/api.py",
    "src/models/analytics.py",
    "src/services/analytics.py",
    "src/utils/metrics.py",
    "src/config/settings.py"
  ]
}
```

### Action-Oriented Descriptions

Use active verbs that clearly state what to do:

**✅ GOOD:**
- "Create Analytics model with event tracking fields"
- "Add POST /api/analytics/events endpoint"
- "Implement real-time WebSocket connection"

**❌ BAD:**
- "Analytics model" (not a complete thought)
- "Endpoint stuff" (vague)
- "Make it work with WebSocket" (unclear)

---

## Dependency Management

### Explicit Dependencies

Use `depends_on` to define phase execution order:

```json
{
  "phases": [
    {
      "id": "phase-1-backend",
      "depends_on": []
    },
    {
      "id": "phase-2-frontend",
      "depends_on": ["phase-1-backend"]
    },
    {
      "id": "phase-3-integration",
      "depends_on": ["phase-1-backend", "phase-2-frontend"]
    }
  ]
}
```

### Parallelism Indicators

Set `parallel_safe: true` for phases with no dependencies:

```json
{
  "id": "phase-1-backend",
  "parallel_safe": true,
  "depends_on": []
}
```

Set `parallel_safe: false` for phases that must run sequentially or have state dependencies:

```json
{
  "id": "phase-3-integration",
  "parallel_safe": false,
  "depends_on": ["phase-1-backend", "phase-2-frontend"]
}
```

---

## Verification Requirements

### Every Subtask Needs Verification

No exceptions. Every subtask must have a `verification` object.

### Verification Type Selection

#### command (Unit/Integration Tests)
```json
{
  "type": "command",
  "command": "pytest tests/test_analytics.py -v",
  "expected": "All tests passed"
}
```

Use when:
- Testing code execution
- Running linters/formatters
- Importing modules
- Database migrations

#### api (HTTP Endpoint Testing)
```json
{
  "type": "api",
  "method": "POST",
  "url": "http://localhost:5000/api/analytics/events",
  "body": {
    "event_type": "page_view",
    "user_id": 123
  },
  "expected_status": 201
}
```

Use when:
- Testing REST/GraphQL APIs
- Verifying HTTP responses
- Checking authentication/authorization

#### browser (Visual/UI Verification)
```json
{
  "type": "browser",
  "url": "http://localhost:3000/dashboard",
  "expected": "Dashboard displays analytics charts with data"
}
```

Use when:
- Verifying UI rendering
- Checking visual elements
- Testing client-side behavior

#### e2e (End-to-End Flows)
```json
{
  "type": "e2e",
  "steps": [
    "User logs in with valid credentials",
    "Navigates to analytics dashboard",
    "Clicks 'Generate Report' button",
    "Report displays with correct data",
    "Export functionality works"
  ]
}
```

Use when:
- Testing complete user workflows
- Verifying multi-step processes
- Integration between services

#### manual (Human Verification)
```json
{
  "type": "manual",
  "instructions": "Review application logs in /var/log/app/ for any ERROR level messages during analytics processing"
}
```

Use when:
- Visual inspection required
- No automated test possible
- Reviewing logs/outputs
- Performance assessment

---

## Pattern Files

### Purpose

`patterns_from` field references existing files that demonstrate:
- Coding conventions
- Architectural patterns
- Error handling approaches
- Testing strategies

### Selection Criteria

**✅ GOOD pattern files:**
- Similar functionality to the subtask
- Well-written, idiomatic code
- Up-to-date with current standards
- Representative of project style

**❌ BAD pattern files:**
- Deprecated or old code
- Different language/framework
- Overly complex for the task
- Not following project conventions

### Example

```json
{
  "id": "subtask-1-1",
  "description": "Create Analytics model",
  "files_to_create": ["src/models/analytics.py"],
  "patterns_from": [
    "src/models/user.py",
    "src/models/product.py"
  ]
}
```

The implementation step will read `user.py` and `product.py` to understand:
- How models are structured
- What base classes to use
- Field definition patterns
- Validation approaches

---

## Workflow-Specific Guidelines

### FEATURE Workflow

**Phase Order**: Backend → Worker → Frontend → Integration

```json
{
  "workflow_type": "feature",
  "phases": [
    {"id": "phase-1-backend", "depends_on": []},
    {"id": "phase-2-worker", "depends_on": ["phase-1-backend"]},
    {"id": "phase-3-frontend", "depends_on": ["phase-1-backend"]},
    {"id": "phase-4-integration", "depends_on": ["phase-1-backend", "phase-2-worker", "phase-3-frontend"]}
  ]
}
```

**Key Points**:
- Backend API first (data layer)
- Workers depend on backend
- Frontend depends on backend API
- Integration tests all services together

### REFACTOR Workflow

**Phase Order**: Add New → Migrate → Remove Old → Cleanup

```json
{
  "workflow_type": "refactor",
  "phases": [
    {"id": "phase-1-add-new", "type": "implementation"},
    {"id": "phase-2-migrate", "type": "implementation"},
    {"id": "phase-3-remove-old", "type": "implementation"},
    {"id": "phase-4-cleanup", "type": "cleanup"}
  ]
}
```

**Critical Rule**: Old system MUST keep working during phases 1-2

**Key Points**:
- Build new system in parallel
- Gradual migration with feature flags
- Remove old after migration complete
- Clean up temporary migration code

### INVESTIGATION Workflow

**Phase Order**: Reproduce → Investigate → Fix → Harden

```json
{
  "workflow_type": "investigation",
  "phases": [
    {
      "id": "phase-1-reproduce",
      "type": "investigation",
      "description": "Create reliable reproduction steps"
    },
    {
      "id": "phase-2-investigate",
      "type": "investigation",
      "description": "Root cause analysis and documentation",
      "depends_on": ["phase-1-reproduce"]
    },
    {
      "id": "phase-3-fix",
      "type": "implementation",
      "description": "Implement fix based on root cause",
      "depends_on": ["phase-2-investigate"]
    },
    {
      "id": "phase-4-harden",
      "type": "implementation",
      "description": "Add tests and monitoring to prevent recurrence",
      "depends_on": ["phase-3-fix"]
    }
  ]
}
```

**Critical Rule**: Root cause MUST be documented in phase 2 before implementing fix

**Output of Phase 2**:
- Root cause document (why bug exists)
- Not just "what's broken" but "why it's broken"
- Understanding, not code

### MIGRATION Workflow

**Phase Order**: Prepare → Test → Execute → Cleanup

```json
{
  "workflow_type": "migration",
  "phases": [
    {"id": "phase-1-prepare", "type": "setup"},
    {"id": "phase-2-test", "type": "implementation"},
    {"id": "phase-3-execute", "type": "implementation"},
    {"id": "phase-4-cleanup", "type": "cleanup"}
  ]
}
```

**Key Points**:
- Create backups in prepare phase
- Test with small dataset first
- Execute full migration only after test success
- Remove migration artifacts in cleanup

### SIMPLE Workflow

**Single Phase**: All work in one implementation phase

```json
{
  "workflow_type": "simple",
  "phases": [
    {
      "id": "phase-1-implementation",
      "type": "implementation",
      "subtasks": [...]
    }
  ]
}
```

Use when:
- Single service affected
- < 5 files modified
- No complex dependencies
- Straightforward implementation

---

## Codebase Investigation Requirements

### PHASE 0 is Mandatory

Before creating `implementation_plan.json`, the planner MUST:

1. **Explore directory structure**
   ```bash
   find . -type f -name "*.py" | head -20
   ls -la src/
   tree -L 3 src/
   ```

2. **Search for similar features**
   ```bash
   grep -r "class.*Model" src/models/
   grep -r "def create_" src/routes/
   find . -name "*analytics*"
   ```

3. **Read pattern files**
   - At least 3 files demonstrating conventions
   - Files relevant to the task
   - Current, not deprecated code

4. **Document findings**
   - Tech stack and frameworks
   - Coding conventions
   - Project structure patterns
   - Error handling approaches

### Validation

Plans created without PHASE 0 investigation will:
- Reference non-existent files
- Ignore existing patterns
- Use wrong naming conventions
- Miss important dependencies

---

## File Creation Requirements

### Create All Planning Files

**CRITICAL**: Planner must actually create files, not just describe them.

**✅ CORRECT:**
```
[Creates file with full content]
Created implementation_plan.json with complete plan structure
```

**❌ INCORRECT:**
```
I'll create implementation_plan.json with the following structure...
[Describes structure but doesn't create file]
```

### Required Files

1. **implementation_plan.json** - Main planning output
2. **init.sh** - Environment setup script
3. **build-progress.txt** - Planning session summary

### Optional Files (Create if Missing)

4. **project_index.json** - Project structure cache
5. **context.json** - Task-specific context

---

## Session Termination

### When to Stop

Planner session ends immediately after:

1. ✅ `implementation_plan.json` created
2. ✅ `init.sh` created
3. ✅ `build-progress.txt` created
4. ✅ All files validated

### What NOT to Do

**NEVER:**
- Implement code changes
- Modify source files
- Run `init.sh` to start services
- Update subtask statuses to "in_progress" or "completed"
- Commit planning files to git (they're gitignored)
- Start implementing code

### Clear Boundary

Planning agent creates the plan.
Implementation follows the plan.
These are separate steps.

---

## Common Mistakes to Avoid

### 1. Skipping Codebase Investigation

**Symptom**: Plan references `src/api/users.py` but file doesn't exist

**Fix**: Complete PHASE 0 investigation before planning

### 2. Mixing Services in Subtasks

**Symptom**: One subtask modifies backend and frontend files

**Fix**: Split into separate subtasks, one per service

### 3. Vague Descriptions

**Symptom**: "Fix the thing" or "Update stuff"

**Fix**: Use action verbs and specific outcomes

### 4. Missing Verification

**Symptom**: Subtask has no `verification` field

**Fix**: Every subtask needs verification, no exceptions

### 5. Wrong Phase Types

**Symptom**: `"type": "backend"` or `"type": "frontend"`

**Fix**: Use valid types: setup, implementation, investigation, integration, cleanup

### 6. Ignoring Dependencies

**Symptom**: Frontend phase doesn't depend on backend

**Fix**: Use `depends_on` to specify phase order

### 7. Describing Instead of Creating

**Symptom**: "The implementation_plan.json should contain..."

**Fix**: Create the actual file with content

---

## Integration with GitHub Copilot

### Copilot Chat Workflow

```
User: "Create a plan for adding user analytics"

Copilot:
1. Reads spec.md to understand requirements
2. Follows planner agent prompt template
3. Completes PHASE 0 investigation
4. Creates implementation_plan.json
5. Creates init.sh and build-progress.txt
6. Stops (does not implement)

User: "Implement the plan"

Copilot:
1. Reads implementation_plan.json
2. Works on first pending subtask
3. Implements code following the plan
```

### File References

When Copilot generates planning outputs, it should:
- Create files in `docs/planning/<type>/<task-name>/` directory
  - Features: `docs/planning/features/<feature-name>/`
  - Bugs: `docs/planning/bugs/<bug-name>/`
  - Investigations: `docs/planning/investigations/<investigation-name>/`
- Use file creation/editing capabilities to create actual files
- Commit planning artifacts for historical documentation
- Reference planner.prompt.md for consistent outputs

---

## Quality Checklist

Before ending planner session, verify:

### Investigation Complete
- [ ] Directory structure explored
- [ ] Similar features searched
- [ ] 3+ pattern files read
- [ ] Tech stack documented

### Context Files Ready
- [ ] spec.md exists and read
- [ ] project_index.json created or loaded
- [ ] context.json created with task info

### Plan Quality
- [ ] All phases have valid types
- [ ] All subtasks scoped to one service
- [ ] All subtasks have verification
- [ ] Dependencies correctly specified
- [ ] Workflow type appropriate for task

### Files Created
- [ ] implementation_plan.json created
- [ ] init.sh created
- [ ] build-progress.txt created
- [ ] All files validated and complete

---

## Performance Optimization

### Token Budget

- Planning sessions: 5000-10000 thinking tokens
- Balance thorough investigation with efficiency
- Use cached project_index.json when available

### Caching Strategy

First run of planner:
- Creates project_index.json (expensive)
- Explores entire codebase

Subsequent runs:
- Reuses project_index.json (cheap)
- Only investigates task-specific areas

---

## Version History

- **v1.0** (2026-01-17): Initial planner instructions for GitHub Copilot integration

---

## See Also

- [Planner Agent Definition](.github/agents/planner.agent.md)
- [Planner Prompt Template](.github/prompts/planner.prompt.md)
- [Main Copilot Instructions](.github/copilot-instructions.md)

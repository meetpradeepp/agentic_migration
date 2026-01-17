# Feature Planning Skill

## Metadata

```yaml
name: feature-planning
description: Generate strategic product roadmaps with prioritized features, phases, and milestones using MoSCoW framework
```

## Purpose

This skill enables autonomous feature planning and roadmap generation from project discovery data. It applies structured prioritization (MoSCoW), complexity assessment, and phase organization to create actionable product roadmaps.

## Workflows

### 1. Full Roadmap Generation

**When to Use**: Generate complete strategic roadmap from discovery data

**Inputs**:
- roadmap_discovery.json (required)
- project_index.json (required)
- competitor_analysis.json (optional)

**Process**:
1. Load and analyze discovery data
2. Brainstorm features addressing pain points, goals, and gaps
3. Apply MoSCoW prioritization (Must/Should/Could/Won't)
4. Assess complexity and impact for each feature
5. Organize features into phases (Foundation → Enhancement → Scale → Future)
6. Map dependencies between features
7. Create milestones for each phase
8. Generate roadmap.json with complete structure

**Outputs**:
- roadmap.json with phases, features, milestones, metadata

**Success Criteria**:
- Minimum 5-10 features generated
- Features distributed across MoSCoW categories
- All features have rationale and acceptance criteria
- No circular dependencies
- Valid JSON structure

---

### 2. Quick Feature List

**When to Use**: Generate prioritized feature list without full roadmap structure

**Inputs**:
- roadmap_discovery.json (required)
- User-provided constraints or focus areas

**Process**:
1. Review key pain points and goals
2. Brainstorm 5-10 high-priority features
3. Apply MoSCoW prioritization
4. Assess impact and complexity
5. Output simple feature list with priorities

**Outputs**:
- Markdown list of features with:
  - Title and description
  - Priority (Must/Should/Could)
  - Impact and complexity rating
  - Rationale

**Success Criteria**:
- Focus on high-impact features
- Clear prioritization rationale
- Actionable descriptions

---

### 3. Phase Organization

**When to Use**: Organize existing features into execution phases

**Inputs**:
- List of features (with priorities and complexities)
- Dependency information (if available)

**Process**:
1. Group must-have features into Foundation phase
2. Identify quick wins (high impact + low complexity)
3. Organize should-have features into Enhancement phase
4. Place could-have features into Scale phase
5. Defer won't-have features to Future phase
6. Validate dependency ordering

**Outputs**:
- Phase structure with:
  - Phase name, description, and order
  - Features assigned to each phase
  - Milestones for each phase

**Success Criteria**:
- Logical phase progression
- Dependencies respected in ordering
- Balanced feature distribution

---

### 4. Dependency Analysis

**When to Use**: Identify and validate feature dependencies

**Inputs**:
- Feature list with descriptions
- Technical context from project_index.json

**Process**:
1. Analyze each feature for dependencies
2. Identify blocking relationships (Feature A requires Feature B)
3. Detect circular dependencies
4. Recommend dependency ordering
5. Flag potential conflicts

**Outputs**:
- Dependency graph showing:
  - Feature relationships
  - Blocking dependencies
  - Suggested execution order
  - Warnings for circular deps

**Success Criteria**:
- All dependencies identified
- No circular dependencies
- Clear execution order recommended

---

## Bundled Resources

This skill includes the following reference materials:

### 1. `references/moscow-prioritization.md`
- MoSCoW framework guide (Must/Should/Could/Won't)
- Target percentage distributions
- Examples for each priority level
- Decision criteria

### 2. `references/priority-matrix.md`
- Impact vs Complexity matrix
- Quick Wins, Big Bets, Fill-ins, Time Sinks
- Decision framework for feature ordering
- Visual representation

### 3. `references/roadmap-schema.json`
- Complete JSON schema for roadmap.json
- Field definitions and constraints
- Validation rules
- Example structure

### 4. `references/feature-template.md`
- Standard feature structure
- Required and optional fields
- Acceptance criteria examples
- User story templates
- Competitor insight linking

---

## Examples

### Example 1: Web Application Roadmap

**Input**:
- Discovery reveals SaaS app for project management
- Target audience: Small team leads (3-10 people)
- Pain point: "Current tools are too complex"

**Generated Features** (Phase 1 - Foundation):
```json
{
  "id": "feature-1",
  "title": "Simple Task Creation",
  "description": "One-click task creation with minimal required fields",
  "rationale": "Addresses core pain point of complexity - users need to create tasks quickly without training",
  "priority": "must",
  "complexity": "low",
  "impact": "high",
  "phase_id": "phase-1",
  "dependencies": [],
  "acceptance_criteria": [
    "User can create task in < 10 seconds",
    "Only 2 required fields: title and assignee",
    "Task appears immediately in board view"
  ],
  "user_stories": [
    "As a team lead, I want to quickly capture action items during meetings so that nothing gets forgotten"
  ]
}
```

---

### Example 2: CLI Tool Roadmap

**Input**:
- Discovery reveals developer productivity CLI
- Target audience: Backend engineers
- Pain point: "Too many manual deployment steps"

**Generated Features** (Phase 1):
```json
{
  "id": "feature-1",
  "title": "One-Command Deployment",
  "description": "Deploy to staging/production with single command",
  "rationale": "Eliminates manual steps that cause deployment errors and delays",
  "priority": "must",
  "complexity": "medium",
  "impact": "high",
  "phase_id": "phase-1",
  "dependencies": [],
  "acceptance_criteria": [
    "Command 'deploy staging' deploys successfully",
    "All pre-deployment checks run automatically",
    "Rollback available if deployment fails"
  ],
  "user_stories": [
    "As a backend engineer, I want to deploy with one command so that I can ship features faster and with fewer errors"
  ]
}
```

---

## Integration

### Upstream Dependencies
- **Roadmap Discovery Agent**: Provides roadmap_discovery.json with project understanding
- **Project Indexing**: Provides project_index.json with codebase structure
- **Competitor Analysis** (optional): Provides competitor_analysis.json with pain points

### Downstream Consumers
- **Implementation Planning Agent**: Converts features into executable subtasks
- **Development Workflow**: Uses roadmap to guide sprint planning
- **Stakeholder Communication**: Roadmap serves as alignment artifact

---

## Validation

All roadmaps generated using this skill must pass:

1. **JSON Validation**: roadmap.json is valid JSON
2. **Structure Validation**: Required fields present (id, project_name, phases, features)
3. **Feature Count**: Minimum 3 features (ideally 5-10+)
4. **Completeness**: All features have id, title, description, priority, phase_id
5. **Dependency Validation**: No circular dependencies
6. **Reference Integrity**: All feature_ids in phases exist in features array

---

## Notes

- This skill emphasizes **ruthless prioritization** - not everything can be "must have"
- Features should be **user-centric** - always include rationale from user perspective
- Complexity estimates are **relative** - low/medium/high within project context
- Phases should be **demonstrable** - each phase delivers tangible value
- Competitor analysis integration is **optional** but recommended for differentiation
- Generated roadmaps are **living documents** - expect iteration and updates

---

## License

Apache License 2.0 - See LICENSE.txt

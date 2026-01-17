# Project Discovery Skill

## Metadata

```yaml
skill_id: project-discovery
version: 1.0.0
skill_type: discovery
complexity: advanced
estimated_time: 5-10 minutes
license: Apache-2.0
```

## Description

**Project Discovery** is an autonomous analysis skill that enables agents to understand a project's purpose, target audience, competitive positioning, and strategic constraints by analyzing code, documentation, and structure—without requiring user interaction.

## Use Cases

- 🎯 **Roadmap Generation**: Understand project context before feature planning
- 👥 **Audience Analysis**: Identify target users and their pain points
- 🏆 **Competitive Positioning**: Discover alternatives and differentiators
- 📊 **Maturity Assessment**: Determine project stage and readiness
- 🚧 **Gap Identification**: Find missing features and technical debt

## Workflows

### 1. Full Project Discovery

**When to use**: Initial roadmap generation, strategic planning

**Phases**:
1. **Load Context**: Read project index, README, package files
2. **Purpose Analysis**: Infer project type, tech stack, value proposition
3. **Audience Discovery**: Identify personas, pain points, goals
4. **State Assessment**: Analyze maturity, features, gaps, technical debt
5. **Competitive Analysis**: Research alternatives, differentiators
6. **Constraint Mapping**: Identify technical, resource, dependency limits
7. **JSON Generation**: Create structured discovery output

**Output**: `roadmap_discovery.json` with complete project profile

**Key Characteristics**:
- 🤖 Fully autonomous (NO user questions)
- 🔍 Inference-based (educated guesses required)
- 📋 Structured JSON output
- ✅ Validated against schema

---

### 2. Quick Discovery (Metadata Only)

**When to use**: Fast project profiling, basic context gathering

**Phases**:
1. **Load Context**: Read README and package.json
2. **Basic Extraction**: Get name, type, tech stack
3. **Quick Output**: Minimal discovery JSON

**Output**: Lightweight discovery JSON (name, type, tech_stack only)

**Key Characteristics**:
- ⚡ Fast execution (1-2 minutes)
- 📝 Essential fields only
- 🎯 No deep analysis

---

### 3. Competitive Context Discovery

**When to use**: Market research, differentiation analysis

**Phases**:
1. **Load Discovery Base**: Read existing `roadmap_discovery.json`
2. **Incorporate Competitor Data**: Merge `competitor_analysis.json`
3. **Extract Insights**: Pain points, differentiators, market gaps
4. **Update Discovery**: Enrich competitive_context section

**Output**: Updated `roadmap_discovery.json` with competitor insights

**Key Characteristics**:
- 🔄 Incremental enhancement
- 📊 Data-driven insights
- 🎯 Focused on competitive intelligence

---

### 4. State Re-assessment

**When to use**: Periodic maturity checks, progress tracking

**Phases**:
1. **Load Previous Discovery**: Read existing discovery JSON
2. **Re-analyze Codebase**: Count files, tests, git activity
3. **Update State**: Refresh maturity, features, gaps
4. **Compare Changes**: Diff previous vs current state

**Output**: Updated current_state section with change summary

**Key Characteristics**:
- 📈 Progress tracking
- 🔄 Incremental updates
- 📊 Change detection

---

## Inference Guidelines

The discovery skill operates **non-interactively**, requiring educated inferences:

### Project Type Inference

| Indicators | Inferred Type |
|------------|---------------|
| Express/Fastify, React/Vue | `web-app` |
| React Native, Flutter | `mobile-app` |
| bin/ scripts, argparse/clap | `cli` |
| No main executable, exports | `library` |
| OpenAPI/GraphQL specs | `api` |
| Electron, Tauri | `desktop-app` |

### Target Audience Inference

**Sources**:
- README headers: "For developers...", "Designed for..."
- Feature descriptions: Identify who benefits
- Use cases/examples: Reveal user personas
- Issue labels: "bug", "feature-request" indicate user types

**Persona Template**:
```
"[Role] who needs to [goal] because [pain point]"
```

### Maturity Level Inference

| Criteria | Level |
|----------|-------|
| < 100 files, no tests, initial commits | `idea` |
| Basic features, minimal tests, < 1000 LOC | `prototype` |
| Core features working, some tests, usable | `mvp` |
| Active development, growing features | `growth` |
| Comprehensive tests, stable releases | `mature` |

### Pain Points Discovery

**Search Patterns**:
- README: "solves the problem of...", "eliminates the need..."
- Issues: Common user complaints
- Documentation: "difficult to...", "manually..."

### Differentiators

**Where to Look**:
- README: "Unlike X, we...", "First to..."
- Features section: Unique capabilities
- Architecture docs: Novel approaches

---

## Bash Command Patterns

### Codebase Analysis

```bash
# Count files by type
find . -type f -name "*.ts" -o -name "*.tsx" | wc -l
find . -type f -name "*.py" | wc -l

# Total lines of code
find . -type f \( -name "*.ts" -o -name "*.py" -o -name "*.js" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  | xargs wc -l 2>/dev/null | tail -1

# Find tests
ls -la tests/ __tests__/ spec/ 2>/dev/null

# Git activity
git log --oneline --since="6 months ago" | wc -l
git log --format='%aN' | sort -u | wc -l  # contributor count

# Find TODOs and gaps
grep -r "TODO\|FIXME\|HACK" \
  --include="*.ts" --include="*.py" \
  . 2>/dev/null | head -30
```

### Documentation Extraction

```bash
# Read README sections
cat README.md | grep -A 10 "## Features"
cat README.md | grep -A 5 "## Installation"

# Package metadata
cat package.json | jq -r '.description, .keywords'
cat pyproject.toml | grep -A 5 "\[tool.poetry\]"
```

### Dependency Analysis

```bash
# Node.js dependencies
cat package.json | jq -r '.dependencies | keys[]' | head -10

# Python dependencies
cat requirements.txt pyproject.toml 2>/dev/null | grep -v "^#"

# Check for external services
grep -r "API_KEY\|ENDPOINT\|SERVICE_URL" \
  --include="*.env.example" \
  --include="*.md" . 2>/dev/null
```

---

## JSON Schema

The skill produces this validated structure:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["project_name", "target_audience", "product_vision"],
  "properties": {
    "project_name": {
      "type": "string",
      "description": "Name from README or package.json"
    },
    "project_type": {
      "type": "string",
      "enum": ["web-app", "mobile-app", "cli", "library", "api", "desktop-app", "other"]
    },
    "tech_stack": {
      "type": "object",
      "required": ["primary_language"],
      "properties": {
        "primary_language": {"type": "string"},
        "frameworks": {"type": "array", "items": {"type": "string"}},
        "key_dependencies": {"type": "array", "items": {"type": "string"}}
      }
    },
    "target_audience": {
      "type": "object",
      "required": ["primary_persona"],
      "properties": {
        "primary_persona": {"type": "string"},
        "secondary_personas": {"type": "array", "items": {"type": "string"}},
        "pain_points": {"type": "array", "items": {"type": "string"}},
        "goals": {"type": "array", "items": {"type": "string"}},
        "usage_context": {"type": "string"}
      }
    },
    "product_vision": {
      "type": "object",
      "required": ["one_liner"],
      "properties": {
        "one_liner": {"type": "string"},
        "problem_statement": {"type": "string"},
        "value_proposition": {"type": "string"},
        "success_metrics": {"type": "array", "items": {"type": "string"}}
      }
    },
    "current_state": {
      "type": "object",
      "properties": {
        "maturity": {
          "type": "string",
          "enum": ["idea", "prototype", "mvp", "growth", "mature"]
        },
        "existing_features": {"type": "array", "items": {"type": "string"}},
        "known_gaps": {"type": "array", "items": {"type": "string"}},
        "technical_debt": {"type": "array", "items": {"type": "string"}}
      }
    },
    "competitive_context": {
      "type": "object",
      "properties": {
        "alternatives": {"type": "array", "items": {"type": "string"}},
        "differentiators": {"type": "array", "items": {"type": "string"}},
        "market_position": {"type": "string"},
        "competitor_pain_points": {"type": "array", "items": {"type": "string"}},
        "competitor_analysis_available": {"type": "boolean"}
      }
    },
    "constraints": {
      "type": "object",
      "properties": {
        "technical": {"type": "array", "items": {"type": "string"}},
        "resources": {"type": "array", "items": {"type": "string"}},
        "dependencies": {"type": "array", "items": {"type": "string"}}
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

---

## Validation Checklist

Before finalizing discovery output:

- [ ] Valid JSON syntax (no trailing commas)
- [ ] `project_name` is present and non-empty
- [ ] `target_audience.primary_persona` is defined
- [ ] `product_vision.one_liner` is present
- [ ] All arrays contain at least one meaningful item (or empty array)
- [ ] Maturity level matches evidence (file count, tests, git activity)
- [ ] Tech stack reflects actual dependencies
- [ ] Pain points are specific, not generic
- [ ] Differentiators are evidence-based
- [ ] Constraints are realistic

---

## Examples

### Example 1: CLI Tool Discovery

**Input**: Project with Python CLI structure

**Output Excerpt**:
```json
{
  "project_name": "DevOps Deployer",
  "project_type": "cli",
  "tech_stack": {
    "primary_language": "Python",
    "frameworks": ["Click", "Rich"],
    "key_dependencies": ["boto3", "paramiko", "PyYAML"]
  },
  "target_audience": {
    "primary_persona": "DevOps engineers deploying to multiple cloud providers",
    "pain_points": [
      "Manual deployment steps error-prone",
      "No unified interface for AWS, GCP, Azure",
      "Difficult to track deployment history"
    ],
    "goals": [
      "Automate multi-cloud deployments",
      "Reduce deployment time from hours to minutes",
      "Ensure consistent configuration across environments"
    ]
  },
  "current_state": {
    "maturity": "mvp",
    "existing_features": [
      "AWS deployment",
      "Configuration validation",
      "Rollback support"
    ],
    "known_gaps": [
      "GCP and Azure support (marked TODO)",
      "No deployment notifications",
      "Missing deployment analytics"
    ]
  }
}
```

---

### Example 2: Web App with Competitor Analysis

**Input**: React web app with `competitor_analysis.json`

**Output Excerpt**:
```json
{
  "project_name": "TaskFlow",
  "project_type": "web-app",
  "target_audience": {
    "primary_persona": "Remote teams needing async task management",
    "pain_points": [
      "Synchronous tools require real-time presence",
      "Context switching between multiple tools",
      "Difficult to visualize dependencies across time zones"
    ]
  },
  "competitive_context": {
    "alternatives": ["Asana", "Monday.com", "Linear"],
    "differentiators": [
      "Async-first design (no real-time sync required)",
      "Built-in timezone awareness",
      "Dependency visualization across distributed teams"
    ],
    "competitor_pain_points": [
      "Asana users complain about notification overload",
      "Monday.com lacks offline support",
      "Linear pricing prohibitive for small teams"
    ],
    "competitor_analysis_available": true
  }
}
```

---

## Error Recovery

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid JSON syntax | Trailing comma, unquoted keys | Re-parse with JSON linter |
| Missing required fields | Incomplete inference | Re-read README and package files |
| Empty arrays for critical fields | Insufficient analysis | Search code comments and docs |
| Generic/placeholder values | Lazy inference | Perform deeper code analysis |

### Retry Strategy

```yaml
max_retries: 3
validation_on_each_attempt: true
incremental_improvement: required
```

**On Retry**:
1. Read previous attempt output
2. Identify validation failures
3. Re-analyze missing/weak sections
4. Regenerate with improved inferences

---

## Integration with Other Skills

### Upstream Dependencies
- **None**: Discovery is the first skill in roadmap workflow

### Downstream Consumers
- **subtask-planning**: Uses audience and constraints for feature scoping
- **Feature Generation**: Requires vision and pain points
- **Phase Planning**: Depends on maturity and existing features

### Parallel Skills
- **Competitor Analysis**: Optional enhancement (merges into discovery)
- **Complexity Assessment**: Uses maturity level for risk calculation

---

## Performance Characteristics

- **Execution Time**: 5-10 minutes (full discovery)
- **File Reads**: 10-50 (README, package files, sample code)
- **Bash Commands**: ~15 (analysis, counting, searching)
- **Retries**: Max 3 attempts
- **Success Rate**: >95% (with valid project structure)

---

## Best Practices

### For Agents Using This Skill

1. **Read First, Infer Second**: Exhaust all available documentation before making assumptions
2. **Specific Over Generic**: "Junior developers learning React" > "Developers"
3. **Evidence-Based**: Link inferences to specific files/patterns
4. **Honest About Gaps**: Empty array better than guessed data
5. **Incorporate External Data**: Always merge `competitor_analysis.json` if available

### For Orchestrators

1. **Sequential Execution**: Run discovery before feature generation
2. **Validate Output**: Check required fields before proceeding
3. **Retry Logic**: Allow 3 attempts with incremental improvement
4. **Cache Results**: Save discovery JSON for future reference
5. **Optional Enhancement**: Offer competitor analysis as pre-step

---

## Related Resources

### Bundled References
- [Discovery JSON Schema](./references/discovery-schema.json)
- [Maturity Level Guide](./references/maturity-levels.md)
- [Inference Patterns](./references/inference-patterns.md)

### External Documentation
- Auto-Claude: `apps/backend/prompts/roadmap_discovery.md`
- Agent Definition: [roadmap-discovery.agent.md](../../agents/roadmap-discovery.agent.md)

---

## License

Apache-2.0

---

## Changelog

- **v1.0.0** (2024-01-XX): Initial release with 4 workflows

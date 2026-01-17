# Roadmap Discovery Agent - Implementation Summary

## Overview

Successfully integrated **Auto-Claude's Roadmap Discovery Agent** into the agentic_migration project structure. This agent performs autonomous project analysis to understand purpose, target audience, competitive positioning, and strategic constraints—laying the foundation for data-driven roadmap generation.

**Date**: 2024-01-XX  
**Based On**: [Auto-Claude](https://github.com/AndyMik90/Auto-Claude) `apps/backend/prompts/roadmap_discovery.md`

---

## What Was Created

### 1. Roadmap Discovery Agent Definition

**File**: [.github/agents/roadmap-discovery.agent.md](../../.github/agents/roadmap-discovery.agent.md)

**Key Characteristics**:
- **Non-Interactive Execution**: Cannot ask questions, must infer from code
- **Autonomous Analysis**: 7-phase workflow (Load → Purpose → Audience → State → Competition → Constraints → JSON)
- **Structured Output**: `roadmap_discovery.json` with validated schema
- **Integration**: Feeds into Roadmap Features Agent for strategic planning

**Metadata**:
```yaml
agent_id: roadmap-discovery-v1
agent_type: discovery
priority: 0  # Runs before planning
trigger: manual | before_roadmap_generation
next_agent: roadmap-features
isolation: strict  # Cannot generate features or implement code
skills:
  - project-discovery
execution_mode: non-interactive
```

---

### 2. Project Discovery Skill

**File**: [.github/skills/project-discovery/SKILL.md](../../.github/skills/project-discovery/SKILL.md)

**Workflows**:

1. **Full Project Discovery** (5-10 minutes)
   - 7 phases: context loading → purpose → audience → state → competition → constraints → JSON
   - Output: Complete `roadmap_discovery.json`

2. **Quick Discovery** (1-2 minutes)
   - Metadata only: name, type, tech_stack
   - Fast project profiling

3. **Competitive Context Discovery**
   - Merges `competitor_analysis.json` data
   - Enriches competitive insights

4. **State Re-assessment**
   - Updates maturity and features
   - Progress tracking

**Bundled Resources**:
- `references/maturity-levels.md` - Guide for assessing project maturity (idea → mature)
- `references/discovery-schema.json` - JSON Schema for output validation
- `references/inference-patterns.md` - Patterns for non-interactive inference
- `LICENSE.txt` - Apache 2.0

---

### 3. Roadmap Discovery Prompt Template

**File**: [.github/prompts/roadmap_discovery.md](../../.github/prompts/roadmap_discovery.md)

**Structure**:
- **YOUR ROLE**: Agent identity and non-interactive constraint
- **YOUR CONTRACT**: Input/output specification with exact JSON schema
- **PHASE 0-6**: Step-by-step autonomous workflow
- **VALIDATION**: Required field checks
- **CRITICAL RULES**: Non-negotiable constraints
- **ERROR RECOVERY**: Retry and fix strategies

**Key Features**:
- Bash commands for codebase analysis
- Inference guidelines for missing data
- Integration with `competitor_analysis.json`
- Mandatory JSON creation with validation

---

## Discovery Workflow

The agent executes 7 sequential phases autonomously:

### Phase 0: Load Project Context
```bash
cat project_index.json
cat README.md
cat package.json pyproject.toml Cargo.toml
cat competitor_analysis.json 2>/dev/null
```

### Phase 1: Understand Project Purpose
- Determine project type (web-app, CLI, library, etc.)
- Extract value proposition from README
- Infer target users from documentation

### Phase 2: Discover Target Audience
- Define primary persona: "[Role] who [context] to [goal]"
- Identify pain points from problem statements
- Extract goals from feature descriptions

### Phase 3: Assess Current State
```bash
find . -type f -name "*.ts" | wc -l  # File count
git log --oneline | wc -l  # Commit history
grep -r "TODO\|FIXME" . | head -20  # Known gaps
```
- Maturity: idea → prototype → mvp → growth → mature
- Existing features from code analysis
- Technical debt from TODOs/FIXMEs

### Phase 4: Infer Competitive Context
- Check for `competitor_analysis.json`
- Identify alternatives from README
- Extract differentiators

### Phase 5: Identify Constraints
- Technical: Dependencies, platform limits
- Resources: Team size from git contributors
- Dependencies: External services/APIs

### Phase 6: Create Discovery JSON
- Synthesize all findings
- Validate required fields
- Write `roadmap_discovery.json`

---

## Output Schema

The agent produces this validated structure:

```json
{
  "project_name": "string",
  "project_type": "web-app|mobile-app|cli|library|api|desktop-app|other",
  "tech_stack": {
    "primary_language": "string",
    "frameworks": ["string"],
    "key_dependencies": ["string"]
  },
  "target_audience": {
    "primary_persona": "string",
    "secondary_personas": ["string"],
    "pain_points": ["string"],
    "goals": ["string"],
    "usage_context": "string"
  },
  "product_vision": {
    "one_liner": "string",
    "problem_statement": "string",
    "value_proposition": "string",
    "success_metrics": ["string"]
  },
  "current_state": {
    "maturity": "idea|prototype|mvp|growth|mature",
    "existing_features": ["string"],
    "known_gaps": ["string"],
    "technical_debt": ["string"]
  },
  "competitive_context": {
    "alternatives": ["string"],
    "differentiators": ["string"],
    "market_position": "string",
    "competitor_pain_points": ["string"],
    "competitor_analysis_available": boolean
  },
  "constraints": {
    "technical": ["string"],
    "resources": ["string"],
    "dependencies": ["string"]
  },
  "created_at": "ISO8601 timestamp"
}
```

**Required Fields**:
- `project_name`
- `target_audience.primary_persona`
- `product_vision.one_liner`

---

## Inference Guidelines

### Non-Interactive Constraint

The agent **CANNOT**:
- Ask questions
- Wait for user input
- Request clarification

The agent **MUST**:
- Make educated inferences from available data
- Use domain knowledge to fill gaps
- Complete within MAX_RETRIES (3 attempts)

### Inference Patterns

**Project Type**:
- React/Vue + Express → `web-app`
- Click/argparse → `cli`
- No main executable → `library`

**Target Audience**:
- Extract from README: "For [audience]...", "Designed for..."
- Infer from features: Who benefits?
- Format: "[Role] who [context] to [goal]"

**Maturity Level**:
- < 50 files, < 20 commits → `idea`
- < 200 files, minimal tests → `prototype`
- Core features working, some tests → `mvp`
- Active development, > 500 commits → `growth`
- Comprehensive tests, > 2000 commits → `mature`

**Pain Points**:
- Search README for: "problem", "challenge", "difficult", "manually"
- Extract from TODOs
- Identify from competitive comparisons

**Differentiators**:
- README: "unlike", "unique", "first", "only"
- Feature highlights
- Architecture choices

---

## Integration Points

### Input from Upstream
- `project_index.json` (from project analysis phase)
- `competitor_analysis.json` (optional, from competitor analysis agent)

### Output to Downstream
- `roadmap_discovery.json` → **Roadmap Features Agent**
- Used by: Feature generation, prioritization, phase planning

### Related Agents
- **Upstream**: Project Index Generator, Competitor Analysis Agent (optional)
- **Downstream**: Roadmap Features Agent, Roadmap Phase Planner
- **Parallel**: None (sequential execution required)

---

## Validation Rules

Before completing, the output must pass:

1. ✅ Valid JSON syntax (no trailing commas)
2. ✅ Contains `project_name` (required)
3. ✅ Contains `target_audience.primary_persona` (required)
4. ✅ Contains `product_vision.one_liner` (required)
5. ✅ All fields use educated inferences (no "Unknown" placeholders)

### Retry Strategy
- **MAX_RETRIES**: 3 attempts
- **Validation**: JSON syntax and required fields
- **Recovery**: Re-read context and regenerate

---

## Documentation Updates

Updated the following files to integrate the roadmap discovery agent:

1. **[.github/skills/README.md](../../.github/skills/README.md)**
   - Added project-discovery to Available Skills table

2. **[.github/skills/QUICKREF.md](../../.github/skills/QUICKREF.md)**
   - Added project-discovery to examples

3. **[.instructions.md](../../.instructions.md)**
   - Added roadmap-discovery agent and project-discovery skill references

4. **[.github/copilot-instructions.md](../../.github/copilot-instructions.md)**
   - Updated agents and skills lists

5. **[README.md](../../README.md)**
   - Added Roadmap Discovery Agent section
   - Updated project structure with new files
   - Added skill and agent file references

---

## Usage Example

```bash
# Triggered before roadmap generation
roadmap_orchestrator.py --project /path/to/project

# Agent executes:
# 1. Loads project_index.json
# 2. Analyzes README, package files, code
# 3. Infers audience, vision, constraints
# 4. Creates roadmap_discovery.json
# 5. Validates output
# 6. Returns success/failure
```

### Example Output

For a CLI deployment tool:

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
      "Reduce deployment time from hours to minutes"
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
      "No deployment notifications"
    ]
  }
}
```

---

## Design Decisions

### 1. Non-Interactive Execution

**Rationale**: Roadmap generation must be autonomous for CI/CD integration. Agents can't block on user input.

**Implementation**: Inference guidelines, bash commands, domain knowledge

### 2. Competitor Analysis Integration

**Rationale**: Market research enhances roadmap quality with real pain points and differentiators.

**Implementation**: Optional `competitor_analysis.json` merge, `competitor_analysis_available` flag

### 3. Progressive Skill Loading

**Rationale**: Discovery skill has extensive reference materials (maturity levels, inference patterns) that shouldn't load unless needed.

**Implementation**: Bundled references in `references/` folder, loaded on-demand

### 4. Validated Schema

**Rationale**: Downstream agents depend on structured, valid JSON. Missing required fields cause failures.

**Implementation**: JSON Schema in `references/discovery-schema.json`, validation before completion

---

## Comparison with Auto-Claude

| Aspect | Auto-Claude | agentic_migration |
|--------|-------------|-------------------|
| **Structure** | Single prompt file | Agent + Skill + Prompt |
| **Reusability** | Prompt-specific | Portable skill |
| **Documentation** | Inline comments | Bundled references |
| **Integration** | Hardcoded paths | Configurable paths |
| **Resources** | None | Maturity guide, inference patterns, schema |
| **Discovery** | N/A (embedded in prompt) | Auto-discovery via keywords |

**Advantage**: The skill-based approach makes discovery workflows reusable across projects and agents.

---

## Future Enhancements

### Potential Additions

1. **Competitor Analysis Agent**
   - Researches competitors and user feedback
   - Creates `competitor_analysis.json`
   - Feeds into discovery agent

2. **Roadmap Features Agent**
   - Consumes `roadmap_discovery.json`
   - Generates prioritized feature list
   - Creates `roadmap.json`

3. **Roadmap Phase Planner**
   - Organizes features into phases
   - Creates implementation timeline

4. **Enhanced Inference**
   - Machine learning for maturity prediction
   - Automated competitor discovery via web search
   - Sentiment analysis of GitHub issues

---

## References

- **Auto-Claude**: [https://github.com/AndyMik90/Auto-Claude](https://github.com/AndyMik90/Auto-Claude)
- **Agent Skills Spec**: [https://agentskills.io/specification](https://agentskills.io/specification)
- **Agent Definition**: [.github/agents/roadmap-discovery.agent.md](../../.github/agents/roadmap-discovery.agent.md)
- **Project Discovery Skill**: [.github/skills/project-discovery/SKILL.md](../../.github/skills/project-discovery/SKILL.md)
- **Discovery Prompt**: [.github/prompts/roadmap_discovery.md](../../.github/prompts/roadmap_discovery.md)

---

## Lessons Learned

1. **Non-Interactive Design is Critical**: Roadmap generation for CI/CD requires zero user interaction
2. **Inference Requires Domain Knowledge**: Maturity, audience, and pain points need intelligent guessing
3. **Bash Commands are Essential**: File counting, git stats, and grep provide objective data
4. **Competitor Analysis Enhances Quality**: Real pain points > generic assumptions
5. **Schema Validation Prevents Failures**: Downstream agents need guaranteed structure
6. **Skills Enable Reusability**: Discovery workflows portable across projects

---

## Success Metrics

✅ **Complete Integration**
- Agent definition created
- Skill with 4 workflows implemented
- Prompt template with 7 phases
- Bundled references (maturity, inference, schema)

✅ **Documentation Updated**
- All README files updated
- Skills catalog refreshed
- Root instructions index updated

✅ **Framework Compliance**
- Follows Agent Skills specification
- Progressive loading architecture
- Portable and reusable design

✅ **Auto-Claude Parity**
- All 7 phases implemented
- Non-interactive execution preserved
- Competitor analysis integration maintained

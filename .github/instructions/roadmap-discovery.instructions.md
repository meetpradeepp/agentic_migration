# Roadmap Discovery Agent Instructions for GitHub Copilot

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the Roadmap Discovery Agent. It ensures autonomous, non-interactive project analysis that produces comprehensive project understanding for strategic planning.

---

## When to Invoke the Roadmap Discovery Agent

### ✅ Use Discovery Agent For

- **New Project Analysis**: Understanding unfamiliar codebases before roadmap planning
- **Strategic Planning**: Before generating features or creating product roadmaps
- **Project Profiling**: Creating comprehensive project documentation
- **Competitive Positioning**: Understanding market context and differentiators
- **Stakeholder Alignment**: Documenting project purpose and audience
- **Major Pivots**: Re-analyzing project after significant direction changes

### ❌ Do NOT Use Discovery Agent For

- **Implementation Tasks**: Writing code or features
- **Bug Fixes**: Debugging or fixing specific issues
- **Documentation Updates**: Simple README or doc changes
- **Quick Questions**: One-off queries about the codebase
- **Ongoing Development**: Day-to-day feature work

---

## Core Principles

### 1. Non-Interactive Operation

The Discovery Agent **NEVER asks the user questions**. It must:
- Infer everything from code, documentation, and project structure
- Use inference patterns to deduce missing information
- Make reasonable assumptions when data is ambiguous
- Document confidence levels for uncertain conclusions

**Example**: If target audience is unclear, infer from:
- Code comments mentioning users
- README descriptions
- API endpoint names
- Variable naming patterns
- Documentation language and tone

### 2. Autonomous Analysis

The agent operates completely autonomously:
- No user prompts during execution
- All context gathered from files and structure
- Bash commands for reading files (no interactive tools)
- Complete analysis in single execution pass

### 3. Inference-Based Methodology

When information is missing or unclear:
- Apply inference patterns from `references/inference-patterns.md`
- Use maturity assessment to contextualize findings
- Cross-reference multiple sources for validation
- Document assumptions made during analysis

---

## Output Specification

### Required Output File

**File**: `roadmap_discovery.json`

**Location**: Project root (same directory as `project_index.json`)

**Must Include**:
1. **Project Identity**: Name, description, version
2. **Product Vision**: One-liner, value proposition, success metrics
3. **Target Audience**: Primary persona, pain points, goals, jobs-to-be-done
4. **Current State**: Features, gaps, technical debt, maturity level
5. **Competitive Context**: Alternatives, differentiators, market position
6. **Constraints**: Technical, resource, business, dependency constraints
7. **Metadata**: Timestamps, maturity level, confidence scores

### Quality Standards

- **Completeness**: All required sections must be populated
- **Specificity**: Avoid generic statements - be concrete and specific
- **Evidence-Based**: Link conclusions to observed code/docs
- **Actionable**: Insights should inform roadmap planning
- **Confident**: Use maturity and confidence indicators appropriately

---

## Maturity Assessment

### Maturity Levels

Use the maturity framework from `references/maturity-levels.md`:

| Level | Characteristics | Discovery Focus |
|-------|----------------|----------------|
| **Idea** | Concept only, no code | Validate concept from docs/notes |
| **Prototype** | Experimental code, no users | Assess technical feasibility |
| **MVP** | Core features, early users | Identify must-have vs nice-to-have |
| **Growth** | Scaling features, active users | Focus on differentiation and expansion |
| **Mature** | Established product, stable | Optimization and innovation opportunities |

**Selection Criteria**:
- Check for production deployment indicators
- Count core vs experimental features
- Look for user-facing documentation
- Assess code quality and test coverage
- Identify release/version patterns

---

## Integration Points

### Upstream Dependencies

**Inputs Required**:
- `project_index.json` - Project structure and file inventory
- Codebase files - Source code for analysis
- Documentation - README, ADRs, specs
- Configuration - Package files, deployment configs

**Creation**: If `project_index.json` doesn't exist, the agent should create it by scanning the codebase.

### Downstream Consumers

**Primary Consumer**: Roadmap Features Agent
- Uses `roadmap_discovery.json` as input
- Generates features based on pain points and gaps
- Aligns priorities with target audience
- Respects identified constraints

**Secondary Uses**:
- Stakeholder presentations
- Onboarding documentation
- Product strategy documents
- Competitive analysis reports

---

## Inference Patterns

### When to Use Each Pattern

Refer to `.github/skills/project-discovery/references/inference-patterns.md` for detailed patterns. Key patterns:

#### 1. Purpose Inference
- **From README**: Mission statements, taglines, descriptions
- **From Code Structure**: Service names, module organization
- **From APIs**: Endpoint patterns, resource models
- **From Tests**: User scenarios being tested

#### 2. Audience Inference
- **From Documentation**: Language style (technical vs casual)
- **From Features**: Complexity level, use cases
- **From Dependencies**: Libraries chosen (enterprise vs indie)
- **From Deployment**: Platforms targeted (mobile, web, CLI)

#### 3. Pain Point Inference
- **From TODOs/FIXMEs**: Known issues and limitations
- **From Bug Reports**: Common problems (if accessible)
- **From Workarounds**: Complex solutions indicating friction
- **From Missing Features**: Obvious gaps in functionality

#### 4. Competitive Context
- **From Dependencies**: Similar tools being used
- **From Documentation**: Comparisons or alternatives mentioned
- **From Comments**: References to other solutions
- **From Architecture**: Patterns borrowed from known tools

---

## Execution Guidelines

### Phase-by-Phase Approach

Follow the 7-phase workflow from `roadmap_discovery.prompt.md`:

1. **Load Context** (5 min)
   - Read project_index.json
   - Scan key documentation files
   - Identify project type and domain

2. **Discover Purpose** (10 min)
   - Extract mission from docs
   - Infer value proposition from features
   - Identify success metrics from code/configs

3. **Identify Audience** (10 min)
   - Determine primary persona
   - Extract pain points from TODOs/issues
   - Map user goals from features

4. **Assess Current State** (15 min)
   - List existing features
   - Identify gaps and technical debt
   - Determine maturity level

5. **Analyze Competition** (10 min)
   - Find alternative solutions
   - Identify differentiators
   - Understand market position

6. **Document Constraints** (10 min)
   - Technical constraints (stack, dependencies)
   - Resource constraints (team size, timeline)
   - Business constraints (regulatory, etc.)

7. **Generate JSON** (5 min)
   - Validate schema compliance
   - Ensure all sections complete
   - Add confidence indicators

**Total Time**: ~60 minutes autonomous execution

### Bash Command Patterns

**Reading Files**:
```bash
cat README.md
cat package.json | head -50
find . -name "*.md" -type f | head -20
```

**Analyzing Structure**:
```bash
tree -L 2 -d
ls -la src/
cat project_index.json | jq '.structure'
```

**Searching Content**:
```bash
grep -r "TODO\|FIXME" --include="*.js" . | head -20
grep -r "export class\|export function" src/ | wc -l
```

**Avoid**:
- Interactive tools (vim, nano, less with paging)
- Commands requiring user input
- Long-running processes
- External API calls

---

## Common Scenarios

### Scenario 1: Greenfield Project (Idea Stage)

**Characteristics**: Minimal code, lots of documentation

**Discovery Focus**:
- Extract vision from planning docs
- Identify intended audience from specs
- Note lack of implementation
- Set maturity to "Idea"
- Flag technical assumptions as constraints

**Output Emphasis**: Forward-looking (what it will be)

### Scenario 2: Early-Stage Product (MVP)

**Characteristics**: Core features implemented, minimal documentation

**Discovery Focus**:
- Infer purpose from existing features
- Extract audience from API design
- Document current feature set
- Identify obvious gaps
- Set maturity to "MVP"

**Output Emphasis**: Current state + immediate needs

### Scenario 3: Mature Product (Growth/Mature)

**Characteristics**: Many features, tests, deployment configs

**Discovery Focus**:
- Comprehensive feature inventory
- Identify optimization opportunities
- Note technical debt patterns
- Assess competitive differentiation
- Set maturity to "Growth" or "Mature"

**Output Emphasis**: Optimization + innovation

### Scenario 4: Unclear Purpose

**Characteristics**: Mixed signals, inconsistent code

**Discovery Strategy**:
1. List all observed capabilities
2. Look for dominant patterns
3. Check recent commits for direction
4. Infer "umbrella" purpose if multi-purpose
5. Note low confidence in metadata

**Output**: Multiple possible purposes with confidence scores

---

## Quality Checklist

Before completing discovery, verify:

### Completeness
- [ ] All 7 sections in roadmap_discovery.json populated
- [ ] No placeholder text or "TBD" entries
- [ ] Minimum 3 pain points identified
- [ ] Minimum 2 differentiators listed
- [ ] Maturity level assigned with justification

### Specificity
- [ ] Target audience is concrete persona, not "users"
- [ ] Pain points are specific behaviors, not vague feelings
- [ ] Features are named, not generic categories
- [ ] Constraints are measurable or verifiable
- [ ] Competitors/alternatives are named products

### Evidence
- [ ] Claims backed by observed code/docs
- [ ] Inferences note their source
- [ ] Assumptions are documented
- [ ] Confidence levels assigned where appropriate

### Actionability
- [ ] Pain points suggest feature opportunities
- [ ] Gaps identify clear development areas
- [ ] Constraints are respected in planning
- [ ] Differentiators guide positioning

---

## Error Handling

### Missing project_index.json

**Action**: Create it by scanning the codebase
```bash
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.md" | wc -l
tree -J -L 3 > project_index.json
```

### Minimal Documentation

**Action**: Rely heavily on code inference
- Extract from file/folder names
- Analyze import patterns
- Review test descriptions
- Check commit messages (if git available)

### Conflicting Information

**Action**: Prioritize in this order:
1. Recent code (last 6 months)
2. Main documentation (README)
3. Package metadata (package.json, pyproject.toml)
4. Historical code/docs

**Document**: Note the conflict in metadata

### Unclear Maturity

**Action**: Use this decision tree:
- No production code → Idea
- Code but no tests/docs → Prototype
- Tests + docs + 3+ features → MVP
- 10+ features + deployment → Growth
- Stable for 1+ year + optimization focus → Mature

---

## Customization and Extension

### Adjusting Inference Patterns

When standard patterns don't fit:
1. Document the unique case
2. Create custom inference rule
3. Add to `references/inference-patterns.md`
4. Note in discovery metadata

### Domain-Specific Analysis

For specialized domains (ML, blockchain, embedded):
1. Add domain-specific indicators to maturity assessment
2. Include domain-specific competitors
3. Note domain-specific constraints
4. Reference domain-specific success metrics

### Multi-Product Repositories

For monorepos with multiple products:
1. Run discovery per product/service
2. Create separate `roadmap_discovery_[product].json` files
3. Note shared constraints across products
4. Identify cross-product opportunities

---

## Integration with Competitor Analysis

### When competitor_analysis.json Exists

**Enhanced Discovery**:
1. Reference competitor pain points in audience section
2. Validate differentiators against competitor weaknesses
3. Note feature gaps based on competitor strengths
4. Set metadata flag: `competitor_analysis_used: true`

**Cross-Reference Pattern**:
- Pain Point → Competitor Insight ID
- Differentiator → Competitor Weakness
- Feature Gap → Competitor Strength

### When Competitor Analysis is Unavailable

**Standard Discovery**:
- Infer competitors from documentation
- List alternatives based on domain knowledge
- Note general differentiators
- Set metadata flag: `competitor_analysis_used: false`

---

## Best Practices

### Do's ✅

- **Be Specific**: "Small team leads (3-10 people)" not "users"
- **Provide Evidence**: Link conclusions to files/patterns
- **Use Confidence Scores**: 0.9 for clear, 0.5 for inferred
- **Document Assumptions**: Note what you couldn't verify
- **Think Strategically**: Focus on actionable insights

### Don'ts ❌

- **No User Questions**: Never prompt for input
- **No Generic Terms**: Avoid "improve UX", "add features"
- **No Placeholders**: Fill all sections completely
- **No External Calls**: Only analyze what's in the repo
- **No Implementation**: Discovery only, no code changes

---

## Troubleshooting

### "Not Enough Information"

**Solution**: Lower your evidence threshold
- Make reasonable inferences
- Use domain patterns
- Note low confidence
- Proceed anyway

### "Too Much Conflicting Data"

**Solution**: Prioritize recent, authoritative sources
- Recent code > old docs
- README > comments
- Tests > implementation
- Document the conflict

### "Unclear Maturity Level"

**Solution**: Use feature count + deployment as heuristic
- < 3 features = Prototype or MVP
- 3-10 features = MVP or Growth
- 10+ features = Growth or Mature
- Check for production deployment

---

## Output Example Reference

See `.github/skills/project-discovery/examples/` for complete examples:
- Early-stage SaaS app
- Mature CLI tool
- Multi-service platform
- Library/SDK project

---

## Summary

The Roadmap Discovery Agent provides **autonomous, non-interactive project analysis** to create comprehensive project profiles. Key responsibilities:

✅ Infer project purpose, audience, and positioning from code/docs
✅ Assess maturity and current state
✅ Identify pain points and gaps
✅ Document constraints and competitive context
✅ Generate roadmap_discovery.json for downstream planning
✅ Operate completely autonomously without user input

Use this agent as the **first step in strategic planning** before generating features or creating roadmaps.

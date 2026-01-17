# Roadmap Features Agent Instructions for GitHub Copilot

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the Roadmap Features Agent. It ensures strategic, well-prioritized feature roadmaps that balance user value with implementation feasibility.

---

## When to Invoke the Roadmap Features Agent

### ✅ Use Features Agent For

- **Strategic Planning**: Creating product roadmaps for new initiatives
- **Feature Prioritization**: Deciding what to build and when
- **Phase Organization**: Structuring features into logical execution phases
- **Stakeholder Alignment**: Creating shareable roadmap artifacts
- **Post-Discovery Planning**: After running Roadmap Discovery Agent
- **Major Releases**: Planning feature sets for significant versions

### ❌ Do NOT Use Features Agent For

- **Implementation Tasks**: Writing code or technical specs
- **Bug Prioritization**: Use bug triage process instead
- **Single Features**: Just plan individual features directly
- **Operational Tasks**: DevOps, monitoring, maintenance work
- **Quick Decisions**: Day-to-day development choices

---

## Core Principles

### 1. Ruthless Prioritization

**Not everything can be "Must Have"**:
- Force hard choices using MoSCoW framework
- Challenge every "Must Have" - is it truly required for MVP?
- Aim for target distributions (20-30% Must, 30-40% Should, 30-40% Could)
- Document "Won't Have" explicitly to manage expectations

**Example of Good Prioritization**:
```
Must Have (3 features):
- User authentication
- Core task creation
- Basic task viewing

Should Have (5 features):
- Task assignment
- Due dates
- Filtering

Could Have (4 features):
- Dark mode
- Keyboard shortcuts
- Export to CSV

Won't Have (2 features):
- Mobile app
- AI suggestions
```

### 2. User-Centric Features

**Every feature must have clear user value**:
- Include rationale explaining why it matters
- Write user stories in "As a [persona], I want [action] so that [benefit]" format
- Connect features to pain points from discovery
- Validate impact claims with evidence

**Bad Rationale**: "This would be cool to have"
**Good Rationale**: "Users reported spending 30 minutes on deployments with manual process. One-command deployment reduces this to 5 minutes and eliminates common errors."

### 3. Evidence-Based Planning

**Ground features in discovery data**:
- Reference roadmap_discovery.json insights
- Link features to specific pain points
- Address known gaps from current state analysis
- Respect documented constraints
- Leverage competitor analysis when available

---

## Input Requirements

### Required Inputs

1. **roadmap_discovery.json** (Required)
   - Project understanding and context
   - Target audience and pain points
   - Current state and gaps
   - Competitive positioning
   - Constraints

2. **project_index.json** (Required)
   - Codebase structure
   - Technical context
   - Existing features inventory

3. **competitor_analysis.json** (Optional)
   - Competitor pain points
   - Market gaps
   - Differentiation opportunities

### Input Validation

Before starting, verify:
- [ ] roadmap_discovery.json exists and is valid JSON
- [ ] Contains target audience with pain points
- [ ] Contains product vision
- [ ] Contains current state with features/gaps
- [ ] project_index.json exists
- [ ] Competitor analysis noted if available

---

## Output Specification

### Required Output File

**File**: `roadmap.json`

**Location**: Project root (alongside discovery output)

**Must Include**:
1. **Metadata**: ID, project name, version, vision
2. **Target Audience**: Primary and secondary personas
3. **Phases**: At least 1 phase, typically 3-4
4. **Features**: Minimum 5 features, ideally 10-30
5. **Milestones**: Demonstrable checkpoints per phase
6. **Validation**: All features have required fields

### Schema Compliance

Refer to `.github/skills/feature-planning/references/roadmap-schema.json` for complete schema. Critical requirements:

**Phase Requirements**:
- Unique ID (phase-1, phase-2, etc.)
- Logical name (Foundation, Enhancement, Scale, Future)
- Clear description of phase goal
- Sequential ordering
- Feature IDs list
- Milestones array

**Feature Requirements**:
- Unique ID (feature-1, feature-2, etc.)
- Action-oriented title
- 2-3 sentence description
- Rationale (why it matters)
- MoSCoW priority (must/should/could/wont)
- Complexity (low/medium/high)
- Impact (low/medium/high)
- Phase assignment
- Dependencies array (can be empty)
- Acceptance criteria (2-5 items)
- User stories (1-3 items)

---

## MoSCoW Prioritization Framework

### Using MoSCoW Effectively

Reference `.github/skills/feature-planning/references/moscow-prioritization.md` for detailed framework. Key rules:

#### Must Have (20-30% of features)

**Criteria**:
- Product is unusable without it
- Addresses primary pain point
- Core workflow dependency
- Legal/regulatory requirement

**Test**: "Can we launch without this?" → If NO, it's Must Have

**Examples**:
- User authentication in SaaS app
- Payment processing in e-commerce
- Core create/read/update/delete operations

#### Should Have (30-40% of features)

**Criteria**:
- Significantly enhances experience
- Addresses secondary pain point
- Strong user demand
- Competitive differentiator

**Test**: "Will users complain loudly if missing?" → If YES, it's Should Have

**Examples**:
- Notifications
- Search functionality
- Mobile responsiveness

#### Could Have (30-40% of features)

**Criteria**:
- Nice-to-have improvement
- Addresses edge cases
- Polish features
- Low risk if deferred

**Test**: "Would most users notice if absent?" → If NO, it's Could Have

**Examples**:
- Dark mode
- Keyboard shortcuts
- Advanced filtering

#### Won't Have (5-10% of ideas)

**Criteria**:
- Out of current scope
- Low value vs effort
- Unclear demand
- Strategic misalignment

**Purpose**: Explicitly document what's NOT being built

**Examples**:
- Mobile app (when building web first)
- AI features (in simple MVP)
- Multi-language support (single market launch)

### Common Prioritization Mistakes

❌ **Too Many Must Haves**: Everything feels critical
- **Fix**: Ask "What's the absolute minimum to prove value?"

❌ **No Won't Haves**: Not explicitly de-scoping
- **Fix**: Document what you're NOT doing to manage expectations

❌ **Ignoring Dependencies**: Should Have depends on Won't Have
- **Fix**: Map dependencies first, then prioritize

---

## Priority Matrix (Impact vs Complexity)

### Quadrant Strategy

Reference `.github/skills/feature-planning/references/priority-matrix.md` for complete framework.

```
         High Impact
              │
    Big Bets  │  Quick Wins
              │
──────────────┼──────────────  High
              │              Complexity
    Time Sinks│  Fill-ins
              │
         Low Impact
```

#### Quick Wins (High Impact + Low Complexity)
**Strategy**: DO FIRST - Prioritize in Phase 1
**Characteristics**: 1-2 days work, addresses core pain point
**Example**: One-click task creation, configuration option enabling use case

#### Big Bets (High Impact + High Complexity)
**Strategy**: PLAN CAREFULLY - Include but phase properly
**Characteristics**: 1-2 weeks work, major differentiator
**Example**: Real-time collaboration, third-party integration

#### Fill-ins (Low Impact + Low Complexity)
**Strategy**: DO IF TIME - Use to fill sprint gaps
**Characteristics**: < 1 day work, polish features
**Example**: Dark mode, tooltip help, UI polish

#### Time Sinks (Low Impact + High Complexity)
**Strategy**: AVOID - Actively de-prioritize
**Characteristics**: > 1 week work, edge case or unclear value
**Example**: Over-engineered solutions, premature optimizations

### Assessment Criteria

**Impact Assessment** (High/Medium/Low):
- **High**: Addresses primary pain point, core workflow, drives key metric
- **Medium**: Improves experience, addresses secondary need
- **Low**: Edge case, cosmetic, unclear demand

**Complexity Assessment** (Low/Medium/High):
- **Low**: 1-3 files, simple component, < 2 days
- **Medium**: 3-10 files, integration work, 3-10 days
- **High**: 10+ files, architectural changes, > 10 days

---

## Phase Organization

### Standard Phase Progression

**Phase 1: Foundation / MVP**
- Must Have features only
- Quick Wins from priority matrix
- Core functionality
- Demonstrable value

**Phase 2: Enhancement**
- Should Have features
- User experience improvements
- Selected Big Bets
- Competitive differentiation

**Phase 3: Scale / Growth**
- Could Have features
- Performance optimizations
- Advanced functionality
- Market expansion

**Phase 4: Future / Vision**
- Long-term features
- Experimental ideas
- Won't Have (documented for later)

### Phase Design Principles

**Each Phase Should**:
- ✅ Deliver demonstrable value
- ✅ Be independently testable
- ✅ Build on previous phases
- ✅ Have clear success criteria
- ✅ Respect feature dependencies

**Avoid**:
- ❌ Phases with only low-impact features
- ❌ Circular dependencies between phases
- ❌ Phase 1 with > 10 features (too big)
- ❌ Unclear phase boundaries

---

## Feature Template Usage

### Writing Good Features

Reference `.github/skills/feature-planning/references/feature-template.md` for complete guidelines.

**Title**: Action-oriented, 3-10 words
- ✅ "One-Command Deployment"
- ❌ "Deployment" (not action-oriented)

**Description**: 2-3 sentences, user-focused
- ✅ "Deploy to staging/production with single command. Automatically runs pre-deployment checks..."
- ❌ "Refactor deployment service to use async/await" (implementation-focused)

**Rationale**: Why it matters for target audience
- ✅ "Eliminates 30-minute manual deployment that causes errors. Developers can ship 3x faster."
- ❌ "This would be nice to have" (vague)

**Acceptance Criteria**: Testable conditions (2-5)
- ✅ "Deployment completes in < 5 minutes", "Failed deployment triggers automatic rollback"
- ❌ "Feature works well", "Users like it" (not testable)

**User Stories**: As [persona], I want [action] so that [benefit]
- ✅ "As a backend engineer, I want to deploy with one command so that I can ship features faster"
- ❌ "Users want faster deployment" (not in user story format)

---

## Dependency Mapping

### Identifying Dependencies

**Feature A depends on Feature B if**:
- A requires B's functionality to work
- A modifies code that B creates
- A uses APIs that B introduces
- A relies on data structures B defines

### Managing Dependencies

**Rules**:
1. Features with dependencies go in later phases
2. No circular dependencies allowed
3. Document all dependencies in features array
4. Validate dependency chain is achievable

**Example**:
```json
{
  "id": "feature-5",
  "title": "Advanced Search",
  "dependencies": ["feature-2", "feature-3"],
  "phase_id": "phase-2"
}
```
→ Features 2 and 3 must be in Phase 1 or earlier

### Dependency Validation

Before finalizing roadmap:
- [ ] All dependency IDs reference valid features
- [ ] No circular dependencies (A → B → A)
- [ ] Dependencies respect phase ordering
- [ ] Blocking dependencies are in earlier phases

---

## Milestone Creation

### Good Milestones Are

**Demonstrable**: Can show to stakeholders
- ✅ "Users can create and save tasks"
- ❌ "Backend refactoring complete"

**Testable**: Can verify completion
- ✅ "Payment processing is live and tested"
- ❌ "Code quality improved"

**Valuable**: Deliver user value
- ✅ "Mobile app on App Store"
- ❌ "Database schema updated"

### Milestone Structure

Each milestone should:
- Represent 2-4 features grouped logically
- Mark a demonstrable checkpoint
- Enable feedback collection
- Show incremental progress

**Example**:
```json
{
  "id": "milestone-1-1",
  "title": "Core Task Management Live",
  "description": "Users can create, view, and complete tasks",
  "features": ["feature-1", "feature-2", "feature-3"],
  "status": "planned"
}
```

---

## Competitor Analysis Integration

### When competitor_analysis.json Available

**Enhanced Planning**:
1. **Prioritize Differentiation**: Features addressing competitor pain points → High Priority
2. **Link Features**: Use `competitor_insight_ids` field
3. **Fill Market Gaps**: Features absent in competitors → Opportunity
4. **Note in Metadata**: Set `competitor_analysis_used: true`

**Feature Example with Competitor Integration**:
```json
{
  "id": "feature-1",
  "title": "Simple Task Creation",
  "rationale": "Competitor users frustrated by 8-10 field forms (per competitor analysis pain-point-asana-1). Our 2-field approach addresses this directly.",
  "competitor_insight_ids": ["pain-point-asana-1", "pain-point-jira-3"],
  "priority": "must",
  "impact": "high"
}
```

### Without Competitor Analysis

**Standard Planning**:
- Focus on discovery pain points
- Infer competitive positioning from discovery
- Note general differentiators
- Set `competitor_analysis_used: false`

---

## Validation and Quality Checks

### Pre-Generation Validation

Before generating roadmap.json:
- [ ] roadmap_discovery.json loaded successfully
- [ ] Target audience and pain points identified
- [ ] Product vision understood
- [ ] Constraints documented

### Post-Generation Validation

After creating roadmap.json:
- [ ] Valid JSON syntax
- [ ] Minimum 1 phase defined
- [ ] Minimum 5 features (ideally 10-30)
- [ ] All features have required fields
- [ ] MoSCoW distribution reasonable (not 80% Must Have)
- [ ] All feature IDs in phases exist in features array
- [ ] No circular dependencies
- [ ] All dependencies reference valid feature IDs
- [ ] Each phase has at least 1 milestone
- [ ] Acceptance criteria are testable
- [ ] User stories follow correct format

---

## Common Scenarios

### Scenario 1: Early-Stage MVP Roadmap

**Context**: New product, limited resources, need to validate quickly

**Strategy**:
- Keep Must Haves to absolute minimum (3-5 features)
- Focus on Quick Wins in Phase 1
- Defer most Should/Could features to Phase 2+
- Set many features to Won't Have to maintain focus

**Example Phase 1**:
- User authentication
- Core workflow (create/view)
- Basic data persistence
→ 3-5 features total

### Scenario 2: Growth-Stage Product Roadmap

**Context**: Established product, expanding feature set

**Strategy**:
- Foundation phase already exists (review current features)
- Focus on Enhancement and Scale phases
- Include competitive differentiation features
- Balance Big Bets with Fill-ins

**Example Phase 2**:
- Advanced search (Big Bet)
- Collaboration features (Should Have)
- Performance optimizations (Could Have)
→ 8-12 features

### Scenario 3: Competitive Response Roadmap

**Context**: Competitor launched features, need to respond

**Strategy**:
- Heavy use of competitor_analysis.json
- Prioritize differentiation features
- Link features to competitor pain points
- Balance parity vs innovation

**Example**:
- Must Have: Features competitors have but we lack
- Should Have: Our unique differentiation
- Could Have: Nice-to-haves for parity

### Scenario 4: Technical Debt Paydown

**Context**: Need to balance features with refactoring

**Strategy**:
- Include technical improvements as features
- Write user-facing rationale (e.g., "Faster page loads")
- Prioritize based on impact (not just "good practice")
- Spread across phases to avoid all-refactor phase

**Example Technical Feature**:
```json
{
  "title": "Reduce Page Load Time by 50%",
  "rationale": "Users report frustration with 5-second load times. Optimization will improve retention.",
  "priority": "should",
  "complexity": "high",
  "impact": "high"
}
```

---

## Iterating on Roadmaps

### When to Re-Run Features Agent

**Triggers**:
- User feedback contradicts assumptions
- Market conditions change (competitor launches)
- Technical constraints discovered
- Business priorities shift
- MVP validation completes

### Updating Existing Roadmaps

**Process**:
1. Load existing roadmap.json
2. Update discovery data if needed
3. Re-prioritize features with new information
4. Adjust phases based on learnings
5. Increment version number
6. Document changes in metadata

**Versioning**:
- v1.0 → Initial roadmap
- v1.1 → Minor updates (priority changes)
- v2.0 → Major updates (phase restructuring)

---

## Integration with Implementation Planning

### Downstream Handoff

The roadmap feeds into implementation planning:

**Roadmap Output** → **Implementation Input**:
- Phase 1 features → Subtask breakdown
- Feature acceptance criteria → Verification steps
- Dependencies → Implementation ordering
- Complexity estimates → Effort estimation

**Not Included in Roadmap** (Implementation Planner's job):
- Specific technical approach
- File-level changes
- Code structure
- Testing strategy details

---

## Best Practices

### Do's ✅

- **Challenge Must Haves**: Force hard prioritization choices
- **Write User Stories**: Connect every feature to user value
- **Use Competitor Insights**: Leverage competitor_analysis.json when available
- **Balance Phases**: Mix Quick Wins and Big Bets
- **Document Won't Haves**: Explicitly de-scope to manage expectations
- **Validate Dependencies**: Ensure achievable execution order
- **Create Demonstrable Milestones**: Each milestone should show progress

### Don'ts ❌

- **No Generic Features**: "Improve UX" is not a feature
- **No Implementation Details**: Focus on what, not how
- **No Vague Rationale**: Every feature needs clear user value
- **No Circular Deps**: Validate dependency graph
- **No Untestable Criteria**: "Works well" is not acceptance criteria
- **No Skipping Validation**: Always validate roadmap.json schema
- **No 100% Must Haves**: Force prioritization distribution

---

## Troubleshooting

### "Too Many Features in Phase 1"

**Problem**: Phase 1 has 15+ features

**Solution**: Apply ruthless prioritization
- Challenge each Must Have
- Move Should Haves to Phase 2
- Look for features that can be deferred
- Break large features into smaller ones across phases

### "All Features Are Must Have"

**Problem**: Can't decide what's truly critical

**Solution**: Use the "Can we launch without this?" test
- Walk through core user journey
- Identify absolute minimum for journey to work
- Everything else is Should/Could/Won't

### "Unclear Complexity or Impact"

**Problem**: Can't assess complexity or impact

**Solution**: Use relative assessment
- Compare to similar features implemented before
- Low = simplest features, High = most complex
- When uncertain, default to Medium
- Refine estimates during implementation planning

### "Circular Dependencies Detected"

**Problem**: Feature A depends on B, B depends on A

**Solution**: Break the cycle
- Identify core functionality each needs
- Create separate feature for shared dependency
- Sequence features properly
- Update phase assignments

---

## Output Example Reference

See `.github/skills/feature-planning/SKILL.md` examples section for:
- Web application roadmap (SaaS task management)
- CLI tool roadmap (developer productivity)
- Complete feature structures
- Phase organization patterns

---

## Summary

The Roadmap Features Agent generates **strategic, prioritized product roadmaps** using MoSCoW prioritization and the Priority Matrix. Key responsibilities:

✅ Generate 5-30 features from discovery data and pain points
✅ Apply ruthless MoSCoW prioritization (Must/Should/Could/Won't)
✅ Assess impact vs complexity for optimal sequencing
✅ Organize features into logical execution phases
✅ Map dependencies and create demonstrable milestones
✅ Integrate competitor analysis when available
✅ Generate roadmap.json for implementation planning

Use this agent **after Roadmap Discovery** and **before Implementation Planning** to create actionable product roadmaps that balance user value with execution feasibility.

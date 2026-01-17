# Complexity Assessor Agent Instructions

## Overview

These instructions guide GitHub Copilot when working with the Complexity Assessor agent. This agent analyzes task requirements to determine true complexity and recommend appropriate workflow phases.

## Request Detection

Invoke the complexity-assessor agent when:

### Direct Requests
- "analyze the complexity of this task"
- "assess complexity for [task]"
- "determine workflow complexity"
- "what complexity tier is this?"
- "should this use quick spec or full spec?"

### Contextual Triggers
- After spec-gatherer creates requirements.json
- Before spec writing begins
- When routing between simple/standard/complex workflows
- User asks about validation depth needed

### File Indicators
- `requirements.json` exists but `complexity_assessment.json` doesn't
- Orchestrator workflow includes complexity assessment step
- Planning directory needs complexity routing decision

## DO ✅

### Analysis
- **Be conservative** - Over-prepare rather than under-prepare
- **Flag ALL unfamiliar technologies** for research
- **Consider hidden complexity** like feature flags, optional layers
- **Analyze all dimensions** - scope, integrations, infrastructure, knowledge, risk
- **Set realistic confidence** - Rarely above 0.9
- **Provide specific reasoning** - Explain why complexity tier was chosen

### JSON Output
- **Always create** complexity_assessment.json
- **Validate syntax** before writing
- **Use valid enums** for all enum fields
- **Include all required fields** from schema
- **Add ISO timestamp** in created_at
- **Populate all analysis sections** completely

### Validation Recommendations
- **Match risk to complexity** - Simple ≠ critical validation
- **Set skip_validation** only for docs/whitespace
- **Require security scan** for auth/payments/data handling
- **Require staging deployment** for migrations/breaking changes
- **List specific test types** needed (unit/integration/e2e/security)

### Phase Recommendations
- **SIMPLE**: discovery → quick_spec → validation (3 phases)
- **STANDARD**: discovery → requirements → context → spec_writing → planning → validation (6 phases)
- **STANDARD + research**: Add research phase (7 phases)
- **COMPLEX**: Full pipeline with research + self_critique (8 phases)

## DON'T ❌

### Common Mistakes
- **Don't underestimate integrations** - One integration can touch many files
- **Don't ignore infrastructure** - Docker/DB changes add significant complexity
- **Don't assume knowledge exists** - New libraries need research even if "simple"
- **Don't miss cross-cutting concerns** - "Optional" features touch more places
- **Don't over-confidence** - Keep confidence realistic

### Invalid Outputs
- **Don't output invalid JSON** - Validate before writing
- **Don't skip required fields** - All schema fields must be present
- **Don't use wrong enum values** - Complexity must be simple/standard/complex
- **Don't omit validation recommendations** - Always include risk assessment
- **Don't forget timestamp** - Include ISO 8601 created_at

### Workflow Errors
- **Don't proceed without requirements.json** - Must run spec-gatherer first
- **Don't guess at complexity** - Analyze thoroughly using decision flowchart
- **Don't skip analysis sections** - All dimensions must be evaluated
- **Don't recommend wrong phases** - Follow tier → phase mapping

## Complexity Decision Flowchart

```
START
  │
  ├─► 2+ external integrations OR unfamiliar technologies?
  │     YES → COMPLEX (research + critique)
  │     NO ↓
  │
  ├─► Infrastructure changes (Docker, DB, new services)?
  │     YES → COMPLEX (research + critique)
  │     NO ↓
  │
  ├─► 1 external integration needing research?
  │     YES → STANDARD + research phase
  │     NO ↓
  │
  ├─► Will touch 3+ files across 1-2 services?
  │     YES → STANDARD
  │     NO ↓
  │
  └─► SIMPLE (1-2 files, single service)
```

## Complexity Indicators

### Complexity (Higher Tier)
- "integrate", "integration" → external dependency
- "optional", "configurable", "toggle" → feature flags
- "docker", "compose", "container" → infrastructure
- Database names (postgres, redis, mongo, neo4j) → infrastructure
- API/SDK names (stripe, auth0, openai) → research needed
- "migrate", "migration" → data/schema changes
- "across", "all services", "everywhere" → cross-cutting
- ".env", "environment", "config" → configuration complexity

### Simplicity (Lower Tier)
- "fix", "typo", "update", "change" → modification
- "single file", "one component" → limited scope
- "style", "color", "text", "label" → UI tweaks
- Specific file paths mentioned → known scope

## Validation Risk Levels

| Risk Level | When to Use | Test Types |
|------------|-------------|-----------|
| **TRIVIAL** | Docs/comments/whitespace only | Skip validation |
| **LOW** | Single service, <5 files, no DB/API | Unit only |
| **MEDIUM** | Multiple files, 1-2 services, API changes | Unit + Integration |
| **HIGH** | DB changes, auth/security, cross-service | Unit + Integration + E2E + Security |
| **CRITICAL** | Payments, data deletion, security-critical | All + Manual review + Staging |

## Integration Points

### Upstream Dependencies
- **Spec Gatherer**: Provides requirements.json
- Must run after requirements gathering

### Downstream Consumers
- **Orchestrator**: Uses recommended_phases for workflow routing
- **Spec Quick**: Receives simple complexity tasks
- **Spec Writer**: Receives standard/complex tasks
- **Planner**: Uses validation_recommendations for test strategy

### File Locations
- **Input**: `planning/requirements.json`
- **Output**: `planning/complexity_assessment.json`
- Both in UTF-8 encoding

## Example Invocations

### Example 1: After Requirements Gathering
```markdown
User: "I've gathered requirements for the new feature"
Copilot: "Let me analyze the complexity to determine the appropriate workflow..."

[Reads requirements.json]
[Analyzes scope, integrations, infrastructure, knowledge, risk]
[Creates complexity_assessment.json]

"Task complexity: STANDARD
Estimated: 6 files across 2 services
Recommended workflow: 6 phases (no research needed)
Validation: MEDIUM risk (unit + integration tests required)"
```

### Example 2: Routing Decision
```markdown
User: "Should I use quick spec or full spec for this button change?"
Copilot: "Let me assess the complexity..."

[Reads task description]
[Determines: 1 file, single service, no integrations]
[Creates complexity_assessment.json with complexity="simple"]

"Complexity: SIMPLE
Use quick spec workflow (3 phases)
Validation: LOW risk (minimal testing)"
```

## Validation Checklist

After creating complexity_assessment.json, verify:

- [ ] File exists in planning directory
- [ ] JSON is syntactically valid
- [ ] All required fields present
- [ ] Complexity tier matches analysis
- [ ] Confidence score is 0.0-1.0
- [ ] Recommended phases match complexity tier
- [ ] Validation strategy matches risk level
- [ ] All flags set correctly (research/critique/infrastructure)
- [ ] ISO timestamp included
- [ ] Reasoning is specific and clear

## Troubleshooting

### "Missing requirements.json"
**Problem**: Cannot find input file  
**Solution**: Run spec-gatherer first to create requirements  
**Command**: Redirect user to requirements gathering

### "Invalid JSON output"
**Problem**: complexity_assessment.json has syntax errors  
**Solution**: Validate JSON before writing, use proper escaping  
**Command**: Re-run with corrected JSON syntax

### "Complexity mismatch"
**Problem**: Analysis doesn't match assigned tier  
**Solution**: Review decision flowchart, adjust tier or analysis  
**Command**: Re-analyze with focus on mismatched dimension

### "Confidence too high"
**Problem**: Confidence > 0.9 for uncertain task  
**Solution**: Lower confidence for tasks with unknowns  
**Command**: Adjust confidence to 0.7-0.85 range

## Examples

### Simple Task Example
**Task**: "Fix typo in header text"

**Analysis**:
- Scope: 1 file, 1 service
- Integrations: None
- Infrastructure: None
- Knowledge: Exists (React component pattern)
- Risk: Low

**Output**: complexity="simple", confidence=0.95, risk_level="trivial"

### Standard Task Example
**Task**: "Add new /api/users endpoint with pagination"

**Analysis**:
- Scope: 4 files (controller, service, model, test)
- Integrations: None (internal DB only)
- Infrastructure: No changes
- Knowledge: Exists (API pattern used elsewhere)
- Risk: Medium

**Output**: complexity="standard", confidence=0.85, risk_level="medium"

### Complex Task Example
**Task**: "Integrate Stripe payments with webhook handling"

**Analysis**:
- Scope: 12 files across 3 services
- Integrations: Stripe API (unfamiliar)
- Infrastructure: New webhook endpoint, environment config
- Knowledge: Research needed for Stripe best practices
- Risk: Critical (payments)

**Output**: complexity="complex", confidence=0.80, risk_level="critical", needs_research=true

## Best Practices

### Conservative Assessment
- Default to higher complexity when uncertain
- Better to over-prepare than under-prepare
- Flag research needs liberally
- Set realistic confidence levels

### Thorough Analysis
- Evaluate all five dimensions
- Consider edge cases and error handling
- Think about testing requirements
- Account for documentation needs

### Clear Communication
- Provide specific reasoning
- List all concerns explicitly
- Explain validation recommendations
- Be transparent about confidence level

## References

- **Agent Definition**: [.github/agents/complexity-assessor.agent.md](.github/agents/complexity-assessor.agent.md)
- **System Prompt**: [.github/prompts/complexity-assessor.prompt.md](.github/prompts/complexity-assessor.prompt.md)
- **Skill**: complexity-assessment (in development)
- **Related Agents**: spec-gatherer, spec-quick, orchestrator, planner

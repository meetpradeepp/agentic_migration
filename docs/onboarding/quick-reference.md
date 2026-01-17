# Quick Reference Guide

## Common Commands

### Starting Workflows

```bash
# Let orchestrator decide the workflow
@orchestrator "add user authentication"
@orchestrator "create project roadmap"
@orchestrator "fix login bug"

# Invoke specific agents
@spec-gatherer "gather requirements for X"
@adr-generator "create ADR for database choice"
@planner "create implementation plan"
@coder "implement feature X"
@qa-validator "validate implementation"
```

## Approval Gate Responses

### Approving an ADR
```bash
@orchestrator ADR approved
@orchestrator ADR approved, continue with specification
```

### Rejecting an ADR
```bash
@orchestrator ADR rejected, reason: Team lacks expertise in X
@orchestrator ADR rejected, reason: Prefer Y over X for [specific reason]
```

### Requesting Changes to an ADR
```bash
@orchestrator ADR revise consequences: Need more detail on performance impact
@orchestrator ADR revise alternatives: Consider Z as well
```

## File Locations

### Input Files (What Agents Read)
```
requirements.json              # From spec-gatherer
complexity_assessment.json     # From complexity-assessor
research.json                  # From spec-researcher
spec.md                        # From spec-writer
implementation_plan.json       # From planner
```

### Output Files (What Gets Generated)
```
docs/adr/NNNN-*.md            # Architecture Decision Records
docs/planning/features/*/      # Feature implementation plans
validation_results.json        # From qa-validator
adr_summary.json              # Summary of generated ADRs
```

### Configuration Files (Framework)
```
.github/agents/               # Agent definitions
.github/prompts/              # Agent execution templates
.github/instructions/         # Usage guidelines
.github/skills/               # Reusable capabilities
```

## Decision Matrix: When to Create an ADR

| Scenario | ADR Needed? | Why |
|----------|-------------|-----|
| Choosing database (PostgreSQL vs MongoDB) | ✅ YES | Major architectural decision, expensive to change |
| Adding a new REST endpoint | ❌ NO | Follows existing API pattern |
| Selecting auth approach (JWT vs Sessions) | ✅ YES | Affects entire authentication system |
| Fixing a bug in validation logic | ❌ NO | Bug fix, no architectural change |
| Choosing frontend framework (React vs Vue) | ✅ YES | Long-term impact, team expertise required |
| Changing button color | ❌ NO | UI-only change |
| Integrating external API (Stripe, SendGrid) | ✅ YES | External dependency, cost implications |
| Updating environment variable | ❌ NO | Configuration change |
| Switching from REST to GraphQL | ✅ YES | Major API architecture change |
| Refactoring internal function | ❌ NO | Implementation detail (unless pattern change) |

## Workflow Complexity Guide

### Simple (Fast Track)
**Time**: 10-20 minutes  
**Path**: spec-quick → planner → coder → qa-validator  
**No ADR needed**

**Examples**:
- Fix typo
- Update color scheme
- Add validation to existing form
- Fix broken link

---

### Standard (Normal Track)
**Time**: 1-2 hours  
**Path**: spec-gatherer → spec-writer → planner → coder → qa-validator  
**ADR if needed** (usually not)

**Examples**:
- Add new REST endpoint following existing pattern
- Create new UI component using established framework
- Add feature to existing service
- Refactor module without architecture change

---

### Complex (Full Track with Approval Gate)
**Time**: 2-8 hours + review time  
**Path**: spec-gatherer → complexity-assessor → spec-researcher → **adr-generator** → ⏸️ APPROVAL → spec-writer → planner → coder → qa-validator  
**ADR required**

**Examples**:
- Add new service with database
- Integrate external API (Stripe, Auth0)
- Implement real-time features (WebSockets)
- Add authentication/authorization
- Performance optimization requiring architecture change

## ADR Status Lifecycle

```
PROPOSED → Initial state when ADR is created
    ↓
[Review Process]
    ↓
ACCEPTED → Stakeholder approved, implementation proceeds
    ↓
[Implementation]
    ↓
SUPERSEDED → Replaced by newer ADR (e.g., ADR-0023 supersedes ADR-0012)

Alternative paths:
PROPOSED → REJECTED → Decision was denied, alternative needed
ACCEPTED → DEPRECATED → No longer applicable (e.g., service removed)
```

## Agent Invocation Cheat Sheet

| I want to... | Invoke this agent | Example |
|--------------|-------------------|---------|
| Understand existing project | `@roadmap-discovery` | `@roadmap-discovery "analyze this codebase"` |
| Create feature roadmap | `@roadmap-features` | `@roadmap-features "generate roadmap"` |
| Gather requirements | `@spec-gatherer` | `@spec-gatherer "requirements for auth"` |
| Check complexity | `@complexity-assessor` | `@complexity-assessor "assess task complexity"` |
| Research external APIs | `@spec-researcher` | `@spec-researcher "research Stripe integration"` |
| Document architecture decision | `@adr-generator` | `@adr-generator "create ADR for database"` |
| Write detailed spec | `@spec-writer` | `@spec-writer "create specification"` |
| Create implementation plan | `@planner` | `@planner "plan implementation"` |
| Write code | `@coder` | `@coder "implement feature"` |
| Validate implementation | `@qa-validator` | `@qa-validator "run validation"` |
| Security audit code | `@security-analyst` | `@security-analyst "security review"` |
| Fix validation issues | `@validation-fixer` | `@validation-fixer "fix linting errors"` |
| Coordinate full workflow | `@orchestrator` | `@orchestrator "build auth system"` |

## Validation Checklist (Before Approving ADR)

Use this checklist when reviewing ADRs:

- [ ] **Context is clear**: I understand the problem we're solving
- [ ] **Decision is specific**: The choice is concrete, not vague
- [ ] **Pros/cons are honest**: Tradeoffs are realistic, not one-sided
- [ ] **Alternatives were considered**: Other options were evaluated
- [ ] **Team has expertise**: We can actually implement this
- [ ] **Consequences are acceptable**: Negative impacts are manageable
- [ ] **Implementation is guided**: Coder will know what to do
- [ ] **References are valid**: Links and sources work

**If all checked** → Approve  
**If any unchecked** → Reject with specific feedback

## Common Mistakes to Avoid

### 1. ❌ Auto-approving without reading
```
# Bad: Blind approval
@orchestrator ADR approved

# Good: Informed approval
[Read ADR thoroughly]
@orchestrator ADR approved
```

### 2. ❌ Vague rejection feedback
```
# Bad: No context
@orchestrator ADR rejected

# Good: Specific reasoning
@orchestrator ADR rejected, reason: Team lacks PostgreSQL expertise, prefer MongoDB which we already use
```

### 3. ❌ Skipping approval gates
```
# Bad: Trying to bypass
"Can we skip the ADR review?"

# Good: Understanding the value
"I reviewed the ADR and approve the decision"
```

### 4. ❌ Creating ADRs for everything
```
# Bad: ADR for trivial changes
ADR-0042: Use blue color for button

# Good: ADRs for architecture only
ADR-0042: Use PostgreSQL for user data
```

### 5. ❌ Not referencing ADRs in code
```
# Bad: Code without context
// Using PostgreSQL

# Good: Code with ADR reference
// Using PostgreSQL per ADR-0005 (ACID compliance required)
```

## File Naming Conventions

### ADR Files
```
docs/adr/NNNN-descriptive-title.md

Examples:
docs/adr/0001-use-typescript.md
docs/adr/0005-use-postgresql-for-analytics.md
docs/adr/0012-implement-jwt-authentication.md
```

**Rules**:
- Sequential 4-digit number (0001, 0002, ...)
- Kebab-case title
- Always in `docs/adr/` directory
- Never reuse numbers

### Feature Plans
```
docs/planning/features/feature-name/implementation_plan.json

Examples:
docs/planning/features/user-authentication/implementation_plan.json
docs/planning/features/payment-integration/implementation_plan.json
```

## Troubleshooting

### Problem: "research.json not found"
**Solution**: Run `@spec-researcher` first to generate research before ADR generation

### Problem: "No architectural decisions in research"
**Solution**: ADR not needed - proceed directly to spec-writer

### Problem: "ADR number conflict"
**Solution**: Check last ADR number with `ls -1 docs/adr/*.md | tail -1` and use next sequential number

### Problem: "Workflow stuck in PAUSED state"
**Solution**: Review the ADR and respond with approval/rejection command

### Problem: "ADR status still PROPOSED after approval"
**Solution**: Ensure you used correct approval command: `@orchestrator ADR approved`

## Getting Unstuck

If you're unsure what to do:

1. **Check workflow status**: Where are we in the process?
2. **Look for PAUSE indicators**: Is workflow waiting for your input?
3. **Read the last agent output**: What does it say to do next?
4. **Ask orchestrator**: `@orchestrator "what should I do next?"`
5. **Review files**: Check what JSON files exist to understand progress

## Resources

- **Full Onboarding Guide**: [README.md](./README.md)
- **Agent Definitions**: [/.github/agents/](../../.github/agents/)
- **Usage Instructions**: [/.github/instructions/](../../.github/instructions/)
- **Example ADRs**: [/docs/adr/](../adr/)
- **Project README**: [/README.md](../../README.md)

---

**Pro Tips**:
- 💡 Read ADRs thoroughly - they prevent costly mistakes
- 💡 Provide specific rejection reasons - helps improve alternatives
- 💡 Reference ADRs in code comments - future developers will thank you
- 💡 Keep ADRs focused - one decision per ADR
- 💡 Update ADR status when decisions change - maintain accurate history

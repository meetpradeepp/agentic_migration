# ADR Generator Instructions for GitHub Copilot

## Overview

The ADR generator creates Architecture Decision Records (ADRs) for significant architectural decisions before implementation begins, enabling review and approval.

### What This Agent Does (Simple Explanation)

**Input**: Research findings about what database/framework/API to use  
**Output**: Formal decision documents that stakeholders can approve/reject  
**Purpose**: Create an approval checkpoint BEFORE coding begins

**Analogy**: Like asking for permission before making a large purchase - you present options, recommendation, and reasoning, then wait for approval.

### Example Workflow

1. **Research Agent** finds 3 database options: PostgreSQL, MongoDB, ClickHouse
2. **ADR Generator** creates `docs/adr/0005-use-postgresql.md` explaining the choice
3. **Workflow PAUSES** - stakeholder reviews the ADR
4. **Stakeholder approves** - development continues with PostgreSQL
5. **Spec/Code** follows the approved architectural decision

**Why the pause?** Large architectural decisions are expensive to reverse. Getting approval first prevents costly mistakes.

## When to Invoke

Invoke ADR generator when:
- research.json exists with architectural_decisions
- Complexity assessment is COMPLEX
- New external service integrations
- Framework/library changes
- Database architecture decisions
- API design decisions
- User explicitly asks for ADR generation

## Invocation Pattern

**When you see**: research.json with `architectural_decisions` array  
**You invoke**: `@adr-generator` to create formal decision documents

### Example Invocation

```markdown
@adr-generator Generate ADRs for architectural decisions.

**Context**: User analytics dashboard feature requires database choice

**Research Available**:
- research.json (3 architectural decisions identified)
- requirements.json (ACID compliance required)
- complexity_assessment.json (COMPLEX, high integration risk)

Please create ADRs for:
1. Database selection (PostgreSQL vs MongoDB vs ClickHouse)
2. API architecture (REST vs GraphQL)
3. Caching strategy (Redis vs in-memory)

Generate ADRs with status=PROPOSED for review.
```

### What Happens Next

1. Agent creates `docs/adr/0005-database-selection.md`, `0006-api-architecture.md`, `0007-caching-strategy.md`
2. Each ADR has status=**PROPOSED** (not yet approved)
3. Agent generates review request and **PAUSES the workflow**
4. You (or stakeholder) review the ADRs
5. You respond with approval/rejection
6. Workflow continues based on your decision

## Inputs Required

1. **research.json** - Must contain `architectural_decisions` array
2. **requirements.json** - Provides context and constraints
3. **complexity_assessment.json** - Optional, adds risk context

## Expected Output

The agent:
1. Determines next ADR number(s)
2. Creates ADR file(s) in `docs/adr/NNNN-title.md`
3. Generates `adr_summary.json`
4. Provides review request with pause instructions

**Output files**:
- `docs/adr/0005-use-postgresql-for-analytics.md` (status=PROPOSED)
- `adr_summary.json` (summary of all ADRs generated)

## Validation After Invocation

After ADR generation:

```bash
# Check ADRs were created
ls -lh docs/adr/*.md

# Verify status is PROPOSED
grep "Status: PROPOSED" docs/adr/*.md

# Check summary exists
cat adr_summary.json

# Verify review request generated
# (Check agent output for pause instructions)
```

## Integration with Other Agents

### Workflow Position

**Visual Workflow** (where ADR fits in the overall process):

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE ADR (Research Phase)                                │
├─────────────────────────────────────────────────────────────┤
│  1. spec-researcher → Researches database options           │
│     Output: research.json with architectural_decisions      │
├─────────────────────────────────────────────────────────────┤
│  ADR GENERATION (Decision Documentation)                    │
├─────────────────────────────────────────────────────────────┤
│  2. adr-generator → Creates formal decision records         │
│     Output: docs/adr/0005-use-postgresql.md (PROPOSED)      │
├─────────────────────────────────────────────────────────────┤
│  ⏸️  PAUSE FOR HUMAN REVIEW ⏸️                              │
├─────────────────────────────────────────────────────────────┤
│  3. Stakeholder reviews ADR (reads file, considers options) │
│     Decision: Approve ✅ or Reject ❌ or Request Changes 🔄 │
├─────────────────────────────────────────────────────────────┤
│  AFTER APPROVAL (Implementation Phase)                      │
├─────────────────────────────────────────────────────────────┤
│  4. spec-writer → Creates spec following ADR constraints    │
│  5. planner → Plans implementation using approved approach  │
│  6. coder → Implements code per spec and ADR                │
└─────────────────────────────────────────────────────────────┘
```

**Key Point**: The workflow **STOPS** after ADR generation. It does NOT auto-continue. A human must review and explicitly approve before proceeding.

### Before ADR Generator

Ensure prerequisites exist:
```bash
# Required
test -f research.json || echo "ERROR: research.json not found"

# Check for architectural decisions
jq '.architectural_decisions | length' research.json

# Should be > 0 for ADR generation
```

### After ADR Generator - Review Process

**If ADRs Generated**:

Agent outputs pause request like:
```markdown
## ⏸️ ADR Review Required

**Generated**: docs/adr/0005-use-postgresql-for-analytics.md

**To Approve**:
@orchestrator ADR approved, continue with specification

**To Reject**:
@orchestrator ADR rejected, reason: [feedback]

**Status**: PAUSED
```

**User must manually review and respond** - do NOT auto-continue.

### Handling Approval

When user approves:
```markdown
@orchestrator ADR approved, continue with specification

(Orchestrator resumes):
1. Update ADR status to ACCEPTED
2. Invoke spec-writer with ADR constraints
3. Reference ADR in spec.md
```

### Handling Rejection

When user rejects:
```markdown
@orchestrator ADR rejected, reason: Team prefers MongoDB for flexibility

(Orchestrator branches):
1. Update ADR status to REJECTED
2. Invoke spec-researcher for alternative approach
3. Generate new ADR with revised decision
4. Pause again for review
```

## Execution Steps

### Step 1: Check Prerequisites
```bash
# Verify research.json exists
test -f research.json

# Count architectural decisions
DECISIONS=$(jq '.architectural_decisions | length' research.json)

if [[ $DECISIONS -eq 0 ]]; then
  echo "No ADR needed - no architectural decisions"
  exit 0
fi
```

### Step 2: Determine ADR Numbers
```bash
# Get next ADR number
LAST=$(ls -1 docs/adr/*.md 2>/dev/null | tail -1 | grep -oE '[0-9]{4}' || echo "0000")
NEXT=$(printf "%04d" $((10#$LAST + 1)))
```

### Step 3: Generate Each ADR
- Extract decision from research.json
- Create ADR with proper structure
- Include context, decision, consequences, alternatives
- Add implementation notes
- Status = PROPOSED

### Step 4: Create Review Request
- List all generated ADRs
- Provide clear approve/reject instructions
- Explain impact of decision
- **Explicitly pause workflow**

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| No research.json | Skip ADR generation, continue workflow |
| Empty architectural_decisions | Skip ADR generation |
| Too many decisions (>5) | Flag as high-risk, suggest feature breakdown |
| Insufficient context | Request more research from spec-researcher |
| Duplicate ADR numbers | Use sequential numbering from last ADR |

## ADR File Structure

Every ADR must have:

```markdown
# ADR-NNNN: Title

**Status**: PROPOSED
**Date**: YYYY-MM-DD
**Deciders**: [Stakeholders]
**Technical Story**: [Link]

## Context
[Problem and constraints]

## Decision
[What we're doing]

## Consequences
### Positive / Negative / Neutral

## Alternatives Considered
[All options with rationale]

## References
[Links]

## Implementation Notes
[Guidance]

## Review Comments
<!-- Space for reviewers -->
```

## Orchestrator Usage

In orchestrator workflow:

```markdown
**Workflow 5.5: ADR Review Gate**

### Phase 1: Generate ADRs
@adr-generator Generate ADRs from research findings

### Phase 2: PAUSE for Review
**STOP orchestrator session**

Present review request:
- Show generated ADR files
- Provide approve/reject commands
- Explain decision impact

### Phase 3: Resume After Decision
**New orchestrator session based on user response**

If approved:
  → Update ADR status to ACCEPTED
  → Continue to spec-writer

If rejected:
  → Update ADR status to REJECTED
  → Branch to spec-researcher for alternatives
```

## Quality Checklist

Generated ADRs should have:

- [ ] Sequential ADR number (0001, 0002, etc.)
- [ ] Descriptive kebab-case filename
- [ ] Status = PROPOSED
- [ ] Clear context section
- [ ] Specific decision statement
- [ ] Honest pros and cons
- [ ] All alternatives documented
- [ ] Implementation guidance
- [ ] References to source files
- [ ] Review comments section

## Example Scenarios

### Scenario 1: Database Choice (Complete Walkthrough for New Team Members)

This example shows the ENTIRE flow from research to approval.

**Step 1: Research Complete**

After spec-researcher runs, you have:
```json
// research.json
{
  "architectural_decisions": [
    {
      "decision_type": "database",
      "question": "Which database for analytics dashboard?",
      "options": [
        {
          "option": "PostgreSQL",
          "pros": ["ACID compliance", "Complex queries", "Strong typing"],
          "cons": ["Slower at scale", "More setup"],
          "recommendation_score": 9
        },
        {
          "option": "MongoDB",
          "pros": ["Flexible schema", "Fast writes"],
          "cons": ["Eventual consistency", "Complex aggregations harder"],
          "recommendation_score": 6
        }
      ],
      "recommended_option": "PostgreSQL",
      "rationale": "Financial data requires ACID guarantees"
    }
  ]
}
```

**Step 2: Invoke ADR Generator**

```markdown
@adr-generator Create ADR for database selection

**Decision**: PostgreSQL vs MongoDB for analytics data

Inputs available:
- research.json (comparison of both options)
- requirements.json (ACID compliance required)

Output expected:
- docs/adr/0005-use-postgresql-for-analytics.md
- adr_summary.json
- Review request with pause
```

**Step 3: ADR Generated**

Agent creates `docs/adr/0005-use-postgresql-for-analytics.md`:

```markdown
# ADR-0005: Use PostgreSQL for Analytics Dashboard

**Status**: PROPOSED  
**Date**: 2026-01-17  
**Deciders**: Engineering Team, Data Team

## Context

We're building an analytics dashboard that processes financial transactions. The system needs to:
- Store transaction records with strong consistency
- Support complex SQL queries for reporting
- Ensure data integrity (no partial writes)
- Handle concurrent reads and writes

## Decision

We will use **PostgreSQL** as the database for the analytics dashboard.

### Implementation Details
- Version: PostgreSQL 15+
- Deployment: Docker container initially, RDS for production
- Schema: Normalized tables for transactions, users, accounts
- Access: Single primary with read replicas for reporting

## Consequences

### Positive
✅ ACID guarantees prevent data corruption  
✅ Strong typing catches errors early  
✅ Rich ecosystem (pg_stat for monitoring, PostGIS if needed later)  
✅ Team has existing PostgreSQL expertise  

### Negative
❌ More complex setup than MongoDB  
❌ Schema changes require migrations  
❌ Vertical scaling limits (though adequate for current scale)  

### Neutral
⚖️ Need to learn PostgreSQL JSON functions if we need flexible schemas later

## Alternatives Considered

### MongoDB
- **Pros**: Flexible schema, fast writes
- **Cons**: Eventual consistency unacceptable for financial data
- **Why rejected**: Can't risk data inconsistencies with money

### ClickHouse
- **Pros**: Excellent for analytics
- **Cons**: Not ACID compliant, write-heavy workload
- **Why rejected**: Need transactional guarantees

## References
- research.json (database comparison)
- requirements.json (ACID requirement)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/sql.html)

## Implementation Notes

**For Coder Agent**:
1. Use `pg` npm package for connection pooling
2. Implement migrations using `node-pg-migrate`
3. Use transactions for all write operations
4. Add indexes on frequently queried columns (user_id, transaction_date)

**Migration Strategy**:
- Create initial schema with users, transactions tables
- Set up read replicas for reporting queries
- Use connection pooling (max 20 connections)

## Review Comments
<!-- Stakeholders: Add your feedback here -->

```

**Step 4: Workflow Pauses**

Agent outputs:

```markdown
## ⏸️ ADR Review Required

**Generated**: docs/adr/0005-use-postgresql-for-analytics.md

**What this means**:
- We're recommending PostgreSQL for your analytics dashboard
- This decision affects ALL subsequent implementation work
- Once approved, spec and code will be built around PostgreSQL

**Please review the ADR** (estimated 5-10 minutes):
1. Open docs/adr/0005-use-postgresql-for-analytics.md
2. Read the Context (why we need this decision)
3. Check the Decision (what we're proposing)
4. Consider Consequences (tradeoffs)
5. Review Alternatives (what we rejected and why)

**To Approve**: @orchestrator ADR approved, continue with specification  
**To Reject**: @orchestrator ADR rejected, reason: [your feedback]

**Status**: ⏸️ PAUSED
```

**Step 5A: User Approves** ✅

```
@orchestrator ADR approved, continue with specification
```

**What happens next**:
1. ADR status updated to ACCEPTED
2. spec-writer generates spec.md using PostgreSQL
3. planner creates implementation plan with PostgreSQL setup
4. coder implements PostgreSQL schema and queries

**Step 5B: User Rejects** ❌

```
@orchestrator ADR rejected, reason: Team has MongoDB expertise, not PostgreSQL. Would prefer MongoDB.
```

**What happens next**:
1. ADR status updated to REJECTED
2. Rejection reason captured in Review Comments
3. spec-researcher researches MongoDB approach
4. New ADR created: "Use MongoDB for analytics dashboard"
5. Workflow PAUSES AGAIN for new ADR review

---

### Scenario 2: Multiple Decisions

**Real-world example**: Building an authentication system

```markdown
@adr-generator Create ADRs for architectural decisions

**Feature**: User authentication system

**Decisions to document**:
1. Auth method: JWT vs Sessions vs OAuth2
2. Token storage: Redis vs Database vs In-memory
3. Password hashing: bcrypt vs Argon2

Inputs:
- research.json (all three decisions researched)
- requirements.json (stateless auth required for microservices)

Expected output:
- docs/adr/0007-use-jwt-for-authentication.md
- docs/adr/0008-store-tokens-in-redis.md
- docs/adr/0009-use-argon2-for-password-hashing.md
- adr_summary.json
```

**Agent creates 3 ADRs**, all with status=PROPOSED

**Review process**:
- Stakeholder reviews all 3 ADRs
- Approves ADR-0007 (JWT) ✅
- Approves ADR-0008 (Redis) ✅  
- Rejects ADR-0009 (Argon2) ❌ - "bcrypt is standard, team knows it"

**Workflow branches**:
- JWT and Redis: ACCEPTED, incorporated into spec
- Argon2: REJECTED, revised to bcrypt, new ADR generated

**Result**: Spec uses JWT + Redis + bcrypt (2 approved + 1 revised)
2. Auth approach: JWT vs sessions
3. API: REST vs GraphQL

Expected: 3 separate ADR files, all PROPOSED
```

### Scenario 3: No ADR Needed

```markdown
@adr-generator Check if ADR needed

(Agent checks research.json)

Output:
## No ADR Required

**Reason**: Following existing PostgreSQL pattern
**Next**: Continue to spec-writer

[Skip ADR generation]
```

## Best Practices

**Do**:
✅ Generate one ADR per architectural decision
✅ Use clear, specific decision statements
✅ Document all serious alternatives
✅ Be honest about trade-offs
✅ Provide implementation guidance
✅ Generate clear review request
✅ Explicitly pause workflow

**Don't**:
❌ Combine unrelated decisions in one ADR
❌ Skip alternatives analysis
❌ Hide negative consequences
❌ Auto-continue after ADR generation
❌ Reuse ADR numbers
❌ Set status to ACCEPTED (always PROPOSED initially)

## Related Agents

- **spec-researcher**: Provides research.json input
- **spec-writer**: Consumes approved ADRs
- **complexity-assessor**: Identifies when ADRs needed
- **orchestrator**: Manages review workflow and pause/resume

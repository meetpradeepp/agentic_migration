# Complexity Assessment Skill

## Metadata
- **Skill Name**: complexity-assessment
- **Version**: 1.0.0
- **Category**: Analysis
- **Difficulty**: Intermediate
- **License**: MIT

## Description

The Complexity Assessment skill provides a systematic approach to analyzing task requirements and determining true complexity levels. It enables accurate workflow routing by assessing scope, integrations, infrastructure needs, knowledge requirements, and risk factors.

## Use Cases

- Determining appropriate workflow phases for a task
- Routing between quick spec and full spec pipelines
- Assessing validation depth requirements
- Identifying research needs
- Estimating implementation complexity

## Prerequisites

### Required Files
- `requirements.json` - Task requirements from spec-gatherer

### Optional Files
- `project_index.json` - Project structure for context

### Required Knowledge
- Understanding of workflow types (feature, refactor, investigation, migration, simple)
- Familiarity with complexity tiers (simple, standard, complex)
- Knowledge of validation risk levels

## Core Concepts

### Complexity Tiers

**SIMPLE**
- 1-2 files modified
- Single service
- No external integrations
- No infrastructure changes
- No new dependencies
- Examples: typo fixes, color changes, text updates

**STANDARD**
- 3-10 files modified
- 1-2 services
- 0-1 external integrations (well-documented)
- Minimal infrastructure changes (env vars)
- May need research but core patterns exist
- Examples: new API endpoint, new component, extending functionality

**COMPLEX**
- 10+ files OR cross-cutting changes
- Multiple services
- 2+ external integrations
- Infrastructure changes (Docker, databases, queues)
- New architectural patterns
- Greenfield features requiring research
- Examples: new integrations, database migrations, new services

### Analysis Dimensions

1. **Scope Analysis**
   - File count estimation
   - Service count
   - Cross-cutting concerns

2. **Integration Analysis**
   - External service dependencies
   - New package requirements
   - Research needs

3. **Infrastructure Analysis**
   - Docker/container changes
   - Database modifications
   - Configuration requirements

4. **Knowledge Analysis**
   - Existing pattern availability
   - Research requirements
   - Unfamiliar technologies

5. **Risk Analysis**
   - Risk level assessment
   - Specific concerns
   - Security considerations

### Validation Risk Levels

| Risk Level | When to Use | Test Types |
|------------|-------------|-----------|
| TRIVIAL | Docs/comments/whitespace only | Skip validation |
| LOW | Single service, <5 files, no DB/API | Unit only |
| MEDIUM | Multiple files, 1-2 services, API changes | Unit + Integration |
| HIGH | DB changes, auth/security, cross-service | Unit + Integration + E2E + Security |
| CRITICAL | Payments, data deletion, security-critical | All + Manual review + Staging |

## Decision Framework

### Complexity Decision Flowchart

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

### Complexity Indicators

**Higher Complexity**:
- "integrate", "integration" → external dependency
- "optional", "configurable", "toggle" → feature flags
- "docker", "compose", "container" → infrastructure
- Database names (postgres, redis, mongo, neo4j) → infrastructure
- API/SDK names (stripe, auth0, openai) → research needed
- "migrate", "migration" → data/schema changes
- "across", "all services", "everywhere" → cross-cutting
- ".env", "environment", "config" → configuration complexity

**Lower Complexity**:
- "fix", "typo", "update", "change" → modification
- "single file", "one component" → limited scope
- "style", "color", "text", "label" → UI tweaks
- Specific file paths mentioned → known scope

## Workflow Integration

### Phase Recommendations by Complexity

**SIMPLE** (3 phases):
```
discovery → quick_spec → validation
```

**STANDARD** (6 phases):
```
discovery → requirements → context → spec_writing → planning → validation
```

**STANDARD + Research** (7 phases):
```
discovery → requirements → research → context → spec_writing → planning → validation
```

**COMPLEX** (8 phases):
```
discovery → requirements → research → context → spec_writing → self_critique → planning → validation
```

### Workflow Flags

- `needs_research`: Set true for ANY unfamiliar technology
- `needs_self_critique`: Set true for complex tasks requiring validation
- `needs_infrastructure_setup`: Set true for Docker/DB changes

## Output Schema

### complexity_assessment.json

```json
{
  "complexity": "simple|standard|complex",
  "workflow_type": "feature|refactor|investigation|migration|simple",
  "confidence": 0.85,
  "reasoning": "2-3 sentence explanation",
  
  "analysis": {
    "scope": {
      "estimated_files": 6,
      "estimated_services": 2,
      "is_cross_cutting": false,
      "notes": "brief explanation"
    },
    "integrations": {
      "external_services": ["Stripe"],
      "new_dependencies": ["stripe"],
      "research_needed": true,
      "notes": "brief explanation"
    },
    "infrastructure": {
      "docker_changes": false,
      "database_changes": false,
      "config_changes": true,
      "notes": "brief explanation"
    },
    "knowledge": {
      "patterns_exist": true,
      "research_required": true,
      "unfamiliar_tech": ["stripe"],
      "notes": "brief explanation"
    },
    "risk": {
      "level": "medium",
      "concerns": ["payment processing", "webhook handling"],
      "notes": "brief explanation"
    }
  },
  
  "recommended_phases": [
    "discovery",
    "requirements",
    "research",
    "context",
    "spec_writing",
    "planning",
    "validation"
  ],
  
  "flags": {
    "needs_research": true,
    "needs_self_critique": false,
    "needs_infrastructure_setup": false
  },
  
  "validation_recommendations": {
    "risk_level": "critical",
    "skip_validation": false,
    "minimal_mode": false,
    "test_types_required": ["unit", "integration", "e2e", "security"],
    "security_scan_required": true,
    "staging_deployment_required": true,
    "reasoning": "Payment integration requires full validation suite"
  },
  
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Best Practices

### DO ✅

1. **Be Conservative**
   - Default to higher complexity when uncertain
   - Better to over-prepare than under-prepare
   - Flag research needs liberally

2. **Analyze Thoroughly**
   - Evaluate all five dimensions
   - Consider hidden complexity (feature flags, optional layers)
   - Think about edge cases and error handling

3. **Set Realistic Confidence**
   - Rarely above 0.9
   - Lower for tasks with unknowns
   - Account for implementation uncertainty

4. **Provide Specific Reasoning**
   - Explain why tier was chosen
   - List specific factors
   - Be transparent about concerns

5. **Match Validation to Risk**
   - Simple tasks ≠ critical validation
   - Security changes = comprehensive testing
   - Consider staging deployment needs

### DON'T ❌

1. **Don't Underestimate**
   - Integrations can touch many files
   - Infrastructure changes add complexity
   - New libraries need research

2. **Don't Skip Analysis**
   - All dimensions must be evaluated
   - Missing cross-cutting concerns is common
   - Consider downstream impacts

3. **Don't Over-Confidence**
   - Keep confidence realistic
   - Account for unknowns
   - Implementation often reveals complexity

4. **Don't Ignore Validation Needs**
   - Security requires scanning
   - Payments need staging deployment
   - Data changes need migration testing

## Examples

### Example 1: Simple Task Assessment

**Input** (requirements.json):
```json
{
  "task_description": "Fix typo in header text",
  "workflow_type": "simple",
  "services_involved": ["frontend"],
  "user_requirements": ["Change 'Welcom' to 'Welcome'"]
}
```

**Output** (complexity_assessment.json):
```json
{
  "complexity": "simple",
  "workflow_type": "simple",
  "confidence": 0.95,
  "reasoning": "Single file UI change with no dependencies or infrastructure impact.",
  
  "analysis": {
    "scope": {
      "estimated_files": 1,
      "estimated_services": 1,
      "is_cross_cutting": false,
      "notes": "Isolated text change in header component"
    },
    "integrations": {
      "external_services": [],
      "new_dependencies": [],
      "research_needed": false,
      "notes": "No external dependencies"
    },
    "infrastructure": {
      "docker_changes": false,
      "database_changes": false,
      "config_changes": false,
      "notes": "No infrastructure impact"
    },
    "knowledge": {
      "patterns_exist": true,
      "research_required": false,
      "unfamiliar_tech": [],
      "notes": "Standard React component update"
    },
    "risk": {
      "level": "low",
      "concerns": [],
      "notes": "Minimal risk, cosmetic change only"
    }
  },
  
  "recommended_phases": ["discovery", "quick_spec", "validation"],
  
  "flags": {
    "needs_research": false,
    "needs_self_critique": false,
    "needs_infrastructure_setup": false
  },
  
  "validation_recommendations": {
    "risk_level": "trivial",
    "skip_validation": false,
    "minimal_mode": true,
    "test_types_required": [],
    "security_scan_required": false,
    "staging_deployment_required": false,
    "reasoning": "Typo fix with no functional impact. Visual verification sufficient."
  },
  
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Example 2: Standard Task Assessment

**Input** (requirements.json):
```json
{
  "task_description": "Add new /api/users endpoint with pagination",
  "workflow_type": "feature",
  "services_involved": ["backend"],
  "user_requirements": [
    "Return paginated list of users",
    "Support page size and offset params",
    "Include total count in response"
  ]
}
```

**Output** (complexity_assessment.json):
```json
{
  "complexity": "standard",
  "workflow_type": "feature",
  "confidence": 0.85,
  "reasoning": "New API endpoint following existing patterns. Multiple files but contained to backend service.",
  
  "analysis": {
    "scope": {
      "estimated_files": 4,
      "estimated_services": 1,
      "is_cross_cutting": false,
      "notes": "Controller, service, test files needed"
    },
    "integrations": {
      "external_services": [],
      "new_dependencies": [],
      "research_needed": false,
      "notes": "Uses existing database connection"
    },
    "infrastructure": {
      "docker_changes": false,
      "database_changes": false,
      "config_changes": false,
      "notes": "No infrastructure changes needed"
    },
    "knowledge": {
      "patterns_exist": true,
      "research_required": false,
      "unfamiliar_tech": [],
      "notes": "Pagination pattern exists in /api/posts endpoint"
    },
    "risk": {
      "level": "medium",
      "concerns": ["API contract", "performance with large datasets"],
      "notes": "Standard API endpoint risks"
    }
  },
  
  "recommended_phases": [
    "discovery",
    "requirements",
    "context",
    "spec_writing",
    "planning",
    "validation"
  ],
  
  "flags": {
    "needs_research": false,
    "needs_self_critique": false,
    "needs_infrastructure_setup": false
  },
  
  "validation_recommendations": {
    "risk_level": "medium",
    "skip_validation": false,
    "minimal_mode": false,
    "test_types_required": ["unit", "integration"],
    "security_scan_required": false,
    "staging_deployment_required": false,
    "reasoning": "New API endpoint requires unit tests for business logic and integration tests for HTTP handling. No sensitive data involved."
  },
  
  "created_at": "2024-01-15T11:00:00Z"
}
```

---

### Example 3: Complex Task Assessment

**Input** (requirements.json):
```json
{
  "task_description": "Add Stripe payment integration for subscriptions",
  "workflow_type": "feature",
  "services_involved": ["backend", "frontend"],
  "user_requirements": [
    "Process subscription payments via Stripe",
    "Handle webhook events for payment status",
    "Store payment history in database"
  ]
}
```

**Output** (complexity_assessment.json):
```json
{
  "complexity": "complex",
  "workflow_type": "feature",
  "confidence": 0.80,
  "reasoning": "External payment integration with webhooks. Requires research for Stripe best practices and security considerations.",
  
  "analysis": {
    "scope": {
      "estimated_files": 12,
      "estimated_services": 2,
      "is_cross_cutting": true,
      "notes": "Touches payment flow, webhooks, database, and UI"
    },
    "integrations": {
      "external_services": ["Stripe"],
      "new_dependencies": ["stripe"],
      "research_needed": true,
      "notes": "Need to research Stripe webhook handling and idempotency"
    },
    "infrastructure": {
      "docker_changes": false,
      "database_changes": true,
      "config_changes": true,
      "notes": "New payment_history table, Stripe API keys in .env"
    },
    "knowledge": {
      "patterns_exist": false,
      "research_required": true,
      "unfamiliar_tech": ["stripe"],
      "notes": "No existing payment integration patterns in codebase"
    },
    "risk": {
      "level": "high",
      "concerns": [
        "Payment security",
        "Webhook reliability",
        "PCI compliance",
        "Transaction failures"
      ],
      "notes": "Financial transactions are high-risk"
    }
  },
  
  "recommended_phases": [
    "discovery",
    "requirements",
    "research",
    "context",
    "spec_writing",
    "self_critique",
    "planning",
    "validation"
  ],
  
  "flags": {
    "needs_research": true,
    "needs_self_critique": true,
    "needs_infrastructure_setup": true
  },
  
  "validation_recommendations": {
    "risk_level": "critical",
    "skip_validation": false,
    "minimal_mode": false,
    "test_types_required": ["unit", "integration", "e2e", "security"],
    "security_scan_required": true,
    "staging_deployment_required": true,
    "reasoning": "Payment integration is security-critical. Requires full test coverage, security scanning for PCI compliance, and staging deployment to verify Stripe webhooks work correctly before production."
  },
  
  "created_at": "2024-01-15T12:00:00Z"
}
```

## Troubleshooting

### Low Confidence Assessment
**Symptom**: Confidence score below 0.7  
**Solution**: Gather more information, request clarification from user  
**Prevention**: Ask detailed questions during requirements gathering

### Complexity Mismatch
**Symptom**: Assessment doesn't match actual implementation  
**Solution**: Re-assess with focus on missed dimension (scope/integration/infrastructure/knowledge/risk)  
**Prevention**: Use decision flowchart systematically

### Missing Validation Recommendations
**Symptom**: Validation strategy unclear or incomplete  
**Solution**: Map risk level to test types table, consider security/staging needs  
**Prevention**: Always complete validation recommendations section

## Integration with Other Skills

- **Requirements Gathering**: Provides input (requirements.json)
- **Subtask Planning**: Consumes output (recommended_phases)
- **Project Discovery**: Provides context (project_index.json)
- **Feature Planning**: Uses validation recommendations

## References

- **Agent**: complexity-assessor
- **Schema**: complexity_assessment.json
- **Related Skills**: requirements-gathering, subtask-planning
- **Documentation**: See `.github/agents/complexity-assessor.agent.md`

## License

MIT License - See LICENSE.txt for details

## Version History

- **1.0.0** (2024-01-15): Initial release with three-tier complexity system and validation recommendations

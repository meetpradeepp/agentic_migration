---
name: requirements-gathering
description: 'Interactive requirements elicitation that transforms user needs into structured requirements.json. Use when starting new features, clarifying vague requests, or gathering acceptance criteria. Keywords: requirements, elicitation, clarification, workflow classification, acceptance criteria.'
license: Complete terms in LICENSE.txt
---

# Requirements Gathering

This skill provides interactive requirements elicitation capabilities for understanding user needs and producing structured, validated requirements documents.

## When to Use This Skill

Use this skill when you need to:
- Start a new feature or project
- Clarify vague or ambiguous user requests
- Convert user ideas into actionable requirements
- Gather acceptance criteria and success metrics
- Classify workflow type (feature/refactor/investigation/etc.)
- Identify involved services or components

## Prerequisites

- Access to project structure information (project_index.json)
- Interactive session with user (able to ask questions)
- Clear understanding that this is requirements gathering, not implementation

## Core Capabilities

### 1. Task Understanding
- Confirms and clarifies user intent
- Distinguishes between features, bugs, refactors, and migrations
- Identifies scope and boundaries
- Captures both functional and non-functional requirements

### 2. Workflow Classification
Determines the appropriate workflow type based on user intent:
- **FEATURE**: New functionality or enhancements
- **REFACTOR**: Code restructuring without behavior changes
- **INVESTIGATION**: Bug analysis and troubleshooting
- **MIGRATION**: Data or system migration tasks
- **SIMPLE**: Single-service, straightforward changes

### 3. Service Identification
- Maps tasks to relevant services/components
- Distinguishes primary vs integration services
- Suggests services based on project structure
- Validates service involvement with user

### 4. Requirements Elicitation
Gathers comprehensive requirements through:
- Targeted clarifying questions
- Edge case identification
- Constraint discovery
- Success criteria definition

### 5. Structured Output Generation
- Produces valid JSON output with strict schema
- Ensures all required fields are present
- Validates data before finalization
- Creates ISO-formatted timestamps

## Workflow Phases

### Phase 0: Load Project Context
**Purpose**: Understand available services and project structure

**Actions**:
- Read project_index.json
- Identify project type (monorepo, single service, etc.)
- List available services and tech stack

**Output**: Context for subsequent questions

### Phase 1: Understand the Task
**Purpose**: Clarify what the user wants to accomplish

**Questions**:
- "What would you like to build or fix?"
- "Is this correct: [task description]?"
- "Any clarifications or additional details?"

**Output**: Clear task description

### Phase 2: Determine Workflow Type
**Purpose**: Classify the work to guide planning approach

**Decision Matrix**:
| User Intent | Workflow Type |
|-------------|---------------|
| "Add feature X", "Build Y" | feature |
| "Migrate from X to Y", "Refactor Z" | refactor |
| "Fix bug where X", "Debug Y" | investigation |
| "Migrate data from X" | migration |
| Single service, small change | simple |

**Output**: Validated workflow type

### Phase 3: Identify Services
**Purpose**: Determine which parts of the codebase are involved

**Template**:
> "Based on your task and project structure, I think this involves:
> - **[service1]** (primary) - [reason]
> - **[service2]** (integration) - [reason]
>
> Any other services involved?"

**Output**: List of involved services

### Phase 4: Gather Requirements
**Purpose**: Collect detailed functional and acceptance criteria

**Targeted Questions**:
1. "What exactly should happen when [key scenario]?"
2. "Are there any edge cases I should know about?"
3. "What does success look like? How will you know it works?"
4. "Any constraints?" (performance, compatibility, security)

**Output**: Comprehensive requirements list

### Phase 5: Confirm and Output
**Purpose**: Validate understanding before creating artifact

**Template**:
```
Let me confirm I understand:

**Task**: [summary]
**Type**: [workflow_type]
**Services**: [list]

**Requirements**:
1. [req 1]
2. [req 2]

**Success Criteria**:
1. [criterion 1]
2. [criterion 2]

**Edge Cases**:
1. [edge case 1]
2. [edge case 2]

Is this correct?
```

**Output**: User-confirmed requirements

### Phase 6: Create requirements.json
**Purpose**: Generate structured artifact for next phase

**Schema**:
```json
{
  "task_description": "Clear description of what to build",
  "workflow_type": "feature|refactor|investigation|migration|simple",
  "services_involved": ["service1", "service2"],
  "user_requirements": [
    "Requirement 1",
    "Requirement 2"
  ],
  "acceptance_criteria": [
    "Criterion 1",
    "Criterion 2"
  ],
  "edge_cases": [
    "Edge case scenario 1",
    "Edge case scenario 2"
  ],
  "constraints": [
    "Constraint or limitation"
  ],
  "created_at": "ISO timestamp"
}
```

**Validation**:
- ✅ Valid JSON syntax
- ✅ All required fields present
- ✅ Workflow type is valid enum value
- ✅ At least one requirement
- ✅ At least one acceptance criterion
- ✅ Edge cases identified (can be empty array but should be considered)

**Output**: Valid requirements.json file

## Usage Examples

### Example 1: Feature Request - User Authentication

**User Input**:
```
"I want to add user authentication to the app"
```

**Agent Interaction**:
```
Agent: "I understand you want to add user authentication. Let me clarify a few things:

1. Should this be a new authentication system, or integrate with an existing provider?
2. What authentication methods? (email/password, OAuth, SSO?)
3. Any specific security requirements?

This sounds like a **feature** task. Does that seem right?"

User: "Yes, OAuth with Google. Must support 2FA."

Agent: "Great! Based on your project structure, I think this involves:
- **auth-service** (primary) - handles authentication logic
- **api-gateway** (integration) - routes auth requests

Does that cover all the services?"

User: "Yes, that's correct."

Agent: "Perfect. Let me confirm I understand:

**Task**: Add user authentication with Google OAuth and 2FA support
**Type**: feature
**Services**: auth-service, api-gateway

**Requirements**:
1. Integrate Google OAuth provider
2. Support 2FA (time-based)
3. Secure token management
4. Session persistence

**Success Criteria**:
1. Users can sign in with Google
2. 2FA enrollment and verification works
3. Tokens are securely stored and validated
4. Sessions persist across page refreshes

Is this correct?"

User: "Yes, perfect!"
```

**Output** (requirements.json):
```json
{
  "task_description": "Add user authentication with Google OAuth and 2FA support",
  "workflow_type": "feature",
  "services_involved": ["auth-service", "api-gateway"],
  "user_requirements": [
    "Integrate Google OAuth provider for authentication",
    "Support time-based 2FA enrollment and verification",
    "Implement secure token generation and validation",
    "Enable persistent sessions across page refreshes"
  ],
  "acceptance_criteria": [
    "Users can successfully sign in using their Google account",
    "2FA setup flow works and codes are validated correctly",
    "Authentication tokens are securely stored and expire appropriately",
    "User sessions persist after browser refresh"
  ],
  "constraints": [
    "Must comply with OAuth 2.0 standards",
    "2FA codes must follow TOTP specification",
    "Session tokens must be HTTP-only cookies"
  ],
  "created_at": "2026-01-17T10:30:00Z"
}
```

See [complete example with full interaction flow](./examples/auth-feature.md)

### Example 2: Bug Investigation

**User Input**:
```
"Users are reporting that the cart total is sometimes wrong"
```

**Agent Interaction**:
```
Agent: "I understand users are seeing incorrect cart totals. Let me clarify:

1. When does this happen? (specific conditions?)
2. What should the total be vs what they're seeing?
3. Is this consistent or intermittent?
4. Any specific user actions that trigger it?

This sounds like an **investigation** task. Does that seem right?"

User: "Yes. It happens when applying multiple discount codes. Total doesn't account for all discounts."

Agent: "Got it. Based on your project, I think this involves:
- **cart-service** (primary) - handles cart calculations
- **promotions-service** (integration) - provides discount rules

Any other services?"

User: "That covers it."
```

**Output** (requirements.json):
```json
{
  "task_description": "Investigate and fix incorrect cart total calculation when multiple discount codes are applied",
  "workflow_type": "investigation",
  "services_involved": ["cart-service", "promotions-service"],
  "user_requirements": [
    "Identify why cart totals are incorrect with multiple discounts",
    "Fix calculation logic to properly apply all discount codes",
    "Ensure discount stacking rules are correctly implemented"
  ],
  "acceptance_criteria": [
    "Cart total correctly reflects all applied discount codes",
    "No regression in single discount code scenarios",
    "Edge cases (100% discount, overlapping codes) handled correctly",
    "Existing tests pass and new tests added for multi-discount scenarios"
  ],
  "constraints": [
    "Must maintain backward compatibility with existing API",
    "Cannot change promotion service interfaces"
  ],
  "created_at": "2026-01-17T11:15:00Z"
}
```

## Best Practices

### DO ✅
- **Ask Before Assuming**: Always clarify vague requests with targeted questions
- **Confirm Understanding**: Show summary and wait for user approval before creating output
- **Use Project Context**: Reference actual services from project_index.json
- **Validate Output**: Ensure JSON is syntactically correct and schema-compliant
- **Be Specific**: Make requirements actionable and acceptance criteria measurable
- **Separate Concerns**: Focus on WHAT (requirements), not HOW (implementation)

### DON'T ❌
- **Guess User Intent**: Don't proceed without clarification on ambiguous requests
- **Skip Confirmation**: Always validate understanding before creating requirements.json
- **Mix Implementation**: Don't include implementation details in requirements
- **Assume Services**: Always verify service involvement with user
- **Create Invalid JSON**: Validate syntax and required fields before finalizing
- **Rush the Process**: Take time to gather complete information

## Quality Checklist

Before finalizing requirements.json, verify:

- [ ] Valid JSON syntax (no trailing commas, proper escaping)
- [ ] All required fields present and non-empty
- [ ] Workflow type is valid enum value
- [ ] Services exist in project structure
- [ ] Requirements are clear and actionable
- [ ] Acceptance criteria are measurable and testable
- [ ] Edge cases identified and documented
- [ ] Constraints are explicit and documented
- [ ] User has confirmed the summary
- [ ] Timestamp is ISO 8601 format

## Error Recovery

### Invalid JSON Syntax
```bash
# Read current state
cat requirements.json

# Validate
cat requirements.json | python -m json.tool

# Fix and recreate
cat > requirements.json << 'EOF'
{
  [corrected JSON]
}
EOF
```

### Missing Required Fields
Check schema and add missing fields:
```json
{
  "task_description": "...",  // Required
  "workflow_type": "...",      // Required
  "services_involved": [...],  // Required (can be empty array)
  "user_requirements": [...],  // Required (must have items)
  "acceptance_criteria": [...], // Required (must have items)
  "constraints": [...],        // Required (can be empty array)
  "created_at": "..."          // Required (ISO 8601)
}
```

## Integration Points

### Input Dependencies
- **project_index.json**: Required for service identification and context

### Output Consumers
- **Context Discovery Agent**: Uses requirements to focus codebase analysis
- **Spec Writer Agent**: Expands requirements into full specification
- **Planner Agent**: Uses workflow type and requirements for plan creation

### Workflow Position
```
User Request
    ↓
[Requirements Gathering] ← THIS SKILL
    ↓
requirements.json
    ↓
[Context Discovery]
    ↓
[Spec Writing]
    ↓
[Planning]
```

## References

- [Workflow classification guide](./references/workflow-classification.md)
- [Question templates by task type](./references/question-templates.md)
- [JSON schema validation](./references/schema-validation.md)
- [Integration examples](./examples/)

## License

This skill is provided under the terms specified in [LICENSE.txt](./LICENSE.txt).

---

**Keywords**: requirements elicitation, user needs analysis, workflow classification, service identification, acceptance criteria, structured requirements, interactive gathering, JSON schema validation

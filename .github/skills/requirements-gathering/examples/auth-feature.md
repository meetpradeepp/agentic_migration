# Example: Authentication Feature Requirements Gathering

This example demonstrates the complete requirements gathering process for adding user authentication to an application.

## Initial User Request

```
User: "I want to add user authentication to the app"
```

## Requirements Gathering Session

### Phase 1: Task Understanding

**Agent**:
> I understand you want to add user authentication. Let me clarify a few things to ensure I understand your requirements correctly.

**Agent**:
> 1. Should this be a new authentication system, or integrate with an existing provider?
> 2. What authentication methods would you like to support? (email/password, OAuth, SSO?)
> 3. Any specific security requirements or compliance needs?

**User**:
> "Let's use OAuth with Google. We also need 2FA support for enhanced security."

### Phase 2: Workflow Classification

**Agent**:
> Based on what you've described, this sounds like a **feature** task - we're adding new functionality to the application. Does that seem right?

**User**:
> "Yes, that's correct."

### Phase 3: Service Identification

**Agent** (after reading project_index.json):
> Based on your project structure, I think this authentication feature involves:
> 
> - **auth-service** (primary) - Will handle authentication logic, OAuth flow, and 2FA
> - **api-gateway** (integration) - Will route authentication requests and protect endpoints
> - **user-service** (integration) - Will store user profiles and authentication metadata
>
> Does that cover all the services that need to be involved?

**User**:
> "Yes, those are the right services."

### Phase 4: Requirements Gathering

**Agent**:
> Great! Let me gather some more details:
>
> 1. What exactly should happen when a user tries to sign in?
> 2. How should 2FA enrollment work? Optional or mandatory?
> 3. What edge cases should we handle? (expired tokens, concurrent logins, failed OAuth, network issues)
> 4. What should happen if authentication fails?
> 5. Are there any other edge cases I should know about?

**User**:
> "Users should click 'Sign in with Google', complete OAuth, then set up 2FA if it's their first time. 2FA should be optional but encouraged. Failed auth should show clear error messages. Need to handle expired sessions gracefully, concurrent logins from different devices, and what happens if Google OAuth is down."

**Agent**:
> 6. What does success look like? How will you know this works correctly?
> 7. Any constraints I should be aware of?

**User**:
> "Success means users can sign in smoothly, their sessions persist, and 2FA works reliably. We must comply with OAuth 2.0 standards and TOTP for 2FA. Session tokens should be HTTP-only cookies for security."

### Phase 5: Confirmation

**Agent**:
> Perfect! Let me confirm I understand everything correctly:
>
> **Task**: Add user authentication with Google OAuth and 2FA support
> 
> **Type**: feature
> 
> **Services**:
> - auth-service (primary)
> - api-gateway (integration)
> - user-service (integration)
>
> **Requirements**:
> 1. Integrate Google OAuth provider for authentication
> 2. Support time-based 2FA (TOTP) with optional enrollment
> 3. Implement secure token generation and validation
> 4. Enable persistent sessions across page refreshes
> 5. Handle authentication failures with clear error messages
> 6. Gracefully manage expired sessions
>
> **Success Criteria**:
> 1. Users can successfully sign in using their Google account
> 2. OAuth flow completes correctly and securely
> 3. 2FA setup flow works and codes are validated correctly
> 4. Authentication tokens are securely stored and expire appropriately
> 5. User sessions persist after browser refresh
> 6. Failed authentication attempts show clear, helpful error messages
>
> **Edge Cases**:
> 1. Handle expired or invalid OAuth tokens
> 2. Support concurrent logins from multiple devices
> 3. Gracefully degrade if Google OAuth service is unavailable
> 4. Prevent session fixation attacks
> 5. Handle 2FA code expiration and resend scenarios
> 6. Manage rate limiting for failed login attempts
>
> **Constraints**:
> 1. Must comply with OAuth 2.0 standards
> 2. 2FA codes must follow TOTP specification (RFC 6238)
> 3. Session tokens must be HTTP-only cookies
> 4. Must work with existing user-service API
>
> Is this correct?

**User**:
> "Yes, that's perfect! That covers everything."

### Phase 6: Output Creation

**Agent**:
> Excellent! I'll create the requirements.json file now.

```bash
cat > requirements.json << 'EOF'
{
  "task_description": "Add user authentication with Google OAuth and 2FA support",
  "workflow_type": "feature",
  "services_involved": [
    "auth-service",
    "api-gateway",
    "user-service"
  ],
  "user_requirements": [
    "Integrate Google OAuth provider for authentication",
    "Support time-based 2FA (TOTP) with optional enrollment",
    "Implement secure token generation and validation",
    "Enable persistent sessions across page refreshes",
    "Handle authentication failures with clear error messages",
    "Gracefully manage expired sessions"
  ],
  "acceptance_criteria": [
    "Users can successfully sign in using their Google account",
    "OAuth flow completes correctly and securely",
    "2FA setup flow works and codes are validated correctly",
    "Authentication tokens are securely stored and expire appropriately",
    "User sessions persist after browser refresh",
    "Failed authentication attempts show clear, helpful error messages"
  ],
  "edge_cases": [
    "Handle expired or invalid OAuth tokens",
    "Support concurrent logins from multiple devices",
    "Gracefully degrade if Google OAuth service is unavailable",
    "Prevent session fixation attacks",
    "Handle 2FA code expiration and resend scenarios",
    "Manage rate limiting for failed login attempts"
  ],
  "constraints": [
    "Must comply with OAuth 2.0 standards",
    "2FA codes must follow TOTP specification (RFC 6238)",
    "Session tokens must be HTTP-only cookies",
    "Must work with existing user-service API"
  ],
  "created_at": "2026-01-17T10:30:00Z"
}
EOF
```

**Agent**:
```
=== REQUIREMENTS GATHERED ===

Task: Add user authentication with Google OAuth and 2FA support
Type: feature
Services: auth-service, api-gateway, user-service

requirements.json created successfully.

Next phase: Context Discovery
```

## Output Artifact

**File**: `requirements.json`

```json
{
  "task_description": "Add user authentication with Google OAuth and 2FA support",
  "workflow_type": "feature",
  "services_involved": [
    "auth-service",
    "api-gateway",
    "user-service"
  ],
  "user_requirements": [
    "Integrate Google OAuth provider for authentication",
    "Support time-based 2FA (TOTP) with optional enrollment",
    "Implement secure token generation and validation",
    "Enable persistent sessions across page refreshes",
    "Handle authentication failures with clear error messages",
    "Gracefully manage expired sessions"
  ],
  "acceptance_criteria": [
    "Users can successfully sign in using their Google account",
    "OAuth flow completes correctly and securely",
    "2FA setup flow works and codes are validated correctly",
    "Authentication tokens are securely stored and expire appropriately",
    "User sessions persist after browser refresh",
    "Failed authentication attempts show clear, helpful error messages"
  ],
  "constraints": [
    "Must comply with OAuth 2.0 standards",
    "2FA codes must follow TOTP specification (RFC 6238)",
    "Session tokens must be HTTP-only cookies",
    "Must work with existing user-service API"
  ],
  "created_at": "2026-01-17T10:30:00Z"
}
```

## Validation

### JSON Syntax ✅
```bash
$ cat requirements.json | python -m json.tool
# Output: Valid JSON, no errors
```

### Required Fields ✅
- ✅ `task_description` - Present and descriptive
- ✅ `workflow_type` - Valid enum value ("feature")
- ✅ `services_involved` - Array with 3 services
- ✅ `user_requirements` - Array with 6 requirements
- ✅ `acceptance_criteria` - Array with 6 criteria
- ✅ `edge_cases` - Array with 6 edge case scenarios
- ✅ `constraints` - Array with 4 constraints
- ✅ `created_at` - Valid ISO 8601 timestamp

### Quality Checks ✅
- ✅ Task description is clear and specific
- ✅ Workflow type matches the nature of work
- ✅ Services are actual project components
- ✅ Requirements are actionable
- ✅ Acceptance criteria are measurable
- ✅ Constraints are explicit
- ✅ User confirmed before creation

## Key Takeaways

1. **Iterative Clarification**: Agent asked multiple rounds of questions to build complete understanding
2. **Context-Aware**: Referenced actual services from project structure
3. **User Validation**: Confirmed understanding before creating output
4. **Comprehensive Coverage**: Captured functional requirements, acceptance criteria, AND constraints
5. **Quality Output**: Valid JSON with all required fields and clear, actionable content

## Next Steps

After requirements.json is created:

1. **Context Discovery Agent** will:
   - Read requirements.json
   - Analyze auth-service, api-gateway, and user-service
   - Find relevant files for OAuth integration and 2FA
   - Create context.json with files to modify/reference

2. **Spec Writer Agent** will:
   - Expand requirements into detailed specification
   - Document OAuth flow, 2FA enrollment process
   - Define API contracts and data models
   - Create spec.md

3. **Planner Agent** will:
   - Break down into subtasks
   - Create implementation plan with phases
   - Define verification steps
   - Generate implementation_plan.json

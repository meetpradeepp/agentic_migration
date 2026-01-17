# Spec Writer Agent Instructions

## Overview

These instructions guide GitHub Copilot when working with the Spec Writer agent. This agent synthesizes project context, requirements, and discovered files into comprehensive specification documents.

## Request Detection

Invoke the spec-writer agent when:

### Direct Requests
- "write a spec for this feature"
- "create spec.md from the requirements"
- "generate specification document"
- "synthesize the context into a spec"

### Contextual Triggers
- requirements.json and context.json both exist
- Complexity assessment shows "standard" or "complex"
- Orchestrator workflow reaches spec writing phase
- User needs comprehensive specification before implementation

### File Indicators
- `requirements.json` exists
- `context.json` exists
- `project_index.json` exists
- No `spec.md` exists yet

## DO ✅

### Context Loading
- **Read ALL input files** - project_index.json, requirements.json, context.json
- **Extract specific data** - Service names, ports, file paths, patterns
- **Use research.json if available** - For complex tasks with integrations
- **Reference complexity_assessment.json** - For validation recommendations

### Specification Writing
- **Include ALL 12 required sections** - Overview through QA Acceptance Criteria
- **Be specific with file paths** - Use exact paths from context.json
- **Populate all tables** - Files to Modify, Files to Reference, test tables
- **Include code examples** - Patterns from reference files
- **Define concrete QA criteria** - Specific tests and verification steps

### Quality Standards
- **Length: 200-500 lines** - Comprehensive, not brief
- **Specificity over generality** - Exact paths, function names, line numbers
- **Actionable guidance** - Clear DO/DON'T lists
- **Measurable success criteria** - Verifiable completion indicators

## DON'T ❌

### Common Mistakes
- **Don't skip sections** - All 12 sections are required
- **Don't use placeholders** - "[TODO]", "[Fill this in]", etc.
- **Don't make up data** - Only use information from input files
- **Don't write generic specs** - Be specific to this project
- **Don't forget QA criteria** - Essential for validation
- **Don't create short specs** - Should be comprehensive

### Invalid Outputs
- **Don't output invalid markdown** - Check table alignment, code blocks
- **Don't leave tables empty** - Populate with real data
- **Don't omit patterns** - Include code examples or detailed descriptions
- **Don't skip edge cases** - From requirements.json edge_cases field

## Required Sections (All 12 in Order)

### 1. Overview
**Purpose**: One paragraph summary of the task  
**Content**:
- What is being built/changed
- Why it's needed
- High-level approach

**Example**:
> This specification outlines the implementation of user authentication using OAuth 2.0 with Google provider. The feature enables users to sign in with their Google accounts and includes support for two-factor authentication. Implementation involves adding authentication middleware to the API gateway and creating a dedicated auth service.

---

### 2. Workflow Type
**Purpose**: Classification and rationale  
**Content**:
- Workflow type (feature|refactor|investigation|migration|simple)
- Justification for classification
- Impact on planning approach

**Example**:
```markdown
**Type**: feature

**Rationale**: This is a multi-service feature addition involving new authentication infrastructure across the API gateway and auth service. Requires external integration (Google OAuth), database schema changes, and comprehensive testing.
```

---

### 3. Task Scope
**Purpose**: Define boundaries of work  
**Content**:
- Services involved and their roles
- What will be changed (new features, modifications)
- What is explicitly out of scope

**Example**:
```markdown
**Services Involved**:
- `auth-service` (primary) - OAuth flow, token management
- `api-gateway` (integration) - Route protection, token validation

**In Scope**:
- Google OAuth 2.0 integration
- JWT token generation and validation
- Session management
- 2FA enrollment and verification

**Out of Scope**:
- Other OAuth providers (Facebook, GitHub)
- Password-based authentication
- Account recovery flows
```

---

### 4. Service Context
**Purpose**: Technical details per service  
**Content**: For EACH service involved:
- Tech stack (language, framework, dependencies)
- Entry point (main file)
- How to run (command)
- Port number
- Key dependencies

**Example**:
```markdown
#### auth-service
- **Tech Stack**: Node.js 18, Express 4.18, TypeScript 5.0
- **Entry Point**: `src/index.ts`
- **Run Command**: `npm run dev`
- **Port**: 3001
- **Dependencies**: passport, passport-google-oauth20, jsonwebtoken

#### api-gateway
- **Tech Stack**: Node.js 18, Express 4.18, TypeScript 5.0
- **Entry Point**: `src/server.ts`
- **Run Command**: `npm start`
- **Port**: 3000
- **Dependencies**: express-jwt, cors
```

---

### 5. Files to Modify
**Purpose**: Exact files that will be changed  
**Content**: Table format

| File | Service | What to Change |
|------|---------|----------------|
| `src/auth/oauth.ts` | auth-service | Add Google OAuth strategy |
| `src/auth/tokens.ts` | auth-service | Implement JWT generation |
| `src/middleware/auth.ts` | api-gateway | Add token validation |
| `src/routes/auth.ts` | auth-service | Create OAuth callback route |

---

### 6. Files to Reference
**Purpose**: Existing code to use as patterns  
**Content**: Table format

| File | Pattern to Copy |
|------|-----------------|
| `src/auth/local-strategy.ts` | Passport strategy setup structure |
| `src/middleware/cors.ts` | Middleware registration pattern |
| `src/utils/jwt.ts` | Token signing/verification utilities |
| `src/config/passport.ts` | Passport configuration approach |

---

### 7. Patterns to Follow
**Purpose**: Code examples or detailed implementation guidance  
**Content**:
- Actual code snippets from reference files
- OR detailed step-by-step descriptions
- Highlight key points to replicate

**Example**:
````markdown
#### OAuth Strategy Pattern
Based on `src/auth/local-strategy.ts`:

```typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user
  // Return user object
}));
```

**Key Points**:
- Use environment variables for credentials
- Implement async callback for user lookup
- Follow error handling pattern from local-strategy
````

---

### 8. Requirements
**Purpose**: Functional requirements and edge cases  
**Content**:
- All user requirements from requirements.json
- All acceptance criteria from requirements.json
- All edge cases from requirements.json
- Any additional derived requirements

**Example**:
```markdown
**Functional Requirements**:
1. Users can initiate Google OAuth flow
2. Successful auth returns JWT token
3. Tokens expire after 24 hours
4. 2FA can be enabled/disabled per user
5. Protected routes validate tokens

**Edge Cases**:
- OAuth flow cancellation by user
- Expired OAuth tokens
- Invalid JWT tokens
- Concurrent login attempts
- 2FA code expiration

**Constraints**:
- Must support 10,000 concurrent users
- Token validation < 50ms
- GDPR compliant data handling
```

---

### 9. Implementation Notes
**Purpose**: Clear DO/DON'T guidance  
**Content**:
- DO list (recommended practices)
- DON'T list (anti-patterns to avoid)
- Based on codebase patterns and best practices

**Example**:
```markdown
**DO**:
✅ Use environment variables for OAuth credentials  
✅ Validate tokens on every protected route  
✅ Hash and salt 2FA secrets  
✅ Log authentication attempts for security  
✅ Return generic errors to client (security)  

**DON'T**:
❌ Store tokens in localStorage (use httpOnly cookies)  
❌ Expose OAuth secrets in client code  
❌ Skip CSRF protection on auth endpoints  
❌ Return detailed error messages to client  
❌ Allow weak 2FA backup codes  
```

---

### 10. Development Environment
**Purpose**: How to run and test locally  
**Content**:
- Commands to start services
- URLs to access
- Environment variables needed
- Database setup (if applicable)

**Example**:
```markdown
**Commands**:
```bash
# Start auth service
cd auth-service && npm run dev

# Start API gateway
cd api-gateway && npm start

# Run both with Docker
docker-compose up
```

**URLs**:
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- OAuth Callback: http://localhost:3000/auth/google/callback

**Environment Variables**:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

**Database**:
```bash
# Run migrations
npm run migrate

# Seed test data
npm run seed
```
```

---

### 11. Success Criteria
**Purpose**: Checklist for completion  
**Content**:
- All acceptance criteria from requirements.json
- Technical completion criteria
- Integration verification steps

**Example**:
```markdown
**Acceptance Criteria**:
- [ ] Users can click "Sign in with Google" button
- [ ] OAuth flow redirects to Google and back
- [ ] JWT token is generated on successful auth
- [ ] Protected routes reject invalid tokens
- [ ] 2FA enrollment flow works
- [ ] 2FA verification required when enabled

**Technical Criteria**:
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Code reviewed and approved
- [ ] Documentation updated

**Integration Verification**:
- [ ] OAuth flow completes in < 3 seconds
- [ ] Token validation works across services
- [ ] 2FA codes expire after 30 seconds
```

---

### 12. QA Acceptance Criteria
**Purpose**: Detailed testing requirements  
**Content**:
- Unit test requirements (tables)
- Integration test scenarios (tables)
- E2E test flows (tables)
- Browser/database verification steps

**Example**:
```markdown
#### Unit Tests

| Test File | Function | Test Case | Expected Result |
|-----------|----------|-----------|-----------------|
| auth.test.ts | generateToken() | Valid user data | Returns JWT string |
| auth.test.ts | generateToken() | Missing user ID | Throws error |
| middleware.test.ts | validateToken() | Valid token | Calls next() |
| middleware.test.ts | validateToken() | Expired token | Returns 401 |

#### Integration Tests

| Service | Endpoint | Scenario | Expected Response |
|---------|----------|----------|-------------------|
| auth-service | POST /auth/google | OAuth success | 200 + JWT token |
| auth-service | POST /auth/google | OAuth failure | 401 + error |
| api-gateway | GET /protected | Valid token | 200 + data |
| api-gateway | GET /protected | No token | 401 + error |

#### E2E Tests

| Test Flow | Steps | Verification |
|-----------|-------|--------------|
| Complete OAuth | 1. Click Google sign in<br>2. Approve on Google<br>3. Redirect back | User logged in, token in cookie |
| 2FA Enrollment | 1. Enable 2FA<br>2. Scan QR code<br>3. Enter code | 2FA enabled, backup codes shown |
| Protected Route | 1. Access /dashboard<br>2. Without token | Redirected to login |

#### Browser Verification

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Verify redirect to Google
4. Approve access
5. Verify redirect back to app
6. Check Network tab for JWT cookie
7. Access protected route
8. Verify successful response

#### Database Verification

```sql
-- Verify user created
SELECT * FROM users WHERE oauth_provider = 'google';

-- Verify 2FA secret stored
SELECT user_id, totp_secret FROM two_factor_auth;
```
```

---

## Section Length Guidelines

- **Overview**: 3-5 sentences
- **Workflow Type**: 2-3 paragraphs
- **Task Scope**: 10-15 lines
- **Service Context**: 5-10 lines per service
- **Files to Modify**: 3-20 files (depends on task)
- **Files to Reference**: 2-10 files
- **Patterns to Follow**: 20-100 lines with code examples
- **Requirements**: All from requirements.json + derived
- **Implementation Notes**: 5-10 DO items, 5-10 DON'T items
- **Development Environment**: All setup steps
- **Success Criteria**: All acceptance criteria + technical
- **QA Acceptance Criteria**: Comprehensive test tables (largest section)

**Total Target**: 200-500 lines for complete spec

## Integration Points

### Upstream Dependencies
- **Spec Gatherer**: Provides requirements.json
- **Context Discovery**: Provides context.json (files to modify/reference)
- **Spec Researcher**: Provides research.json (for complex tasks)
- **Complexity Assessor**: Provides validation recommendations

### Downstream Consumers
- **Planner Agent**: Uses spec.md to create implementation_plan.json
- **Implementation Agent**: Uses spec.md for coding guidance
- **QA Agent**: Uses QA Acceptance Criteria for validation

### File Locations
- **Inputs**: `planning/project_index.json`, `planning/requirements.json`, `planning/context.json`
- **Output**: `planning/spec.md`
- All in UTF-8 encoding

## Example Invocations

### Example 1: Standard Feature
```markdown
User: "Create the spec from the gathered requirements"
Copilot: [Reads requirements.json, context.json, project_index.json]

[Analyzes implementation strategy]
[Writes comprehensive spec.md with all 12 sections]
[Verifies all sections present]

"Spec created: 247 lines
All required sections present ✓
Files to modify: 4 files across 2 services
Ready for implementation planning"

✅ Specification complete!

Now automatically proceeding to implementation planning...

Call to subagent planner
```

### Example 2: Complex Integration
```markdown
User: "Write spec for the Stripe integration"
Copilot: [Reads requirements.json, research.json, context.json]

[Incorporates research findings for Stripe API patterns]
[Documents configuration requirements from research]
[Creates comprehensive QA criteria for payment testing]

"Spec created: 412 lines
Includes Stripe API patterns from research.json
QA criteria includes payment security verification
Ready for planning"

✅ Specification complete!

Now automatically proceeding to implementation planning...

Call to subagent planner
```

## Validation Checklist

After creating spec.md, verify:

- [ ] File exists in planning directory
- [ ] Length >= 200 lines
- [ ] All 12 required sections present
- [ ] Overview section has one paragraph summary
- [ ] Workflow Type section has type and rationale
- [ ] Files to Modify table populated with specific paths
- [ ] Files to Reference table populated with patterns
- [ ] Patterns to Follow section has code examples or descriptions
- [ ] Requirements section includes all acceptance criteria
- [ ] Edge cases from requirements.json included
- [ ] QA Acceptance Criteria has all test tables
- [ ] Success Criteria checklist includes all acceptance criteria
- [ ] Valid markdown syntax (tables aligned, code blocks closed)
- [ ] No placeholder or TODO content

## Troubleshooting

### "Spec too short"
**Problem**: spec.md is < 100 lines  
**Solution**: Expand sections with more detail, add pattern examples, complete QA tables  
**Prevention**: Target 200-500 lines for comprehensive specs

### "Missing sections"
**Problem**: Required section not present  
**Solution**: Append missing section with appropriate content  
**Command**: Use grep to identify missing sections, then append

### "Empty tables"
**Problem**: Tables have headers but no data rows  
**Solution**: Review context.json and populate with actual file paths  
**Prevention**: Ensure context discovery ran successfully

### "Generic content"
**Problem**: Spec lacks project-specific details  
**Solution**: Use exact data from input files, not generic descriptions  
**Prevention**: Always reference project_index.json for service details

## Best Practices

### Specificity
- Use exact file paths: `src/services/auth/middleware.ts` not "the middleware file"
- Reference specific functions: `validateToken()` not "validation logic"
- Include line numbers when known: "Update line 42 in auth.ts"

### Patterns
- Include actual code snippets from reference files
- If code not available, provide detailed step-by-step description
- Highlight key points to notice and replicate

### QA Criteria
- Name specific test files: `auth.test.ts` not "auth tests"
- Define exact test scenarios: "Verify 401 on expired token"
- Include browser URLs for frontend: `http://localhost:3000/login`

## References

- **Agent Definition**: [.github/agents/spec-writer.agent.md](.github/agents/spec-writer.agent.md)
- **System Prompt**: [.github/prompts/spec-writer.prompt.md](.github/prompts/spec-writer.prompt.md)
- **Related Agents**: spec-gatherer, spec-researcher, complexity-assessor, planner
- **Context Discovery**: context.json schema
- **Requirements**: requirements.json schema

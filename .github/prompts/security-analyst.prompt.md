# Security Analyst Agent Prompt Template

## Prompt Structure

Use this template when invoking the security analyst agent:

```markdown
@security-analyst Please perform a comprehensive security audit of the implemented code.

## Context

**Feature**: [Feature name from implementation_plan.json]
**Workflow Type**: [feature|refactor|bugfix|migration]
**QA Status**: [approved|not_run] (from validation_results.json if exists)

## Files to Review

[List all modified files from implementation_plan.json or specify manually]

Example:
- src/auth/login.ts
- src/auth/session.ts
- src/components/LoginForm.tsx
- src/api/user.service.ts

## Security Focus Areas

[Specify areas of concern, or use defaults below]

### Required Scans
- [ ] SAST (Static Analysis): Secrets, injection, XSS, data leakage
- [ ] DAST (Logic Analysis): Access control, race conditions, error handling
- [ ] Supply Chain: Dependencies and CVE checks
- [ ] Governance: Architecture compliance and test coverage

### Feature-Specific Concerns
[Add any specific security concerns for this feature]

Example:
- Authentication bypass potential
- Session hijacking risks
- Password storage security
- Rate limiting on login attempts

## Compliance Requirements

[Specify if applicable]

- [ ] OWASP Top 10 2021 compliance
- [ ] PCI-DSS (payment data)
- [ ] HIPAA (health data)
- [ ] GDPR (EU user data)
- [ ] SOC 2 controls

## Expected Output

Please generate:
1. **security_review.json** - Structured findings
2. **Markdown Report** - Human-readable summary with:
   - Security verdict (PASS/BLOCK/WARNING)
   - Risk score (CRITICAL/HIGH/MEDIUM/LOW)
   - Detailed findings table
   - Remediation steps
   - Blocking issues (if any)

## Additional Context

[Optional: Provide any additional context that helps security review]

Example:
- This is a high-traffic endpoint (10k req/min)
- Handles sensitive PII data
- Integrates with third-party payment provider
- Must comply with internal security policy: [link]
```

---

## Invocation Examples

### Example 1: Post-QA Security Review

```markdown
@security-analyst The implementation has passed QA validation. Please perform a comprehensive security audit before merge.

## Context

**Feature**: User Authentication System
**Workflow Type**: feature
**QA Status**: approved (validation_results.json shows all tests passed)

## Files to Review

- src/auth/login.ts
- src/auth/register.ts
- src/auth/session.service.ts
- src/auth/password.util.ts
- src/middleware/auth.middleware.ts
- src/components/LoginForm.tsx
- src/components/RegisterForm.tsx

## Security Focus Areas

### Required Scans
- [x] SAST: Check for hardcoded secrets, SQL injection, XSS
- [x] DAST: Verify access control, session management
- [x] Supply Chain: Audit bcrypt/jsonwebtoken dependencies
- [x] Governance: Ensure auth tests cover security scenarios

### Feature-Specific Concerns
- Password storage using bcrypt with appropriate work factor
- JWT token security (expiration, signature verification)
- Session management (HttpOnly, Secure, SameSite cookies)
- Rate limiting on login/register endpoints
- SQL injection prevention in user queries
- XSS prevention in user input fields

## Compliance Requirements

- [x] OWASP Top 10 2021 compliance
- [x] Internal security policy: minimum password length 12 characters
- [x] Session timeout: 30 minutes of inactivity

## Expected Output

Generate security_review.json and provide detailed findings. Block merge if any CRITICAL or HIGH severity issues found.
```

### Example 2: Payment Integration Security Audit

```markdown
@security-analyst Please audit the Stripe payment integration for PCI-DSS compliance and security vulnerabilities.

## Context

**Feature**: Stripe Payment Integration
**Workflow Type**: feature
**QA Status**: approved

## Files to Review

- src/payment/stripe.ts
- src/payment/checkout.tsx
- src/payment/webhook.ts
- src/api/payment.routes.ts

## Security Focus Areas

### Required Scans
- [x] SAST: No card data stored locally, secrets management
- [x] DAST: Webhook signature verification, amount manipulation
- [x] Supply Chain: Stripe SDK version and security
- [x] Governance: PCI-DSS compliance checklist

### Feature-Specific Concerns
- **CRITICAL**: No card numbers/CVV stored in database or logs
- **CRITICAL**: Stripe webhook signatures verified
- **HIGH**: Payment amounts validated server-side (no client trust)
- **HIGH**: HTTPS enforced for all payment endpoints
- **MEDIUM**: Stripe API keys in environment variables
- **MEDIUM**: Payment error messages don't leak sensitive info

## Compliance Requirements

- [x] PCI-DSS SAQ A compliance (Stripe handles card data)
- [x] No sensitive data in application logs
- [x] TLS 1.2+ enforced
- [x] Webhook replay attack prevention

## Expected Output

Provide PCI-DSS compliance report in addition to standard security review.
```

### Example 3: Quick Security Scan

```markdown
@security-analyst Quick security scan of authentication changes in src/auth/login.ts

Focus on:
- SQL injection prevention
- Password handling
- Session security
```

### Example 4: Dependency Security Check

```markdown
@security-analyst Please review the new dependencies added in this PR for security vulnerabilities.

## Context

**Feature**: Add data visualization dashboard
**New Dependencies**:
- chart.js@4.4.0
- lodash@4.17.21
- axios@1.6.2

## Security Focus Areas

- [x] Check for known CVEs in dependencies
- [x] Verify minimal dependency footprint
- [x] Check if native alternatives exist
- [x] Review dependency licenses

## Expected Output

Flag any dependencies with known vulnerabilities or unnecessary attack surface.
```

---

## Workflow Integration Prompts

### Orchestrator to Security Analyst

```markdown
## 🔒 Security Gate (Phase 5)

QA validation complete. Initiating security review.

@security-analyst Please perform comprehensive security audit:

**Feature**: [From implementation_plan.json]
**Modified Files**: [From implementation_plan.json]
**QA Status**: APPROVED (validation_results.json)

Run full security scan (SAST + DAST + Supply Chain + Governance).

Generate security_review.json and report findings.
```

### Security Analyst to Validation Fixer

```markdown
## 🔧 Auto-Remediation Request

Security scan found X fixable issues.

@validation-fixer Please fix the following security issues:

**From**: security_review.json

**Fixable Issues**:
1. Remove console.log with sensitive data at auth.ts:67
2. Update lodash@4.17.15 to 4.17.21 (CVE-2020-8203)
3. Add missing HttpOnly flag to session cookie

**Manual Review Required**:
- CRITICAL: Hardcoded AWS key at api.ts:42 (requires manual fix)

After fixes, re-run: @security-analyst
```

---

## Custom Security Scans

### API Security Scan

```markdown
@security-analyst Audit REST API endpoints for security

Focus Areas:
- Authentication/authorization on all endpoints
- Input validation and sanitization
- Rate limiting implementation
- CORS configuration
- API versioning security
- Error handling (no stack traces leaked)

Files:
- src/api/routes/*.ts
- src/middleware/*.ts
```

### Database Security Scan

```markdown
@security-analyst Review database access layer for security

Focus Areas:
- SQL injection prevention (parameterized queries)
- Connection string security (no hardcoded passwords)
- Least privilege database user
- Query performance (DoS potential)
- Data encryption at rest

Files:
- src/database/client.ts
- src/repositories/*.ts
```

### Frontend Security Scan

```markdown
@security-analyst Audit React frontend for XSS and data exposure

Focus Areas:
- No dangerouslySetInnerHTML with user data
- Input sanitization in forms
- No sensitive data in localStorage (unencrypted)
- Content Security Policy headers
- Secure API calls (credentials handling)

Files:
- src/components/**/*.tsx
- src/hooks/**/*.ts
```

---

## Severity-Specific Prompts

### Critical Vulnerability Response

```markdown
🚨 CRITICAL SECURITY ISSUE DETECTED

@security-analyst found CRITICAL vulnerability:
- Hardcoded AWS credentials at src/api.ts:42

**Immediate Actions Required**:
1. Revoke exposed credentials immediately
2. Remove from code and use environment variables
3. Audit AWS CloudTrail for unauthorized access
4. Re-run security scan after fix

**DO NOT MERGE** until resolved.
```

### Compliance Violation Response

```markdown
⚠️ COMPLIANCE VIOLATION DETECTED

@security-analyst found PCI-DSS violation:
- Card data stored in local storage (src/payment.ts:89)

**Required Actions**:
1. Remove all card data storage
2. Use Stripe.js tokenization
3. Update implementation to SAQ A compliance
4. Re-run compliance check

**MERGE BLOCKED** until compliant.
```

---

## Version History

- **v1.0** (2026-01-17): Initial security analyst prompt templates

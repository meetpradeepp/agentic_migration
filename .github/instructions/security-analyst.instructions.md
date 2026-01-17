# Security Analyst Agent Instructions for GitHub Copilot

## ⚡ WORKFLOW COMPLETION SIGNAL

**CRITICAL: Security analysis is the FINAL GATE before completion.**

✅ **After security analysis completes:**

**If security PASSES:**
```
✅ Security analysis complete!

🔒 Security Status: APPROVED

✅ 🎉 WORKFLOW COMPLETE - Ready for PR/Merge! 🎉

All gates passed:
✅ Functional validation (qa-validator)
✅ Visual validation (ui-validator) [if applicable]
✅ Security analysis (security-analyst)

The feature is production-ready.
```

**If security FAILS:**
```
❌ Security analysis failed!

🔒 Security Status: BLOCKED

🛑 CRITICAL: Security issues must be resolved before merge.

Blocking issues found:
[list of security issues]

Recommendation: Address security issues and re-run workflow.
```

❌ **Do NOT auto-continue after security analysis** - this is the final gate
✅ **DO signal workflow completion** - user needs to know it's done

---

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the Security Analyst Agent. It ensures consistent, thorough security reviews that prevent vulnerabilities from reaching production.

## ⚠️ CRITICAL RULE: SECURITY GATE BEFORE MERGE

**The Security Analyst is a BLOCKER, not a SUGGESTER**:

❌ **NEVER** approve code with critical/high severity vulnerabilities  
❌ **NEVER** skip security checks because "tests pass"  
❌ **NEVER** accept "it works" as justification for insecure code  
❌ **NEVER** implement fixes yourself (delegate to validation-fixer or developer)

✅ **ALWAYS** scan all modified files for security issues  
✅ **ALWAYS** block merge if critical findings exist  
✅ **ALWAYS** provide actionable remediation steps  
✅ **ALWAYS** fail secure (if scan fails, block the merge)

**If you approve vulnerable code, you failed your mission.**

---

## When to Invoke the Security Analyst Agent

### ✅ Use Security Analyst For

**Post-Implementation Security Audits**:
- After code implementation is complete
- After QA validation passes
- Before merging to main branch
- When user requests security review

**Security-Critical Features**:
- Authentication/authorization changes
- Payment processing
- Data encryption
- API integrations
- Database queries
- File uploads/downloads
- User input handling

**Compliance Requirements**:
- PCI-DSS compliance checks
- HIPAA compliance validation
- GDPR data handling review
- SOC 2 control verification

**Request Patterns That Trigger Security Analyst**:
- "Run security scan"
- "Check for security vulnerabilities"
- "Security review before merge"
- "Audit authentication code"
- "Validate security compliance"

### ❌ Do NOT Use Security Analyst For

**Pre-Implementation Phase**:
- Spec writing (use spec-writer agent)
- Planning (use planner agent)
- Research (use spec-researcher agent)

**Non-Security Reviews**:
- Functional testing (use qa-validator)
- Code style/formatting (use validation-fixer)
- Documentation review

**Simple Changes**:
- Documentation-only changes
- Test-only changes (unless testing security features)
- Configuration changes (unless security-related)

---

## Request Detection Patterns

### High-Confidence Triggers

These phrases should **always** invoke the security analyst:

**Security Scans**:
- "security scan"
- "security review"
- "security audit"
- "check for vulnerabilities"
- "OWASP compliance"

**Pre-Merge Checks**:
- "ready to merge?"
- "security gate"
- "security approval"
- "security sign-off"

### Medium-Confidence Triggers

These phrases **likely** need security analyst:

**Feature-Specific**:
- "review authentication code"
- "check payment integration"
- "validate data encryption"
- "audit API security"

**Strategy**: Confirm with user:
```
"This involves security-critical code. Should I run a security scan?"
```

---

## Invocation Pattern

### Method 1: After QA Validation (Recommended)

```markdown
@security-analyst The implementation has passed QA validation. Please perform a comprehensive security audit.

**Context:**
- Feature: User authentication
- Files Modified: auth.ts, login.tsx, user.service.ts
- QA Status: Approved (validation_results.json)
- Implementation Plan: implementation_plan.json

**Focus Areas:**
- Input validation in authentication
- Session management
- Password handling
- SQL injection prevention
```

### Method 2: Standalone Security Review

```markdown
@security-analyst Please audit the payment processing module for security vulnerabilities.

**Files to Review:**
- src/payment/stripe.ts
- src/payment/checkout.tsx
- src/payment/webhook.ts

**Compliance Required:**
- PCI-DSS compliance
- Secure card data handling
```

### Method 3: Quick Security Check

```markdown
@security-analyst Quick security scan of auth changes in PR #123
```

---

## Inputs Required

### Mandatory Files

1. **implementation_plan.json** - Identifies files modified
   - OR list of specific files to audit

### Optional Files (Enhances Context)

2. **validation_results.json** - QA validation results
3. **spec.md** - Requirements and acceptance criteria
4. **requirements.json** - Feature requirements
5. **ADRs** - Architecture decisions affecting security

---

## Expected Output

The agent generates:

1. **security_review.json** - Structured security findings
2. **Markdown Report** - Human-readable security summary

### Output Structure

```json
{
  "security_status": "pass|block|warning",
  "risk_score": "critical|high|medium|low",
  "findings": [...],
  "blocking_issues": [...],
  "recommendations": [...]
}
```

---

## Validation After Invocation

After security review:

```bash
# Check security review was generated
test -f security_review.json && echo "✅ Security review complete"

# Check security status
STATUS=$(jq -r '.security_status' security_review.json)
echo "Security Status: $STATUS"

# Check for blocking issues
BLOCKING=$(jq -r '.blocking_issues | length' security_review.json)
if [ "$BLOCKING" -gt 0 ]; then
  echo "❌ BLOCKED: $BLOCKING critical issues found"
  jq -r '.blocking_issues[]' security_review.json
fi

# Check risk score
RISK=$(jq -r '.risk_score' security_review.json)
echo "Risk Score: $RISK"
```

---

## Integration with Other Agents

### Workflow Position

```
implementation_plan.json (completed)
       ↓
[@coder] - Implements code
       ↓
[@qa-validator] - Validates functionality
       ↓
validation_results.json (approved)
       ↓
[@security-analyst] ← YOU ARE HERE
       ↓
security_review.json
       ↓
If BLOCK → [@validation-fixer] or manual fix → re-scan
If WARNING → Manual review required
If PASS → Ready to merge
```

### Handoff to Validation Fixer

If security issues found:

```markdown
Security review found X vulnerabilities. Invoking validation-fixer for auto-remediation.

@validation-fixer Please fix the security issues identified in security_review.json:
- CRITICAL: Hardcoded secrets at src/api.ts:42
- HIGH: XSS vulnerability at src/TodoItem.tsx:15
```

---

## Security Scanning Checklist

For every review, ensure:

### SAST (Static Analysis)
- [ ] Scanned for hardcoded secrets/credentials
- [ ] Checked for SQL/NoSQL injection vulnerabilities
- [ ] Reviewed for XSS vulnerabilities
- [ ] Verified no sensitive data in logs
- [ ] Checked for command injection
- [ ] Reviewed crypto usage (no weak algorithms)

### DAST (Logic Analysis)
- [ ] Verified access control (IDOR prevention)
- [ ] Checked authentication/authorization
- [ ] Reviewed session management
- [ ] Analyzed race condition risks
- [ ] Checked error handling security
- [ ] Verified input validation

### Supply Chain
- [ ] Reviewed new dependencies
- [ ] Checked for known CVEs
- [ ] Verified minimal dependency footprint
- [ ] Checked package versions/updates

### Governance
- [ ] Verified architecture compliance
- [ ] Checked test coverage for security logic
- [ ] Reviewed against ADRs
- [ ] Validated compliance requirements

---

## Severity Classification

### CRITICAL (Block Merge Immediately)
- Hardcoded secrets/credentials
- SQL injection vulnerabilities
- Authentication bypass
- Remote code execution
- Data breach potential
- Complete access control failure

### HIGH (Block Merge, Fix Required)
- XSS vulnerabilities
- CSRF vulnerabilities
- IDOR (Insecure Direct Object References)
- Missing authentication
- Weak cryptography
- Session fixation

### MEDIUM (Warning, Review Required)
- Missing rate limiting
- Weak session management
- Information disclosure
- Missing input validation
- Dependency vulnerabilities (non-critical)
- Architecture violations

### LOW (Advisory, Can Merge)
- Code quality issues
- Missing security tests
- Commented-out code
- Non-security architecture violations
- Minor dependency updates needed

---

## Common Vulnerabilities to Check

### Authentication & Session
```typescript
// ❌ BAD: Weak session ID
const sessionId = Math.random().toString();

// ✅ GOOD: Cryptographically secure
const sessionId = crypto.randomUUID();
```

### Input Validation
```typescript
// ❌ BAD: No validation
const userId = req.params.id;
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ GOOD: Parameterized query
const userId = validateUserId(req.params.id);
db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### XSS Prevention
```tsx
// ❌ BAD: Unescaped HTML
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ GOOD: Escaped by default
<div>{userInput}</div>
```

### Secrets Management
```typescript
// ❌ BAD: Hardcoded
const API_KEY = "sk_live_abc123";

// ✅ GOOD: Environment variable
const API_KEY = process.env.STRIPE_API_KEY;
```

---

## Error Handling Patterns

### If Implementation Plan Missing

```markdown
## ⚠️ Security Scan Incomplete

**Issue**: No implementation_plan.json found

**Required Files**:
- implementation_plan.json (to identify modified files)
- OR explicit list of files to audit

**Action**: Please provide files to scan or run planner first.

**Security Status**: BLOCKED (cannot verify without context)
```

### If Critical Vulnerabilities Found

```markdown
## 🚨 MERGE BLOCKED - Critical Security Issues

**Blocking Issues**:
1. CRITICAL: Hardcoded AWS credentials at src/api.ts:42
2. CRITICAL: SQL injection at src/user.service.ts:156

**Next Steps**:
1. Fix all CRITICAL issues immediately
2. Re-run security scan: @security-analyst
3. Merge only after PASS status

**Escalation**: Manual security review required for credential management
```

---

## Best Practices

### DO:
✅ Read all modified files completely  
✅ Check both frontend and backend code  
✅ Review test files for security test coverage  
✅ Verify dependencies for known CVEs  
✅ Provide specific line numbers in findings  
✅ Include remediation steps for each finding  
✅ Link to OWASP/CWE references  
✅ Set approval_required for critical issues

### DON'T:
❌ Skip files because "they look safe"  
❌ Approve without checking all categories  
❌ Implement fixes yourself (delegate)  
❌ Ignore warnings in logs/console  
❌ Skip dependency checks  
❌ Assume frontend validation is enough  
❌ Trust commented-out code

---

## Examples

### Example 1: Authentication Security Review

**User Request**: "Security review for authentication module"

**Agent Actions**:
1. Identify auth-related files
2. Scan for:
   - Password storage (bcrypt/argon2?)
   - Session management (secure cookies?)
   - JWT handling (signature verification?)
   - Rate limiting (brute force protection?)
   - Input validation (SQL injection prevention?)
3. Generate security_review.json
4. Provide findings report

### Example 2: Payment Integration Review

**User Request**: "Audit Stripe payment integration for PCI compliance"

**Agent Actions**:
1. Review payment processing files
2. Check for:
   - No card data stored locally
   - Stripe.js used for tokenization
   - Webhook signature verification
   - HTTPS enforcement
   - No sensitive data in logs
3. Validate PCI-DSS requirements
4. Generate compliance report

---

## Integration Points

### With Orchestrator

The orchestrator should invoke security-analyst:
- After qa-validator approves
- Before allowing merge
- As part of complete workflow

### With Validation Fixer

Security-analyst can invoke validation-fixer for:
- Auto-fixing linting issues
- Removing console.log statements
- Updating dependencies
- Simple security fixes

But NOT for:
- Critical vulnerabilities (manual fix required)
- Architecture changes
- Complex security issues

---

## Quality Gates

Security review is **APPROVED** only if:
1. ✅ No CRITICAL findings
2. ✅ No HIGH findings (or acknowledged by security team)
3. ✅ All modified files scanned
4. ✅ Dependencies checked for CVEs
5. ✅ Architecture compliance verified
6. ✅ Security tests present for critical paths

Security review is **BLOCKED** if:
1. ❌ Any CRITICAL finding exists
2. ❌ HIGH finding without remediation plan
3. ❌ Scan failed to complete
4. ❌ Required files not accessible
5. ❌ Critical code path has no tests

---

## Continuous Improvement

After each security review:
- Document new vulnerability patterns found
- Update scanning checklist if gaps identified
- Improve remediation guidance
- Share learnings with team

---

## Version History

- **v1.0** (2026-01-17): Initial security analyst instructions for agentic migration workflows

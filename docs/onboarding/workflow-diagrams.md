# Visual Workflow Diagrams

## Complete Workflow (Complex Feature with ADR Approval)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INITIATES                              │
│                  "Add user authentication"                          │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: REQUIREMENTS GATHERING                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Agent: spec-gatherer                                               │
│  Input: User's natural language request                             │
│  Output: requirements.json                                          │
│  Duration: ~5 minutes                                               │
│                                                                      │
│  Asks clarifying questions:                                         │
│  - What auth methods? (email/password, OAuth, etc.)                 │
│  - Session management needed?                                       │
│  - Multi-factor auth required?                                      │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: COMPLEXITY ASSESSMENT                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Agent: complexity-assessor                                         │
│  Input: requirements.json                                           │
│  Output: complexity_assessment.json                                 │
│  Duration: ~3 minutes                                               │
│                                                                      │
│  Evaluates:                                                         │
│  - Scope: Multi-file changes ✓                                      │
│  - Integrations: External auth provider ✓                           │
│  - Risk: Security implications ✓                                    │
│  Result: COMPLEX → Full research needed                             │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: RESEARCH EXTERNAL OPTIONS                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Agent: spec-researcher                                             │
│  Input: requirements.json, complexity_assessment.json               │
│  Output: research.json (with architectural_decisions)               │
│  Duration: ~10 minutes                                              │
│                                                                      │
│  Researches:                                                        │
│  - Auth libraries: Passport.js vs Auth0 vs NextAuth                 │
│  - Token storage: JWT vs Sessions                                   │
│  - Security: bcrypt vs Argon2                                       │
│                                                                      │
│  Documents each decision with:                                      │
│  - Options, pros/cons, recommendation                               │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 4: GENERATE ARCHITECTURE DECISION RECORDS (ADRs)             │
├─────────────────────────────────────────────────────────────────────┤
│  Agent: adr-generator                                               │
│  Input: research.json, requirements.json                            │
│  Output: docs/adr/NNNN-*.md (status=PROPOSED)                       │
│  Duration: ~5 minutes                                               │
│                                                                      │
│  Creates formal decision documents:                                 │
│  - ADR-0012: Use Passport.js for authentication                     │
│  - ADR-0013: Store tokens using JWT                                 │
│  - ADR-0014: Hash passwords with bcrypt                             │
│                                                                      │
│  Each ADR includes:                                                 │
│  - Context (why we need this)                                       │
│  - Decision (what we chose)                                         │
│  - Consequences (pros/cons/tradeoffs)                               │
│  - Alternatives (what we rejected and why)                          │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ⏸️  WORKFLOW PAUSED - HUMAN APPROVAL REQUIRED  ⏸️                   │
├─────────────────────────────────────────────────────────────────────┤
│  Agent: orchestrator                                                │
│  Status: WAITING FOR USER RESPONSE                                  │
│  Duration: Minutes to days (user decides)                           │
│                                                                      │
│  Workflow stops and displays:                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ADR Review Required                                           │ │
│  │                                                               │ │
│  │ Generated ADRs:                                               │ │
│  │ - docs/adr/0012-use-passport-for-auth.md                      │ │
│  │ - docs/adr/0013-store-tokens-with-jwt.md                      │ │
│  │ - docs/adr/0014-hash-passwords-with-bcrypt.md                 │ │
│  │                                                               │ │
│  │ Please review before proceeding.                              │ │
│  │                                                               │ │
│  │ To Approve: @orchestrator ADR approved                        │ │
│  │ To Reject: @orchestrator ADR rejected, reason: [feedback]     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  User reads ADRs, considers:                                        │
│  ✓ Do we agree with the choices?                                    │
│  ✓ Does team have expertise?                                        │
│  ✓ Are consequences acceptable?                                     │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ├──── APPROVED ✅ ────────────┐
                  │                              │
                  ├──── REJECTED ❌ ─────┐       │
                  │                       │       │
                  ▼                       ▼       ▼
┌─────────────────────────────┐  ┌──────────────────────────────────┐
│  REJECTION BRANCH           │  │  APPROVAL BRANCH                 │
├─────────────────────────────┤  ├──────────────────────────────────┤
│  1. Update ADR: REJECTED    │  │  1. Update ADR: ACCEPTED         │
│  2. Capture feedback        │  │  2. Continue workflow            │
│  3. Research alternatives   │  │  3. Use approved decisions       │
│  4. Create new ADR          │  │                                  │
│  5. PAUSE AGAIN for review  │  │                                  │
└─────────────────────────────┘  └──────────┬───────────────────────┘
                                            │
                                            ▼
                        ┌─────────────────────────────────────────────┐
                        │  PHASE 5: WRITE SPECIFICATION               │
                        ├─────────────────────────────────────────────┤
                        │  Agent: spec-writer                         │
                        │  Input: requirements + research + ADRs      │
                        │  Output: spec.md                            │
                        │  Duration: ~15 minutes                      │
                        │                                             │
                        │  Creates comprehensive spec:                │
                        │  - Overview and objectives                  │
                        │  - Architecture (references ADRs)           │
                        │  - API endpoints                            │
                        │  - Database schema                          │
                        │  - Security requirements                    │
                        │  - QA criteria                              │
                        │                                             │
                        │  MUST follow ADR constraints:               │
                        │  ✓ Use Passport.js (per ADR-0012)           │
                        │  ✓ Use JWT tokens (per ADR-0013)            │
                        │  ✓ Use bcrypt (per ADR-0014)                │
                        └─────────────┬───────────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────────────────────────┐
                        │  PHASE 6: CREATE IMPLEMENTATION PLAN        │
                        ├─────────────────────────────────────────────┤
                        │  Agent: planner                             │
                        │  Input: spec.md                             │
                        │  Output: implementation_plan.json           │
                        │  Duration: ~10 minutes                      │
                        │                                             │
                        │  Breaks work into subtasks:                 │
                        │  1. Install Passport.js and dependencies    │
                        │  2. Create User model with bcrypt           │
                        │  3. Implement local auth strategy           │
                        │  4. Add JWT token generation                │
                        │  5. Create login/signup endpoints           │
                        │  6. Add auth middleware                     │
                        │  7. Write tests                             │
                        │                                             │
                        │  Each subtask has:                          │
                        │  - Description, files to modify             │
                        │  - Dependencies, verification steps         │
                        └─────────────┬───────────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────────────────────────┐
                        │  PHASE 7: IMPLEMENT CODE                    │
                        ├─────────────────────────────────────────────┤
                        │  Agent: coder                               │
                        │  Input: implementation_plan.json, spec.md   │
                        │  Output: Code commits                       │
                        │  Duration: ~2 hours (depends on complexity) │
                        │                                             │
                        │  Executes subtasks one at a time:           │
                        │  For each subtask:                          │
                        │  1. Read current codebase                   │
                        │  2. Implement changes                       │
                        │  3. Verify code works                       │
                        │  4. Create commit                           │
                        │  5. Move to next subtask                    │
                        │                                             │
                        │  Code quality standards:                    │
                        │  ✓ Complexity ≤ 10                          │
                        │  ✓ Functions < 50 lines                     │
                        │  ✓ JSDoc comments                           │
                        │  ✓ Input validation                         │
                        │  ✓ Error handling                           │
                        └─────────────┬───────────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────────────────────────┐
                        │  PHASE 8: VALIDATE QUALITY                  │
                        ├─────────────────────────────────────────────┤
                        │  Agent: qa-validator                        │
                        │  Input: spec.md, implementation code        │
                        │  Output: validation_results.json            │
                        │  Duration: ~20 minutes                      │
                        │                                             │
                        │  Runs comprehensive validation:             │
                        │  1. Linting (code style)                    │
                        │  2. Type checking                           │
                        │  3. Unit tests                              │
                        │  4. Integration tests                       │
                        │  5. E2E tests                               │
                        │  6. Security checks                         │
                        │  7. Performance checks                      │
                        │  8. QA criteria verification                │
                        │                                             │
                        │  Result: APPROVED ✅ or FAILED ❌            │
                        └─────────────┬───────────────────────────────┘
                                      │
                                      ├──── FAILED ❌ ────────┐
                                      │                       │
                                      ├──── APPROVED ✅       │
                                      │                       ▼
                                      │          ┌────────────────────┐
                                      │          │  AUTO-FIX ISSUES   │
                                      │          ├────────────────────┤
                                      │          │  validation-fixer  │
                                      │          │  Fixes:            │
                                      │          │  - Linting errors  │
                                      │          │  - Formatting      │
                                      │          │  - Type errors     │
                                      │          │  - Test failures   │
                                      │          │                    │
                                      │          │  Re-runs QA        │
                                      │          └────────┬───────────┘
                                      │                   │
                                      │                   │
                                      ▼◄──────────────────┘
                        ┌─────────────────────────────────────────────┐
                        │  ✅ COMPLETE - READY FOR DEPLOYMENT          │
                        ├─────────────────────────────────────────────┤
                        │  Deliverables:                              │
                        │  ✓ ADRs documenting architectural decisions │
                        │  ✓ Comprehensive specification              │
                        │  ✓ Working code (tested and validated)      │
                        │  ✓ Test coverage ≥ 80%                      │
                        │  ✓ All QA criteria passed                   │
                        │                                             │
                        │  Historical record:                         │
                        │  - Why decisions were made (ADRs)           │
                        │  - What was built (spec.md)                 │
                        │  - How it was implemented (commits)         │
                        │  - Quality validation (validation results)  │
                        └─────────────────────────────────────────────┘
```

## Simplified View (For Quick Understanding)

```
User Request
     ↓
Gather Requirements (spec-gatherer)
     ↓
Assess Complexity (complexity-assessor)
     ↓
Research Options (spec-researcher)
     ↓
Document Decisions (adr-generator)
     ↓
⏸️  PAUSE FOR APPROVAL  ⏸️
     ↓
Write Specification (spec-writer)
     ↓
Plan Implementation (planner)
     ↓
Write Code (coder)
     ↓
Validate Quality (qa-validator)
     ↓
Done! ✅
```

## Agent Responsibility Matrix

```
┌────────────────────┬──────────────┬──────────────┬────────────────┐
│ Agent              │ Input        │ Output       │ Duration       │
├────────────────────┼──────────────┼──────────────┼────────────────┤
│ spec-gatherer      │ User request │ requirements │ 5 min          │
│ complexity-        │ requirements │ complexity_  │ 3 min          │
│   assessor         │              │ assessment   │                │
│ spec-researcher    │ requirements │ research     │ 10 min         │
│ adr-generator      │ research     │ ADR files    │ 5 min          │
│ ⏸️  USER REVIEW    │ ADRs         │ approval     │ variable       │
│ spec-writer        │ research +   │ spec.md      │ 15 min         │
│                    │ ADRs         │              │                │
│ planner            │ spec.md      │ impl_plan    │ 10 min         │
│ coder              │ impl_plan    │ code         │ 1-4 hours      │
│ qa-validator       │ spec + code  │ validation   │ 20 min         │
│ validation-fixer   │ validation   │ fixes        │ 10 min         │
└────────────────────┴──────────────┴──────────────┴────────────────┘
```

## Decision Flow (Approval/Rejection)

```
ADR Generated (PROPOSED)
         │
         ▼
   ┌──────────┐
   │  REVIEW  │
   └────┬─────┘
        │
        ├─────────────────────┬─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    APPROVE ✅            REJECT ❌          REQUEST CHANGES 🔄
        │                     │                     │
        ▼                     ▼                     ▼
    ACCEPTED          Research Alternative      Revise ADR
        │                     │                     │
        ▼                     ▼                     ▼
  Continue to       Create New ADR          PAUSE AGAIN
   Spec Writer           │                         │
                         ▼                         │
                   PAUSE AGAIN ◄──────────────────┘
                         │
                         ▼
                   (Repeat Review)
```

## Time Estimates by Workflow Type

### Simple Workflow (No ADR)
```
Requirements → Quick Spec → Plan → Code → QA
   (2 min)      (2 min)    (1 min) (10 min) (5 min)
Total: ~20 minutes
```

### Standard Workflow (No ADR)
```
Requirements → Spec → Plan → Code → QA
   (5 min)    (15 min) (10 min) (1 hr) (20 min)
Total: ~2 hours
```

### Complex Workflow (With ADR)
```
Requirements → Complexity → Research → ADR → PAUSE → Spec → Plan → Code → QA
   (5 min)       (3 min)    (10 min)  (5 min) (varies) (15 min) (10 min) (2 hrs) (20 min)
Total: ~3 hours + review time
```

## Key Principles Illustrated

1. **Sequential Processing**: Each agent completes before next starts
2. **Data Handoffs**: JSON files connect agents
3. **Approval Gates**: Human review required for architectural decisions
4. **Quality Validation**: Automated testing before completion
5. **Historical Record**: ADRs preserve decision rationale

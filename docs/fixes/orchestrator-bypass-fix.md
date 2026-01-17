# Orchestrator Bypass Fix

**Date**: 2026-01-17  
**Issue**: Copilot bypassing orchestrator and implementing directly  
**Status**: ✅ ENFORCED

---

## Problem Description

Copilot was skipping the orchestrator entirely and implementing features directly, bypassing the agentic workflow system.

### Observed Behavior
```
User: "Add user authentication"
    ↓
❌ Copilot: "I'll create AuthService.ts..."
    ↓
[Files created without spec, plan, or workflow]
```

### Expected Behavior
```
User: "Add user authentication"
    ↓
✅ Call to subagent orchestrator
    ↓
[Orchestrator routes to workflow]
    ↓
[Complete agent chain executes]
    ↓
[Implementation with spec + plan + validation]
```

---

## Root Cause Analysis

### Primary Issues

1. **Weak Language**
   - Instructions said "Should we use agentic workflow?" (asking permission)
   - Used "recommended" and "should" instead of "MUST"
   - Copilot could choose to ignore the suggestion

2. **No Clear Definition**
   - Unclear what requires orchestrator vs direct implementation
   - "Significant changes" is too vague
   - No decision criteria

3. **Optional Behavior**
   - Orchestrator treated as an option, not a requirement
   - "ASK" step allowed Copilot to skip asking
   - No enforcement mechanism

4. **Buried Instructions**
   - Critical rule wasn't at the very top
   - Mixed with other content
   - Not prominent enough

---

## Solution Implemented

### 1. Mandatory Pre-Flight Check

Added **decision tree at the TOP** of copilot-instructions.md:

```
User makes a request
    ↓
Is it a trivial change?
    ↓ YES → Implement directly
    ↓ NO → STOP IMMEDIATELY → Invoke orchestrator FIRST
```

### 2. Auto-Invocation (No Asking)

**OLD** (weak):
```
ASK: "Should we use the agentic workflow?"
```

**NEW** (strong):
```
Call to subagent orchestrator
```

No questions. No analysis. Immediate invocation.

### 3. Clear Trivial Definition

**✅ Trivial (Can Skip Orchestrator)**:
- Typo fixes
- Documentation updates
- Formatting changes
- Import fixes
- Simple renames (single file)

**❌ NOT Trivial (MUST Use Orchestrator)**:
- New features
- Bug fixes/investigations
- New files/components
- Refactoring
- Configuration changes
- Dependencies
- API changes
- Database changes
- Tests
- Enhancements

**Default Rule**: If unsure → invoke orchestrator

### 4. Negative Examples

Added explicit "DO NOT DO THIS" examples:

```
❌ WRONG:
User: "Add feature"
    ↓
"I'll create files..." ← Bypassed orchestrator

❌ WRONG:
User: "Fix bug"
    ↓
"Let me investigate..." ← Bypassed orchestrator
```

### 5. Strong Enforcement Language

- **MANDATORY PRE-FLIGHT CHECK** (not "optional")
- **MUST invoke** (not "should")
- **STOP IMMEDIATELY** (not "consider")
- **DEFAULT BEHAVIOR** (not "recommended")

---

## Validation

### Test Cases

**Test 1: New Feature**
```
Input: "Add user login"
Expected: Call to subagent orchestrator (immediately)
No analysis, no questions, no implementation
```

**Test 2: Bug Fix**
```
Input: "Fix the search not working"
Expected: Call to subagent orchestrator (immediately)
No investigation, no debugging, no fixes
```

**Test 3: Investigation**
```
Input: "Why is the app slow?"
Expected: Call to subagent orchestrator (immediately)
No analysis, no profiling, no suggestions
```

**Test 4: Trivial Change**
```
Input: "Fix typo in README"
Expected: Fix typo directly (no orchestrator)
```

**Test 5: Edge Case**
```
Input: "Update button color"
Expected: Call to subagent orchestrator (design change = non-trivial)
```

### Success Criteria

✅ **PASS**: Orchestrator invoked as first action for non-trivial requests  
✅ **PASS**: No "I'll implement..." or "Let me analyze..." responses  
✅ **PASS**: Trivial changes handled directly without orchestrator  
✅ **PASS**: Edge cases default to orchestrator when unclear  

❌ **FAIL**: Any file creation without prior workflow  
❌ **FAIL**: Analysis or investigation without orchestrator  
❌ **FAIL**: "Should we use workflow?" questions  

---

## Known Limitations

### 1. Compliance-Based Enforcement

- Still relies on Copilot reading and following instructions
- Not a technical gate or validation check
- Very prominent placement reduces likelihood of bypass

### 2. Context Window Position

- Instructions must be loaded in context
- If truncated, enforcement may weaken
- Monitor for context window issues

### 3. Trivial Edge Cases

- Some requests may be ambiguous (trivial vs non-trivial)
- Default to orchestrator when in doubt
- May over-invoke orchestrator initially (better than under-invoking)

---

## Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Language** | "Should we use..." | "MUST invoke..." |
| **Position** | Middle of file | TOP of file |
| **Behavior** | Ask permission | Auto-invoke |
| **Definition** | Vague ("significant") | Explicit list |
| **Examples** | Positive only | Negative examples added |
| **Enforcement** | Weak ("recommended") | Strong ("MANDATORY") |
| **Default** | Unclear | Default to orchestrator |

---

## Impact Assessment

### Positive Outcomes

✅ **Reduced Bypass Rate**: Orchestrator invocation now mandatory and automatic  
✅ **Clear Decision Criteria**: Developers know exactly when to use orchestrator  
✅ **Consistent Workflow**: All non-trivial work goes through proper workflow  
✅ **Better Quality**: Spec + plan + validation for all features  

### Potential Concerns

⚠️ **Over-Invocation**: May invoke orchestrator for borderline cases  
- **Mitigation**: Better to over-invoke than bypass critical workflow

⚠️ **Slower for Simple Tasks**: Workflow overhead for minor changes  
- **Mitigation**: Clear trivial definition minimizes this

⚠️ **User Experience**: More structured, less "helpful assistant"  
- **Mitigation**: This is intentional - prioritize correctness over speed

---

## Monitoring & Metrics

Track these metrics to measure effectiveness:

1. **Bypass Rate**: % of requests that skip orchestrator when they shouldn't
2. **False Positives**: % of trivial requests incorrectly routed to orchestrator
3. **User Intervention**: # of times user needs to correct routing
4. **Workflow Completion**: % of orchestrator invocations that complete successfully

**Target**:
- Bypass rate: <5% (down from ~30%+ before fix)
- False positives: <10% (acceptable trade-off)
- Workflow completion: >90%

---

## Rollback Plan

If this creates too much friction:

1. **Partial Rollback**: Keep strong language, restore "ASK" step
2. **Full Rollback**: Revert to commit before 3cdbab8
3. **Alternative**: Add user-configurable "workflow-mode" setting

---

## Next Steps

1. ✅ Monitor real-world usage for bypass attempts
2. ⬜ Collect metrics on orchestrator invocation rate
3. ⬜ Refine trivial definition based on edge cases
4. ⬜ Add technical validation gate (if compliance insufficient)
5. ⬜ Create "workflow audit log" to track bypasses

---

## Related Issues

- **Workflow Stoppage**: Fixed in [workflow-stoppage-fix.md](workflow-stoppage-fix.md)
- **Spec-Gatherer Q&A Stop**: Fixed in [workflow-stoppage-fix.md](workflow-stoppage-fix.md)

---

## Changelog

- **2026-01-17**: Initial enforcement implemented (commit 3cdbab8)
- **2026-01-17**: Documentation created

# 🛑 STOP - Read This First!

## Before You Start Coding

If a user asks you to create/add/implement a new feature or component, **STOP** and follow this decision tree:

```
User Request: "Add/Create/Implement [feature]"
                    ↓
        ┌───────────┴───────────┐
        │   Is this a new       │
        │   feature/component?  │
        └───────────┬───────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
         YES                 NO
          │                   │
          ↓                   ↓
    ┌─────────────┐      ┌──────────────┐
    │ USE AGENTIC │      │ Implement    │
    │  WORKFLOW   │      │ Directly     │
    └─────────────┘      └──────────────┘
          │
          ↓
   Ask: "Should we use
   the agentic workflow?"
          │
          ↓
   Invoke @orchestrator
   or @spec-gatherer
```

## ✅ When to Use Agentic Workflow

**MUST use orchestrator/agents for:**
- ✅ New feature development
- ✅ Adding new components, services, or modules
- ✅ Architectural changes or decisions
- ✅ Complex refactoring or migrations
- ✅ Integration with external systems
- ✅ Database schema changes
- ✅ Creating new context providers, hooks, or state management

## ❌ When You Can Skip It

**Can implement directly:**
- ❌ Simple typo fixes
- ❌ Documentation updates
- ❌ Code formatting changes
- ❌ Updating existing code to follow established patterns
- ❌ Minor bug fixes in existing code

## ⚠️ Real Example from Logs

**What Happened (WRONG):**
```
User: "Create global state management"
Copilot: "Now let's create the task context for global state management:
          Create task-manager/src/contexts/TaskContext.tsx..."
User: "Are we implementing? What about orchestrator?"
```

**What Should Have Happened (RIGHT):**
```
User: "Create global state management"
Copilot: "This looks like a new feature requiring state management 
          architecture. Should we use the agentic workflow system to 
          properly plan this?"
User: "Yes"
Copilot: "@orchestrator I need to plan global state management feature"
```

## 🚨 Red Flags That You're Bypassing the Workflow

If you find yourself doing ANY of these **without a spec.md or implementation_plan.json**, STOP:

1. Creating new files/components directly
2. Installing new dependencies
3. Making architectural decisions
4. Adding new services or modules
5. Creating context providers, hooks, or state management
6. Integrating external APIs or libraries

## 📋 Correct Workflow Sequence

```
1. User Request
        ↓
2. Recognize it's a new feature
        ↓
3. ASK: "Should we use the agentic workflow?"
        ↓
4. Invoke @orchestrator or @spec-gatherer
        ↓
5. Gather requirements → requirements.json
        ↓
6. Assess complexity → complexity_assessment.json
        ↓
7. Research if needed → research.json
        ↓
8. Generate ADR if complex → docs/adr/*.md (APPROVAL GATE)
        ↓
9. Write spec → spec.md
        ↓
10. Create plan → implementation_plan.json
        ↓
11. NOW you can implement code (via @coder agent)
```

## 🎯 Quick Reference

| User Says | You Should |
|-----------|------------|
| "Add user authentication" | Ask: "Should we use agentic workflow?" → @orchestrator |
| "Create global state" | Ask: "Should we use agentic workflow?" → @spec-gatherer |
| "Fix typo in header" | Implement directly (simple fix) |
| "Add real-time notifications" | Ask: "Should we use agentic workflow?" → @orchestrator |
| "Update button color" | Implement directly (simple change) |
| "Integrate Stripe payments" | Ask: "Should we use agentic workflow?" → @orchestrator |

## 💡 Why This Matters

**Without the workflow:**
- ❌ No architectural review
- ❌ No complexity assessment  
- ❌ No approval gates
- ❌ Risk of implementing wrong approach
- ❌ Wasted time on rewrites

**With the workflow:**
- ✅ Proper planning and design
- ✅ Architectural decisions documented
- ✅ Stakeholder approval before coding
- ✅ Clear implementation path
- ✅ Quality validation built-in

## 🔗 See Also

- [Critical Workflow Rule](../.github/copilot-instructions.md#️-critical-workflow-rule)
- [Orchestrator Usage Guide](./orchestrator-usage.md)
- [Onboarding Guide](./onboarding/README.md)

---

**Remember: When in doubt, ask. Don't jump straight to code.**

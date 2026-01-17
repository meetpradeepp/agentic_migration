# MoSCoW Prioritization Framework

## Overview

MoSCoW is a prioritization technique used to categorize requirements and features into four categories: **Must Have**, **Should Have**, **Could Have**, and **Won't Have**. This framework ensures ruthless prioritization and clear stakeholder alignment.

## Categories

### Must Have (Critical)

**Definition**: Non-negotiable requirements that are critical for the project's success. Without these, the product doesn't work or deliver core value.

**Characteristics**:
- Core functionality required for MVP
- Addresses primary pain points
- Product is unusable/invalid without it
- Legal or regulatory requirement
- Major business risk if omitted

**Target Distribution**: 20-30% of features

**Examples**:
- User authentication in a SaaS app
- Payment processing in an e-commerce platform
- Core workflow (e.g., "Create and save documents")
- Data persistence and retrieval
- Critical bug fixes affecting core functionality

**Test**: "Can we launch without this?" If answer is no, it's a Must Have.

---

### Should Have (Important)

**Definition**: Important features that add significant value but aren't critical for initial launch. These can be deferred to a later phase if necessary.

**Characteristics**:
- Enhances core experience significantly
- Addresses secondary pain points
- Strong user demand
- Competitive differentiator
- Can be delivered in Phase 2

**Target Distribution**: 30-40% of features

**Examples**:
- Notification system in a collaboration tool
- Search functionality (if workaround exists)
- User profile customization
- Export/import features
- Mobile responsive design (if desktop-first)

**Test**: "Will users complain if this isn't in v1?" If yes but they'll still use the product, it's a Should Have.

---

### Could Have (Nice-to-Have)

**Definition**: Desirable features that would improve the experience but have limited impact if omitted. These are "bonus" features if time/budget allows.

**Characteristics**:
- Enhances user experience
- Addresses edge cases or convenience
- Low risk if deferred
- Can wait for user feedback
- "Polish" features

**Target Distribution**: 30-40% of features

**Examples**:
- Dark mode / theme customization
- Keyboard shortcuts
- Advanced filtering options
- Analytics dashboard (for internal use)
- Tooltip help text

**Test**: "Would users notice if this wasn't there?" If most users wouldn't care, it's a Could Have.

---

### Won't Have (Out of Scope)

**Definition**: Features that are explicitly out of scope for the current timeline. May be considered for future versions but not now.

**Characteristics**:
- Out of scope for current project goals
- Low value vs effort (time sinks)
- User demand is unclear
- Conflicts with vision or strategy
- Can be revisited later

**Target Distribution**: 5-10% of total ideas

**Examples**:
- Mobile app (when building web app first)
- AI-powered features (when building simple MVP)
- Multi-language support (for single-market launch)
- Advanced integrations (before core product proven)
- Over-engineered solutions to simple problems

**Test**: "Is this aligned with our current goals and resources?" If no, it's a Won't Have.

---

## Application Guidelines

### Step 1: List All Features
- Brainstorm all possible features without filtering
- Capture ideas from user research, pain points, goals, gaps

### Step 2: Categorize
- For each feature, ask the priority test questions
- Place into Must/Should/Could/Won't buckets
- Be ruthless - default to lower priority unless strong justification

### Step 3: Validate Distribution
- Count features in each category
- Aim for target distributions (20-30% Must, 30-40% Should, 30-40% Could)
- If too many "Must Haves," challenge each one

### Step 4: Sequence
- Must Haves go to Phase 1 (Foundation)
- Should Haves go to Phase 2 (Enhancement)
- Could Haves go to Phase 3+ (Scale/Future)
- Won't Haves are documented but not planned

---

## Decision Framework

Use this decision tree:

```
Is it required for core functionality?
├─ Yes → Is it legally/critically required?
│  ├─ Yes → MUST HAVE
│  └─ No → Can we launch without it?
│     ├─ No → MUST HAVE
│     └─ Yes → SHOULD HAVE
└─ No → Does it add significant value?
   ├─ Yes → Will users complain loudly?
      ├─ Yes → SHOULD HAVE
      └─ No → COULD HAVE
   └─ No → Is it aligned with current goals?
      ├─ Yes → COULD HAVE
      └─ No → WON'T HAVE
```

---

## Common Mistakes

### Too Many Must Haves
**Problem**: Everything feels critical
**Solution**: Ask "What's the absolute minimum to prove value?" Force hard choices.

### No Won't Haves
**Problem**: Not explicitly de-scoping
**Solution**: Document what you're NOT doing to manage expectations

### Vague Criteria
**Problem**: "Important" vs "Critical" is unclear
**Solution**: Use the test questions for each category

### Ignoring Dependencies
**Problem**: Should Have depends on Won't Have
**Solution**: Map dependencies first, then prioritize

---

## Examples by Project Type

### SaaS Application
- **Must**: Auth, core workflow, data persistence, basic UI
- **Should**: Notifications, search, collaboration features
- **Could**: Dark mode, keyboard shortcuts, analytics
- **Won't**: Mobile app, AI features, advanced integrations

### CLI Tool
- **Must**: Core command execution, config file support, error handling
- **Should**: Interactive mode, auto-complete, help documentation
- **Could**: Plugins, themes, telemetry
- **Won't**: GUI version, cloud sync, marketplace

### Library/SDK
- **Must**: Core API, documentation, basic examples
- **Should**: TypeScript definitions, middleware support
- **Could**: CLI for scaffolding, advanced examples
- **Won't**: Visual builder, hosted service

---

## Re-Prioritization Triggers

Revisit MoSCoW prioritization when:
- User feedback contradicts assumptions
- Market conditions change (competitor launches feature)
- Technical constraints discovered (complexity higher than expected)
- Business priorities shift
- MVP validation completes

---

## Summary

MoSCoW prioritization ensures:
✅ Clear stakeholder alignment on what's in/out of scope
✅ Ruthless focus on delivering core value
✅ Realistic planning based on constraints
✅ Flexibility to adjust as learnings emerge

**Remember**: The goal is not to do everything, but to do the right things at the right time.

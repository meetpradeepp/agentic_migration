# Priority Matrix: Impact vs Complexity

## Overview

The Priority Matrix is a 2x2 framework for evaluating features based on two dimensions:
- **Impact**: Value delivered to users and business
- **Complexity**: Effort and difficulty to implement

This creates four quadrants that guide execution strategy.

---

## The Matrix

```
         High Impact
              │
              │
    Big Bets  │  Quick Wins
              │
──────────────┼──────────────  
              │              High
    Time Sinks│  Fill-ins    Complexity
              │
         Low Impact
```

---

## Quadrant 1: Quick Wins (High Impact + Low Complexity)

### Definition
Features that deliver significant user/business value with minimal effort.

### Strategy
**DO FIRST** - Prioritize these heavily in Phase 1 (Foundation/MVP)

### Characteristics
- 1-2 days of work
- Touches 1-3 files
- Addresses core pain point
- No architectural changes needed
- Clear, simple implementation

### Examples
- Simple UI improvement that addresses major usability issue
- Configuration option that unlocks important use case
- Basic feature that fills critical gap
- Remove friction point in existing flow

### Execution Tips
- Batch multiple quick wins together
- Use to build momentum in early phases
- Great for proving value quickly
- Low risk - ship fast and iterate

---

## Quadrant 2: Big Bets (High Impact + High Complexity)

### Definition
Strategic features that deliver major value but require significant investment.

### Strategy
**PLAN CAREFULLY** - Include in roadmap but plan execution thoroughly

### Characteristics
- 1-2 weeks of work
- Touches 10+ files
- May require architectural changes
- Core differentiator or major feature
- Needs design, testing, documentation

### Examples
- Complete workflow redesign
- Integration with third-party platform
- Real-time collaboration feature
- Advanced search with AI/ML
- Performance optimization requiring refactoring

### Execution Tips
- Break into smaller milestones
- Validate approach with spike/prototype first
- Plan dependencies carefully
- Consider phased rollout
- May span multiple phases

---

## Quadrant 3: Fill-ins (Low Impact + Low Complexity)

### Definition
Easy improvements that add polish but don't significantly move the needle.

### Strategy
**DO IF TIME** - Include after quick wins and big bets are complete

### Characteristics
- < 1 day of work
- Single file or component
- Nice-to-have enhancement
- Low user demand
- Polish or convenience

### Examples
- UI polish (rounded corners, better spacing)
- Additional keyboard shortcuts
- Minor text/label improvements
- Tooltip help text
- Console logging improvements

### Execution Tips
- Great for new contributors
- Use to fill gaps in sprint capacity
- Don't let these crowd out higher priorities
- Batch several together
- Can defer indefinitely without harm

---

## Quadrant 4: Time Sinks (Low Impact + High Complexity)

### Definition
Features that require significant effort but deliver limited value.

### Strategy
**AVOID** - Actively de-prioritize or eliminate from roadmap

### Characteristics
- > 1 week of work
- Architectural complexity
- Addresses edge case or minority need
- Unclear user demand
- High maintenance burden

### Examples
- Over-engineered solution to simple problem
- Complex feature for power users only
- Premature optimization
- Gold-plating existing features
- Building for hypothetical future needs

### Execution Tips
- Question whether these belong in roadmap
- Look for simpler alternatives
- Consider "Won't Have" in MoSCoW
- If must do, look for ways to reduce complexity
- Avoid unless strong business justification

---

## Assessment Framework

### Impact Criteria (High/Medium/Low)

**High Impact**:
- Addresses primary user pain point
- Enables core workflow
- Strong differentiator vs competitors
- Directly drives key metric (revenue, engagement, retention)
- High user demand (based on research/feedback)
- **Addresses pain point from competitor analysis**

**Medium Impact**:
- Improves existing workflow
- Addresses secondary pain point
- Moderate user demand
- Enhances experience but not critical
- Competitive parity feature

**Low Impact**:
- Addresses edge case
- Cosmetic improvement
- Low/unclear user demand
- Internal convenience
- Hypothetical future need

### Complexity Criteria (Low/Medium/High)

**Low Complexity** (1-2 days):
- 1-3 files modified
- Single component/module
- No external dependencies
- Well-understood implementation
- Minimal testing required
- No architectural changes

**Medium Complexity** (3-10 days):
- 3-10 files modified
- Multiple components/modules
- May require new dependencies
- Some unknowns in implementation
- Integration testing needed
- Minor architectural changes

**High Complexity** (10+ days):
- 10+ files modified
- Cross-cutting concerns
- Major dependencies or integrations
- Significant unknowns
- Extensive testing required
- Architectural changes or refactoring needed

---

## Plotting Features

For each feature, ask:

### Impact Questions
1. How many users does this affect?
2. How severe is the pain point it addresses?
3. Does this enable a core workflow?
4. Will this differentiate us from competitors?
5. Does it drive a key business metric?

### Complexity Questions
1. How many files/components are affected?
2. Do we understand the implementation clearly?
3. Are there unknowns or risks?
4. How much testing is required?
5. Does it require architectural changes?

### Scoring
- 3+ "yes" answers to impact = High Impact
- 1-2 "yes" = Medium, 0 = Low
- Similar for complexity

---

## Execution Strategy

### Phase 1 (Foundation / MVP)
- **Prioritize**: Quick Wins
- **Include**: Selected Big Bets (1-2 maximum)
- **Defer**: Fill-ins, Time Sinks

### Phase 2 (Enhancement)
- **Prioritize**: Remaining Big Bets
- **Include**: Quick Wins and Fill-ins
- **Defer**: Time Sinks

### Phase 3+ (Scale / Future)
- **Consider**: Fill-ins for polish
- **Re-evaluate**: Time Sinks (can complexity be reduced?)

---

## Decision Tree

```
Assess feature impact:
├─ High Impact
│  ├─ Low Complexity → QUICK WIN (Do First)
│  └─ High Complexity → BIG BET (Plan Carefully)
└─ Low Impact
   ├─ Low Complexity → FILL-IN (Do If Time)
   └─ High Complexity → TIME SINK (Avoid)
```

---

## Common Patterns

### Misclassified Big Bets
**Symptom**: Feature seems like quick win but keeps expanding
**Solution**: Re-assess complexity. Break into smaller features.

### Hidden Quick Wins
**Symptom**: Underestimating value of simple improvements
**Solution**: Talk to users. Simple fixes to major annoyances = high impact.

### Time Sink Trap
**Symptom**: Building complex solution because it's "interesting"
**Solution**: Challenge whether simpler approach exists. Focus on user value.

### Fill-in Creep
**Symptom**: Lots of small features crowding out strategic work
**Solution**: Batch fill-ins. Limit to 20% of capacity.

---

## Examples

### Example 1: Task Management App

**Quick Wins** (Phase 1):
- One-click task creation (high impact, low complexity)
- Keyboard shortcuts for common actions
- Default due date to "today"

**Big Bets** (Phase 1-2):
- Real-time collaboration (high impact, high complexity)
- Mobile app (high impact, high complexity)
- Advanced filtering and search

**Fill-ins** (Phase 2-3):
- Dark mode
- Custom color themes
- Animation polish

**Time Sinks** (Avoid):
- AI-powered task recommendations (complex, unproven value)
- Custom workflow engine (over-engineered for user needs)

---

### Example 2: Developer CLI Tool

**Quick Wins** (Phase 1):
- Single command deployment (high impact, low complexity)
- Config file validation with helpful errors
- Progress indicators for long operations

**Big Bets** (Phase 1-2):
- Plugin system (high impact, high complexity)
- CI/CD integration (high impact, high complexity)
- Interactive TUI mode

**Fill-ins** (Phase 2-3):
- Colored output
- Verbose logging mode
- Auto-update check

**Time Sinks** (Avoid):
- GUI version (complex, unclear demand)
- Cloud-hosted dashboard (complex, not core value)

---

## Summary

The Priority Matrix helps you:
✅ Identify high-ROI features (quick wins)
✅ Plan strategic investments (big bets)
✅ Avoid wasted effort (time sinks)
✅ Balance polish and progress (fill-ins)

**Golden Rule**: Maximize quick wins, carefully select big bets, minimize time sinks, sprinkle in fill-ins.

# Onboarding Guide for New Team Members

Welcome! This guide will help you understand the agentic migration framework and how to work with it effectively.

## What is This Project?

This project is an **agentic workflow system** that breaks down complex software development tasks into manageable phases using specialized AI agents.

**Think of it like an assembly line**, where each station (agent) has a specific job:

```
User Request
    ↓
[Discovery] → Understands the project
    ↓
[Planning] → Creates feature roadmap
    ↓
[Research] → Investigates technical options
    ↓
[ADR] → Documents architectural decisions → ⏸️ APPROVAL GATE
    ↓
[Spec] → Writes detailed specification
    ↓
[Plan] → Creates implementation steps
    ↓
[Code] → Writes the actual code
    ↓
[QA] → Validates quality
    ↓
Done!
```

## Core Concepts (5-Minute Understanding)

### 1. Agents = Specialists

Each agent is a specialist that does ONE thing well:

| Agent | What It Does | Analogy |
|-------|-------------|---------|
| **roadmap-discovery** | Analyzes project to understand purpose | Market researcher |
| **roadmap-features** | Creates strategic feature list | Product manager |
| **spec-researcher** | Researches external APIs/libraries | Technical researcher |
| **adr-generator** | Documents architectural decisions | Architect presenting options |
| **spec-writer** | Writes detailed specifications | Technical writer |
| **planner** | Breaks work into subtasks | Project planner |
| **coder** | Implements the code | Developer |
| **qa-validator** | Tests and validates | QA engineer |

### 2. Workflows = Sequences

Workflows chain agents together for specific goals:

**Example: Adding a new feature**

1. User: "Add user authentication"
2. **spec-gatherer**: Asks clarifying questions → `requirements.json`
3. **complexity-assessor**: Determines this is COMPLEX → `complexity_assessment.json`
4. **spec-researcher**: Researches JWT vs OAuth → `research.json`
5. **adr-generator**: Creates decision docs → `docs/adr/0012-use-jwt.md` (PAUSED)
6. User: Reviews and approves ADR
7. **spec-writer**: Writes detailed spec → `spec.md`
8. **planner**: Creates subtasks → `implementation_plan.json`
9. **coder**: Implements code → commits
10. **qa-validator**: Runs tests → `validation_results.json`

### 3. JSON Files = Handoffs

Agents communicate through JSON files (like paperwork in an office):

```
spec-researcher writes research.json
         ↓
adr-generator reads research.json, writes docs/adr/*.md
         ↓
spec-writer reads research.json + ADRs, writes spec.md
         ↓
planner reads spec.md, writes implementation_plan.json
         ↓
coder reads implementation_plan.json, writes code
```

**If a file is missing**, the workflow stops (like missing paperwork).

### 4. Approval Gates = Checkpoints

Some phases require human approval before proceeding:

```
ADR Generated (status=PROPOSED)
         ↓
    ⏸️ PAUSE ⏸️
         ↓
Human Reviews Document
         ↓
    Approve ✅ or Reject ❌
         ↓
Workflow Continues or Branches
```

**Why?** Large decisions (database choice, framework change) are expensive to reverse. Getting approval first prevents wasted work.

## Common Workflows Explained

### Workflow 1: Quick Fix (Simple)

**User**: "Fix typo in header"

```
spec-gatherer → spec-quick → planner → coder → qa-validator
   (2 min)       (2 min)      (1 min)  (5 min)    (3 min)
```

**Total time**: ~13 minutes  
**No ADRs needed**: Following existing patterns

---

### Workflow 2: New Feature (Complex)

**User**: "Add real-time notifications"

```
spec-gatherer → complexity-assessor → spec-researcher
   (5 min)           (3 min)              (10 min)
                                             ↓
                                      adr-generator
                                         (5 min)
                                             ↓
                                      ⏸️ PAUSE ⏸️
                                             ↓
                                     Human Approves
                                         (1 day)
                                             ↓
spec-writer → planner → coder → qa-validator
  (15 min)    (10 min)  (2 hrs)    (20 min)
```

**Total time**: ~3 hours + 1 day review  
**ADRs required**: WebSockets vs Server-Sent Events decision

---

### Workflow 3: Complete Project Planning

**User**: "Create roadmap for this project"

```
roadmap-discovery → roadmap-features → (planner per feature)
     (15 min)            (20 min)           (10 min each)
```

**Output**: 
- Understanding of project (`roadmap_discovery.json`)
- Prioritized features (`roadmap.json`)
- Implementation plans for each feature

## How to Work With the System

### As a Developer

**Starting a task**:
```bash
# Option 1: Let orchestrator decide workflow
@orchestrator "Add user authentication"

# Option 2: Invoke specific agent
@spec-gatherer "I need requirements for auth feature"
```

**Reviewing ADRs**:
1. Read the ADR file in `docs/adr/`
2. Check if you agree with the decision
3. Look at consequences (tradeoffs)
4. Respond:
   - Approve: `@orchestrator ADR approved`
   - Reject: `@orchestrator ADR rejected, reason: [feedback]`

**Implementing code**:
- Read `spec.md` for requirements
- Read `implementation_plan.json` for subtasks
- Read ADRs in `docs/adr/` for architectural constraints
- Code according to specifications

### As a Reviewer/Tech Lead

**Your responsibilities**:
1. **Review ADRs** when workflow pauses
   - Check if decision aligns with team standards
   - Verify consequences are acceptable
   - Ensure team has expertise for chosen approach

2. **Approve/Reject thoughtfully**
   - Approve: Work continues with this approach
   - Reject: Work stops, alternative is researched
   - Request changes: ADR is revised

3. **Provide clear feedback**
   ```
   # Good rejection
   @orchestrator ADR rejected, reason: Team lacks Redis expertise, prefer in-memory cache

   # Bad rejection
   @orchestrator ADR rejected
   ```

## File Structure Explained

```
/workspaces/agentic_migration/
├── .github/
│   ├── agents/              # Agent definitions (what each agent does)
│   │   ├── orchestrator.agent.md
│   │   ├── adr-generator.agent.md
│   │   └── ...
│   ├── prompts/             # Execution templates (how to run agents)
│   │   ├── adr-generator.prompt.md
│   │   └── ...
│   ├── instructions/        # Usage guidelines (when to invoke)
│   │   ├── adr-generator.instructions.md
│   │   └── ...
│   └── skills/              # Reusable capabilities
│       ├── subtask-planning/
│       └── ...
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   │   ├── 0001-use-typescript.md
│   │   ├── 0005-use-postgresql.md
│   │   └── ...
│   ├── planning/
│   │   └── features/        # Feature implementation plans
│   └── onboarding/          # YOU ARE HERE
└── README.md
```

## Common Questions

### Q: When do I need to create an ADR?

**A**: When making architectural decisions that:
- Affect multiple components (database, framework)
- Are expensive to reverse (migration, infrastructure)
- Have long-term impact (authentication approach)
- Involve external dependencies (APIs, services)

**No ADR needed for**:
- Bug fixes
- UI tweaks
- Following existing patterns
- Configuration changes

### Q: What if I disagree with an ADR?

**A**: Reject it with clear reasoning:
```
@orchestrator ADR rejected, reason: [explain your concern]
```

The workflow will:
1. Mark the ADR as REJECTED
2. Research alternatives
3. Generate a new ADR
4. Pause again for your review

### Q: Can I skip the approval gate?

**A**: No. Approval gates exist to prevent costly mistakes. However, if you have authority to approve, you can approve immediately:
```
@orchestrator ADR approved
```

### Q: How do I know what to review in an ADR?

**A**: Check these sections:
1. **Context**: Do we understand the problem correctly?
2. **Decision**: Is this the right choice?
3. **Consequences**: Are the tradeoffs acceptable?
4. **Alternatives**: Were all options considered?

If all look good → Approve  
If something's wrong → Reject with feedback

### Q: What happens if an agent fails?

**A**: The orchestrator will:
1. Show the error
2. Suggest remediation
3. Allow retry or manual intervention

Example:
```
ERROR: research.json not found
REMEDIATION: Run @spec-researcher first to generate research
```

## Next Steps

1. **Read the main README**: [/README.md](../../README.md)
2. **Review agent capabilities**: [.github/agents/](.github/../agents/)
3. **Try a simple workflow**: Start with `@orchestrator "analyze this project"`
4. **Review an example ADR**: [docs/adr/template.md](../adr/)

## Getting Help

- **Agent documentation**: See `.github/agents/[agent-name].agent.md`
- **Instructions**: See `.github/instructions/[agent-name].instructions.md`
- **Examples**: See `docs/planning/features/*/` for real implementation plans
- **Ask orchestrator**: `@orchestrator "How do I [task]?"`

---

**Welcome to the team! 🎉**

The agentic workflow takes time to understand, but once you get it, you'll appreciate how it:
- Prevents rework through upfront planning
- Documents decisions for future reference
- Breaks complex work into manageable pieces
- Maintains quality through automated validation

Start with small workflows, observe how agents coordinate, and gradually you'll master the system.

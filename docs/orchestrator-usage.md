# Orchestrator Agent Usage Guide

## Quick Start

The Orchestrator Agent coordinates multi-agent workflows. Here's how to use it effectively.

---

## How to Invoke

### Method 1: Direct Request (Recommended)

Simply ask Copilot to create a roadmap or coordinate planning:

```
"Create a complete roadmap for this project"
```

Copilot will:
1. Detect that this requires the orchestrator
2. Load the orchestrator agent definition
3. Execute the multi-agent workflow

### Method 2: Explicit Agent Reference

Reference the orchestrator explicitly if Copilot doesn't auto-detect:

```
"Use the orchestrator agent to generate a roadmap"
```

### Method 3: Workflow-Specific Request

Ask for specific workflows:

```
"Run project discovery and generate features"
"Create implementation plans from the roadmap"
"Analyze this project and prioritize features"
```

---

## Common Workflows

### Workflow 1: Complete Roadmap (Discovery → Features)

**Request**:
```
"Create a complete roadmap for this project from scratch"
```

**What Happens**:
1. Orchestrator invokes **Roadmap Discovery Agent**
   - Analyzes codebase
   - Generates `roadmap_discovery.json`
   - Shows findings for your review

2. You approve discovery findings

3. Orchestrator invokes **Roadmap Features Agent**
   - Uses discovery data
   - Generates `roadmap.json`
   - Shows feature priorities for your review

4. You approve roadmap

5. Orchestrator offers to plan specific features

**Time**: ~20-30 minutes

---

### Workflow 2: Discovery Only

**Request**:
```
"Run project discovery to understand this codebase"
```

**What Happens**:
1. Orchestrator invokes **Roadmap Discovery Agent**
2. Generates `roadmap_discovery.json`
3. Presents findings
4. Asks if you want to continue to features (optional)

**Time**: ~10 minutes

---

### Workflow 3: Features from Existing Discovery

**Request**:
```
"Generate features using the existing discovery data"
```

**Prerequisites**: `roadmap_discovery.json` must exist

**What Happens**:
1. Orchestrator validates discovery file exists
2. Invokes **Roadmap Features Agent**
3. Generates `roadmap.json`
4. Shows roadmap for approval

**Time**: ~15 minutes

---

### Workflow 4: Implementation Planning

**Request**:
```
"Create an implementation plan for the 'Simple Task Creation' feature"
```

**Prerequisites**: `roadmap.json` must exist (or provide spec.md)

**What Happens**:
1. Orchestrator extracts feature from roadmap
2. Creates `spec.md` if needed
3. Invokes **Planner Agent**
4. Generates `implementation_plan.json`
5. Shows subtask breakdown

**Time**: ~10 minutes per feature

---

## User Interaction Points

The orchestrator will pause at these points for your input:

### 1. Workflow Confirmation
```
## 🎯 Workflow Plan

**Detected Workflow**: Complete Roadmap Generation

**Required Agents**:
1. Roadmap Discovery → roadmap_discovery.json
2. Roadmap Features → roadmap.json

**Ready to proceed?**
```

**Your Response**: "Yes" / "Proceed" / "Start"

---

### 2. Agent Completion Review
```
## ✅ Discovery Complete

**Generated**: roadmap_discovery.json

**Key Findings**:
- Project Type: Task Management SaaS
- Target Audience: Small team leads
- Top Pain Point: "Tools are too complex"

**Proceed to feature generation?**
```

**Your Response**: "Proceed" / "Adjust [field]" / "Re-run"

---

### 3. Error Recovery
```
## ❌ Prerequisite Missing

**Missing**: roadmap_discovery.json
**Required For**: Features Agent

**Options**:
1. Run Discovery Agent to generate it
2. Create it manually

**Recommendation**: Run Discovery Agent

**Proceed with option 1?**
```

**Your Response**: Choose an option number or describe action

---

## Output Files

The orchestrator generates these files through its agents:

| File | Created By | Purpose |
|------|------------|---------|
| `roadmap_discovery.json` | Discovery Agent | Project understanding |
| `roadmap.json` | Features Agent | Strategic roadmap |
| `implementation_plan.json` | Planner Agent | Execution plan |
| `project_index.json` | Discovery Agent | Codebase structure |

All files are created in the project root.

---

## Example Full Session

**User**: "Create a complete roadmap for this project"

**Orchestrator**:
```markdown
## 🎯 Workflow Plan

**Detected Workflow**: Complete Roadmap Generation

**Phase 1**: Project Discovery (10 min)
- Analyze codebase structure
- Infer purpose and audience
- Generate roadmap_discovery.json

**Phase 2**: Feature Planning (15 min)
- Generate prioritized features
- Create roadmap.json

**Prerequisites**:
✅ Project code available
❌ project_index.json (will create)

**Ready to begin?**
```

**User**: "Yes"

**Orchestrator**:
```markdown
## 🚀 Phase 1: Discovery

Invoking Roadmap Discovery Agent...

[Executes discovery workflow]

## ✅ Discovery Complete

**Generated**: roadmap_discovery.json

**Key Findings**:
- **Project**: Task Management SaaS
- **Audience**: Small team leads (3-10 people)
- **Maturity**: MVP
- **Pain Point**: "Current tools too complex"

**Proceed to features?**
```

**User**: "Proceed"

**Orchestrator**:
```markdown
## 🚀 Phase 2: Features

Invoking Roadmap Features Agent...

[Executes features workflow]

## ✅ Features Complete

**Generated**: roadmap.json

**Summary**:
- 18 total features
- 5 Must Have (Foundation phase)
- 7 Should Have (Enhancement phase)
- 6 Could Have (Scale phase)

**Top Features**:
1. Simple Task Creation (Quick Win)
2. User Authentication (Must Have)
3. Task List View (Must Have)

**Select a feature to implement?**
```

**User**: "Plan feature #1"

**Orchestrator**:
```markdown
## 🚀 Phase 3: Implementation Planning

Creating plan for: Simple Task Creation

Invoking Planner Agent...

[Executes planner workflow]

## ✅ Plan Complete

**Generated**: implementation_plan.json

**Summary**:
- Workflow: FEATURE
- 3 phases
- 8 subtasks
- 2 parallel opportunities

**Location**: docs/planning/features/simple-task-creation/

**Ready to implement?**
```

---

## Tips for Best Results

### 1. Be Specific About Workflow

✅ **Good**: "Create a complete roadmap from discovery to features"
❌ **Vague**: "Help me plan"

### 2. Check for Existing Files

Before requesting workflows, check if these exist:
- `roadmap_discovery.json` - Skip to features if present
- `roadmap.json` - Skip to implementation if present

### 3. Review Outputs Before Proceeding

The orchestrator pauses for your review. Actually review the files:
```bash
cat roadmap_discovery.json | jq .
cat roadmap.json | jq '.features[] | {title, priority}'
```

### 4. Provide Feedback at Gates

If something looks wrong, say so:
```
"Re-run discovery, this is a CLI tool not a web app"
"Adjust priority of feature #3 to 'must have'"
```

### 5. Use Workflow Shortcuts

For experienced users:
```
"Discovery and features, auto-approve if valid"
```

---

## Troubleshooting

### "No agent matched your request"

**Solution**: Be more explicit
```
"Use the orchestrator agent to create a roadmap"
```

### "Required file missing"

**Solution**: Follow the recommended workflow sequence
```
Discovery → Features → Implementation
```

### "Agent output invalid"

**Solution**: The orchestrator will re-run automatically or ask for manual correction

---

## Advanced Usage

### Skipping User Gates (Experienced Users)

If you trust the agents and want faster execution:
```
"Run complete roadmap workflow, auto-proceed if outputs are valid"
```

The orchestrator will:
- Still validate outputs
- Still show summaries
- Only pause if errors occur

### Custom Workflows

Create custom sequences:
```
"Run discovery, then create implementation plans for must-have features only"
```

### Re-running Specific Agents

Fix issues without starting over:
```
"Re-run features agent with adjusted priorities"
"Re-run discovery focusing on competitive analysis"
```

---

## Summary

The Orchestrator Agent makes multi-agent workflows simple:

✅ **Request a workflow** → Orchestrator coordinates agents
✅ **Review at gates** → Approve or adjust before proceeding  
✅ **Get quality outputs** → Validated schemas and completeness
✅ **Recover from errors** → Actionable guidance when issues occur

Start with: `"Create a complete roadmap for this project"`

# Feature Template

## Overview

This template provides the standard structure for features in the product roadmap. All features should follow this format to ensure consistency and completeness.

---

## Feature Structure

```json
{
  "id": "feature-[number]",
  "title": "Clear, Action-Oriented Title",
  "description": "2-3 sentences explaining what this feature does",
  "rationale": "Why this matters for [target audience persona]",
  "priority": "must|should|could|wont",
  "complexity": "low|medium|high",
  "impact": "low|medium|high",
  "phase_id": "phase-[number]",
  "dependencies": ["feature-ids this depends on"],
  "status": "idea|planned|in-progress|completed|deferred",
  "acceptance_criteria": [
    "Testable criterion 1",
    "Testable criterion 2"
  ],
  "user_stories": [
    "As a [persona], I want to [action] so that [benefit]"
  ],
  "competitor_insight_ids": ["pain-point-id-1"]
}
```

---

## Field Definitions

### Required Fields

#### `id` (string)
- **Format**: `feature-[number]` (e.g., `feature-1`, `feature-42`)
- **Purpose**: Unique identifier for referencing in phases, dependencies, milestones
- **Example**: `"feature-5"`

#### `title` (string)
- **Format**: Clear, action-oriented, 3-10 words
- **Purpose**: Quick description of what the feature does
- **Guidelines**:
  - Use active verbs ("Create", "Enable", "Add", "Improve")
  - Be specific, not generic
  - Avoid jargon
- **Good Examples**:
  - "Simple Task Creation"
  - "One-Command Deployment"
  - "Real-Time Collaboration"
- **Bad Examples**:
  - "Tasks" (not action-oriented)
  - "Improve UX" (too vague)
  - "Implement advanced ML-based predictive analytics" (too technical/long)

#### `description` (string)
- **Format**: 2-3 sentences
- **Purpose**: Explain what the feature does in user terms
- **Guidelines**:
  - Start with what user can do
  - Include key details
  - Avoid implementation details
- **Example**:
  ```
  "Allow users to create tasks with a single click, requiring only title and assignee. 
  Task appears immediately in the board view without page reload."
  ```

#### `rationale` (string)
- **Format**: 1-2 sentences
- **Purpose**: Explain why this feature matters for target audience
- **Guidelines**:
  - Reference specific pain point or goal
  - Explain user benefit
  - Connect to business value
- **Example**:
  ```
  "Addresses core pain point of complexity - users need to create tasks quickly during 
  meetings without training or delay. Reduces friction in core workflow by 80%."
  ```

#### `priority` (enum)
- **Values**: `must`, `should`, `could`, `wont`
- **Purpose**: MoSCoW priority
- **See**: `references/moscow-prioritization.md` for detailed criteria

#### `complexity` (enum)
- **Values**: `low`, `medium`, `high`
- **Purpose**: Implementation effort estimate
- **Guidelines**:
  - **Low**: 1-2 days, 1-3 files, no architectural changes
  - **Medium**: 3-10 days, 3-10 files, some integration work
  - **High**: 10+ days, 10+ files, architectural changes

#### `impact` (enum)
- **Values**: `low`, `medium`, `high`
- **Purpose**: User/business value
- **Guidelines**:
  - **High**: Core pain point, differentiator, drives key metric
  - **Medium**: Improves experience, secondary need
  - **Low**: Edge case, polish, unclear demand

#### `phase_id` (string)
- **Format**: `phase-[number]` (e.g., `phase-1`)
- **Purpose**: Assign feature to execution phase
- **Example**: `"phase-1"` (Foundation/MVP)

#### `dependencies` (array of strings)
- **Format**: Array of feature IDs
- **Purpose**: Track which features must be completed first
- **Guidelines**:
  - Only include direct dependencies
  - Avoid circular dependencies
  - Empty array if no dependencies
- **Example**: `["feature-2", "feature-5"]` or `[]`

#### `status` (enum)
- **Values**: `idea`, `planned`, `in-progress`, `completed`, `deferred`
- **Purpose**: Track feature lifecycle
- **Default**: `idea` for new features

#### `acceptance_criteria` (array of strings)
- **Format**: Array of testable statements
- **Purpose**: Define "done" for this feature
- **Guidelines**:
  - Must be testable/verifiable
  - Use Given/When/Then or "User can..." format
  - Include 2-5 criteria
- **Examples**:
  ```json
  [
    "User can create task in < 10 seconds",
    "Only 2 required fields: title and assignee",
    "Task appears immediately without page reload",
    "Validation errors are clear and actionable"
  ]
  ```

#### `user_stories` (array of strings)
- **Format**: "As a [persona], I want to [action] so that [benefit]"
- **Purpose**: Connect feature to user value
- **Guidelines**:
  - Use actual persona from discovery
  - Focus on outcome, not implementation
  - Include 1-3 stories
- **Examples**:
  ```json
  [
    "As a team lead, I want to quickly capture action items during meetings so that nothing gets forgotten",
    "As a team member, I want to see new tasks immediately so that I know what to work on next"
  ]
  ```

### Optional Fields

#### `competitor_insight_ids` (array of strings)
- **Format**: Array of pain point IDs from competitor_analysis.json
- **Purpose**: Link feature to specific competitor pain points
- **When to Use**: Only if competitor_analysis.json exists
- **Example**: `["pain-point-asana-1", "pain-point-jira-3"]` or `[]`
- **Benefit**: Shows how feature addresses known competitor weaknesses

---

## Complete Examples

### Example 1: SaaS Task Management App

```json
{
  "id": "feature-1",
  "title": "Simple Task Creation",
  "description": "Allow users to create tasks with a single click, requiring only title and assignee. Task appears immediately in the board view without page reload.",
  "rationale": "Addresses core pain point of complexity - users need to create tasks quickly during meetings without training or delay. Competitor analysis shows users frustrated by 8-10 field forms in existing tools.",
  "priority": "must",
  "complexity": "low",
  "impact": "high",
  "phase_id": "phase-1",
  "dependencies": [],
  "status": "idea",
  "acceptance_criteria": [
    "User can create task in < 10 seconds",
    "Only 2 required fields: title and assignee",
    "Task appears immediately in board view",
    "Validation errors are clear and actionable"
  ],
  "user_stories": [
    "As a team lead, I want to quickly capture action items during meetings so that nothing gets forgotten",
    "As a team member, I want to create tasks without leaving the board view so that I stay in flow"
  ],
  "competitor_insight_ids": ["asana-pain-1", "jira-pain-3"]
}
```

### Example 2: Developer CLI Tool

```json
{
  "id": "feature-3",
  "title": "One-Command Deployment",
  "description": "Deploy application to staging or production with a single command. Automatically runs pre-deployment checks, builds assets, and handles rollback if deployment fails.",
  "rationale": "Eliminates manual deployment steps that cause errors and delays. Developers reported spending 30+ minutes on deployments with current process.",
  "priority": "must",
  "complexity": "medium",
  "impact": "high",
  "phase_id": "phase-1",
  "dependencies": ["feature-1", "feature-2"],
  "status": "idea",
  "acceptance_criteria": [
    "Command 'deploy staging' deploys successfully in < 5 minutes",
    "All pre-deployment checks run automatically",
    "Failed deployment triggers automatic rollback",
    "Deployment logs are saved and accessible",
    "User receives success/failure notification"
  ],
  "user_stories": [
    "As a backend engineer, I want to deploy with one command so that I can ship features faster and with fewer errors",
    "As a team lead, I want deployment to be automated so that junior developers can deploy confidently"
  ],
  "competitor_insight_ids": []
}
```

### Example 3: Enhancement Feature

```json
{
  "id": "feature-12",
  "title": "Keyboard Shortcuts for Common Actions",
  "description": "Add keyboard shortcuts for creating tasks (Ctrl+N), searching (Ctrl+K), and navigating between views (Ctrl+1/2/3). Display shortcut hints on hover.",
  "rationale": "Power users want faster navigation without using mouse. This is a common request from beta testers and improves efficiency for daily users.",
  "priority": "should",
  "complexity": "low",
  "impact": "medium",
  "phase_id": "phase-2",
  "dependencies": ["feature-1", "feature-5"],
  "status": "idea",
  "acceptance_criteria": [
    "Ctrl+N opens task creation modal",
    "Ctrl+K opens search dialog",
    "Ctrl+1/2/3 switches between Board/List/Calendar views",
    "Shortcuts are documented in help menu",
    "Shortcut hints appear on button hover"
  ],
  "user_stories": [
    "As a power user, I want keyboard shortcuts so that I can navigate faster without using my mouse",
    "As a new user, I want to discover shortcuts through hints so that I can gradually become more efficient"
  ],
  "competitor_insight_ids": []
}
```

---

## Validation Checklist

Before adding feature to roadmap.json, verify:

- [ ] `id` follows pattern `feature-[number]` and is unique
- [ ] `title` is clear, action-oriented, 3-10 words
- [ ] `description` is 2-3 sentences in user terms
- [ ] `rationale` explains why it matters for target audience
- [ ] `priority` aligns with MoSCoW framework
- [ ] `complexity` and `impact` are realistically assessed
- [ ] `phase_id` references valid phase
- [ ] `dependencies` contains only valid feature IDs, no circular deps
- [ ] `acceptance_criteria` has 2-5 testable criteria
- [ ] `user_stories` has 1-3 stories in proper format
- [ ] `competitor_insight_ids` is populated if competitor analysis exists

---

## Common Mistakes

### ❌ Vague Title
```json
"title": "Improve Performance"
```
✅ **Better**:
```json
"title": "Reduce Page Load Time to < 2 Seconds"
```

### ❌ Implementation-Focused Description
```json
"description": "Refactor the task service to use async/await and implement caching layer with Redis."
```
✅ **Better**:
```json
"description": "Speed up task loading by implementing caching. Users will see their task list load in under 1 second instead of 3-5 seconds."
```

### ❌ Missing Rationale
```json
"rationale": "Users want this feature"
```
✅ **Better**:
```json
"rationale": "Users reported frustration with slow task loading (3-5 seconds) causing delays in daily standup meetings. Faster loading enables real-time collaboration."
```

### ❌ Untestable Acceptance Criteria
```json
"acceptance_criteria": ["Feature works well", "Users are happy"]
```
✅ **Better**:
```json
"acceptance_criteria": [
  "Page load completes in < 2 seconds (measured by Lighthouse)",
  "User can see task list within 1 second of clicking 'Tasks' tab"
]
```

---

## Tips

1. **Write for humans, not machines** - Feature descriptions should be understandable by stakeholders
2. **Be specific** - "Reduce load time by 50%" is better than "Make it faster"
3. **Link to research** - Reference discovery data, user feedback, or competitor analysis
4. **Think incrementally** - Break large features into smaller ones if complexity is high
5. **Validate dependencies** - Ensure dependency chain makes sense and isn't circular
6. **Use competitor insights** - If available, link features to specific pain points in competitor products

---

## Summary

A well-written feature:
✅ Has clear, action-oriented title
✅ Describes what users can do, not how it's built
✅ Explains why it matters for target audience
✅ Is realistically prioritized and assessed
✅ Has testable acceptance criteria
✅ Connects to user value through stories
✅ Links to competitor pain points (if applicable)

Use this template to ensure all features in the roadmap are complete, consistent, and actionable.

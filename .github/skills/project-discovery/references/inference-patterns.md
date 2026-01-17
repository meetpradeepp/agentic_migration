# Inference Patterns for Project Discovery

## Overview

Since the Discovery Agent operates **non-interactively**, it must make educated inferences from available evidence. This guide provides repeatable patterns for extracting insights when explicit information is missing.

---

## Pattern 1: Project Type Inference

### Decision Matrix

| Evidence | Inferred Type | Confidence |
|----------|---------------|------------|
| `package.json` with React/Vue + Express/Fastify | `web-app` | High |
| `package.json` with React Native / Flutter | `mobile-app` | High |
| `bin/` directory + CLI framework (Click, Commander) | `cli` | High |
| Exports functions, no executable | `library` | High |
| OpenAPI spec / GraphQL schema | `api` | High |
| Electron/Tauri dependencies | `desktop-app` | High |
| Mixed or unclear | `other` | Low |

### Code Examples

```bash
# Check for web app indicators
grep -E "react|vue|angular|express|fastapi|flask" package.json pyproject.toml 2>/dev/null

# Check for CLI indicators
ls -la bin/ cli/ 2>/dev/null
grep -E "click|commander|yargs|argparse|clap" package.json requirements.txt Cargo.toml 2>/dev/null

# Check for API indicators
ls -la openapi.yaml swagger.json schema.graphql 2>/dev/null

# Check for library indicators (no main/bin)
cat package.json | jq -r '.main // .exports // "none"'
```

---

## Pattern 2: Target Audience from README

### Extraction Strategies

**Strategy 1: Explicit Mentions**

Look for phrases in README:
- "For [audience]..."
- "Designed for [audience]..."
- "Built by [audience] for [audience]..."
- "Helps [audience] to..."

```bash
cat README.md | grep -E "for |designed for |built by |helps " -A 2
```

**Strategy 2: Feature-Based Inference**

Features reveal audience:
- "Deploy to AWS/GCP/Azure" → DevOps engineers
- "Manage tasks across timezones" → Remote teams
- "Parse GraphQL schemas" → Backend developers

**Strategy 3: Use Case Analysis**

```bash
# Extract use case sections
cat README.md | sed -n '/## Use Cases/,/^##/p'
cat README.md | sed -n '/## Examples/,/^##/p'
```

**Strategy 4: Issue Label Analysis**

```bash
# If GitHub repo, check issue labels (requires gh CLI)
gh issue list --label "feature-request" --limit 20 --json title,body
```

### Persona Template

Format: `"[Role] who [context] to [goal]"`

Examples:
- "DevOps engineers who manage multi-cloud infrastructure to reduce deployment complexity"
- "Remote team leads who coordinate across timezones to improve async collaboration"

---

## Pattern 3: Pain Points Discovery

### Source 1: README Problem Statement

```bash
# Extract problem statements
cat README.md | grep -E "problem|challenge|difficult|manually|painful" -A 3
```

### Source 2: Competitor Comparison

README often mentions what competitors lack:

```bash
cat README.md | grep -E "unlike|whereas|compared to|instead of" -A 2
```

### Source 3: TODO/FIXME Comments

```bash
grep -r "TODO\|FIXME\|HACK" --include="*.ts" --include="*.py" . 2>/dev/null | head -20
```

Known issues → Pain points being addressed

### Pain Point Patterns

Common templates:
- "Manual [task] is error-prone"
- "No unified interface for [X, Y, Z]"
- "Difficult to track [outcome]"
- "[Process] requires [barrier]"

---

## Pattern 4: Value Proposition Extraction

### Source 1: Package Description

```bash
cat package.json | jq -r '.description'
cat pyproject.toml | grep "description = "
```

### Source 2: README Tagline

Usually in the first 3 lines:

```bash
head -5 README.md
```

### Source 3: Feature Differentiators

```bash
cat README.md | sed -n '/## Features/,/^##/p' | grep -E "first|only|unique|unlike"
```

### Value Prop Template

Format: `"[Benefit] through [method] so [outcome]"`

Examples:
- "Async collaboration through timezone-aware task management so teams avoid meeting overload"
- "Multi-cloud deployments through unified CLI so engineers reduce tool switching"

---

## Pattern 5: Maturity Level Calculation

### Quantitative Indicators

```bash
#!/bin/bash

# File count
file_count=$(find . -type f \( -name "*.ts" -o -name "*.py" \) \
  -not -path "*/node_modules/*" | wc -l)

# Lines of code
loc=$(find . -type f \( -name "*.ts" -o -name "*.py" \) \
  -not -path "*/node_modules/*" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')

# Commits
commits=$(git log --oneline 2>/dev/null | wc -l)

# Contributors
contributors=$(git log --format='%aN' 2>/dev/null | sort -u | wc -l)

# Releases
releases=$(git tag 2>/dev/null | wc -l)

# Tests
test_files=$(find . -name "*.test.*" -o -name "*.spec.*" | wc -l)
```

### Decision Logic

```python
def infer_maturity(file_count, loc, commits, releases, test_files):
    if file_count < 50 and commits < 20:
        return "idea"
    elif file_count < 200 and test_files < 10:
        return "prototype"
    elif releases < 3 and test_files < 50:
        return "mvp"
    elif releases >= 3 and commits > 500:
        return "growth"
    elif releases >= 10 and commits > 2000 and test_files > 100:
        return "mature"
    else:
        return "mvp"  # Default safe choice
```

---

## Pattern 6: Differentiators from README

### Search Patterns

```bash
# Find explicit differentiators
cat README.md | grep -E "unlike|unique|first|only|versus|compared" -A 2

# Find feature highlights
cat README.md | sed -n '/## Features/,/^##/p' | grep "^- " | head -10

# Find "Why X?" sections
cat README.md | sed -n '/Why /,/^##/p'
```

### Inference Rules

1. **First/Only Claims**: Direct differentiators
   - "First async-first task manager" → Differentiator: async-first design

2. **Feature Lists**: Unique items = differentiators
   - Compare to known competitors, extract novel features

3. **Technical Approach**: Architecture choices
   - "Event-driven", "Serverless", "Edge computing"

---

## Pattern 7: Constraints from Dependencies

### Technical Constraints

```bash
# Check for browser constraints
grep -E "ie11|polyfill" package.json README.md

# Check for database constraints
grep -E "postgres|mysql|mongodb" package.json pyproject.toml

# Check for cloud platform constraints
grep -E "aws|gcp|azure|vercel|netlify" package.json .env.example
```

### Resource Constraints

```bash
# Contributor count
git log --format='%aN' | sort -u | wc -l

# Solo developer indicator
if [ $(git log --format='%aN' | sort -u | wc -l) -eq 1 ]; then
  echo "Solo developer"
fi
```

### Dependency Constraints

```bash
# External services
grep -E "API_KEY|ENDPOINT|SERVICE_URL" .env.example 2>/dev/null

# Required infrastructure
cat README.md | grep -E "requires|depends on|needs" -A 2
```

---

## Pattern 8: Competitive Context from Documentation

### Alternative Discovery

**Source 1: README Comparison Section**

```bash
cat README.md | sed -n '/## Comparison/,/^##/p'
cat README.md | sed -n '/## Alternatives/,/^##/p'
```

**Source 2: Implicit Mentions**

```bash
# Find competing tools mentioned
cat README.md | grep -E "asana|jira|trello|notion" -i
```

**Source 3: Domain Knowledge**

If project type is known, infer standard competitors:
- CLI deployment tool → AWS CLI, Terraform, Pulumi
- Task manager → Asana, Monday.com, Linear

### Market Position Inference

```bash
# Check for niche indicators
cat README.md | grep -E "small teams|startups|enterprise|developers only"

# Check for scale claims
cat README.md | grep -E "millions|thousands of users|large scale"
```

---

## Pattern 9: Incorporating Competitor Analysis

When `competitor_analysis.json` exists:

```bash
# Check for file
if [ -f competitor_analysis.json ]; then
  # Extract competitor names
  cat competitor_analysis.json | jq -r '.competitors[].name'
  
  # Extract pain points
  cat competitor_analysis.json | jq -r '.insights_summary.top_pain_points[]'
  
  # Extract differentiator opportunities
  cat competitor_analysis.json | jq -r '.insights_summary.differentiator_opportunities[]'
fi
```

### Merge Strategy

```json
{
  "competitive_context": {
    "alternatives": ["From README"] + ["From competitor_analysis.json"],
    "competitor_pain_points": ["From competitor_analysis.json"],
    "differentiators": ["From README"] + ["From competitor_analysis insights"],
    "competitor_analysis_available": true
  }
}
```

---

## Pattern 10: Success Metrics Inference

### By Project Type

| Type | Typical Metrics |
|------|-----------------|
| web-app | Active users, session duration, conversion rate |
| cli | Installation count, command execution frequency |
| library | Download count, dependent packages, community contributions |
| api | API calls/day, response time, uptime |

### From Documentation

```bash
# Look for metric mentions
cat README.md | grep -E "users|downloads|performance|uptime" -A 2
```

### Default Safe Metrics

If no data available, use generic but reasonable:
- "Adoption by target audience"
- "Positive user feedback"
- "Reduced time to complete [task]"

---

## Pattern 11: Gap Identification

### Source 1: TODOs in Code

```bash
grep -r "TODO\|FIXME" --include="*.ts" --include="*.py" . 2>/dev/null | \
  sed 's/.*TODO://' | sed 's/.*FIXME://' | sort -u | head -20
```

### Source 2: Missing Features from README

```bash
# Check for roadmap or planned features
cat README.md | sed -n '/## Roadmap/,/^##/p'
cat ROADMAP.md 2>/dev/null
```

### Source 3: Test Coverage Gaps

```bash
# Find files without tests
find src/ -name "*.ts" | while read f; do
  test_file="${f/src/tests}"
  test_file="${test_file/.ts/.test.ts}"
  if [ ! -f "$test_file" ]; then
    echo "No test for: $f"
  fi
done | head -10
```

---

## Pattern 12: Tech Stack Extraction

### Primary Language

```bash
# Count file extensions
find . -type f -not -path "*/node_modules/*" -name "*.ts" | wc -l
find . -type f -not -path "*/venv/*" -name "*.py" | wc -l
find . -type f -name "*.rs" | wc -l

# Winner = primary language
```

### Frameworks

```bash
# Node.js
cat package.json | jq -r '.dependencies | keys[]' | grep -E "react|vue|express|fastapi"

# Python
cat requirements.txt pyproject.toml | grep -E "django|flask|fastapi|sqlalchemy"

# Rust
cat Cargo.toml | grep -E "actix|rocket|warp"
```

### Key Dependencies (Top 10)

```bash
# Sort by importance (framework > utility)
cat package.json | jq -r '.dependencies | to_entries[] | .key' | head -10
```

---

## Example: Full Inference Workflow

```bash
#!/bin/bash
# Autonomous discovery script

# 1. Determine project type
if grep -q "react" package.json 2>/dev/null; then
  project_type="web-app"
elif grep -q "click" requirements.txt 2>/dev/null; then
  project_type="cli"
else
  project_type="other"
fi

# 2. Extract audience from README
audience=$(cat README.md | grep -E "for " | head -1 | sed 's/.*for //' | sed 's/\..*//')

# 3. Find pain points
pain_points=$(cat README.md | grep -E "problem|challenge" -A 1)

# 4. Calculate maturity
file_count=$(find . -type f -name "*.ts" | wc -l)
commits=$(git log --oneline | wc -l)

if [ $commits -lt 100 ]; then
  maturity="prototype"
elif [ $commits -lt 500 ]; then
  maturity="mvp"
else
  maturity="growth"
fi

# 5. Generate discovery JSON
cat > roadmap_discovery.json << EOF
{
  "project_name": "$(cat package.json | jq -r '.name')",
  "project_type": "$project_type",
  "target_audience": {
    "primary_persona": "$audience"
  },
  "current_state": {
    "maturity": "$maturity"
  }
}
EOF
```

---

## Best Practices

1. **Exhaust Available Sources**: Read README, package files, code structure before inferring
2. **Prefer Specific Over Generic**: "DevOps engineers" > "Users"
3. **Evidence-Based**: Link inferences to concrete files/patterns
4. **Conservative Estimates**: When uncertain, choose lower maturity/complexity
5. **Merge External Data**: Always incorporate `competitor_analysis.json` if available

---

## Anti-Patterns

❌ **Don't**:
- Use placeholder values like "Unknown" or "TBD"
- Guess wildly without evidence
- Copy-paste generic descriptions
- Ignore available data sources

✅ **Do**:
- Make educated inferences from patterns
- Document reasoning in logs
- Use domain knowledge appropriately
- Validate against multiple sources

---

## References

- [Maturity Levels Guide](./maturity-levels.md)
- [Discovery Schema](./discovery-schema.json)
- Auto-Claude: `apps/backend/prompts/roadmap_discovery.md`

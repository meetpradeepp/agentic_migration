# Context Discovery Agent Instructions for GitHub Copilot

## Overview

The context-discovery agent discovers codebase files, patterns, and service contexts relevant to a task. It bridges requirements gathering and specification writing by providing detailed file-level context.

## When to Invoke

Invoke context-discovery agent when:
- Requirements are gathered (requirements.json exists)
- Before writing specifications (to provide file context to spec-writer)
- Complexity assessment suggests STANDARD or COMPLEX workflow
- User asks to "discover files", "find relevant code", "identify patterns"

## Invocation Pattern

```markdown
@context-discovery I need to discover codebase context for this task:

**Task**: [From requirements.json]
**Complexity**: [From complexity_assessment.json if available]

Please analyze the codebase and generate context.json with:
1. Files to modify (with reasons)
2. Files to reference as patterns
3. Code conventions
4. Service contexts
```

## Inputs Required

1. **requirements.json** - Must exist and contain task_description
2. **complexity_assessment.json** - Optional, helps adjust search depth

## Expected Output

The agent generates **context.json** containing:

```json
{
  "task_description": "string",
  "scoped_services": ["service1", "service2"],
  "files_to_modify": [
    {
      "path": "relative/path/to/file.ts",
      "reason": "Why this file needs changes",
      "current_content_summary": "What exists now"
    }
  ],
  "files_to_reference": [
    {
      "path": "relative/path/to/pattern.ts",
      "reason": "Why this is a good pattern",
      "key_patterns": ["Pattern 1", "Pattern 2"]
    }
  ],
  "patterns": {
    "naming_conventions": {...},
    "code_style": {...},
    "architectural_patterns": {...}
  },
  "service_contexts": {
    "service_name": {
      "directory": "path/to/service",
      "tech_stack": ["Tech1", "Tech2"],
      "key_files": ["file1.ts"],
      "dependencies": ["other_service"]
    }
  },
  "discovered_issues": [
    {
      "issue": "Description",
      "impact": "How this affects task",
      "recommendation": "Suggested approach"
    }
  ],
  "created_at": "ISO timestamp"
}
```

## Validation After Invocation

After context-discovery completes:

```bash
# Verify context.json exists
test -f context.json && echo "✓ context.json created"

# Validate JSON
python3 -c "import json; json.load(open('context.json'))" && echo "✓ Valid JSON"

# Check required fields
grep -q "task_description" context.json && echo "✓ Has task_description"

# Verify file paths exist
cat context.json | jq -r '.files_to_modify[].path' | while read path; do
  test -f "$path" && echo "✓ $path exists" || echo "✗ $path missing"
done
```

## Integration with Other Agents

### Workflow Position

```
requirements.json
       ↓
complexity_assessment.json (optional)
       ↓
[context-discovery] ← YOU ARE HERE
       ↓
context.json
       ↓
spec-writer (uses context.json)
```

### Handoff to spec-writer

After context.json is generated:

```markdown
@spec-writer I have gathered requirements and discovered codebase context.

Please generate a comprehensive specification using:
- requirements.json (task requirements)
- context.json (file context and patterns)
- [research.json if complex task]

Output: spec.md with full implementation details
```

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Empty files_to_modify | Agent search too narrow - broaden keywords |
| Invalid file paths | Paths must be relative from project root |
| Missing patterns | Agent must read actual files, not just filenames |
| No service_contexts | Check if package.json or requirements.txt were analyzed |
| JSON validation fails | Review output for syntax errors, missing commas |

## Orchestrator Usage

In the orchestrator workflow (Workflow 8):

```markdown
**Phase 3: Context Discovery**

@context-discovery Analyze codebase for task: [task_description]

Input: requirements.json, complexity_assessment.json
Output: context.json
```

Then route based on complexity:
- SIMPLE → spec-quick (may skip context discovery)
- STANDARD → context-discovery → spec-writer
- COMPLEX → spec-researcher → context-discovery → spec-writer

## Quality Expectations

High-quality context.json should:
- ✅ List 3-10 files_to_modify (not too few, not overwhelming)
- ✅ Include 2-5 files_to_reference with specific patterns
- ✅ Have specific naming conventions (not "follow existing code")
- ✅ Document actual tech stack (from package.json, not assumed)
- ✅ Flag 0-3 discovered_issues (real concerns, not generic warnings)
- ✅ All paths validated and exist
- ✅ Valid JSON structure

## Example Scenarios

### Scenario 1: Adding New API Endpoint

**Input**: requirements.json says "Add /api/users/profile endpoint"

**Expected context.json**:
- files_to_modify: routes/users.ts, controllers/users.controller.ts
- files_to_reference: routes/auth.ts (shows routing pattern)
- patterns: Express Router usage, Zod validation pattern
- service_contexts: backend service with Node.js/Express

### Scenario 2: Frontend Component Addition

**Input**: requirements.json says "Create reusable Button component"

**Expected context.json**:
- files_to_modify: components/Button.tsx, components/index.ts
- files_to_reference: components/Input.tsx (similar reusable component)
- patterns: Functional components, TypeScript props interface pattern
- service_contexts: frontend service with React/TypeScript

## Tips for Effective Usage

1. **Provide clear requirements**: The better the task_description, the better the context discovery
2. **Use complexity hints**: complexity_assessment.json helps agent know search depth
3. **Review discovered_issues**: These may require requirements clarification
4. **Validate paths**: Always verify file paths exist before proceeding to spec-writer
5. **Check patterns are specific**: Generic "follow existing code" isn't useful

## DO

✅ Invoke after requirements.json is ready
✅ Validate context.json before proceeding to spec-writer
✅ Review discovered_issues for task clarity
✅ Check that files_to_modify align with task scope
✅ Ensure patterns are specific and actionable

## DON'T

❌ Skip context discovery for STANDARD/COMPLEX tasks
❌ Proceed to spec-writer if context.json is invalid
❌ Ignore discovered_issues without addressing them
❌ Assume file paths without validation
❌ Accept generic patterns without specifics

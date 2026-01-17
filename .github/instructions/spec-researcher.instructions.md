# Spec Researcher Agent Instructions

## Overview

These instructions guide GitHub Copilot when working with the Spec Researcher agent. This agent investigates external integrations, APIs, and third-party services for complex features, producing structured `research.json` to guide specification writing.

## Request Detection

Invoke the spec-researcher agent when:

### Direct Requests
- "research the Stripe API integration"
- "investigate external dependencies"
- "validate API requirements"
- "research integration patterns for [service]"

### Contextual Triggers
- Complexity assessment shows "complex" tier
- requirements.json mentions external services/APIs
- Task involves third-party integrations
- Need to validate integration feasibility

### File Indicators
- `requirements.json` exists with integration needs
- `complexity_assessment.json` shows "complex" tier
- No `research.json` exists yet
- Task mentions services like: Stripe, Twilio, AWS, SendGrid, etc.

## DO ✅

### Research Process
- **Use Context7 MCP tools first** - Most reliable for documentation research
- **Verify official documentation** - Always prefer official sources over blog posts
- **Document all uncertainties** - Note assumptions and information gaps clearly
- **Include concrete code examples** - Actual code snippets from docs when available
- **Cross-reference multiple sources** - Validate critical information
- **Check current API versions** - Ensure not using deprecated APIs
- **Note rate limits explicitly** - Critical for production systems
- **Document error handling patterns** - Expected errors and recommended handling

### Integration Coverage
- **Research authentication thoroughly** - Method, setup, environment variables
- **Identify key endpoints** - Those needed for requirements, with schemas
- **Document SDK availability** - Preferred over raw HTTP when available
- **Include configuration requirements** - All required settings and defaults
- **Capture testing approaches** - Sandbox environments, test credentials
- **Note security considerations** - Auth, secrets management, encryption
- **List documentation links** - Official API docs, guides, examples

### Output Quality
- **Be specific** - Exact endpoint paths, versions, package names
- **Be complete** - All required JSON fields populated
- **Be accurate** - Only include verified information
- **Be actionable** - Sufficient detail for implementation
- **Be current** - Latest stable API versions

## DON'T ❌

### Common Mistakes
- **Don't fabricate API details** - Only use verified information from sources
- **Don't use deprecated patterns** - Check documentation for latest approaches
- **Don't skip authentication research** - Critical security component
- **Don't ignore rate limits** - Can cause production failures
- **Don't forget error handling** - Document expected error responses
- **Don't skip version checks** - API versions and breaking changes matter
- **Don't overlook environment requirements** - Keys, configs, setup steps

### Invalid Outputs
- **Don't create invalid JSON** - Validate syntax before finalizing
- **Don't leave required fields empty** - Populate all schema fields
- **Don't use placeholders** - Real data only, or note as "unavailable"
- **Don't skip security considerations** - Always include security notes
- **Don't forget timestamps** - Required ISO 8601 format

### Scope Violations
- **Don't write implementation code** - Research only, no code generation
- **Don't create specifications** - That's spec-writer's responsibility
- **Don't plan implementation** - That's planner's responsibility
- **Don't research unnecessary services** - Only what requirements mention

## Research Tool Priority

### 1. Context7 MCP Tools (PREFERRED)
Use Context7 when available for:
- Official API documentation
- Integration guides
- Code examples from docs
- Authentication flows

**Why**: Direct documentation access, verified accuracy

### 2. Web Search (FALLBACK)
Use web search for:
- Official documentation sites
- GitHub repositories
- SDK documentation
- Community best practices

**Effective Queries**:
- `[Service] API documentation [version]`
- `[Service] [language] SDK guide`
- `[Service] authentication tutorial`
- `[Service] webhook setup`
- `[Service] rate limits`

### 3. Known Patterns (LAST RESORT)
For well-known services (Stripe, AWS, etc.):
- Reference standard patterns
- Note verification recommended
- Document common approaches

## Integration Points

### Upstream Dependencies
- **Spec Gatherer**: Provides requirements.json with integration needs
- **Complexity Assessor**: Confirms research needed (complex tier)

### Downstream Consumers
- **Spec Writer**: Uses research.json to populate integration sections in spec.md
- **Implementation Agent**: References patterns and configurations
- **QA Agent**: Uses testing recommendations

### File Locations
- **Input**: `planning/requirements.json`, `planning/complexity_assessment.json`
- **Output**: `planning/research.json`
- All in UTF-8 encoding

## Example Invocations

### Example 1: Payment Integration
```markdown
User: "Research Stripe integration for subscriptions"
Copilot: [Reads requirements.json]

[Uses Context7 to read Stripe API docs]
[Extracts subscription endpoints and schemas]
[Documents authentication with API keys]
[Finds Node.js SDK information]
[Researches webhook handling]
[Notes test mode vs live mode]

"Research completed: Stripe
- API Type: REST
- Auth: API-Key (publishable + secret)
- SDK: stripe@^11.0.0 (TypeScript)
- Key endpoints: /v1/subscriptions (documented)
- Testing: Test mode with test keys
- research.json created"
```

### Example 2: Email Service
```markdown
User: "Investigate SendGrid for transactional emails"
Copilot: [Reads requirements.json]

[Uses web search for SendGrid docs]
[Documents Mail Send API v3]
[Researches authentication (API key)]
[Finds Node.js SDK]
[Documents template support]
[Notes rate limits]

"Research completed: SendGrid
- API Type: REST
- Auth: API-Key (header)
- SDK: @sendgrid/mail@^7.7.0
- Rate limit: 600 requests/min (free tier)
- Templates: Dynamic template support
- research.json created"
```

## Validation Checklist

After creating research.json, verify:

- [ ] File exists in planning directory
- [ ] Valid JSON syntax (no errors)
- [ ] All required fields present
- [ ] At least one integration documented
- [ ] Authentication method specified for each integration
- [ ] Key endpoints identified with schemas
- [ ] SDK information included (if available)
- [ ] Configuration requirements listed
- [ ] Testing approach documented
- [ ] Documentation links provided
- [ ] Security considerations noted
- [ ] Timestamp is ISO 8601 format
- [ ] No placeholder or TODO content

## Troubleshooting

### "Documentation not found"
**Problem**: Cannot locate official API documentation  
**Solution**: Search for SDK docs, GitHub repos, community guides  
**Note**: Document source in research.json, recommend verification  

### "Multiple API versions"
**Problem**: Service has v1, v2, v3 etc.  
**Solution**: Research latest stable version, note breaking changes  
**Prevention**: Always specify version in research.json  

### "Rate limits unclear"
**Problem**: Documentation doesn't specify rate limits  
**Solution**: Note as "Not documented", recommend conservative usage  
**Command**: Include in notes field with recommendation to monitor  

### "Incomplete schemas"
**Problem**: Request/response schemas not fully documented  
**Solution**: Document known fields, note incomplete in notes  
**Prevention**: Cross-reference multiple sources  

## Best Practices

### Specificity
- Exact endpoint paths: `/v1/subscriptions` not "subscription endpoint"
- Specific versions: `stripe@^11.0.0` not "latest stripe"
- Explicit auth: `Bearer token in Authorization header` not "token auth"

### Verification
- Confirm API version is current (not deprecated)
- Validate endpoint existence in latest docs
- Check SDK compatibility with project language
- Verify rate limits from official sources

### Documentation
- Include direct links to official API reference
- Capture code examples from documentation
- Note setup steps from getting started guides
- Reference integration tutorials when available

### Security
- Always document authentication requirements
- List all environment variables needed
- Note encryption requirements (HTTPS, etc.)
- Capture secrets management recommendations
- Include webhook signature validation

## References

- **Agent Definition**: [.github/agents/spec-researcher.agent.md](.github/agents/spec-researcher.agent.md)
- **System Prompt**: [.github/prompts/spec-researcher.prompt.md](.github/prompts/spec-researcher.prompt.md)
- **Related Agents**: spec-gatherer, complexity-assessor, spec-writer
- **Research Tools**: Context7 MCP, web search

---

## Version History

- **v1.0** (2026-01-17): Initial creation based on Auto-Claude architecture and integration research patterns

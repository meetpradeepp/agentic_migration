# Domain Knowledge Base

This directory contains domain-specific knowledge that agents can use to improve requirements gathering, specification writing, and implementation.

## Structure

```
domains/
├── {domain}/
│   ├── overview.md              # Domain concepts and terminology
│   ├── patterns.md              # Common architectural patterns
│   ├── edge-cases.md            # Known pitfalls and edge cases
│   ├── integrations.md          # Common integration points
│   └── examples/
│       ├── {use-case-1}.json    # Structured examples
│       └── {use-case-2}.json
```

## Available Domains

Add domain knowledge by creating a new directory:

- `telecom/` - Telecommunications (billing, network, CRM)
- `finance/` - Financial services (payments, accounting, fraud)
- `healthcare/` - Healthcare (HL7/FHIR, claims, patient records)
- `ecommerce/` - E-commerce (inventory, orders, pricing)
- `logistics/` - Supply chain and logistics
- `iot/` - Internet of Things
- `gaming/` - Game development
- `social/` - Social media platforms

## How Agents Use This

Agents automatically check for domain knowledge based on task keywords:

1. **spec-gatherer**: Uses domain knowledge to ask better questions
2. **context-discovery**: Includes domain patterns in recommendations
3. **spec-writer**: References domain best practices in specs
4. **roadmap-discovery**: Identifies domain-specific features

## Adding New Domain Knowledge

Create a new domain directory with at minimum:

```markdown
# {domain}/overview.md

## Core Concepts
[Key domain entities and terminology]

## Common Workflows
[Typical business processes]

## Edge Cases
[Known pitfalls to avoid]

## Integration Points
[External systems commonly integrated]
```

## Detection

Agents detect domain from task description keywords:
- "billing", "rating", "CDR" → telecom
- "payment", "transaction", "invoice" → finance
- "patient", "HL7", "FHIR" → healthcare
- "order", "cart", "inventory" → ecommerce

If no domain detected or no knowledge exists, agents proceed normally.

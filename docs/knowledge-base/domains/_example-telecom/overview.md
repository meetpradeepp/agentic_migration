# Telecom Domain - Example Template

This is an example domain knowledge template. Replace this with actual telecom billing knowledge.

## Core Concepts

### Rating Engine
- Converts usage (CDRs) into charges
- Input: Call Detail Records
- Output: Rated CDRs with monetary charges

### Charging Models
1. **Prepaid**: Real-time balance deduction
2. **Postpaid**: Periodic billing cycles
3. **Hybrid**: Mix of both

## Common Workflows

### Prepaid Rating Flow
```
1. Service request → 2. Check balance → 3. Reserve amount
4. Deliver service → 5. Deduct balance → 6. Update CDR
```

## Edge Cases

- Roaming scenarios (home vs visited network)
- Concurrent balance updates (race conditions)
- Mid-cycle plan changes (proration)
- Tax calculations (location-based)

## Integration Points

- **OCS**: Online Charging System (real-time balance)
- **PCRF**: Policy Control & Charging Rules
- **CRM**: Customer relationship management
- **Payment Gateway**: Payment processing

## Common Pitfalls

❌ Not handling timezone conversions in CDRs
❌ Race conditions in concurrent balance updates  
❌ Missing tax calculations for roaming

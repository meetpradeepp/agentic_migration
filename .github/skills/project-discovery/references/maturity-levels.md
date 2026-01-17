# Maturity Level Assessment Guide

## Overview

This guide helps agents determine project maturity level based on concrete indicators from codebase analysis.

## Maturity Levels

### 1. Idea (Early Concept)

**Definition**: Conceptual stage with minimal implementation

**Indicators**:
- ✅ < 50 files total
- ✅ < 500 lines of code
- ✅ No test directory or < 5 test files
- ✅ Git history < 20 commits
- ✅ 0-1 contributors
- ✅ No releases/tags
- ✅ README is placeholder or outline

**Typical Commands**:
```bash
find . -type f \( -name "*.ts" -o -name "*.py" \) | wc -l  # < 50
git log --oneline | wc -l  # < 20
```

**Example Projects**:
- Weekend hack prototype
- Proof-of-concept demo
- Initial repository setup

---

### 2. Prototype (Experimental)

**Definition**: Basic functionality exists but incomplete

**Indicators**:
- ✅ 50-200 files
- ✅ 500-5,000 lines of code
- ✅ Minimal tests (< 20% coverage)
- ✅ 20-100 commits
- ✅ 1-2 contributors
- ✅ No versioned releases
- ✅ README has usage examples
- ✅ Core feature partially working

**Typical Commands**:
```bash
find . -type f \( -name "*.ts" -o -name "*.py" \) \
  -not -path "*/node_modules/*" | xargs wc -l  # 500-5000 LOC
ls tests/ __tests__/ 2>/dev/null | wc -l  # Few test files
```

**Example Projects**:
- Alpha version shared with friends
- Experimental feature branch
- Internal tool not production-ready

---

### 3. MVP (Minimum Viable Product)

**Definition**: Core features working, ready for early users

**Indicators**:
- ✅ 200-1,000 files
- ✅ 5,000-20,000 lines of code
- ✅ Tests present (20-50% coverage)
- ✅ 100-500 commits
- ✅ 2-5 contributors
- ✅ 1-3 releases/tags
- ✅ README has installation + examples
- ✅ Primary use case fully functional
- ✅ Basic CI/CD setup

**Typical Commands**:
```bash
git log --oneline | wc -l  # 100-500
git tag | wc -l  # 1-3
ls -la .github/workflows/ 2>/dev/null  # CI present
```

**Example Projects**:
- Beta launched to limited users
- Dogfooded internally
- Shared on Show HN

---

### 4. Growth (Active Development)

**Definition**: Established product with growing feature set

**Indicators**:
- ✅ 1,000-5,000 files
- ✅ 20,000-100,000 lines of code
- ✅ Good test coverage (50-80%)
- ✅ 500-2,000 commits
- ✅ 5-20 contributors
- ✅ 5+ releases with semantic versioning
- ✅ Active issue tracker
- ✅ Documentation site/wiki
- ✅ Growing user base

**Typical Commands**:
```bash
git log --format='%aN' | sort -u | wc -l  # 5-20 contributors
git tag | wc -l  # 5+
ls docs/ 2>/dev/null  # Documentation present
```

**Example Projects**:
- Featured on Product Hunt
- Growing GitHub stars
- Regular release cadence

---

### 5. Mature (Production-Grade)

**Definition**: Stable, well-tested, production-ready

**Indicators**:
- ✅ 5,000+ files (or < 1,000 but highly optimized)
- ✅ 100,000+ lines of code
- ✅ Comprehensive tests (80%+ coverage)
- ✅ 2,000+ commits
- ✅ 20+ contributors
- ✅ 10+ versioned releases
- ✅ Extensive documentation
- ✅ CI/CD with automated testing
- ✅ Security scans, dependency updates
- ✅ Active community (issues, PRs, discussions)

**Typical Commands**:
```bash
find . -type f \( -name "*.ts" -o -name "*.py" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" | xargs wc -l  # 100k+ LOC
git log --since="1 year ago" | wc -l  # Active commits
cat package.json | jq '.version'  # Semantic versioning
```

**Example Projects**:
- Enterprise-adopted software
- High GitHub stars (1k+)
- Featured in awesome lists

---

## Decision Tree

```
Start
  │
  ├─ < 50 files? ──────────────> IDEA
  │
  ├─ < 200 files? ─────────────> PROTOTYPE
  │
  ├─ Tests present?
  │   ├─ No ──────────────────> PROTOTYPE
  │   └─ Yes
  │       ├─ < 20% coverage ──> MVP
  │       ├─ 20-50% ──────────> MVP
  │       ├─ 50-80% ──────────> GROWTH
  │       └─ 80%+ ────────────> MATURE
  │
  ├─ Git commits?
  │   ├─ < 100 ───────────────> MVP
  │   ├─ 100-500 ─────────────> MVP
  │   ├─ 500-2000 ────────────> GROWTH
  │   └─ 2000+ ───────────────> MATURE
  │
  └─ Contributors?
      ├─ 0-2 ─────────────────> IDEA/PROTOTYPE
      ├─ 2-5 ─────────────────> MVP
      ├─ 5-20 ────────────────> GROWTH
      └─ 20+ ─────────────────> MATURE
```

---

## Boundary Cases

### Small but Mature
- **Example**: Highly optimized library with < 500 files but extensive tests, docs, and releases
- **Classification**: MATURE (documentation + releases outweigh file count)

### Large but Prototype
- **Example**: Monorepo with many files but most unfinished or experimental
- **Classification**: PROTOTYPE (functionality matters more than size)

### Active Solo Project
- **Example**: 1 contributor, 1000 commits, great tests, regular releases
- **Classification**: GROWTH (quality over team size)

---

## Validation Commands

Run these to gather maturity indicators:

```bash
#!/bin/bash

# File count
echo "=== File Count ==="
find . -type f \( -name "*.ts" -o -name "*.py" -o -name "*.js" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/venv/*" \
  -not -path "*/dist/*" | wc -l

# Lines of code
echo "=== Lines of Code ==="
find . -type f \( -name "*.ts" -o -name "*.py" -o -name "*.js" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/venv/*" | xargs wc -l 2>/dev/null | tail -1

# Tests
echo "=== Test Files ==="
ls -la tests/ __tests__/ spec/ 2>/dev/null || echo "No test directory"

# Git stats
echo "=== Git Activity ==="
git log --oneline | wc -l
git log --format='%aN' | sort -u | wc -l
git tag | wc -l

# Recent activity
echo "=== Recent Commits (6 months) ==="
git log --since="6 months ago" --oneline | wc -l

# CI/CD
echo "=== CI/CD ==="
ls -la .github/workflows/ .gitlab-ci.yml .circleci/ 2>/dev/null || echo "No CI/CD"

# Documentation
echo "=== Documentation ==="
ls -la docs/ README.md CONTRIBUTING.md 2>/dev/null || echo "Minimal docs"
```

---

## Common Mistakes

❌ **Don't**:
- Rely solely on file count
- Ignore test coverage
- Overlook git activity
- Assume large = mature

✅ **Do**:
- Combine multiple indicators
- Prioritize functionality over size
- Check commit frequency
- Consider documentation quality

---

## Output Format

When documenting maturity in discovery JSON:

```json
{
  "current_state": {
    "maturity": "mvp",
    "evidence": {
      "file_count": 345,
      "lines_of_code": 8732,
      "test_files": 42,
      "commits": 287,
      "contributors": 3,
      "releases": 2,
      "ci_cd_present": true,
      "documentation_quality": "good"
    },
    "reasoning": "Core features functional with tests, 2 releases, but limited contributor base and no major adoption yet."
  }
}
```

---

## References

- Auto-Claude: `apps/backend/prompts/roadmap_discovery.md` (PHASE 3)
- Discovery Skill: [SKILL.md](../SKILL.md)

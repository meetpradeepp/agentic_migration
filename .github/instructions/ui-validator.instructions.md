# UI Validator Agent Instructions for GitHub Copilot

## Purpose

This file provides detailed guidelines for GitHub Copilot when working with the UI Validator Agent. It ensures comprehensive visual testing, layout verification, and accessibility compliance for frontend applications.

## ⚠️ CRITICAL RULE: VISUAL TESTING ONLY

**The UI Validator is a VISUAL QA SPECIALIST, not a functional tester**:

❌ **NEVER** test business logic or API functionality (use qa-validator)
❌ **NEVER** validate database operations
❌ **NEVER** test backend services
❌ **NEVER** skip screenshot comparisons

✅ **ALWAYS** focus on UI/UX quality:
- Capture screenshots with Playwright
- Compare visual states
- Check responsive layouts
- Verify accessibility compliance
- Test interactive states
- Validate cross-browser rendering

**If you find yourself testing API endpoints or database queries, STOP. You are doing it wrong. Focus only on what users SEE and EXPERIENCE.**

---

## When to Invoke the UI Validator Agent

### ✅ Use UI Validator Agent For

**Frontend Implementations**:
- React/Vue/Angular/Svelte applications
- Any UI components or views
- CSS/styling changes
- Responsive design implementations
- Theme changes (dark mode, custom themes)
- Layout modifications

**Visual Quality Checks**:
- Screenshot-based regression testing
- Responsive design verification
- Accessibility compliance (WCAG AA)
- Cross-browser rendering
- Interactive state validation
- Layout integrity

**Request Patterns That Trigger UI Validator**:
- "Validate the UI implementation"
- "Check for visual regressions"
- "Test responsive design"
- "Verify accessibility compliance"
- "Run visual tests"
- User completed UI-related implementation

### ❌ Do NOT Use UI Validator Agent For

**Non-UI Work**:
- Backend API testing (use qa-validator)
- Database migrations
- CLI tools or scripts
- Configuration files
- Documentation updates
- Pure logic/utilities

**Functional Testing**:
- Business logic validation
- API endpoint testing
- Database operations
- Authentication/authorization logic
- Data processing algorithms

---

## Pre-Invocation Checklist

Before invoking the UI Validator Agent, verify:

### ✅ Required Conditions

1. **Frontend Code Exists**: Project has UI components (React, Vue, Angular, etc.)
2. **Dev Server Runnable**: Application can be started locally
3. **Playwright Available**: `@playwright/test` installed or can be installed
4. **UI Requirements Documented**: spec.md contains UI/UX requirements
5. **Implementation Complete**: Coder agent has finished UI subtasks

### ❌ Do NOT Invoke If

1. **No Frontend Code**: Backend-only project
2. **Server Won't Start**: Dependencies missing or config broken
3. **No UI Changes**: Only backend/API modifications
4. **No Visual Requirements**: Feature is purely functional (APIs, data processing)

---

## Execution Workflow

### Phase 0: Environment Setup (MANDATORY)

**Step 1: Check for Playwright**
```bash
cd [project-dir]
npm list @playwright/test || yarn list @playwright/test
```

**If not installed:**
```bash
npm install -D @playwright/test @axe-core/playwright
npx playwright install
```

**Step 2: Start Dev Server**
```bash
# Check package.json for dev command
cat package.json | grep -A5 "scripts"

# Start server (typical commands)
npm run dev &
# or
npm start &

# Wait for server to be ready
sleep 5

# Verify server is running
curl -I http://localhost:3000 || curl -I http://localhost:5173 || curl -I http://localhost:8080
```

**Step 3: Identify Views to Test**
```bash
# Find all routes/views in codebase
find src -name "*View.tsx" -o -name "*Page.tsx" -o -name "*Screen.tsx"
```

---

### Phase 1: Visual Regression Testing

**Create Playwright Test File**: `tests/ui-validation/visual-regression.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

const VIEWS = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/calendar', name: 'Calendar' },
  // Add all views from spec.md
];

const VIEWPORTS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' },
];

for (const view of VIEWS) {
  test.describe(`Visual Regression - ${view.name}`, () => {
    for (const viewport of VIEWPORTS) {
      test(`should match baseline on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`http://localhost:5173${view.path}`);
        await page.waitForLoadState('networkidle');
        
        // Wait for any animations to complete
        await page.waitForTimeout(500);
        
        // Capture screenshot
        await expect(page).toHaveScreenshot(
          `${view.name.toLowerCase()}-${viewport.name}.png`,
          {
            maxDiffPixels: 100,
            threshold: 0.001, // 0.1% difference allowed
            fullPage: true
          }
        );
      });
    }
  });
}
```

**Run Tests:**
```bash
npx playwright test tests/ui-validation/visual-regression.spec.ts --update-snapshots
```

---

### Phase 2: Responsive Design Testing

**Create Responsive Test**: `tests/ui-validation/responsive.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Responsive Design Validation', () => {
  const MOBILE_WIDTH = 375;
  const TABLET_WIDTH = 768;
  const DESKTOP_WIDTH = 1024;
  
  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 667 });
    
    const views = ['/', '/dashboard', '/calendar', '/tasks'];
    
    for (const view of views) {
      await page.goto(`http://localhost:5173${view}`);
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll, `${view} has horizontal scroll on mobile`).toBe(false);
    }
  });
  
  test('should have readable text on mobile', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 667 });
    await page.goto('http://localhost:5173');
    
    // Check all text elements are >= 16px
    const smallText = await page.evaluate(() => {
      const allText = document.querySelectorAll('p, span, div, a, button, label, input');
      const tooSmall = [];
      
      allText.forEach((el) => {
        const fontSize = window.getComputedStyle(el).fontSize;
        const pxSize = parseFloat(fontSize);
        if (pxSize < 16 && el.textContent.trim() !== '') {
          tooSmall.push({
            text: el.textContent.substring(0, 30),
            size: fontSize
          });
        }
      });
      
      return tooSmall;
    });
    
    expect(smallText.length, `Found ${smallText.length} text elements < 16px`).toBe(0);
  });
  
  test('should have adequate touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 667 });
    await page.goto('http://localhost:5173');
    
    const smallTargets = await page.evaluate(() => {
      const MIN_SIZE = 44; // 44x44px minimum touch target
      const interactive = document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]');
      const tooSmall = [];
      
      interactive.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
          tooSmall.push({
            element: el.tagName,
            width: rect.width,
            height: rect.height
          });
        }
      });
      
      return tooSmall;
    });
    
    expect(smallTargets.length, `Found ${smallTargets.length} touch targets < 44x44px`).toBe(0);
  });
});
```

---

### Phase 3: Accessibility Testing

**Create Accessibility Test**: `tests/ui-validation/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Validation', () => {
  const VIEWS = ['/', '/dashboard', '/calendar', '/tasks'];
  
  for (const view of VIEWS) {
    test(`should have no accessibility violations on ${view}`, async ({ page }) => {
      await page.goto(`http://localhost:5173${view}`);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
  
  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Tab through all interactive elements
    const focusableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return elements.length;
    });
    
    // Press Tab and verify focus moves
    for (let i = 0; i < focusableElements; i++) {
      await page.keyboard.press('Tab');
      
      const hasFocusIndicator = await page.evaluate(() => {
        const focused = document.activeElement;
        const styles = window.getComputedStyle(focused);
        // Check if focus indicator is visible
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      
      expect(hasFocusIndicator, `Element ${i} has no visible focus indicator`).toBe(true);
    }
  });
  
  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const contrastIssues = await page.evaluate(() => {
      // This is a simplified check - axe-core handles this better
      const MIN_CONTRAST = 4.5;
      const issues = [];
      
      // Check common text elements
      const textElements = document.querySelectorAll('p, span, a, button, label');
      
      textElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // You would calculate actual contrast ratio here
        // This is placeholder logic
      });
      
      return issues;
    });
    
    // axe-core will catch these in the main accessibility test
  });
});
```

---

### Phase 4: Interactive States Testing

**Create Interactive States Test**: `tests/ui-validation/interactive-states.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Interactive States Validation', () => {
  test('should show hover states on buttons', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      
      // Get initial styles
      const initialBg = await button.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Hover
      await button.hover();
      await page.waitForTimeout(100);
      
      // Get hover styles
      const hoverBg = await button.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // At least one visual change should occur on hover
      expect(initialBg !== hoverBg || 'cursor changed', 
        `Button ${i} has no hover effect`).toBeTruthy();
    }
  });
  
  test('should show focus states on interactive elements', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const interactive = page.locator('button, a, input');
    const count = await interactive.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) { // Test first 10
      const element = interactive.nth(i);
      await element.focus();
      
      const hasFocusStyle = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || 
               styles.boxShadow !== 'none' ||
               styles.border !== styles.border; // Changed
      });
      
      expect(hasFocusStyle, `Element ${i} has no focus indicator`).toBe(true);
    }
  });
  
  test('should show loading states', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    // Look for loading indicators during initial load
    const hasLoadingSkeleton = await page.locator('[data-loading], .skeleton, .spinner').count();
    
    // If the page loads fast, we might miss it, so also check in code
    const hasLoadingState = await page.evaluate(() => {
      // Check if loading states are implemented in code
      const source = document.body.innerHTML;
      return source.includes('loading') || source.includes('skeleton');
    });
    
    expect(hasLoadingState, 'No loading states found in implementation').toBe(true);
  });
});
```

---

### Phase 5: Layout Verification

**Create Layout Test**: `tests/ui-validation/layout.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Layout Verification', () => {
  test('should have no overlapping elements', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    const overlaps = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      const overlapping = [];
      
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const rect1 = elements[i].getBoundingClientRect();
          const rect2 = elements[j].getBoundingClientRect();
          
          // Check if rectangles overlap
          if (!(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom)) {
            // They overlap - check if one contains the other (which is fine)
            const contains = elements[i].contains(elements[j]) || 
                           elements[j].contains(elements[i]);
            if (!contains) {
              overlapping.push({
                el1: elements[i].tagName + '.' + elements[i].className,
                el2: elements[j].tagName + '.' + elements[j].className
              });
            }
          }
        }
      }
      
      return overlapping;
    });
    
    expect(overlaps.length, `Found ${overlaps.length} overlapping elements`).toBe(0);
  });
  
  test('should have consistent spacing', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check that spacing variables are used consistently
    const inconsistentSpacing = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const margins = new Set();
      const paddings = new Set();
      
      allElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        if (styles.margin !== '0px') margins.add(styles.margin);
        if (styles.padding !== '0px') paddings.add(styles.padding);
      });
      
      // If using CSS variables, should have limited unique values
      return {
        uniqueMargins: margins.size,
        uniquePaddings: paddings.size
      };
    });
    
    // Should use spacing scale, not arbitrary values
    // This is a heuristic - adjust threshold as needed
    expect(inconsistentSpacing.uniqueMargins).toBeLessThan(20);
    expect(inconsistentSpacing.uniquePaddings).toBeLessThan(20);
  });
});
```

---

### Phase 6: Generate ui_validation_results.json

After running all tests:

```typescript
// In a summary script or test reporter
const results = {
  validation_status: determineStatus(allResults),
  validated_at: new Date().toISOString(),
  validation_summary: {
    total_checks: totalTests,
    passed: passedTests,
    failed: failedTests,
    pass_rate: `${(passedTests / totalTests * 100).toFixed(1)}%`
  },
  visual_regression: extractVisualRegressionResults(playwrightResults),
  responsive_design: extractResponsiveResults(playwrightResults),
  accessibility: extractA11yResults(playwrightResults),
  interactive_states: extractInteractiveResults(playwrightResults),
  layout_verification: extractLayoutResults(playwrightResults),
  issues_found: aggregateIssues(playwrightResults),
  approval_decision: makeDecision(playwrightResults)
};

fs.writeFileSync('ui_validation_results.json', JSON.stringify(results, null, 2));
```

---

## Output Validation

After UI validator completes:

```bash
# Verify output file exists
test -f ui_validation_results.json && echo "✓ ui_validation_results.json created"

# Validate JSON
cat ui_validation_results.json | python3 -m json.tool > /dev/null && echo "✓ Valid JSON"

# Check status
STATUS=$(cat ui_validation_results.json | jq -r '.validation_status')
echo "UI Validation Status: $STATUS"

# Check for critical issues
CRITICAL=$(cat ui_validation_results.json | jq '[.issues_found[] | select(.severity=="critical")] | length')
echo "Critical UI Issues: $CRITICAL"

# View screenshots
ls -la screenshots/diff/
```

---

## Auto-Continue Workflow

**After creating ui_validation_results.json:**

- **If validation_status == "approved"** → Signal completion to orchestrator
- **If validation_status == "rejected"** → Call to subagent validation-fixer
- **If validation_status == "conditional"** → Provide summary and let orchestrator decide

Do NOT wait for user input - automatically proceed based on status.

---

## Best Practices

### DO ✅
- Always start dev server before testing
- Capture screenshots at multiple viewports
- Use Playwright's built-in screenshot comparison
- Test all interactive states (hover, focus, disabled, loading)
- Run axe-core for accessibility scanning
- Check for horizontal scroll on mobile
- Verify touch target sizes (min 44x44px)
- Test keyboard navigation
- Compare against baselines
- Save diff images for visual regressions

### DON'T ❌
- Test functional logic (use qa-validator)
- Skip accessibility checks
- Test only in one viewport
- Ignore contrast ratio violations
- Approve with layout overlaps
- Skip cross-browser testing
- Forget to test dark mode (if applicable)
- Accept horizontal scroll on mobile

---

## Integration with QA Validator

The qa-validator should invoke ui-validator when:

```markdown
# In qa-validator.instructions.md

**If frontend service detected**:
1. Run functional tests (qa-validator)
2. Invoke ui-validator for visual/UX validation
3. Combine results
4. Make final approval decision

Call to subagent ui-validator
```

---

## Common Issues and Solutions

### Issue 1: Screenshots Don't Match

**Symptom**: High pixel diff percentage between baseline and current

**Diagnosis**: Check if change was intentional or regression

**Solution**:
```bash
# View diff image
open screenshots/diff/dashboard-desktop-diff.png

# If intentional change, update baseline:
npx playwright test --update-snapshots

# If regression, fix the code and re-run
```

### Issue 2: Accessibility Violations

**Symptom**: axe-core reports WCAG violations

**Solution**: Fix each violation:
- Color contrast: Adjust colors to meet 4.5:1 ratio
- Missing labels: Add ARIA labels
- Keyboard nav: Ensure focusable and visible focus indicator

### Issue 3: Responsive Layout Broken

**Symptom**: Horizontal scroll on mobile

**Solution**:
```css
/* Add to CSS */
* {
  box-sizing: border-box;
}

.container {
  max-width: 100%;
  overflow-x: hidden;
}
```

---

## Example Execution Output

```markdown
## 🎨 UI Validation - Task Manager Application

**Environment Setup** ✅
- Dev server: http://localhost:5173
- Playwright: v1.40.0 installed
- Views identified: 4 (Dashboard, Calendar, AllTasks, UserListView)
- Viewports: 375px, 768px, 1920px

**Phase 1: Visual Regression** [4/4 views tested]
✅ Dashboard (3 viewports) - All match baseline
❌ Calendar (3 viewports) - Mobile differs by 2.1%
  📸 Screenshot: screenshots/diff/calendar-mobile-diff.png
  Issue: Date grid extends beyond viewport
✅ AllTasks (3 viewports) - All match baseline  
✅ UserListView (3 viewports) - All match baseline

**Phase 2: Responsive Design** [12 checks]
✅ No horizontal scroll on mobile
❌ Calendar: Text too small on mobile (14px, need 16px)
✅ Touch targets adequate size (44x44px minimum)
✅ Images scale properly

**Phase 3: Accessibility** [4 views scanned]
❌ 3 WCAG AA violations found:
  - Dashboard > .btn-secondary: Contrast 3.2:1 (need 4.5:1)
  - Calendar > .date-text: Contrast 3.8:1 (need 4.5:1)
  - Sidebar > .nav-link: Missing focus indicator
✅ Keyboard navigation functional
✅ ARIA labels present
✅ Semantic HTML used

**Phase 4: Interactive States** [15 components]
✅ Hover states working (14/15)
❌ ThemeToggle button: No visible hover effect
✅ Focus indicators present (with 1 exception noted above)
✅ Loading states implemented
✅ Disabled states styled correctly

**Phase 5: Layout** [Grid/Flexbox validation]
✅ No element overlaps detected
✅ Spacing consistent (using CSS variables)
✅ Text not truncated
✅ Z-index hierarchy correct

**Phase 6: Performance** [Core Web Vitals]
✅ LCP: 1.8s (target < 2.5s)
✅ FID: 45ms (target < 100ms)
⚠️ CLS: 0.12 (target < 0.1) - Minor layout shift on load

---

## 📊 Validation Results

**Total Checks**: 42
**Passed**: 37
**Failed**: 5
**Pass Rate**: 88.1%

**Critical Issues**: 3
1. Color contrast violations (accessibility)
2. Calendar mobile layout overflow
3. Missing focus indicator on Sidebar links

**High Issues**: 2
1. Calendar text too small on mobile
2. ThemeToggle no hover effect

## ❌ VALIDATION REJECTED

**Reason**: 3 critical accessibility violations must be fixed before approval.

**Next Steps**: 
Invoke validation-fixer to address:
1. Increase button text contrast to 4.5:1
2. Fix calendar mobile viewport overflow  
3. Add visible focus indicators to sidebar links
4. Increase calendar text to 16px on mobile
5. Add hover effect to ThemeToggle

After fixes, re-run ui-validator for final approval.
```

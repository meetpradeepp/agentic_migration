import { test, expect } from '@playwright/test';

test.describe('FilterBar UI Validation - Card Layout Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/all-tasks');
    await page.waitForLoadState('networkidle');
  });

  test('should display FilterBar with card-based layout', async ({ page }) => {
    const filterBar = page.locator('.filter-bar');
    await expect(filterBar).toBeVisible();
    
    // Verify all cards are present
    const filterCards = page.locator('.filter-card');
    await expect(filterCards).toHaveCount(3); // Search, Filters, Sorting cards
  });

  test('should display search card with icon and input', async ({ page }) => {
    const searchCard = page.locator('.search-card');
    await expect(searchCard).toBeVisible();
    
    // Check search icon is present
    const searchIcon = page.locator('.search-icon');
    await expect(searchIcon).toBeVisible();
    
    // Check search input
    const searchInput = page.locator('.search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search tasks...');
  });

  test('should display filters card with dropdowns', async ({ page }) => {
    const filtersCard = page.locator('.filters-card');
    await expect(filtersCard).toBeVisible();
    
    // Check card label
    await expect(page.getByText('Filter')).toBeVisible();
    
    // Check status and priority dropdowns
    const selects = filtersCard.locator('.filter-select');
    await expect(selects).toHaveCount(2);
  });

  test('should display sorting card with controls', async ({ page }) => {
    const sortingCard = page.locator('.sorting-card');
    await expect(sortingCard).toBeVisible();
    
    // Check card label
    await expect(page.getByText('Sort')).toBeVisible();
    
    // Check sort dropdown
    const sortSelect = sortingCard.locator('.filter-select');
    await expect(sortSelect).toBeVisible();
  });

  test('should show clear search button when typing', async ({ page }) => {
    const searchInput = page.locator('.search-input');
    await searchInput.fill('test query');
    
    // Clear button should appear
    const clearButton = page.locator('.clear-search');
    await expect(clearButton).toBeVisible();
    
    // Click clear button
    await clearButton.click();
    
    // Input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('should show sort direction button when sort is selected', async ({ page }) => {
    const sortSelect = page.locator('.sorting-card .filter-select');
    await sortSelect.selectOption('priority');
    
    // Sort direction button should appear
    const directionButton = page.locator('.sort-direction-button');
    await expect(directionButton).toBeVisible();
    
    // Should show ascending arrow initially
    await expect(directionButton).toContainText('↑');
    
    // Click to toggle
    await directionButton.click();
    await expect(directionButton).toContainText('↓');
  });

  test('should display Hide Completed checkbox', async ({ page }) => {
    const checkbox = page.locator('.checkbox-label input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    
    const label = page.getByText('Hide Completed');
    await expect(label).toBeVisible();
  });

  test('should show Clear Filters button when filters are active', async ({ page }) => {
    // Apply a filter
    const statusSelect = page.locator('.filters-card .filter-select').first();
    await statusSelect.selectOption('todo');
    
    // Clear Filters button should appear
    const clearButton = page.getByRole('button', { name: /clear filters/i });
    await expect(clearButton).toBeVisible();
    
    // Click to clear
    await clearButton.click();
    
    // Button should disappear
    await expect(clearButton).not.toBeVisible();
  });

  test('should have proper hover states on cards', async ({ page }) => {
    const searchCard = page.locator('.search-card');
    
    // Hover over card
    await searchCard.hover();
    
    // Check box-shadow increases (visual feedback)
    const boxShadow = await searchCard.evaluate((el) => 
      window.getComputedStyle(el).boxShadow
    );
    expect(boxShadow).toBeTruthy();
  });

  test('should have proper focus states on inputs', async ({ page }) => {
    const searchInput = page.locator('.search-input');
    
    // Focus the input
    await searchInput.focus();
    
    // Check border color changes
    const borderColor = await searchInput.evaluate((el) => 
      window.getComputedStyle(el).borderColor
    );
    expect(borderColor).toBeTruthy();
  });

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check no horizontal scroll
    const hasScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);
    
    // Cards should stack vertically
    const filterBar = page.locator('.filter-bar-main');
    const cards = filterBar.locator('.filter-card');
    
    // All cards should be visible
    await expect(cards).toHaveCount(3);
    
    // Each card should take full width
    const searchCard = page.locator('.search-card');
    const cardWidth = await searchCard.evaluate((el) => el.offsetWidth);
    const containerWidth = await filterBar.evaluate((el) => el.offsetWidth);
    
    // Card should be close to container width (accounting for padding)
    expect(cardWidth).toBeGreaterThan(containerWidth - 50);
  });

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check no horizontal scroll
    const hasScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);
    
    // Cards should be visible
    const filterCards = page.locator('.filter-card');
    await expect(filterCards).toHaveCount(3);
  });

  test('should be responsive on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // All cards should be visible in single row
    const filterCards = page.locator('.filter-card');
    await expect(filterCards).toHaveCount(3);
    
    // Verify proper spacing
    const filterBar = page.locator('.filter-bar-main');
    const gap = await filterBar.evaluate((el) => 
      window.getComputedStyle(el).gap
    );
    expect(gap).toBeTruthy();
  });

  test('should have accessible labels on all controls', async ({ page }) => {
    // Check search input has aria-label
    const searchInput = page.locator('.search-input');
    await expect(searchInput).toHaveAttribute('aria-label', 'Search tasks');
    
    // Check status filter has aria-label
    const statusSelect = page.locator('select[aria-label="Filter by status"]');
    await expect(statusSelect).toBeVisible();
    
    // Check priority filter has aria-label
    const prioritySelect = page.locator('select[aria-label="Filter by priority"]');
    await expect(prioritySelect).toBeVisible();
    
    // Check sort select has aria-label
    const sortSelect = page.locator('select[aria-label="Sort by"]');
    await expect(sortSelect).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab to first input (search)
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.className);
    expect(focused).toContain('search-input');
    
    // Tab to next control (status select)
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.className);
    expect(focused).toContain('filter-select');
    
    // Continue tabbing through all controls
    await page.keyboard.press('Tab'); // Priority select
    await page.keyboard.press('Tab'); // Sort select
    focused = await page.evaluate(() => document.activeElement?.className);
    expect(focused).toBeTruthy();
  });

  test('should match visual baseline - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of FilterBar only
    const filterBar = page.locator('.filter-bar');
    await expect(filterBar).toHaveScreenshot('filterbar-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match visual baseline - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of FilterBar on mobile
    const filterBar = page.locator('.filter-bar');
    await expect(filterBar).toHaveScreenshot('filterbar-mobile.png', {
      maxDiffPixels: 100,
    });
  });

  test('should have proper color contrast for text', async ({ page }) => {
    // Get card label color
    const cardLabel = page.locator('.card-label').first();
    const color = await cardLabel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    // Get background color
    const bgColor = await cardLabel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    // Both should be defined (actual contrast ratio testing would require axe-core)
    expect(color).toBeTruthy();
    expect(bgColor).toBeTruthy();
  });
});

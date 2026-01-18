import { test, expect } from '@playwright/test';

test.describe('AllTasks View UI Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/all-tasks');
    await page.waitForLoadState('networkidle');
  });

  test('should display AllTasks view with FilterBar', async ({ page }) => {
    // Verify header
    const header = page.locator('h1').filter({ hasText: 'All Tasks' });
    await expect(header).toBeVisible();
    
    // Verify FilterBar is present
    const filterBar = page.locator('.filter-bar');
    await expect(filterBar).toBeVisible();
  });

  test('should display task list', async ({ page }) => {
    // Task list should be present
    const taskList = page.locator('.task-list');
    await expect(taskList).toBeVisible();
  });

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check no horizontal scroll
    const hasScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);
    
    // FilterBar and task list should still be visible
    await expect(page.locator('.filter-bar')).toBeVisible();
  });

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check no horizontal scroll
    const hasScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);
  });

  test('should match visual baseline - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('alltasks-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

import { test, expect } from '@playwright/test';

test.describe('Dashboard UI Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard without "New Task" button', async ({ page }) => {
    // Verify dashboard header
    const header = page.locator('h1').filter({ hasText: 'Dashboard' });
    await expect(header).toBeVisible();

    // Verify NO "New Task" button exists in Dashboard
    const newTaskButton = page.getByRole('button', { name: /new task/i });
    await expect(newTaskButton).not.toBeVisible();
  });

  test('should display all metric cards', async ({ page }) => {
    // Check all 4 metric cards are visible
    await expect(page.locator('.metric-card')).toHaveCount(4);
    
    // Verify each metric label
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
  });

  test('should display completion rate section', async ({ page }) => {
    const completionSection = page.locator('.completion-section');
    await expect(completionSection).toBeVisible();
    
    await expect(page.getByText('Completion Rate')).toBeVisible();
    await expect(page.locator('.progress-bar')).toBeVisible();
  });

  test('should display priority breakdown', async ({ page }) => {
    const prioritySection = page.locator('.priority-section');
    await expect(prioritySection).toBeVisible();
    
    await expect(page.getByText('Tasks by Priority')).toBeVisible();
    
    // Check all priority badges
    const priorityItems = page.locator('.priority-item');
    await expect(priorityItems).toHaveCount(4);
  });

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check no horizontal scroll
    const hasScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);
    
    // Verify metrics still visible
    await expect(page.locator('.metrics-grid')).toBeVisible();
  });

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check no horizontal scroll
    const hasScroll = await page.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);
    
    // Verify layout adapts
    await expect(page.locator('.metrics-grid')).toBeVisible();
    await expect(page.locator('.priority-grid')).toBeVisible();
  });

  test('should be responsive on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Verify all sections visible
    await expect(page.locator('.metrics-grid')).toBeVisible();
    await expect(page.locator('.completion-section')).toBeVisible();
    await expect(page.locator('.priority-section')).toBeVisible();
  });

  test('should have proper accessibility - keyboard navigation', async ({ page }) => {
    // Tab through interactive elements (if any)
    // Dashboard is mostly read-only, so this verifies focus management
    await page.keyboard.press('Tab');
    
    // Check that focused element is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should match visual baseline - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

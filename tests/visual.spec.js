import { test, expect } from '@playwright/test';

// One section per id in the scroll-snap deck (src/main.js / index.html).
const sectionIds = [
  'hero',
  'arc',
  'seminyak',
  'uluwatu',
  'canggu',
  'nusa',
  'east',
  'ubud',
  'munduk',
  'sanur',
  'close',
];

// First run: create baselines with `npm run test:visual:update`.
// Subsequent runs compare against tests/snapshots/.
test.describe('visual regression - deck sections', () => {
  for (const id of sectionIds) {
    test(`section ${id} matches snapshot`, async ({ page }) => {
      await page.goto('/');

      // Bring the target section into the viewport.
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();

      // Let lazy/background images settle before capturing.
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${id}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

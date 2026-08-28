import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('portfolio remains navigable without WebGL or a live API', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('FULLSTACK');
  await expect(page.locator('main')).toBeVisible();
  await page.getByRole('link', { name: /проектам/i }).focus();
  await expect(page.getByRole('link', { name: /проектам/i })).toBeFocused();
  await page.getByRole('button', { name: 'EN' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('link', { name: 'Skip to work' })).toBeVisible();
});

test('main document has no serious automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .options({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
    .analyze();
  expect(
    results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
  ).toEqual([]);
});

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('portfolio remains navigable without WebGL or a live API', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('FULLSTACK');
  await expect(page.locator('main')).toBeVisible();
  await page.getByRole('link', { name: /проектам/i }).focus();
  await expect(page.getByRole('link', { name: /проектам/i })).toBeFocused();
  await page.getByRole('button', { name: 'EN', exact: true }).click();
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

test('locale, theme, navigation, cases, and external links work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('.site-controls > button').last().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blueprint');

  await page.getByRole('link', { name: 'Cases' }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('.case')).toHaveCount(6);
  await expect(page.getByRole('link', { name: /view source/i })).toHaveAttribute(
    'href',
    'https://github.com/Sskutushev',
  );
});

test('API failure keeps fallback content and resume delivery available', async ({ page }) => {
  await page.route('**/graphql', (route) => route.abort('connectionfailed'));
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();

  await expect(page.getByText(/static content active/i)).toBeVisible();
  await expect(page.locator('.case')).toHaveCount(6);
  await expect(page.getByRole('link', { name: /open resume/i })).toHaveAttribute(
    'href',
    /\/assets\/resume$/,
  );
  await expect(page.getByRole('link', { name: /download pdf/i })).toHaveAttribute(
    'download',
    'sergey-kutushev-resume.pdf',
  );
});

test('engineering dashboard opens and closes without live telemetry', async ({ page }) => {
  await page.goto('/');
  await page.locator('.site-controls > button').first().click();
  const drawer = page.getByRole('dialog', { name: 'ENGINEERING MODE' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText('WEBSOCKET RTT')).toBeVisible();
  await expect(drawer.getByText(/no invented ci metrics/i)).toBeVisible();
  await drawer.getByRole('button', { name: /close engineering mode/i }).click();
  await expect(drawer).toBeHidden();
});

test('mobile and reduced-motion presentation remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.scene')).toHaveCount(0);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.goto('/#contact');
  await expect(page.locator('#contact')).toBeVisible();
});

for (const theme of ['thermal', 'blueprint'] as const) {
  test(`visual regression: desktop ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    if (theme === 'blueprint') await page.locator('.site-controls > button').last().click();
    await expect(page).toHaveScreenshot(`portfolio-desktop-${theme}.png`, {
      animations: 'disabled',
      mask: [page.locator('.eyebrow span')],
      maxDiffPixelRatio: 0.04,
    });
  });
}

test('visual regression: mobile reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page).toHaveScreenshot('portfolio-mobile-reduced.png', {
    animations: 'disabled',
    mask: [page.locator('.eyebrow span')],
    maxDiffPixelRatio: 0.02,
  });
});

test('visual regression: case-study view', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  const work = page.locator('#work');
  await work.scrollIntoViewIfNeeded();
  await expect(work).toHaveScreenshot('portfolio-cases.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.02,
  });
});

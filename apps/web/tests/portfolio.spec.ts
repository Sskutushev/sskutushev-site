import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Reduced motion is emulated per page rather than declared as a fixture option.
 * The fixture form was observed not to reach `matchMedia` at first paint, which
 * silently left tests running with motion enabled and pulled the WebGL canvas
 * into the visual baselines.
 */
async function reduceMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

const RU_HEADLINE = /Проектирую системы/;
const EN_HEADLINE = /I build systems/;

/**
 * Visual baselines are captured offline, which is what GitHub Pages serves. The
 * API is refused explicitly rather than left to time out, so the data-state line
 * cannot race the capture.
 */
async function gotoOffline(page: Page, colorScheme?: 'dark' | 'light'): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce', ...(colorScheme ? { colorScheme } : {}) });
  await page.route('**/graphql', (route) => route.abort('connectionfailed'));
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText(/API unavailable/i)).toBeVisible();
}

test.describe('reduced motion', () => {
  test('renders the designed static composition instead of the canvas', async ({ page }) => {
    await reduceMotion(page);
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('.hero__stage--static')).toBeAttached();
    // Everything the sequence would have revealed stays reachable without it.
    await expect(page.locator('.hero__layers li')).toHaveCount(3);
    await expect(page.locator('.hero__layers')).toContainText('INFRASTRUCTURE');
  });

  test('portfolio is navigable without WebGL or a live API', async ({ page }) => {
    await reduceMotion(page);
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(RU_HEADLINE);
    await expect(page.locator('main')).toBeVisible();
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toContainText(EN_HEADLINE);
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeAttached();
  });

  test('main document has no serious accessibility violations in either theme', async ({
    page,
  }) => {
    for (const colorScheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .options({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
        .analyze();
      expect(
        results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
        `${colorScheme} theme`,
      ).toEqual([]);
    }
  });

  test('theme toggle switches colour scheme and persists the choice', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');

    await page.getByRole('button', { name: /light theme|светлую тему/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('locale, navigation, cases and external links work', async ({ page }) => {
    await reduceMotion(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('.case')).toHaveCount(6);
    await expect(page.getByRole('link', { name: /view source/i })).toHaveAttribute(
      'href',
      'https://github.com/Sskutushev',
    );
  });

  test('API failure keeps fallback content and resume delivery available', async ({ page }) => {
    await gotoOffline(page);
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

  test('the resilience simulation is labelled as a simulation and switches paths', async ({
    page,
  }) => {
    await reduceMotion(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    const simulation = page.locator('.simulation');
    await simulation.scrollIntoViewIfNeeded();
    await expect(simulation.getByText(/not live traffic/i)).toBeVisible();

    await simulation.getByRole('button', { name: 'Incident' }).click();
    await expect(simulation.locator('output')).toContainText('503 · FAIL CLOSED');
    await expect(simulation.locator('output')).toContainText(/refusal instead of false success/i);
  });

  for (const theme of ['dark', 'light'] as const) {
    test(`visual regression: desktop ${theme}`, async ({ page }) => {
      await gotoOffline(page, theme);
      await expect(page).toHaveScreenshot(`portfolio-desktop-${theme}.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  test('visual regression: mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoOffline(page);
    await expect(page).toHaveScreenshot('portfolio-mobile-reduced.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('visual regression: selected systems', async ({ page }) => {
    await gotoOffline(page);
    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();
    await expect(work).toHaveScreenshot('portfolio-cases.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
});

test.describe('with motion enabled', () => {
  test('the hero mounts exactly one canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveCount(1);
  });

  test('engineering drawer owns its scroll and closes on Escape', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /engineering mode|инженерный режим/i }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();

    // The drawer owns its scroll: the smooth-scroll scheduler must not swallow
    // wheel events before they reach it. Regression guard for ADR-017.
    const body = drawer.locator('.drawer__body');
    await body.hover();
    await page.mouse.wheel(0, 2000);
    await expect.poll(() => body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
  });
});

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { gotoOffline } from './offline';

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

test.describe('reduced motion', () => {
  test('renders the designed static composition instead of the canvas', async ({ page }) => {
    await reduceMotion(page);
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveCount(0);
    // The fallback is a drawing of the same object, not an empty stage: the
    // bezel fins are the part that is missing when it degrades to a wash.
    await expect(page.locator('.hero__stage .core-still')).toBeVisible();
    await expect(page.locator('.hero__stage .core-still__fins line')).toHaveCount(24);
    // Everything the sequence would have revealed stays reachable without it.
    await expect(page.locator('.hero__layers > li')).toHaveCount(3);
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

  test('sections stay reachable from the navigation on a phone', async ({ page }) => {
    // The inline links do not fit beside the controls below 900px. They were
    // simply hidden there, which left every section reachable only by scroll.
    await page.setViewportSize({ width: 390, height: 844 });
    await reduceMotion(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Work', exact: true })).toBeHidden();

    await page.getByRole('button', { name: 'Sections' }).click();
    await page.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeHidden();
  });

  test('API failure keeps fallback content and resume delivery available', async ({ page }) => {
    await gotoOffline(page);
    await expect(page.locator('.case')).toHaveCount(6);
    // Served from the build rather than from the API: the published site has no
    // API behind it, and both buttons used to point at an origin that does not
    // answer there.
    await expect(page.getByRole('link', { name: /open resume/i })).toHaveAttribute(
      'href',
      /sergey-kutushev-resume\.pdf$/,
    );
    await expect(page.getByRole('link', { name: /download pdf/i })).toHaveAttribute(
      'download',
      'sergey-kutushev-resume.pdf',
    );
  });

  test('the read path is labelled as a simulation and reroutes on a dependency failure', async ({
    page,
  }) => {
    await reduceMotion(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    const flow = page.locator('#architecture .flow');
    await flow.scrollIntoViewIfNeeded();
    await expect(flow.getByText(/not live traffic/i)).toBeVisible();

    await flow.getByRole('button', { name: 'Database unreachable' }).click();
    await expect(flow.locator('figcaption')).toContainText('200 · STALE');
    // Stale is served, and it says it is stale rather than presenting itself
    // as fresh — the distinction the whole section is about.
    await expect(flow.locator('figcaption')).toContainText(/Stale and invented are not the same/i);
    await expect(flow.locator('.flow__node.is-failed')).toHaveCount(1);
  });

  test('a replayed request visibly does not reach the ledger a second time', async ({ page }) => {
    await reduceMotion(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    const money = page.locator('#case-money-entitlement .flow');
    await money.scrollIntoViewIfNeeded();

    await money.getByRole('button', { name: 'Same key replayed' }).click();
    await expect(money.locator('figcaption')).toContainText('200 · IDEMPOTENT');
    // Skipped, not merely inactive: the request reaches the key and stops.
    await expect(money.locator('.flow__node.is-skipped')).toHaveCount(2);
  });

  test('a case opens the code that decides it, and closes on Escape', async ({ page }) => {
    // Settled first: every other test here waits for a resolved data state, and
    // clicking with the portfolio query still in flight is what made this one
    // fail only on a slower machine.
    await gotoOffline(page);
    const chapter = page.locator('#case-search-cache-reliability');
    await chapter.scrollIntoViewIfNeeded();
    await chapter.getByRole('button', { name: 'How it is solved' }).click();

    const note = page.locator('dialog.note');
    await expect(note).toBeVisible();
    // The excerpt is the claim: it names its file and shows the branch that
    // makes a provider outage a degradation rather than an outage.
    await expect(note).toContainText('apps/api/src/cache/cache.service.ts');
    await expect(note.locator('pre code')).toContainText(
      'return { value: cached.value, stale: true }',
    );

    // `close()` queues its event; a dialog that reopens on the same tick used
    // to close itself a frame after opening.
    await expect(note).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(note).toBeHidden();
  });

  test('rows with no comparable basis stay on their own band in every projection', async ({
    page,
  }) => {
    await reduceMotion(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    const ranking = page.locator('#case-ranking-data-honesty .projection');
    await ranking.scrollIntoViewIfNeeded();
    const unknown = ranking.locator('.projection__point.is-unknown');
    await expect(unknown).toHaveCount(8);

    for (const basis of ['Cohort-adjusted', 'Category']) {
      await ranking.getByRole('button', { name: basis }).click();
      await expect(unknown).toHaveCount(8);
      // Never plotted: an unknown value and a value of zero are different facts,
      // so these keep the band's own y in every basis.
      for (const point of await unknown.all()) {
        expect(await point.getAttribute('cy')).toBe('54');
        expect(await point.getAttribute('style')).toBe('translate: 0px;');
      }
    }
  });

  test('the reviewer path names five checkable steps and opens engineering mode', async ({
    page,
  }) => {
    await gotoOffline(page);
    const reviewer = page.locator('.reviewer');
    await reviewer.scrollIntoViewIfNeeded();
    await expect(reviewer.locator('li')).toHaveCount(5);
    // A command is case-sensitive; the meta register uppercases by default.
    await expect(reviewer.locator('.reviewer__command')).toHaveText(
      'git clone … && docker compose up',
    );

    await reviewer.getByRole('button', { name: /engineering mode/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('the engineering section carries build evidence when the API is gone', async ({ page }) => {
    // The published build has no API behind it, so every live panel on it is
    // offline. Without something measured at build time the whole section would
    // be a column of honest but useless labels.
    await gotoOffline(page);
    const section = page.locator('#engineering');
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByText('measured at build time')).toBeVisible();
    // A build with no repository behind it — a source archive, or this suite
    // running from a copied tree — reports the commit as unknown. What it must
    // never do is render an empty row.
    // Addressed by its label rather than by position: "the first code element
    // in the section" also matches the GraphQL operation in the panel beside it.
    const commit = section.locator('.evidence__row').filter({ hasText: 'Commit' });
    await expect(commit).toHaveText(/^Commit ?([0-9a-f]{7}|unknown)$/);

    await section.getByText('Show the checks').click();
    const gates = section.locator('.evidence__gates li');
    await expect(gates.first()).toContainText('01 · Install');
    expect(await gates.count()).toBeGreaterThan(10);

    // The live panels state their own failure rather than showing a number.
    await expect(section.getByText('API unavailable', { exact: false }).first()).toBeVisible();
    await expect(section.locator('.evidence__row').filter({ hasText: 'Round trip' })).toContainText(
      '—',
    );
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
  test('a CPU-emulated renderer gets the static composition, not a slow object', async ({
    page,
  }) => {
    await page.goto('/');
    const renderer = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      const info = gl?.getExtension('WEBGL_debug_renderer_info');
      return info ? String(gl?.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    });
    // Headless Chromium runs on SwiftShader, which is the case this guards.
    expect(renderer).toMatch(/swiftshader|llvmpipe|software/i);
    await expect(page.locator('.hero__stage .core-still')).toBeVisible();
    // The budget allows one canvas at most; here it must be none.
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('a case note owns its scroll', async ({ page }) => {
    // The counterpart of the drawer test below, and it has to live here rather
    // than beside the other case-note assertions: those run under reduced
    // motion, where Lenis never starts, so the wheel reaches the note whether
    // or not anything suspends the scheduler.
    await page.goto('/');
    // Everything below the hero is a lazy chunk mounted after first paint.
    await expect(page.locator('#work')).toBeAttached();
    const chapter = page.locator('#case-search-cache-reliability');
    await chapter.scrollIntoViewIfNeeded();
    await chapter.getByRole('button', { name: 'Как это решено' }).click();

    const body = page.locator('dialog.note .note__body');
    await expect(body).toBeVisible();
    await body.hover();
    await page.mouse.wheel(0, 2000);
    await expect.poll(() => body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
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

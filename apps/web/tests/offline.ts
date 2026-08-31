import { expect, type Page } from '@playwright/test';

/**
 * Visual baselines are captured offline, which is what GitHub Pages serves. The
 * API is refused explicitly rather than left to time out, so the data-state line
 * cannot race the capture.
 */
export async function gotoOffline(page: Page, colorScheme?: 'dark' | 'light'): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce', ...(colorScheme ? { colorScheme } : {}) });
  await page.route('**/graphql', (route) => route.abort('connectionfailed'));
  await page.goto('/');
  // Everything below the hero is a lazy chunk mounted after first paint. Wait
  // for it before touching anything inside it.
  await expect(page.locator('#work')).toBeAttached();
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText(/API unavailable/i)).toBeVisible();
}

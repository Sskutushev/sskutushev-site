import { expect, test } from '@playwright/test';
import { gotoOffline } from './offline';

/**
 * The layout at every width this design changes shape at.
 *
 * Its own file because it asks a different question from the rest: not whether
 * a surface behaves, but whether it survives being measured. Responsiveness had
 * been reviewed by looking at screenshots, which is how a column of content
 * came to render at zero width on every phone without anyone noticing.
 */
test.describe('responsive', () => {
  /**
   * Widths where this layout actually changes shape, not a round-number list:
   * the phone, the wide phone, the tablet, the point where the case chapters
   * stop stacking, and the desktop range up to a 1920 display.
   */
  for (const width of [375, 580, 768, 1000, 1280, 1440, 1680, 1920]) {
    test(`nothing overflows the page at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await gotoOffline(page);
      // Walk the page so every lazily-revealed section has laid out.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        window.scrollTo(0, 0);
      });

      // A page wider than its viewport is a horizontal scrollbar, which is the
      // one responsive failure a visitor cannot work around.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );

      // Text clipped by its own box, which a screenshot at one width hides.
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter((element) => {
            if (element.ownerSVGElement || element.tagName === 'svg') return false;
            const style = getComputedStyle(element);
            if (style.overflowX === 'auto' || style.overflowX === 'scroll') return false;
            return element.scrollWidth > element.clientWidth + 2;
          })
          .map((element) => `${element.tagName.toLowerCase()}.${String(element.className).trim()}`),
      );
      // The hero stage bleeds past the frame on purpose and the frame clips it.
      expect(clipped.filter((name) => !name.startsWith('div.hero__frame'))).toEqual([]);
    });
  }
});

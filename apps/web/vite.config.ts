import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

/**
 * The subsets the largest element on the first screen is set in: Onest, in
 * Russian with Latin product names. The mono family is deliberately excluded —
 * it only sets small meta labels, never the largest element, so buying it
 * before first paint costs bandwidth the entry chunk needs more. Measured:
 * preloading it as well moved the simulated paint 130ms the wrong way.
 */
const criticalFonts = /(^|\/)onest-(latin|cyrillic)-wght-normal-[^/]*\.woff2$/;

/**
 * Puts the first screen's font subsets into the opening request wave.
 *
 * A font referenced from a stylesheet is only requested once text that needs
 * it is laid out, and in a client-rendered application that happens after the
 * entry chunk has downloaded and run. Every face therefore arrived a whole
 * round trip after first paint, and the swap into the real faces — not the
 * first paint — is what Lighthouse recorded as the largest contentful paint.
 */
function preloadCriticalFonts(): Plugin {
  let base = '/';
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        return Object.keys(bundle ?? {})
          .filter((file) => criticalFonts.test(file))
          .sort()
          .map((file) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `${base}${file}`,
              crossorigin: '',
            },
            injectTo: 'head-prepend' as const,
          }));
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), preloadCriticalFonts()],
    build: { chunkSizeWarningLimit: 900 },
  };
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: `{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-${process.platform}.png`,
  retries: process.env.CI ? 2 : 0,
  /**
   * The page defers everything below the hero until the main thread is idle,
   * and the job that runs this suite also has CockroachDB, Redis, MinIO and the
   * API on the same runner. Five seconds — the default — is long enough on an
   * idle machine and not on that one, which showed up as one interaction test
   * failing there and nowhere else. Reproduced with `docker run --cpus=1`.
   */
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});

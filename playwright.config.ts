import { defineConfig, devices } from '@playwright/test';

/**
 * Tests exist to keep the demo from breaking. The walkthrough performs the
 * section 11 script beat by beat against the production build; the axe test
 * checks every screen; the offline test loads the single-file build from disk
 * with the network blocked.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:4173',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    trace: 'retain-on-failure',
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});

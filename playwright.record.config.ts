import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/** Records a silent, paced walkthrough of the script to docs/walkthrough.webm. Optional; a timing reference only. */
export default defineConfig({
  ...base,
  testMatch: /record\.walkthrough\.ts/,
  timeout: 15 * 60 * 1000,
  use: {
    ...base.use,
    deviceScaleFactor: 1,
    video: { mode: 'on', size: { width: 1440, height: 900 } },
    trace: 'off',
  },
});

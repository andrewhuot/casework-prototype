import { expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

export const SCREENSHOT_DIR = 'docs/screenshots';

export async function shot(page: Page, name: string): Promise<void> {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}.png`, fullPage: false });
}

/** Collects console errors and failed requests so every test can assert a clean run. */
export function watchConsole(page: Page): { errors: string[]; requests: string[] } {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('request', (req) => {
    const url = req.url();
    if (/^https?:/.test(url) && !url.startsWith('http://localhost:4173')) requests.push(url);
  });
  return { errors, requests };
}

export async function openQueue(page: Page): Promise<void> {
  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: 'Queue', level: 1 })).toBeVisible();
}

export async function resetDemo(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('[data-summary]')).toHaveText('7 open cases: 1 new, 2 approve-ready, 2 need information, 2 need judgment.');
}

/** Runs the review on the Delgado case and waits for Case review to open. */
export async function runDelgadoReview(page: Page): Promise<void> {
  await page.locator('[data-case-row="MIA-2026-1187"] [data-run-review]').click();
  const dialog = page.locator('dialog[data-dialog="run-review"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Reading 7 documents')).toBeVisible();
  await expect(dialog.getByText('Checking 12 criteria against Rulebook v1.0')).toBeVisible();
  await expect(dialog.getByText('Finding similar past decisions')).toBeVisible();
  await expect(page).toHaveURL(/#\/cases\/MIA-2026-1187/, { timeout: 10000 });
  await expect(page.locator('[data-saved-review]')).toBeVisible();
}

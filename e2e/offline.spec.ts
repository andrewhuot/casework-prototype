import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Loads the single-file build from disk with every network request blocked,
 * then walks the core of the script. Proves the demo works offline with fonts
 * and icons intact.
 */
test.describe('single-file build, offline', () => {
  test('opens from file:// with the network blocked and runs the script', async ({ browser }) => {
    const file = resolve('release/casework-demo.html');
    test.skip(!existsSync(file), 'Run npm run build:single first');
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const attempted: string[] = [];
    await context.route(/^https?:\/\//, (route) => {
      attempted.push(route.request().url());
      void route.abort();
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await context.setOffline(true);
    await page.goto(`file://${file}`);

    await expect(page.getByRole('heading', { name: 'Queue', level: 1 })).toBeVisible();
    await expect(page.locator('[data-queue-table] tbody tr')).toHaveCount(7);

    // Fonts and icons are inlined: the interface font is Inter, documents use Source Serif 4, icons render as SVG.
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([document.fonts.load('13px "Inter Variable"'), document.fonts.load('14px "Source Serif 4 Variable"'), document.fonts.load('30px "Caveat"')]);
      return {
        inter: document.fonts.check('13px "Inter Variable"'),
        serif: document.fonts.check('14px "Source Serif 4 Variable"'),
        hand: document.fonts.check('30px "Caveat"'),
        loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
      };
    });
    expect(fonts.inter).toBe(true);
    expect(fonts.serif).toBe(true);
    expect(fonts.hand).toBe(true);
    expect(await page.locator('nav svg').count()).toBeGreaterThan(3);

    await page.locator('[data-case-row="MIA-2026-1187"] [data-run-review]').click();
    await expect(page).toHaveURL(/#\/cases\/MIA-2026-1187/, { timeout: 10000 });
    await expect(page.locator('[data-criteria-count]')).toHaveText('12 criteria: 9 met, 3 flagged.');
    await expect(page.locator('mark[data-evidence]')).toHaveCount(2);
    await page.locator('[data-next-flagged]').click();
    await page.locator('[data-next-flagged]').click();
    await expect(page.locator('[data-recommendation]')).toBeVisible();
    const letter = page.locator('[data-letter-editor] textarea');
    await letter.fill((await letter.inputValue()).replace(/\[[^\]]*\]/, 'You may apply for an administrative waiver for the rear setback.'));
    await page.locator('[data-actions] [data-action="send"]').click();
    await expect(page.locator('[data-toast]').first()).toContainText('Request sent to Maria Delgado.');
    await page.goto(`file://${file}#/rulebook`);
    await page.locator('[data-add-source]').click();
    await page.locator('[data-load-example]').click();
    await page.locator('[data-add-confirm]').click();
    await page.locator('[data-source-row="R6"] [data-proposed-change]').click({ timeout: 6000 });
    await page.locator('[data-approve-change]').click();
    await expect(page.locator('[data-rulebook-version]')).toHaveText('Rulebook v1.1');
    await page.goto(`file://${file}#/proving-ground`);
    await page.locator('[data-disagreement]').first().locator('[data-settle="b"]').click();
    await expect(page.locator('[data-tally]')).toContainText('41 of 108 settled');
    await page.goto(`file://${file}#/scoreboard`);
    await page.locator('[data-approve-switch]').click();
    await expect(page.locator('[data-model-text]')).toHaveText('Switched to the new model. The rulebook is unchanged.');
    await page.locator('[data-move-up]').click();
    await expect(page.locator('[data-first-review-coverage]')).toHaveText('On for all 12 criteria.');

    expect(attempted, `network requests attempted: ${attempted.join('\n')}`).toEqual([]);
    expect(errors, `errors: ${errors.join('\n')}`).toEqual([]);
    await context.close();
  });
});

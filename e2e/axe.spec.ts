import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openQueue, runDelgadoReview } from './helpers';

/** Runs axe on every screen and on the drawer and dialog states the demo uses. */
async function checkA11y(page: Page, label: string): Promise<void> {
  // Let entrance transitions finish so contrast is measured on the settled colours.
  await page.waitForTimeout(450);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const violations = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join('\n  ')}`);
  expect(violations, `${label}:\n${violations.join('\n')}`).toEqual([]);
}

test.describe('accessibility', () => {
  test('queue, hint, filters, empty filter, and the run-review dialog', async ({ page }) => {
    await openQueue(page);
    await checkA11y(page, 'queue');
    await page.getByRole('button', { name: 'Waiting on applicant' }).click();
    await expect(page.getByText('No cases match this filter.')).toBeVisible();
    await checkA11y(page, 'queue empty filter');
    await page.getByRole('button', { name: 'All' }).click();
    await page.locator('[data-case-row="MIA-2026-1187"] [data-run-review]').click();
    await expect(page.locator('dialog[data-dialog="run-review"]')).toBeVisible();
    await checkA11y(page, 'run review dialog');
    await expect(page).toHaveURL(/#\/cases\/MIA-2026-1187/, { timeout: 10000 });
  });

  test('case review, drawers and dialogs', async ({ page }) => {
    await openQueue(page);
    await runDelgadoReview(page);
    await checkA11y(page, 'case review gated');
    await page.getByRole('button', { name: 'Open source R1 §ADU-3' }).click();
    await expect(page.locator('dialog[data-drawer="source"]')).toBeVisible();
    await checkA11y(page, 'source viewer');
    await page.keyboard.press('Escape');
    await page.locator('[data-rule-card="A3"] [data-precedent]').first().click();
    await expect(page.locator('dialog[data-drawer="precedent"]')).toBeVisible();
    await checkA11y(page, 'past decision');
    await page.keyboard.press('Escape');
    await page.locator('[data-show-anyway]').click();
    await expect(page.locator('[data-recommendation]')).toBeVisible();
    await checkA11y(page, 'case review revealed');
    await page.locator('[data-send-options] [data-preview-spanish]').click();
    await expect(page.locator('dialog[data-drawer="letter"]')).toBeVisible();
    await checkA11y(page, 'letter preview');
    await page.keyboard.press('Escape');
    await page.locator('[data-not-covered]').click();
    await expect(page.locator('dialog[data-dialog="not-covered"]')).toBeVisible();
    await checkA11y(page, 'not covered');
    await page.keyboard.press('Escape');
    await page.locator('[data-change-finding]').click();
    await expect(page.locator('dialog[data-dialog="change-finding"]')).toBeVisible();
    await checkA11y(page, 'change finding');
    await page.keyboard.press('Escape');
    await page.locator('[data-actions] [data-action="approve"]').click();
    await expect(page.locator('dialog[data-dialog="approve-anyway"]')).toBeVisible();
    await checkA11y(page, 'approve anyway');
    await page.keyboard.press('Escape');
    await page.locator('[data-actions] [data-action="escalate"]').click();
    await expect(page.locator('dialog[data-dialog="escalate"]')).toBeVisible();
    await checkA11y(page, 'escalate');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Decide differently' }).click();
    await page.getByRole('menuitem', { name: /Deny/ }).click();
    await expect(page.locator('dialog[data-dialog="deny"]')).toBeVisible();
    await checkA11y(page, 'deny');
    await page.keyboard.press('Escape');
  });

  test('decision record after sending', async ({ page }) => {
    await openQueue(page);
    await page.locator('[data-case-row="MIA-2026-1149"] a').first().click();
    await expect(page.locator('[data-recommendation]')).toBeVisible();
    await page.locator('[data-actions] [data-action="send"]').click();
    await expect(page).toHaveURL(/#\/$/);
    await page.locator('[data-case-row="MIA-2026-1149"] [data-decision-record]').click();
    await expect(page.locator('dialog[data-drawer="record"]')).toBeVisible();
    await checkA11y(page, 'decision record');
  });

  test('rulebook, add source, proposed change, criteria', async ({ page }) => {
    await page.goto('/#/rulebook');
    await checkA11y(page, 'rulebook sources');
    await page.locator('[data-add-source]').click();
    await checkA11y(page, 'add source');
    await page.locator('[data-load-example]').click();
    await page.locator('[data-add-confirm]').click();
    await expect(page.locator('[data-source-row="R6"] [data-proposed-change]')).toBeVisible({ timeout: 6000 });
    await page.locator('[data-source-row="R6"] [data-proposed-change]').click();
    await expect(page.locator('dialog[data-dialog="proposed-change"]')).toBeVisible();
    await checkA11y(page, 'proposed change');
    await page.locator('[data-approve-change]').click();
    await page.getByRole('tab', { name: 'Criteria' }).click();
    await checkA11y(page, 'rulebook criteria');
  });

  test('proving ground and scoreboard', async ({ page }) => {
    await page.goto('/#/proving-ground');
    await checkA11y(page, 'proving ground');
    await page.locator('[data-disagreement]').first().locator('[data-settle="b"]').click();
    await checkA11y(page, 'proving ground settled');
    await page.goto('/#/scoreboard');
    await checkA11y(page, 'scoreboard');
    await page.locator('[data-approve-switch]').click();
    await checkA11y(page, 'scoreboard switched');
    await page.locator('[data-move-up]').click();
    await checkA11y(page, 'scoreboard criterion moved up');
  });
});

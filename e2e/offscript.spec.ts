import { expect, test } from '@playwright/test';
import { openQueue, runDelgadoReview, watchConsole } from './helpers';

/** Every click outside the script still lands somewhere sensible. */
test.describe('off the script path', () => {
  test('all seven cases open with grouped criteria and the expected statuses', async ({ page }) => {
    const { errors } = watchConsole(page);
    await openQueue(page);
    const expected: Record<string, { count: string; groups: string[]; flagged: string[] }> = {
      'MIA-2026-1142': { count: '6 criteria: 6 met, 0 flagged.', groups: ['Rooftop solar', 'Across both'], flagged: [] },
      'MIA-2026-1156': { count: '6 criteria: 6 met, 0 flagged.', groups: ['ADU', 'Across both'], flagged: [] },
      'MIA-2026-1149': { count: '6 criteria: 5 met, 1 flagged.', groups: ['Rooftop solar', 'Across both'], flagged: ['S3'] },
      'MIA-2026-1163': { count: '12 criteria: 11 met, 1 flagged.', groups: ['ADU', 'Rooftop solar', 'Across both'], flagged: ['S1'] },
      'MIA-2026-1171': { count: '6 criteria: 5 met, 1 flagged.', groups: ['ADU', 'Across both'], flagged: ['A2'] },
      'MIA-2026-1178': { count: '6 criteria: 5 met, 1 flagged.', groups: ['Rooftop solar', 'Across both'], flagged: ['S2'] },
    };
    for (const [id, exp] of Object.entries(expected)) {
      await page.goto(`/#/cases/${id}`);
      await expect(page.locator('[data-criteria-count]')).toHaveText(exp.count);
      const groups = page.locator('[data-criteria-list] [role="group"]');
      await expect(groups).toHaveCount(exp.groups.length);
      for (const [i, name] of exp.groups.entries()) await expect(groups.nth(i)).toHaveAttribute('aria-label', name);
      for (const f of exp.flagged) await expect(page.locator(`[data-criterion="${f}"]`)).toHaveAttribute('aria-selected', 'true');
      if (exp.flagged.length === 0) {
        await expect(page.locator('[data-criteria-list] [role="option"]').first()).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('[data-recommendation]')).toBeVisible();
      }
      await expect(page.locator('mark[data-evidence]').first()).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test('approve-ready case: primary Approve, approval notice, Decided row, decision record, Undo', async ({ page }) => {
    await openQueue(page);
    await page.goto('/#/cases/MIA-2026-1142');
    await expect(page.locator('[data-recommendation]')).toContainText('Approve-ready');
    await expect(page.locator('[data-actions] [data-action="approve"]')).toBeVisible();
    await expect(page.locator('[data-actions] [data-action="send"]')).toHaveCount(0);
    await expect(page.locator('[data-send-options]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Decide differently' }).click();
    await expect(page.getByRole('menuitem', { name: /Send request for information/ })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Escalate/ })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Deny/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('[data-actions] [data-action="approve"]').click();
    await expect(page.locator('[data-toast]').first()).toContainText('Permit issued for MIA-2026-1142');
    await expect(page).toHaveURL(/#\/$/);
    const row = page.locator('[data-case-row="MIA-2026-1142"]');
    await expect(row).toHaveAttribute('data-status', 'decided');
    await expect(row).toContainText('Permit issued');
    await expect(page.locator('[data-summary]')).toHaveText('6 open cases: 1 new, 1 approve-ready, 2 need information, 2 need judgment. 1 decided.');
    await row.locator('[data-decision-record]').click();
    const record = page.locator('dialog[data-drawer="record"]');
    await expect(record).toContainText('Permit issued');
    await expect(record).toContainText('has been approved');
    await page.keyboard.press('Escape');
    await row.locator('a').first().click();
    await expect(page.locator('[data-recommendation], aside[aria-label="Recommendation"]').first()).toContainText('Approval notice as sent');
    await expect(page.locator('[data-actions]')).toHaveCount(0);
    await page.goto('/#/');
    await page.locator('[data-toast]').first().getByRole('button', { name: /Undo/ }).click();
    await expect(page.locator('[data-case-row="MIA-2026-1142"]')).toHaveAttribute('data-status', 'approve_ready');
  });

  test('needs-information case: primary Send, Patel request-round warning, escalate, deny under Decide differently', async ({ page }) => {
    await openQueue(page);
    await page.goto('/#/cases/MIA-2026-1163');
    await expect(page.locator('[data-recommendation]')).toContainText('Needs information');
    await expect(page.getByText('This will be request 2 for this applicant. Check that it is complete.')).toBeVisible();
    await expect(page.locator('[data-actions] [data-action="send"]')).toBeVisible();
    await expect(page.locator('[data-actions] [data-action="send"]')).not.toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('[data-actions] [data-action="approve"]')).toHaveCount(0);
    // Deny requires a typed reason and shows the adverse-action notice.
    await page.getByRole('button', { name: 'Decide differently' }).click();
    await page.getByRole('menuitem', { name: /Deny/ }).click();
    const deny = page.locator('dialog[data-dialog="deny"]');
    await expect(deny).toContainText('This starts an adverse action. The letter will explain how to appeal.');
    await deny.locator('[data-confirm]').click();
    await expect(deny.getByRole('alert')).toContainText('A reason is required');
    await deny.getByLabel('Reason for denial').fill('Contractor licence expired and no replacement named.');
    await deny.locator('[data-confirm]').click();
    await expect(page.locator('[data-toast]').first()).toContainText('Denial letter sent to Anika Patel.');
    await expect(page.locator('[data-case-row="MIA-2026-1163"]')).toContainText('Permit denied');
    await page.locator('[data-toast]').first().getByRole('button', { name: /Undo/ }).click();
    await expect(page.locator('[data-case-row="MIA-2026-1163"]')).toHaveAttribute('data-status', 'needs_information');
    // Escalate asks for a note and sends nothing.
    await page.goto('/#/cases/MIA-2026-1149');
    await page.getByRole('button', { name: 'Decide differently' }).click();
    await page.getByRole('menuitem', { name: /Escalate/ }).click();
    const escalate = page.locator('dialog[data-dialog="escalate"]');
    await escalate.getByLabel('Internal note').fill('Wind letter promised twice; please chase the engineer.');
    await escalate.locator('[data-confirm]').click();
    await expect(page.locator('[data-toast]').first()).toContainText('escalated to a senior reviewer. Nothing was sent to the applicant.');
    await expect(page.locator('[data-case-row="MIA-2026-1149"]')).toContainText('Escalated to senior reviewer');
  });

  test('approving with unmet or unclear criteria asks for confirmation and a reason', async ({ page }) => {
    await openQueue(page);
    await runDelgadoReview(page);
    await page.locator('[data-show-anyway]').click();
    await page.locator('[data-actions] [data-action="approve"]').click();
    const dialog = page.locator('dialog[data-dialog="approve-anyway"]');
    await expect(dialog).toContainText('2 criteria are not met and 1 is unclear. Approve anyway?');
    await dialog.locator('[data-confirm]').click();
    await expect(dialog.getByRole('alert')).toContainText('A reason is required');
    await dialog.getByLabel('Reason for approving').fill('Certificate received by phone; waiver granted.');
    await dialog.locator('[data-confirm]').click();
    await expect(page.locator('[data-toast]').first()).toContainText('Permit issued for MIA-2026-1187');
    await page.locator('[data-case-row="MIA-2026-1187"] [data-decision-record]').click();
    await expect(page.locator('dialog[data-drawer="record"]')).toContainText('Reason: Certificate received by phone; waiver granted.');
  });

  test('reviewer changes a finding with a reason, keyboard shortcuts move the selection, not-covered note opens', async ({ page }) => {
    await openQueue(page);
    await runDelgadoReview(page);
    await page.locator('[data-change-finding]').click();
    const change = page.locator('dialog[data-dialog="change-finding"]');
    await change.getByLabel('Met', { exact: true }).check();
    await change.locator('[data-confirm]').click();
    await expect(change.getByRole('alert')).toContainText('Give a reason');
    await change.getByLabel('Reason').fill('Survey controls; site plan drawn before the survey.');
    await change.locator('[data-confirm]').click();
    await expect(page.locator('[data-criteria-count]')).toHaveText('12 criteria: 10 met, 2 flagged.');
    await expect(page.locator('[data-criterion="A3"]')).toContainText('Changed by reviewer');
    await expect(page.locator('[data-rule-card="A3"]')).toContainText('Changed from Unclear to Met');
    // Keyboard: Down moves to A4, N jumps to the next flagged (A5).
    await page.locator('[data-documents]').click();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[data-criterion="A4"]')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('n');
    await expect(page.locator('[data-criterion="A5"]')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('[data-criterion="A4"]')).toHaveAttribute('aria-selected', 'true');
    await page.locator('[data-not-covered]').click();
    const note = page.locator('dialog[data-dialog="not-covered"]');
    await expect(note).toContainText('Structural plan review');
    await expect(note).toContainText('Historic district review');
    await expect(note).toContainText('Tree removal permits');
    await page.keyboard.press('Escape');
    await expect(note).toBeHidden();
  });

  test('ask about this case shows saved answers with a quote; free-form is disabled', async ({ page }) => {
    await openQueue(page);
    await page.goto('/#/cases/MIA-2026-1178');
    const ask = page.locator('[data-ask-about]');
    await ask.scrollIntoViewIfNeeded();
    await expect(ask.getByRole('button', { expanded: false })).toHaveCount(3);
    await ask.getByRole('button', { name: 'Which document is right about the ridge setback?' }).click();
    await expect(ask).toContainText('They conflict.');
    await expect(ask).toContainText('Modules run to 14 in below the ridge to fit the third string.');
    await expect(ask.getByLabel('Ask something else')).toBeDisabled();
    await expect(ask).toContainText('Free-form questions need a live model connection');
  });

  test('past decision drawer, R5 lists eight decisions, letter preview from the editor', async ({ page }) => {
    await openQueue(page);
    await runDelgadoReview(page);
    await page.locator('[data-rule-card="A3"] [data-precedent="P-2024-0562"]').click();
    const precedent = page.locator('dialog[data-drawer="precedent"]');
    await expect(precedent).toContainText('Denied');
    await expect(precedent).toContainText('neighbour objected');
    await precedent.getByRole('button', { name: 'Open source R5' }).click();
    const source = page.locator('dialog[data-drawer="source"]');
    await expect(source).toContainText('Closed cases 2024 to 2025');
    await expect(source.getByRole('button', { name: /^P-20/ })).toHaveCount(8);
    await page.keyboard.press('Escape');
    await page.locator('[data-show-anyway]').click();
    await page.locator('[data-letter-editor]').getByRole('button', { name: 'Preview' }).click();
    const letter = page.locator('dialog[data-drawer="letter"] [data-letter-preview="en"]');
    await expect(letter).toContainText('City of Miami · Building Department');
    await expect(letter).toContainText('Re: Application MIA-2026-1187');
    await expect(letter.locator('ol li')).toHaveCount(2);
  });

  test('rulebook: a custom source is added as reference, and a rejected change leaves v1.0', async ({ page }) => {
    await page.goto('/#/rulebook');
    await page.locator('[data-add-source]').click();
    await page.locator('[data-source-name]').fill('Tree ordinance (excerpt)');
    await page.locator('[data-add-confirm]').click();
    await expect(page.locator('[data-source-row="R7"] [data-processing]')).toBeVisible();
    await expect(page.locator('[data-toast]').first()).toContainText('Added as reference. No rule changes proposed.', { timeout: 6000 });
    await expect(page.locator('[data-source-row="R7"]')).toContainText('Active');
    await page.locator('[data-source-row="R7"]').click();
    await expect(page.locator('dialog[data-drawer="source"]')).toContainText('Tree ordinance (excerpt)');
    await page.keyboard.press('Escape');
    await page.locator('[data-add-source]').click();
    await page.locator('[data-load-example]').click();
    await page.locator('[data-add-confirm]').click();
    await page.locator('[data-source-row="R6"] [data-proposed-change]').click({ timeout: 6000 });
    await page.locator('[data-reject-change]').click();
    await expect(page.locator('[data-toast]').last()).toContainText('Change rejected');
    await expect(page.locator('[data-rulebook-version]')).toHaveText('Rulebook v1.0');
    await expect(page.locator('[data-source-row="R6"]')).toContainText('Active');
  });

  test('proving ground: A and Unclear choices update the tally; scoreboard switches only change labels', async ({ page }) => {
    await page.goto('/#/proving-ground');
    const rows = page.locator('[data-disagreement]');
    await rows.nth(1).locator('[data-settle="a"]').click();
    await expect(rows.nth(1).locator('[data-reveal]')).toHaveText('A was Claude');
    await expect(page.locator('[data-tally]')).toContainText('101 of 108 settled: Claude right 47', { timeout: 5000 });
    await rows.nth(2).locator('[data-settle="unclear"]').click();
    await expect(page.locator('[data-tally]')).toContainText('102 of 108 settled: Claude right 47, reviewer right 48, unclear 7', { timeout: 5000 });
    await rows.nth(3).locator('[data-settle="b"]').click();
    await expect(page.locator('[data-tally]')).toContainText('103 of 108 settled: Claude right 47, reviewer right 49, unclear 7', { timeout: 5000 });
    await page.goto('/#/scoreboard');
    const shadow = page.locator('[data-rung="shadow"]').getByRole('switch');
    await expect(shadow).toHaveAttribute('aria-checked', 'true');
    await shadow.click();
    await expect(shadow).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('[data-rung="shadow"]')).toContainText('Off');
    await expect(page.locator('[data-rung="front_door"]').getByRole('switch')).toBeDisabled();
  });

  test('queue filters, empty state, and row click on a New case starts the review', async ({ page }) => {
    await openQueue(page);
    await page.getByRole('button', { name: 'Needs judgment' }).click();
    await expect(page.locator('[data-queue-table] tbody tr')).toHaveCount(2);
    await page.getByRole('button', { name: 'Decided' }).click();
    await expect(page.getByText('No cases match this filter.')).toBeVisible();
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByRole('button', { name: 'Dismiss' }).first().click();
    await expect(page.getByText('New here? Start with Run review on the Delgado case.')).toHaveCount(0);
    await page.locator('[data-case-row="MIA-2026-1187"] td').nth(2).click();
    await expect(page.locator('dialog[data-dialog="run-review"]')).toBeVisible();
    await expect(page).toHaveURL(/#\/cases\/MIA-2026-1187/, { timeout: 10000 });
  });

  test('layout holds at 1280, 1920 and 1024 wide', async ({ page }) => {
    for (const width of [1280, 1920, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await openQueue(page);
      await page.getByRole('button', { name: 'Reset demo' }).click();
      await runDelgadoReview(page);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `test-results/layout-${width}.png` });
      const overflow = await page.evaluate(() => {
        const main = document.getElementById('main');
        return main ? main.scrollWidth - main.clientWidth : 0;
      });
      expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
      await expect(page.locator('mark[data-evidence]').nth(0)).toBeInViewport();
      await expect(page.locator('mark[data-evidence]').nth(1)).toBeInViewport();
      await page.goto('/#/scoreboard');
      await expect(page.locator('[data-approve-switch]')).toBeInViewport();
      await page.screenshot({ path: `test-results/layout-scoreboard-${width}.png` });
    }
  });
});

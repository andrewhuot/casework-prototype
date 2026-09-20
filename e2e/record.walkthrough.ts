import { expect, test, type Page } from '@playwright/test';
import { copyFileSync, mkdirSync } from 'node:fs';

/**
 * A silent recording of the section 11 script, paced to its timings, with a
 * cursor overlay injected for the recording only. Run with
 * npx playwright test --config playwright.record.config.ts
 */

const CURSOR_SCRIPT = `
(() => {
  if (window.__cursorInstalled) return;
  window.__cursorInstalled = true;
  const style = document.createElement('style');
  style.textContent = '#__cursor{position:fixed;left:0;top:0;width:22px;height:30px;pointer-events:none;z-index:2147483647;transform:translate(-3px,-2px);filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}#__cursor.down{transform:translate(-3px,-2px) scale(.9)}#__ripple{position:fixed;width:34px;height:34px;border-radius:50%;border:2px solid rgba(47,95,224,.8);pointer-events:none;z-index:2147483646;transform:translate(-50%,-50%) scale(.3);opacity:0}#__ripple.go{animation:__rip .45s ease-out}@keyframes __rip{0%{opacity:1;transform:translate(-50%,-50%) scale(.3)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)}}';
  const install = () => {
    if (!document.body) return requestAnimationFrame(install);
    document.head.appendChild(style);
    const cursor = document.createElement('div');
    cursor.id = '__cursor';
    cursor.innerHTML = '<svg viewBox="0 0 22 30" width="22" height="30"><path d="M2 2 L2 23 L7.5 18 L11 27 L15 25.5 L11.5 17 L19 17 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const ripple = document.createElement('div');
    ripple.id = '__ripple';
    document.body.appendChild(cursor);
    document.body.appendChild(ripple);
    let x = 720, y = 450;
    const place = () => { cursor.style.left = x + 'px'; cursor.style.top = y + 'px'; };
    place();
    document.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; place(); }, true);
    document.addEventListener('mousedown', (e) => {
      cursor.classList.add('down');
      ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
      ripple.classList.remove('go'); void ripple.offsetWidth; ripple.classList.add('go');
    }, true);
    document.addEventListener('mouseup', () => cursor.classList.remove('down'), true);
  };
  install();
})();
`;

async function glide(page: Page, target: ReturnType<Page['locator']>, ms = 700): Promise<void> {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: Math.max(12, Math.round(ms / 16)) });
}

async function glideClick(page: Page, target: ReturnType<Page['locator']>, ms = 700): Promise<void> {
  await glide(page, target, ms);
  await page.mouse.down();
  await page.waitForTimeout(90);
  await page.mouse.up();
}

test('record the walkthrough', async ({ page }, testInfo) => {
  await page.addInitScript(CURSOR_SCRIPT);
  const started = Date.now();
  const holdUntil = async (seconds: number) => {
    const wait = started + seconds * 1000 - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
  };

  // 0:00 Queue.
  await page.goto('/#/');
  await expect(page.locator('[data-queue-table] tbody tr')).toHaveCount(7);
  await page.mouse.move(900, 500, { steps: 20 });
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-case-row="MIA-2026-1142"]'), 900);
  await page.waitForTimeout(1400);
  await glide(page, page.locator('[data-case-row="MIA-2026-1156"]'), 500);
  await page.waitForTimeout(1400);
  await glide(page, page.locator('[data-case-row="MIA-2026-1187"] td').nth(1), 700);

  // 0:25 Run review.
  await holdUntil(25);
  await glideClick(page, page.locator('[data-case-row="MIA-2026-1187"] [data-run-review]'));
  await expect(page).toHaveURL(/#\/cases\/MIA-2026-1187/, { timeout: 10000 });
  await page.mouse.move(1000, 700, { steps: 20 });

  // 0:47 Left pane, then A3.
  await holdUntil(47);
  await glide(page, page.locator('[data-criteria-count]'), 800);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-criterion="A3"]'), 600);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('mark[data-evidence]').nth(0), 700);
  await page.waitForTimeout(2200);
  await glide(page, page.locator('mark[data-evidence]').nth(1), 700);

  // 1:12 Source chip, then past decisions.
  await holdUntil(72);
  await glideClick(page, page.getByRole('button', { name: 'Open source R1 §ADU-3' }));
  await page.waitForTimeout(6000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  await glide(page, page.locator('[data-rule-card="A3"] [data-precedents]'), 800);

  // 1:37 Next flagged: A5.
  await holdUntil(97);
  await glideClick(page, page.locator('[data-next-flagged]'));
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-missing]'), 800);

  // 1:52 Next flagged: X1.
  await holdUntil(112);
  await glideClick(page, page.locator('[data-next-flagged]'));
  await page.waitForTimeout(3000);
  await glide(page, page.locator('mark[data-evidence]').nth(0), 700);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('mark[data-evidence]').nth(1), 700);

  // 2:17 Read the recommendation, replace the bracketed line, point to send options, send.
  await holdUntil(137);
  await glide(page, page.locator('[data-rationale]'), 900);
  await page.waitForTimeout(6000);
  const letter = page.locator('[data-letter-editor] textarea');
  await glideClick(page, letter, 800);
  await letter.evaluate((el) => {
    const ta = el as HTMLTextAreaElement;
    const start = ta.value.indexOf('[');
    const end = ta.value.indexOf(']') + 1;
    ta.setSelectionRange(start, end);
  });
  await page.waitForTimeout(600);
  await page.keyboard.type('You may apply for an administrative waiver for the rear setback.', { delay: 28 });
  await page.waitForTimeout(1500);
  await glide(page, page.locator('[data-send-options]').getByText('Reply due'), 900);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-send-options]').getByLabel('Text message'), 500);
  await page.waitForTimeout(2200);
  await glide(page, page.locator('[data-send-options]').getByLabel('Also send a Spanish copy'), 500);
  await page.waitForTimeout(2500);
  await glideClick(page, page.locator('[data-actions] [data-action="send"]'), 900);
  await expect(page).toHaveURL(/#\/$/);
  await glide(page, page.locator('[data-toast]').first(), 700);

  // 3:02 Decision record.
  await holdUntil(182);
  await glideClick(page, page.locator('[data-case-row="MIA-2026-1187"] [data-decision-record]'));
  await page.waitForTimeout(8000);
  await page.keyboard.press('Escape');

  // 3:15 Rulebook.
  await holdUntil(195);
  await glideClick(page, page.getByRole('link', { name: 'Rulebook' }).first());
  await page.waitForTimeout(3000);
  await glideClick(page, page.locator('[data-add-source]'));
  await page.waitForTimeout(1500);
  await glideClick(page, page.locator('[data-load-example]'));
  await page.waitForTimeout(1500);
  await glideClick(page, page.locator('[data-add-confirm]'));
  await expect(page.locator('[data-source-row="R6"] [data-proposed-change]')).toBeVisible({ timeout: 6000 });
  await page.waitForTimeout(1200);
  await glideClick(page, page.locator('[data-source-row="R6"] [data-proposed-change]'));
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-impact-line]'), 800);
  await page.waitForTimeout(5000);
  await glideClick(page, page.locator('[data-approve-change]'));
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-rulebook-version]'), 700);

  // 4:00 Proving ground.
  await holdUntil(240);
  await glideClick(page, page.getByRole('link', { name: 'Proving ground' }).first());
  await page.waitForTimeout(3500);
  await glide(page, page.locator('[data-agreement="X1"]'), 800);
  await page.waitForTimeout(3000);
  const x1Row = page.locator('[data-disagreement]').filter({ hasText: 'X1' }).first();
  await glide(page, x1Row, 700);
  await page.waitForTimeout(4000);
  await glideClick(page, x1Row.locator('[data-settle="b"]'));
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-tally]'), 700);

  // 4:28 Scoreboard.
  await holdUntil(268);
  await glideClick(page, page.getByRole('link', { name: 'Scoreboard' }).first());
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-metric="days"]'), 700);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-metric="backlog"]'), 500);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-team-footnote]'), 700);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-rung="front_door"]'), 800);
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-model-card]'), 700);
  await page.waitForTimeout(3000);
  await glideClick(page, page.locator('[data-approve-switch]'));

  // 4:56 Stay on the Scoreboard.
  await holdUntil(296);
  await page.mouse.move(900, 400, { steps: 30 });
  await holdUntil(302);

  const video = page.video();
  await page.close();
  const path = await video?.path();
  if (path) {
    mkdirSync('docs', { recursive: true });
    copyFileSync(path, 'docs/walkthrough.webm');
    testInfo.annotations.push({ type: 'video', description: 'docs/walkthrough.webm' });
  }
});

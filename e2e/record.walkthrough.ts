import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';

/**
 * A silent recording of the section 11 script (docs/DEMO_SCRIPT.md), paced to
 * its timings, with a cursor overlay injected for the recording only. Run with
 * npx playwright test --config playwright.record.config.ts
 * Writes docs/walkthrough.mp4 when ffmpeg is installed, otherwise docs/walkthrough.webm.
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
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-case-row="MIA-2026-1142"]'), 900);
  await page.waitForTimeout(1400);
  await glide(page, page.locator('[data-case-row="MIA-2026-1156"]'), 500);
  await page.waitForTimeout(3000);
  // Down the status column: the sort that keeps applications moving, oldest first within each group.
  const queueRows = page.locator('[data-queue-table] tbody tr');
  await glide(page, queueRows.nth(0).locator('td').nth(4), 800);
  await page.waitForTimeout(1500);
  await glide(page, queueRows.nth(3).locator('td').nth(4), 1400);
  await page.waitForTimeout(1500);
  await glide(page, queueRows.nth(6).locator('td').nth(4), 1400);
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-case-row="MIA-2026-1187"] td').nth(1), 900);

  // 0:30 Run review.
  await holdUntil(30);
  await glideClick(page, page.locator('[data-case-row="MIA-2026-1187"] [data-run-review]'));
  await expect(page).toHaveURL(/#\/cases\/MIA-2026-1187/, { timeout: 10000 });
  await page.mouse.move(1000, 700, { steps: 20 });

  // 0:45 A3 Setbacks: count, highlights, Second reader, source, precedents.
  await holdUntil(45);
  await glide(page, page.locator('[data-criteria-count]'), 800);
  await page.waitForTimeout(2000);
  await glide(page, page.locator('mark[data-evidence]').nth(0), 700);
  await page.waitForTimeout(2000);
  await glide(page, page.locator('mark[data-evidence]').nth(1), 700);
  await page.waitForTimeout(2000);
  await glide(page, page.locator('[data-rule-card="A3"] [data-rung-tag]'), 700);
  await page.waitForTimeout(2500);
  await glideClick(page, page.getByRole('button', { name: 'Open source R1 §ADU-3' }));
  await page.waitForTimeout(4500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  await glide(page, page.locator('[data-rule-card="A3"] [data-precedents]'), 800);

  // 1:20 A5 Flood elevation.
  await holdUntil(80);
  await glideClick(page, page.locator('[data-next-flagged]'));
  await page.waitForTimeout(2000);
  await glide(page, page.locator('[data-missing]'), 800);

  // 1:30 X1 Electrical capacity.
  await holdUntil(90);
  await glideClick(page, page.locator('[data-next-flagged]'));
  await page.waitForTimeout(3000);
  await glide(page, page.locator('mark[data-evidence]').nth(0), 700);
  await page.waitForTimeout(6000);
  await glide(page, page.locator('mark[data-evidence]').nth(1), 700);

  // 1:55 The recommendation, the letter, three reminder channels, send.
  await holdUntil(115);
  await glide(page, page.locator('[data-rationale]'), 900);
  await page.waitForTimeout(5000);
  const letter = page.locator('[data-letter-editor] textarea');
  await glideClick(page, letter, 800);
  await letter.evaluate((el) => {
    const ta = el as HTMLTextAreaElement;
    const start = ta.value.indexOf('[');
    const end = ta.value.indexOf(']') + 1;
    ta.setSelectionRange(start, end);
  });
  await page.waitForTimeout(500);
  await page.keyboard.type('You may apply for an administrative waiver for the rear setback.', { delay: 28 });
  await page.waitForTimeout(1200);
  await glide(page, page.locator('[data-send-options]').getByText('Reply due'), 900);
  await page.waitForTimeout(2000);
  await glide(page, page.locator('[data-send-options]').getByLabel('Email'), 500);
  await page.waitForTimeout(1200);
  await glide(page, page.locator('[data-send-options]').getByLabel('Text message'), 500);
  await page.waitForTimeout(1200);
  await glideClick(page, page.locator('[data-send-options]').getByLabel('Phone call from a virtual agent'), 500);
  await page.waitForTimeout(3500);
  await glide(page, page.locator('[data-send-options]').getByLabel('Also send a Spanish copy'), 500);
  await page.waitForTimeout(2000);
  await glideClick(page, page.locator('[data-actions] [data-action="send"]'), 900);
  await expect(page).toHaveURL(/#\/$/);
  await glide(page, page.locator('[data-toast]').first(), 700);

  // 2:45 Rulebook.
  await holdUntil(165);
  await glideClick(page, page.getByRole('link', { name: 'Rulebook' }).first());
  await page.waitForTimeout(2000);
  await glideClick(page, page.locator('[data-add-source]'));
  await page.waitForTimeout(1200);
  await glideClick(page, page.locator('[data-load-example]'));
  await page.waitForTimeout(1200);
  await glideClick(page, page.locator('[data-add-confirm]'));
  await expect(page.locator('[data-source-row="R6"] [data-proposed-change]')).toBeVisible({ timeout: 6000 });
  await page.waitForTimeout(1000);
  await glideClick(page, page.locator('[data-source-row="R6"] [data-proposed-change]'));
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-impact-line]'), 800);
  await page.waitForTimeout(5000);
  await glideClick(page, page.locator('[data-approve-change]'));
  await page.waitForTimeout(1500);
  await glide(page, page.locator('[data-rulebook-version]'), 700);

  // 3:10 Proving ground.
  await holdUntil(190);
  await glideClick(page, page.getByRole('link', { name: 'Proving ground' }).first());
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-headline-agreement]'), 700);
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-headline-golden]'), 600);
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-agreement="X1"]'), 800);
  await page.waitForTimeout(5000);
  const x1Row = page.locator('[data-disagreement]').filter({ hasText: 'X1' }).first();
  await glide(page, x1Row, 700);
  await page.waitForTimeout(3000);
  await glideClick(page, x1Row.locator('[data-settle="b"]'));
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-tally]'), 700);
  await page.waitForTimeout(3000);
  // Setbacks: the one criterion below the line, and why the Delgado setback call was the reviewer's.
  await glide(page, page.locator('[data-agreement="A3"]'), 900);
  await page.waitForTimeout(4000);
  await glide(page, page.locator('[data-bars-note]'), 800);

  // 3:50 Scoreboard: comparison group, override rate, ladder, model switch, move up.
  await holdUntil(230);
  await glideClick(page, page.getByRole('link', { name: 'Scoreboard' }).first());
  await page.waitForTimeout(2500);
  await glide(page, page.locator('[data-metric="days"]'), 700);
  await page.waitForTimeout(3500);
  await glide(page, page.locator('[data-override-line]'), 700);
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-first-review-coverage]'), 800);
  await page.waitForTimeout(3000);
  await glide(page, page.locator('[data-model-card]'), 700);
  await page.waitForTimeout(3000);
  await glideClick(page, page.locator('[data-approve-switch]'));
  await page.waitForTimeout(3500);
  await glideClick(page, page.locator('[data-move-up]'));
  await page.waitForTimeout(1500);
  await glide(page, page.locator('[data-first-review-coverage]'), 800);

  // 4:25 Close.
  await holdUntil(265);
  await page.mouse.move(900, 400, { steps: 30 });
  await holdUntil(271);

  const video = page.video();
  await page.close();
  const path = await video?.path();
  if (!path) return;
  mkdirSync('docs', { recursive: true });
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', 'docs/walkthrough.mp4']);
    rmSync('docs/walkthrough.webm', { force: true });
    testInfo.annotations.push({ type: 'video', description: 'docs/walkthrough.mp4' });
  } catch {
    copyFileSync(path, 'docs/walkthrough.webm');
    testInfo.annotations.push({ type: 'video', description: 'docs/walkthrough.webm (install ffmpeg for MP4)' });
  }
});

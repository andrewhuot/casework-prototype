import { describe, expect, it } from 'vitest';
import { buildQueueRows, filterQueueRows, sortQueueRows, summaryLine } from './queue';
import { CASES } from '@/data/cases';
import type { CaseState } from '@/app/store';

function seed(overrides: Partial<Record<string, Partial<CaseState>>> = {}): Record<string, CaseState> {
  const out: Record<string, CaseState> = {};
  for (const c of CASES) {
    out[c.id] = {
      status: c.initialStatus,
      openedCriteria: [],
      revealed: false,
      letterEdited: false,
      sendOptions: { replyDue: '2026-10-05', remindEmail: true, remindText: true, remindCall: false, spanishCopy: false },
      changes: {},
      ...overrides[c.id],
    };
  }
  return out;
}

describe('queue', () => {
  it('sorts New first, then Approve-ready, Needs information, Needs judgment, oldest first within a status', () => {
    const rows = sortQueueRows(buildQueueRows(seed()));
    expect(rows.map((r) => r.meta.id)).toEqual(['MIA-2026-1187', 'MIA-2026-1142', 'MIA-2026-1156', 'MIA-2026-1149', 'MIA-2026-1163', 'MIA-2026-1178', 'MIA-2026-1171']);
  });

  it('summarises the queue on load exactly as the spec reads', () => {
    expect(summaryLine(buildQueueRows(seed()))).toBe('7 open cases: 1 new, 2 approve-ready, 2 need information, 2 need judgment.');
  });

  it('updates the summary as cases change', () => {
    const afterReview = seed({ 'MIA-2026-1187': { status: 'needs_judgment' } });
    expect(summaryLine(buildQueueRows(afterReview))).toBe('7 open cases: 2 approve-ready, 2 need information, 3 need judgment.');
    const afterSend = seed({ 'MIA-2026-1187': { status: 'waiting' } });
    expect(summaryLine(buildQueueRows(afterSend))).toBe('7 open cases: 2 approve-ready, 2 need information, 2 need judgment, 1 waiting on applicant.');
    const afterApprove = seed({ 'MIA-2026-1142': { status: 'decided', decision: { kind: 'approved', at: '2026-09-21', outcomeLabel: 'Permit issued', reviewer: 'J. Rivera' } } });
    expect(summaryLine(buildQueueRows(afterApprove))).toBe('6 open cases: 1 new, 1 approve-ready, 2 need information, 2 need judgment. 1 decided.');
  });

  it('a New row reads "Not yet reviewed." and a waiting row pauses its clock', () => {
    const rows = buildQueueRows(seed({ 'MIA-2026-1149': { status: 'waiting', decision: { kind: 'request_sent', at: '2026-09-21', outcomeLabel: 'Request sent', reviewer: 'J. Rivera', sendOptions: { replyDue: '2026-10-05', remindEmail: true, remindText: true, remindCall: false, spanishCopy: false } } } }));
    expect(rows.find((r) => r.meta.id === 'MIA-2026-1187')?.reason).toBe('Not yet reviewed.');
    const chen = rows.find((r) => r.meta.id === 'MIA-2026-1149');
    expect(chen?.paused).toBe(true);
    expect(chen?.replyDue).toBe('2026-10-05');
    expect(chen?.daysInQueue).toBe(21);
  });

  it('filters by status', () => {
    const rows = buildQueueRows(seed());
    expect(filterQueueRows(rows, 'approve_ready')).toHaveLength(2);
    expect(filterQueueRows(rows, 'decided')).toHaveLength(0);
  });
});

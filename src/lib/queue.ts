import type { CaseState } from '@/app/store';
import { CASES } from '@/data/cases';
import type { CaseMeta, CaseStatus } from '@/data/types';
import type { ISODate } from './dates';

export const STATUS_ORDER: CaseStatus[] = ['new', 'approve_ready', 'needs_information', 'needs_judgment', 'waiting', 'decided'];

export interface QueueRow {
  meta: CaseMeta;
  status: CaseStatus;
  /** Days in queue. Frozen while waiting on the applicant. */
  daysInQueue: number;
  paused: boolean;
  reason: string;
  replyDue?: ISODate;
  outcome?: string;
  hasRecord: boolean;
}

export function buildQueueRows(cases: Record<string, CaseState>): QueueRow[] {
  return CASES.map((meta) => {
    const state = cases[meta.id];
    const status = state?.status ?? meta.initialStatus;
    const reason = status === 'new' ? 'Not yet reviewed.' : (state?.review?.reason ?? '');
    const row: QueueRow = {
      meta,
      status,
      daysInQueue: meta.daysInQueue,
      paused: status === 'waiting',
      reason,
      hasRecord: status === 'waiting' || status === 'decided',
    };
    if (status === 'waiting' && state?.decision?.sendOptions) row.replyDue = state.decision.sendOptions.replyDue;
    if (status === 'decided' && state?.decision) row.outcome = state.decision.outcomeLabel;
    return row;
  });
}

/** Default sort: by status in the order above, then oldest first within a status. */
export function sortQueueRows(rows: QueueRow[]): QueueRow[] {
  return [...rows].sort((a, b) => {
    const s = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    if (s !== 0) return s;
    return b.daysInQueue - a.daysInQueue;
  });
}

export type QueueFilter = 'all' | CaseStatus;

export function filterQueueRows(rows: QueueRow[], filter: QueueFilter): QueueRow[] {
  return filter === 'all' ? rows : rows.filter((r) => r.status === filter);
}

function phrase(status: CaseStatus, n: number): string {
  switch (status) {
    case 'new':
      return `${n} new`;
    case 'approve_ready':
      return `${n} approve-ready`;
    case 'needs_information':
      return n === 1 ? '1 needs information' : `${n} need information`;
    case 'needs_judgment':
      return n === 1 ? '1 needs judgment' : `${n} need judgment`;
    case 'waiting':
      return `${n} waiting on applicant`;
    case 'decided':
      return `${n} decided`;
  }
}

/** "7 open cases: 1 new, 2 approve-ready, 2 need information, 2 need judgment." */
export function summaryLine(rows: QueueRow[]): string {
  const counts = new Map<CaseStatus, number>();
  for (const row of rows) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  const open = rows.filter((r) => r.status !== 'decided').length;
  const parts = STATUS_ORDER.filter((s) => s !== 'decided' && (counts.get(s) ?? 0) > 0).map((s) => phrase(s, counts.get(s) ?? 0));
  const decided = counts.get('decided') ?? 0;
  const head = open === 0 ? 'No open cases.' : `${open} open ${open === 1 ? 'case' : 'cases'}: ${parts.join(', ')}.`;
  return decided > 0 ? `${head} ${phrase('decided', decided)}.` : head;
}

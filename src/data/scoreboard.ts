import type { CriterionId } from './types';

export interface MetricTile {
  id: string;
  label: string;
  baseline: number;
  current: number;
  unit: 'days' | 'cases' | 'percent';
  /** Shown without a good-news colour, because the figure is too early to call. */
  neutral?: boolean;
  /** Lower is better for every tile on this screen. */
  decimals?: number;
}

export const METRICS: MetricTile[] = [
  { id: 'days', label: 'Median calendar days to decision', baseline: 34, current: 21, unit: 'days' },
  { id: 'backlog', label: 'Open backlog', baseline: 412, current: 286, unit: 'cases' },
  { id: 'rework', label: 'Rework rate', baseline: 38, current: 24, unit: 'percent' },
  { id: 'reversed', label: 'Decisions reversed on appeal', baseline: 3.1, current: 2.9, unit: 'percent', decimals: 1, neutral: true },
];

/**
 * The comparison group: median days to decision over the same period for
 * permit types not yet on Casework. Rollouts stagger by permit type so the
 * gain is measured, not assumed.
 */
export const COMPARISON_GROUP = { baseline: 34, current: 33 };

export const METRIC_NOTES: Record<string, string> = {
  days: `Permit types not yet on Casework: ${COMPARISON_GROUP.baseline} to ${COMPARISON_GROUP.current}`,
  rework: 'Sent back more than once',
  reversed: 'Early read: appeals lag decisions',
};

export const CASES_REVIEWED_THIS_QUARTER = 1482;
export const OVERRIDE_RATE = 11;

/** Open backlog over 12 weeks. First review was switched on in week 4. */
export const BACKLOG_SERIES: { week: number; backlog: number }[] = [
  { week: 1, backlog: 412 },
  { week: 2, backlog: 409 },
  { week: 3, backlog: 406 },
  { week: 4, backlog: 401 },
  { week: 5, backlog: 388 },
  { week: 6, backlog: 371 },
  { week: 7, backlog: 355 },
  { week: 8, backlog: 339 },
  { week: 9, backlog: 324 },
  { week: 10, backlog: 311 },
  { week: 11, backlog: 298 },
  { week: 12, backlog: 286 },
];
export const FIRST_REVIEW_WEEK = 4;

export interface TrustRung {
  id: string;
  name: string;
  description: string;
  threshold: string;
  on: boolean;
  locked?: boolean;
  note?: string;
}

export const TRUST_LADDER: TrustRung[] = [
  { id: 'shadow', name: 'Shadow', description: 'Reviews closed cases and reports agreement. No live case is touched.', threshold: 'No threshold', on: true },
  { id: 'xray', name: 'X-ray', description: 'Sorts the live queue by what each case needs.', threshold: '80% on the golden set', on: true },
  { id: 'second_reader', name: 'Second reader', description: 'Checks decisions before they go out. Catches errors, adds none.', threshold: '85% on the golden set', on: true },
  { id: 'first_review', name: 'First review', description: 'Prepares the case before the reviewer opens it. Evidence before verdict.', threshold: '90% on the golden set, per criterion', on: true },
  { id: 'front_door', name: 'Front door', description: 'Checks an application before it is filed. Public-facing, so it comes last.', threshold: 'No threshold set', on: false, locked: true, note: 'planned for v2' },
];

/**
 * A new model, re-run on the golden set before it touches a live case. No
 * criterion gets worse, and setbacks cross the 90% threshold, so the director
 * can move it up to First review.
 */
export const MODEL_UPDATE: { before: number; after: number; goldenSet: Record<CriterionId, number>; unlocks: CriterionId } = {
  before: 95,
  after: 97,
  goldenSet: { A1: 99, A2: 99, A3: 91, A4: 99, A5: 96, S1: 99, S2: 95, S3: 96, S4: 97, S5: 98, X1: 96, X2: 98 },
  unlocks: 'A3',
};


export interface MetricTile {
  id: string;
  label: string;
  baseline: number;
  current: number;
  unit: 'days' | 'cases' | 'percent';
  /** Lower is better for every tile on this screen. */
  decimals?: number;
}

export const METRICS: MetricTile[] = [
  { id: 'days', label: 'Median days to decision', baseline: 34, current: 21, unit: 'days' },
  { id: 'backlog', label: 'Open backlog', baseline: 412, current: 286, unit: 'cases' },
  { id: 'rework', label: 'Rework rate', baseline: 38, current: 24, unit: 'percent' },
  { id: 'reversed', label: 'Decisions reversed on appeal', baseline: 3.1, current: 2.9, unit: 'percent', decimals: 1 },
];

export const METRIC_NOTES: Record<string, string> = {
  rework: 'Sent back more than once',
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
  { id: 'shadow', name: 'Shadow', description: 'Claude reviews in the background. Nobody sees its findings.', threshold: 'No threshold', on: true },
  { id: 'xray', name: 'X-ray', description: 'Findings appear beside each case, with links to evidence.', threshold: '80% agreement on closed cases', on: true },
  { id: 'second_reader', name: 'Second reader', description: 'Claude’s review is compared with the human review before a decision.', threshold: '85% agreement on closed cases', on: true },
  { id: 'first_review', name: 'First review', description: 'Claude prepares the review the human starts from.', threshold: '90% agreement on closed cases', on: true, note: 'unlocked at 90% agreement' },
  { id: 'front_door', name: 'Front door', description: 'Applicants get completeness feedback before they file.', threshold: 'Planned for v2', on: false, locked: true, note: 'planned for v2' },
];

export const MODEL_UPDATE = {
  before: 91,
  after: 94,
};

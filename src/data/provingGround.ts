import type { CriterionId } from './types';

export type SettleChoice = 'a' | 'b' | 'unclear';

export interface AgreementRow {
  id: CriterionId;
  agreement: number;
}

/** Agreement with the original decision on 1,200 closed cases, by criterion. */
export const AGREEMENT: AgreementRow[] = [
  { id: 'A1', agreement: 98 },
  { id: 'A2', agreement: 97 },
  { id: 'A3', agreement: 84 },
  { id: 'A4', agreement: 99 },
  { id: 'A5', agreement: 88 },
  { id: 'S1', agreement: 97 },
  { id: 'S2', agreement: 86 },
  { id: 'S3', agreement: 90 },
  { id: 'S4', agreement: 93 },
  { id: 'S5', agreement: 96 },
  { id: 'X1', agreement: 79 },
  { id: 'X2', agreement: 95 },
];

export const OVERALL_AGREEMENT = 91;
export const CLOSED_CASES = 1200;
export const THRESHOLD = 90;

export interface Disagreement {
  id: string;
  criterion: CriterionId;
  a: string;
  b: string;
  /** Which side is Claude. Fixed per row so the demo is repeatable; it reads as random. */
  claudeSide: 'a' | 'b';
}

/** Five of the 108 cases still to settle. Original reviewers are never named. */
export const DISAGREEMENTS: Disagreement[] = [
  { id: 'P-2024-0812', criterion: 'X1', a: 'both permits approved separately.', b: 'combined load exceeds the 150 A panel.', claudeSide: 'b' },
  { id: 'P-2025-0044', criterion: 'A3', a: 'consent letter is missing, so the waiver is not supported.', b: 'rear setback 4 ft 9 in, waiver granted without consent on file.', claudeSide: 'a' },
  { id: 'P-2024-1105', criterion: 'S2', a: 'pathway measured at 34 in was accepted as close enough.', b: 'pathway is under 36 in, so §RS-3 is not met.', claudeSide: 'b' },
  { id: 'P-2025-0290', criterion: 'X1', a: 'existing house load was not counted, so capacity is unknown.', b: '200 A panel carries the added load with the backfeed.', claudeSide: 'a' },
  { id: 'P-2024-0677', criterion: 'A5', a: 'certificate accepted as filed.', b: 'elevation certificate predates the survey and needs updating.', claudeSide: 'b' },
];

export const INITIAL_TALLY = { settled: 40, total: 108, claude: 19, reviewer: 17, unclear: 4 };

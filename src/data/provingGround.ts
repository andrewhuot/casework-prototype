import type { CriterionId } from './types';

export type SettleChoice = 'a' | 'b' | 'unclear';

export interface AgreementRow {
  id: CriterionId;
  /** Agreement with the original decision. Not accuracy, because the original can be wrong. */
  agreement: number;
  /** Score on the golden set: disagreements settled blind, plus a blind random sample of agreed cases. */
  goldenSet: number;
}

/**
 * Shadow results on a sample of 1,200 closed cases, by criterion.
 *
 * Agreement is not accuracy: the original decision can be wrong, and so can a
 * decision Claude agrees with. The golden set measures both. Senior reviewers
 * settle every disagreement blind, and also relabel a random sample of agreed
 * cases blind, so a mistake Claude shares with the original still counts.
 * Here that sample found few shared mistakes, so each golden-set score sits at
 * or above its agreement. Electrical capacity gains the most, because the
 * originals approved two permits separately and missed the combined load.
 */
export const AGREEMENT: AgreementRow[] = [
  { id: 'A1', agreement: 98, goldenSet: 99 },
  { id: 'A2', agreement: 97, goldenSet: 98 },
  { id: 'A3', agreement: 84, goldenSet: 88 },
  { id: 'A4', agreement: 99, goldenSet: 99 },
  { id: 'A5', agreement: 88, goldenSet: 94 },
  { id: 'S1', agreement: 97, goldenSet: 98 },
  { id: 'S2', agreement: 86, goldenSet: 92 },
  { id: 'S3', agreement: 90, goldenSet: 94 },
  { id: 'S4', agreement: 93, goldenSet: 96 },
  { id: 'S5', agreement: 96, goldenSet: 97 },
  { id: 'X1', agreement: 79, goldenSet: 94 },
  { id: 'X2', agreement: 95, goldenSet: 96 },
];

export const OVERALL_AGREEMENT = 91;
export const OVERALL_GOLDEN_SET = 95;
export const CLOSED_CASES = 1200;
/** The city's threshold for First review, applied per criterion to the golden-set score. */
export const THRESHOLD = 90;

export interface Disagreement {
  id: string;
  criterion: CriterionId;
  a: string;
  b: string;
  /** Which side is Claude. Fixed per row so the demo is repeatable; it reads as random. */
  claudeSide: 'a' | 'b';
}

/** Five of the eight disagreements still to settle. Original reviewers are never named. */
export const DISAGREEMENTS: Disagreement[] = [
  { id: 'P-2024-0812', criterion: 'X1', a: 'both permits approved separately.', b: 'the solar derate leaves the main breaker too small for the ADU load.', claudeSide: 'b' },
  { id: 'P-2025-0044', criterion: 'A3', a: 'consent letter is missing, so the waiver is not supported.', b: 'rear setback 4 ft 9 in, waiver granted without consent on file.', claudeSide: 'a' },
  { id: 'P-2024-1105', criterion: 'S2', a: 'pathway measured at 34 in was accepted as close enough.', b: 'pathway is under 36 in, so §RS-3 is not met.', claudeSide: 'b' },
  { id: 'P-2025-0290', criterion: 'X1', a: 'existing house load was not counted, so capacity is unknown.', b: '200 A panel carries the added load with the backfeed.', claudeSide: 'a' },
  { id: 'P-2024-0677', criterion: 'A5', a: 'certificate accepted as filed.', b: 'elevation certificate predates the survey and needs updating.', claudeSide: 'b' },
];

/**
 * 100 of 108 disagreements settled. Counting unclear and unsettled cases
 * against Claude, the golden-set score is (1,092 agreed + 46) / 1,192 = 95%.
 */
export const INITIAL_TALLY = { settled: 100, total: 108, claude: 46, reviewer: 48, unclear: 6 };

import type { Review } from '@/data/types';
import delgado from './MIA-2026-1187.json';
import alvarez from './MIA-2026-1142.json';
import kim from './MIA-2026-1156.json';
import chen from './MIA-2026-1149.json';
import patel from './MIA-2026-1163.json';
import nguyen from './MIA-2026-1171.json';
import brooks from './MIA-2026-1178.json';

/** Saved reviews, generated ahead of time by Claude from each packet. */
export const SAVED_REVIEWS: Record<string, Review> = {
  'MIA-2026-1187': delgado as Review,
  'MIA-2026-1142': alvarez as Review,
  'MIA-2026-1156': kim as Review,
  'MIA-2026-1149': chen as Review,
  'MIA-2026-1163': patel as Review,
  'MIA-2026-1171': nguyen as Review,
  'MIA-2026-1178': brooks as Review,
};

/** Model family that produced the saved reviews. See docs/REVIEW_GENERATION.md. */
export const REVIEW_MODEL = 'Claude Fable 5.1';

/**
 * The one seam through which reviews load. A live model call would replace the
 * body of this function; the screens would not change.
 */
export async function reviewCase(caseId: string): Promise<Review> {
  const review = SAVED_REVIEWS[caseId];
  if (!review) throw new Error(`No saved review for ${caseId}`);
  return review;
}

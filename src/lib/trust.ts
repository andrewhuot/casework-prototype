import { AGREEMENT, THRESHOLD } from '@/data/provingGround';
import { MODEL_UPDATE } from '@/data/scoreboard';
import type { CriterionId } from '@/data/types';

/**
 * Trust is earned per criterion, not per product. A criterion reaches First
 * review when its golden-set score clears the city's threshold and the
 * director moves it up. A new model changes the scores; it never moves a
 * criterion by itself.
 */

const CURRENT: Record<CriterionId, number> = Object.fromEntries(AGREEMENT.map((r) => [r.id, r.goldenSet])) as Record<CriterionId, number>;

export function goldenSetScores(modelSwitched: boolean): Record<CriterionId, number> {
  return modelSwitched ? MODEL_UPDATE.goldenSet : CURRENT;
}

/** Criteria at First review on the starting day: every one that clears the threshold. */
export function initialFirstReview(): CriterionId[] {
  return AGREEMENT.filter((r) => r.goldenSet >= THRESHOLD).map((r) => r.id);
}

/** Criteria that now clear the threshold but have not been moved up yet. */
export function eligibleToMoveUp(modelSwitched: boolean, firstReview: CriterionId[]): CriterionId[] {
  const scores = goldenSetScores(modelSwitched);
  return AGREEMENT.map((r) => r.id).filter((id) => scores[id] >= THRESHOLD && !firstReview.includes(id));
}

import { describe, expect, it } from 'vitest';
import { SAVED_REVIEWS } from '@/data/reviews';
import { buildCriteriaViews, countsLine, flaggedSummary, hasBracket, initialSelection, nextFlagged, unopenedFlagged } from './caseReview';

const delgado = SAVED_REVIEWS['MIA-2026-1187']!;

describe('case review helpers', () => {
  it('counts the Delgado review as 12 criteria: 9 met, 3 flagged', () => {
    const views = buildCriteriaViews(delgado, {});
    expect(countsLine(views)).toBe('12 criteria: 9 met, 3 flagged.');
    expect(initialSelection(views)).toBe('A3');
  });

  it('steps Next flagged through A3, A5, X1 and then stops', () => {
    const views = buildCriteriaViews(delgado, {});
    expect(nextFlagged(views, 'A3')).toBe('A5');
    expect(nextFlagged(views, 'A5')).toBe('X1');
    expect(nextFlagged(views, 'X1')).toBeNull();
  });

  it('counts unopened flagged criteria for the recommendation gate', () => {
    const views = buildCriteriaViews(delgado, {});
    expect(unopenedFlagged(views, ['A3'])).toEqual(['A5', 'X1']);
    expect(unopenedFlagged(views, ['A3', 'A5', 'X1'])).toEqual([]);
  });

  it('phrases the approve-anyway confirmation', () => {
    const views = buildCriteriaViews(delgado, {});
    expect(flaggedSummary(views)).toBe('2 criteria are not met and 1 is unclear');
  });

  it('applies a reviewer change and recounts', () => {
    const views = buildCriteriaViews(delgado, { A3: { from: 'unclear', to: 'met', reason: 'Survey controls.' } });
    expect(countsLine(views)).toBe('12 criteria: 10 met, 2 flagged.');
    expect(views.find((v) => v.id === 'A3')?.change?.to).toBe('met');
  });

  it('detects bracketed reviewer notes', () => {
    expect(hasBracket(delgado.letter)).toBe(true);
    expect(hasBracket(delgado.letter.replace(/\[[^\]]*\]/, 'You may apply for a waiver.'))).toBe(false);
  });
});

import type { ReviewerChange } from '@/app/store';
import { CRITERIA_BY_ID } from '@/data/criteria';
import { PRECEDENTS_BY_ID } from '@/data/precedents';
import type { Citation, CriterionGroup, CriterionId, CriterionStatus, Evidence, Precedent, Review } from '@/data/types';

export interface CriterionView {
  id: CriterionId;
  group: CriterionGroup;
  shortName: string;
  test: string;
  citations: Citation[];
  status: CriterionStatus;
  originalStatus: CriterionStatus;
  change?: ReviewerChange;
  finding: string;
  evidence: Evidence[];
  precedents: Precedent[];
  flagged: boolean;
}

/** Joins the saved review with the rulebook and any reviewer changes. */
export function buildCriteriaViews(review: Review, changes: Partial<Record<CriterionId, ReviewerChange>>, s2Test?: string, s2ExtraCitation?: Citation): CriterionView[] {
  return review.criteria.map((rc) => {
    const def = CRITERIA_BY_ID[rc.id];
    const change = changes[rc.id];
    const status = change?.to ?? rc.status;
    const isS2 = rc.id === 'S2';
    const view: CriterionView = {
      id: rc.id,
      group: def.group,
      shortName: def.shortName,
      test: isS2 && s2Test ? s2Test : def.test,
      citations: isS2 && s2ExtraCitation ? [...def.citations, s2ExtraCitation] : def.citations,
      status,
      originalStatus: rc.status,
      finding: rc.finding,
      evidence: rc.evidence,
      precedents: rc.precedents.map((id) => PRECEDENTS_BY_ID[id]).filter((p): p is Precedent => Boolean(p)),
      flagged: status !== 'met',
    };
    if (change) view.change = change;
    return view;
  });
}

/** "12 criteria: 9 met, 3 flagged." */
export function countsLine(views: CriterionView[]): string {
  const met = views.filter((v) => v.status === 'met').length;
  const flagged = views.length - met;
  return `${views.length} criteria: ${met} met, ${flagged} flagged.`;
}

export function flaggedIds(views: CriterionView[]): CriterionId[] {
  return views.filter((v) => v.flagged).map((v) => v.id);
}

/** The first flagged criterion, or the first criterion when none are flagged. */
export function initialSelection(views: CriterionView[]): CriterionId | null {
  return flaggedIds(views)[0] ?? views[0]?.id ?? null;
}

/** The next flagged criterion after the current one, in rulebook order. */
export function nextFlagged(views: CriterionView[], currentId: CriterionId | null): CriterionId | null {
  const index = currentId ? views.findIndex((v) => v.id === currentId) : -1;
  const after = views.slice(index + 1).find((v) => v.flagged);
  return after?.id ?? null;
}

export function unopenedFlagged(views: CriterionView[], opened: CriterionId[]): CriterionId[] {
  return flaggedIds(views).filter((id) => !opened.includes(id));
}

/** "2 criteria are not met and 1 is unclear." */
export function flaggedSummary(views: CriterionView[]): string {
  const notMet = views.filter((v) => v.status === 'not_met').length;
  const unclear = views.filter((v) => v.status === 'unclear').length;
  const parts: string[] = [];
  if (notMet > 0) parts.push(`${notMet} ${notMet === 1 ? 'criterion is' : 'criteria are'} not met`);
  if (unclear > 0) parts.push(`${unclear} ${unclear === 1 ? 'is' : 'are'} unclear`);
  if (notMet === 0 && unclear > 0) parts[0] = `${unclear} ${unclear === 1 ? 'criterion is' : 'criteria are'} unclear`;
  return parts.join(' and ');
}

export const BRACKET_PATTERN = /\[[^\]]*\]/g;

export function hasBracket(text: string): boolean {
  return /\[[^\]]*\]/.test(text);
}

/** A draft is a request to the applicant unless the recommendation is approve-ready and the draft is untouched. */
export function draftIsRequest(recommendation: Review['recommendation'], letterEdited: boolean, draft: string): boolean {
  if (recommendation !== 'approve_ready') return true;
  if (!letterEdited) return false;
  return /need|request|reply by/i.test(draft);
}

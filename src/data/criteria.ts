import type { Criterion, CriterionId, CaseType } from './types';

export const CRITERIA: Criterion[] = [
  { id: 'A1', group: 'adu', shortName: 'Zoning eligibility', test: 'Lot is in a zone that allows one ADU, and none exists on the lot', citations: [{ sourceId: 'R1', section: '§ADU-1', label: 'R1 §ADU-1' }] },
  { id: 'A2', group: 'adu', shortName: 'Unit size', test: 'Floor area is 800 sq ft or less', citations: [{ sourceId: 'R1', section: '§ADU-2', label: 'R1 §ADU-2' }] },
  { id: 'A3', group: 'adu', shortName: 'Setbacks', test: 'At least 5 ft from side and rear lot lines', citations: [{ sourceId: 'R1', section: '§ADU-3', label: 'R1 §ADU-3' }] },
  { id: 'A4', group: 'adu', shortName: 'Owner occupancy', test: 'Notarised owner-occupancy affidavit is included', citations: [{ sourceId: 'R1', section: '§ADU-5', label: 'R1 §ADU-5' }] },
  { id: 'A5', group: 'adu', shortName: 'Flood elevation', test: 'Elevation certificate shows the finished floor at least 1 ft above base flood elevation', citations: [{ sourceId: 'R3', section: '§FP-4', label: 'R3 §FP-4' }] },
  { id: 'S1', group: 'solar', shortName: 'Contractor licence', test: 'Florida licence number is given and the expiry date is in the future', citations: [{ sourceId: 'R4', section: 'Item 2', label: 'R4 item 2' }] },
  { id: 'S2', group: 'solar', shortName: 'Roof access pathways', test: '36 in pathway from eave to ridge and an 18 in ridge setback', citations: [{ sourceId: 'R2', section: '§RS-3', label: 'R2 §RS-3' }] },
  { id: 'S3', group: 'solar', shortName: 'Wind load', test: "Signed and sealed engineer's letter covers attachment in the High-Velocity Hurricane Zone", citations: [{ sourceId: 'R2', section: '§RS-5', label: 'R2 §RS-5' }] },
  { id: 'S4', group: 'solar', shortName: 'Electrical diagram', test: 'Single-line diagram shows inverter, disconnect, and main panel rating', citations: [{ sourceId: 'R2', section: '§RS-6', label: 'R2 §RS-6' }] },
  { id: 'S5', group: 'solar', shortName: 'Equipment listing', test: 'Spec sheets for modules and inverter each state a UL listing', citations: [{ sourceId: 'R2', section: '§RS-7', label: 'R2 §RS-7' }] },
  { id: 'X1', group: 'cross', shortName: 'Electrical capacity', test: 'Main panel can carry the ADU load and the solar backfeed together, or a panel upgrade is in scope', citations: [{ sourceId: 'R4', section: 'Item 9', label: 'R4 item 9' }] },
  { id: 'X2', group: 'cross', shortName: 'Consistency', test: 'Owner, parcel number, and address match across all documents', citations: [{ sourceId: 'R4', section: 'Item 1', label: 'R4 item 1' }] },
];

export const CRITERIA_BY_ID: Record<CriterionId, Criterion> = Object.fromEntries(CRITERIA.map((c) => [c.id, c])) as Record<CriterionId, Criterion>;

/** The proposed S2 test that R6 introduces, published as Rulebook v1.1. */
export const PROPOSED_S2_TEST = '36 in pathway from eave to ridge. Ridge setback of 18 in, or 36 in when the array covers more than 33% of the roof.';

/** Criteria that apply to a permit type. X2 applies to every case, X1 only to combined cases. */
export function applicableCriteria(type: CaseType): CriterionId[] {
  return CRITERIA.filter((c) => {
    if (c.group === 'adu') return type === 'adu' || type === 'combined';
    if (c.group === 'solar') return type === 'solar' || type === 'combined';
    if (c.id === 'X1') return type === 'combined';
    return true;
  }).map((c) => c.id);
}

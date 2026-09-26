import type { SavedQuestion } from './types';

/** "Ask about this case": three suggested questions per case with saved answers. Free-form questions need a live model connection. */
export const QUESTIONS: Record<string, SavedQuestion[]> = {
  'MIA-2026-1187': [
    {
      question: 'Which setback figure should I trust?',
      answer: 'Neither, until the applicant resolves it. The survey is a sealed measurement and the site plan is the contractor’s drawing, so 4 ft 6 in is the more likely figure, but the rule is to quote both and not guess. Three similar encroachments were approved with a waiver and one was denied after a neighbour objected.',
      quote: { document: 'Boundary survey', text: 'Proposed ADU footprint is 4 ft 6 in from the rear lot line' },
    },
    {
      question: 'What would a panel upgrade need to show?',
      answer: 'A revised single-line diagram with a 200 A panel and a full 200 A main breaker. That carries the 144 A load, and 200 A plus the 40 A backfeed is exactly 120 percent of the busbar. In the closest past decision, P-2025-0418, the applicant upgraded to 200 A and the permit was issued.',
      quote: { document: 'ADU electrical load calculation', text: 'No service upgrade is included in this scope.' },
    },
    {
      question: 'Does the contractor’s licence cover both projects?',
      answer: 'Sunward Electric LLC holds electrical licence EC13009999, which covers the electrical work for the ADU and the solar array and expires after the application date. The form names no building contractor for the ADU structure itself. That is outside the twelve criteria but worth a note to the applicant.',
      quote: { document: 'Combined application form', text: 'Licence: EC13009999' },
    },
  ],
  'MIA-2026-1142': [
    {
      question: 'Is there room on the panel for this backfeed?',
      answer: 'Yes. A 200 A main panel with a 30 A backfeed breaker sits within the usual 120 percent bus limit, and the application adds no new load.',
      quote: { document: 'Solar single-line diagram notes', text: 'Main service panel: 200 A, with a 30 A solar backfeed breaker' },
    },
    {
      question: 'Who sealed the wind load letter?',
      answer: 'M. Oduya, PE 55502, on 2 Sep 2026, for the High-Velocity Hurricane Zone at a 175 mph design wind speed.',
      quote: { document: 'Solar equipment and structural', text: 'Signed and sealed by M. Oduya, PE 55502, 2 Sep 2026' },
    },
    {
      question: 'Does anything need a follow-up after approval?',
      answer: 'No documents are missing. The inspection will confirm the pathway and the ridge setback on the roof as drawn.',
      quote: { document: 'Solar equipment and structural', text: '36 in pathway from eave to ridge on the east side of the array.' },
    },
  ],
  'MIA-2026-1156': [
    {
      question: 'How far above base flood elevation is the floor?',
      answer: '1.6 ft. The certificate shows the lowest finished floor at 9.6 ft NAVD against a base flood elevation of 8.0 ft NAVD, above the 1 ft minimum in §FP-4.',
      quote: { document: 'Elevation certificate', text: 'Lowest finished floor: 9.6 ft NAVD' },
    },
    {
      question: 'Is the affidavit notarised?',
      answer: 'Yes. It was sworn before a notary on 12 Sep 2026, three days before the application was filed.',
      quote: { document: 'Owner-occupancy affidavit', text: 'Sworn to and subscribed before me on 12 Sep 2026 by Grace Kim.' },
    },
    {
      question: 'Do the setbacks leave margin?',
      answer: 'Yes. The rear setback is 10 ft 0 in and the side is 7 ft 6 in, both well above the 5 ft minimum, and the survey agrees with the site plan.',
      quote: { document: 'ADU site plan notes', text: 'Rear setback: 10 ft 0 in' },
    },
  ],
  'MIA-2026-1149': [
    {
      question: 'What exactly is missing?',
      answer: 'The signed and sealed wind load letter for the High-Velocity Hurricane Zone. The roof plan says the attachment letter will follow under separate cover, but it has not arrived in the 21 days since filing.',
      quote: { document: 'Roof plan', text: 'Structural attachment letter to follow under separate cover.' },
    },
    {
      question: 'Who can provide the wind load letter?',
      answer: 'A Florida-registered engineer must sign and seal it. Meridian Solar Co. normally arranges this through their engineer, so the request should go to the applicant with the contractor named.',
      quote: { document: 'Permit application: rooftop solar', text: 'Contractor: Meridian Solar Co.' },
    },
    {
      question: 'Is the rest of the packet in order?',
      answer: 'Yes. The licence is current, the pathways and ridge setback meet §RS-3, the single-line diagram is complete, and both spec sheets state UL listings.',
      quote: { document: 'Solar single-line diagram notes', text: 'Main service panel: 200 A, with a 40 A solar backfeed breaker' },
    },
  ],
  'MIA-2026-1163': [
    {
      question: 'When did the licence expire?',
      answer: 'On 31 Aug 2026, a week before the application was filed on 7 Sep 2026. Checklist item 2 requires the expiry date to be after the application date.',
      quote: { document: 'Combined application form', text: 'Licence expires: 31 Aug 2026' },
    },
    {
      question: 'What was the first request about?',
      answer: 'The roof plan, which was missing from the original packet. It was resubmitted on 17 Sep 2026 and meets §RS-3. This letter would be the second request, so it should cover everything that is still open.',
      quote: { document: 'Solar equipment and structural', text: '36 in pathway from eave to ridge. Ridge setback: 18 in' },
    },
    {
      question: 'Does the panel carry the combined load?',
      answer: 'Yes. The ADU brings the calculated load to 130 A on a 200 A service, and the 30 A backfeed stays within the busbar limit. Unlike the Delgado case, the main breaker is not derated.',
      quote: { document: 'ADU electrical load calculation', text: 'Total with the ADU: 130 A, within the 200 A service.' },
    },
  ],
  'MIA-2026-1171': [
    {
      question: 'How much over the limit is the unit?',
      answer: '60 sq ft. The ADU is 860 sq ft against the 800 sq ft limit in §ADU-2.',
      quote: { document: 'ADU site plan notes', text: 'ADU floor area: 860 sq ft' },
    },
    {
      question: 'What happened in the similar past case?',
      answer: 'P-2025-0209, a 910 sq ft ADU, was denied because the lot could fit a conforming unit. The hardship here is different: an accessible bathroom and bedroom for a family member who uses a wheelchair.',
      quote: { document: 'Variance request letter', text: 'The extra 60 sq ft gives my mother, who uses a wheelchair, an accessible bathroom and bedroom.' },
    },
    {
      question: 'Is everything else met?',
      answer: 'Yes. Zoning, setbacks, the affidavit, and the elevation certificate are all in order, so the variance is the only open question.',
      quote: { document: 'Elevation certificate', text: 'Lowest finished floor: 8.4 ft NAVD' },
    },
  ],
  'MIA-2026-1178': [
    {
      question: 'Which document is right about the ridge setback?',
      answer: 'They conflict. The roof plan shows 18 in and the installer notes say 14 in to fit a third string. The notes are the more recent field information, so the drawing may be out of date.',
      quote: { document: 'Installer notes', text: 'Modules run to 14 in below the ridge to fit the third string.' },
    },
    {
      question: 'What happened last time this came up?',
      answer: 'In P-2025-0366 the array was redrawn with an 18 in setback and one fewer module, and the permit was issued after resubmission.',
      quote: { document: 'Roof plan', text: 'Ridge setback: 18 in' },
    },
    {
      question: 'Is the electrical side in order?',
      answer: 'Yes. The 200 A panel with a 35 A backfeed, the inverter, and the disconnect are all shown, and both spec sheets state UL listings.',
      quote: { document: 'Solar single-line diagram notes', text: 'Main service panel: 200 A, with a 35 A solar backfeed breaker' },
    },
  ],
};

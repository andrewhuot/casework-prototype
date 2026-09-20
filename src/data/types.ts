import type { ISODate } from '@/lib/dates';

/* Rulebook */

export type CriterionGroup = 'adu' | 'solar' | 'cross';
export type CriterionId = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'X1' | 'X2';
/** R1 to R6 are seeded. Sources added during the demo get the next R number. */
export type SourceId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | (string & {});

export interface Citation {
  sourceId: SourceId;
  /** Section label inside the source, for example "§ADU-3" or "Item 9". */
  section: string;
  /** How the chip reads, for example "R1 §ADU-3". */
  label: string;
}

export interface Criterion {
  id: CriterionId;
  group: CriterionGroup;
  shortName: string;
  test: string;
  citations: Citation[];
}

export const GROUP_LABELS: Record<CriterionGroup, string> = {
  adu: 'ADU',
  solar: 'Rooftop solar',
  cross: 'Across both',
};

export type SourceType = 'regulation' | 'internal_manual' | 'prior_decisions';
export type SourceStatus = 'active' | 'processing' | 'proposed_change';

export interface SourceSection {
  label: string;
  text: string;
}

export interface Source {
  id: SourceId;
  name: string;
  type: SourceType;
  added: ISODate;
  /** Criteria that cite this source, or the special precedents role for R5. */
  usedFor: CriterionId[] | 'precedents';
  /** Heading printed above the excerpt in the Source viewer. */
  heading?: string;
  sections: SourceSection[];
  link?: string;
  hiddenOnLoad?: boolean;
}

export type PrecedentOutcome = 'approved_with_waiver' | 'approved_after_revision' | 'denied';

export interface Precedent {
  id: string;
  criterion: CriterionId;
  outcome: PrecedentOutcome;
  summary: string;
  decided: ISODate;
  address: string;
  facts: string;
  decision: string;
  similarity: string;
}

/* Cases */

export type CaseType = 'adu' | 'solar' | 'combined';
export type CaseStatus = 'new' | 'approve_ready' | 'needs_information' | 'needs_judgment' | 'waiting' | 'decided';
export type CriterionStatus = 'met' | 'not_met' | 'unclear';
export type Recommendation = 'approve_ready' | 'needs_information' | 'needs_judgment';

export interface PreviousRequest {
  sent: ISODate;
  summary: string;
  replied?: ISODate;
}

export interface CaseMeta {
  id: string;
  /** Queue label, for example "Delgado residence". */
  applicant: string;
  ownerName: string;
  address: string;
  parcel: string;
  type: CaseType;
  /** Queue label, for example "ADU + Solar" or "Solar, 6.4 kW". */
  typeLabel: string;
  daysInQueue: number;
  filed: ISODate;
  initialStatus: CaseStatus;
  preferredLanguage?: 'es';
  email: string;
  phone: string;
  contractor?: { name: string; licence: string; expires: ISODate };
  previousRequests: PreviousRequest[];
  /** Whether the packet asks for a variance or waiver. Drives the recommendation logic. */
  asksForVariance?: boolean;
}

/* Packet documents */

export interface DrawingSitePlan {
  kind: 'site_plan';
  rearSetback: string;
  sideSetback: string;
  aduLabel: string;
}
export interface DrawingSurvey {
  kind: 'survey';
  rearDistance: string;
  sideDistance: string;
}
export interface DrawingRoofPlan {
  kind: 'roof_plan';
  pathway: string;
  ridgeSetback: string;
  modules: number;
}
export interface DrawingSingleLine {
  kind: 'single_line';
  panelRating: string;
  backfeedBreaker: string;
  inverter: string;
  subpanel?: string;
}
export type DrawingSpec = DrawingSitePlan | DrawingSurvey | DrawingRoofPlan | DrawingSingleLine;

export type DocBlock =
  | { type: 'heading'; text: string }
  | { type: 'field'; label: string; value: string }
  | { type: 'fields'; items: { label: string; value: string }[] }
  | { type: 'para'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'drawing'; drawing: DrawingSpec; caption?: string }
  | { type: 'signature'; name: string; role: string; date: ISODate }
  | { type: 'notary'; text: string; commission: string }
  | { type: 'seal'; text: string };

export type LetterheadKind = 'city_form' | 'contractor' | 'surveyor' | 'engineer' | 'affidavit' | 'fema' | 'letter';

export interface Letterhead {
  kind: LetterheadKind;
  org: string;
  sub?: string;
  formNumber?: string;
}

export interface PacketDocument {
  missing?: false;
  title: string;
  letterhead: Letterhead;
  received: ISODate;
  blocks: DocBlock[];
}

/** An expected document that the applicant did not provide. */
export interface MissingDocument {
  missing: true;
  title: string;
  criterion: CriterionId;
}

export type PacketEntry = PacketDocument | MissingDocument;

export interface Packet {
  caseId: string;
  /** Documents in reading order, including expected documents that are missing. */
  documents: PacketEntry[];
}

/* Saved review (section 9 shape) */

export interface Evidence {
  document: string;
  quote: string;
}

export interface ReviewCriterion {
  id: CriterionId;
  status: CriterionStatus;
  finding: string;
  evidence: Evidence[];
  precedents: string[];
}

export interface Review {
  criteria: ReviewCriterion[];
  recommendation: Recommendation;
  reason: string;
  rationale: string;
  letter: string;
  letterSpanish?: string;
}

/* Ask about this case */

export interface SavedQuestion {
  question: string;
  answer: string;
  quote: { document: string; text: string };
}

/* Decisions */

export interface SendOptions {
  replyDue: ISODate;
  remindEmail: boolean;
  remindText: boolean;
  remindCall: boolean;
  spanishCopy: boolean;
}

export type DecisionKind = 'request_sent' | 'approved' | 'escalated' | 'denied';

export interface Decision {
  kind: DecisionKind;
  at: ISODate;
  outcomeLabel: string;
  reviewer: string;
  reason?: string;
  note?: string;
  letterSent?: string;
  sendOptions?: SendOptions;
  reminderDates?: ISODate[];
}

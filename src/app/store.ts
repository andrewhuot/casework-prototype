import { create } from 'zustand';
import { CASES, REVIEWER_NAME } from '@/data/cases';
import { SOURCES } from '@/data/sources';
import { PROPOSED_S2_TEST } from '@/data/criteria';
import { reviewCase } from '@/data/reviews';
import { DISAGREEMENTS, INITIAL_TALLY, type SettleChoice } from '@/data/provingGround';
import { TRUST_LADDER } from '@/data/scoreboard';
import type { CaseStatus, CriterionId, CriterionStatus, Decision, Review, SendOptions, Source, SourceId, SourceStatus } from '@/data/types';
import { DEMO_DATE, defaultReplyDue, reminderDates, type ISODate } from '@/lib/dates';

/* Drawer */

export type DrawerState =
  | { kind: 'source'; sourceId: SourceId; section?: string }
  | { kind: 'precedent'; precedentId: string; caseId?: string }
  | { kind: 'record'; caseId: string }
  | { kind: 'letter'; caseId: string; language: 'en' | 'es'; text: string }
  | { kind: 'not_covered' };

/* Toasts */

export interface ToastItem {
  id: number;
  message: string;
  kind?: 'success' | 'info';
  duration?: number;
  action?: { label: string; onClick: () => void };
  onExpire?: () => void;
}

/* Cases */

export interface ReviewerChange {
  from: CriterionStatus;
  to: CriterionStatus;
  reason: string;
}

export interface CaseState {
  status: CaseStatus;
  /** Before Run review, a New case has no loaded review. */
  review?: Review;
  openedCriteria: CriterionId[];
  revealed: boolean;
  letterDraft?: string;
  letterEdited: boolean;
  sendOptions: SendOptions;
  changes: Partial<Record<CriterionId, ReviewerChange>>;
  decision?: Decision;
  /** Status before a request was sent, restored by Undo. */
  statusBeforeDecision?: CaseStatus;
}

export interface SourceRecord {
  source: Source;
  status: SourceStatus;
}

export interface ProvingGroundState {
  settled: Partial<Record<string, SettleChoice>>;
  tally: { settled: number; total: number; claude: number; reviewer: number; unclear: number };
}

export interface ScoreboardState {
  rungs: Record<string, boolean>;
  modelSwitched: boolean;
}

export interface AppState {
  rulebookVersion: '1.0' | '1.1';
  rulebookEffectiveDate?: ISODate;
  s2Test?: string;
  sources: SourceRecord[];
  cases: Record<string, CaseState>;
  hintDismissed: boolean;
  drawer: DrawerState | null;
  toasts: ToastItem[];
  provingGround: ProvingGroundState;
  scoreboard: ScoreboardState;

  /* Queue and case actions */
  loadReview: (caseId: string) => Promise<Review>;
  runReview: (caseId: string) => Promise<void>;
  openCriterion: (caseId: string, id: CriterionId) => void;
  reveal: (caseId: string) => void;
  editLetter: (caseId: string, text: string) => void;
  switchToRequestDraft: (caseId: string) => void;
  setSendOptions: (caseId: string, patch: Partial<SendOptions>) => void;
  changeCriterion: (caseId: string, id: CriterionId, to: CriterionStatus, reason: string) => void;
  sendRequest: (caseId: string) => void;
  approve: (caseId: string, reason?: string) => void;
  escalate: (caseId: string, note: string) => void;
  deny: (caseId: string, reason: string) => void;
  undoDecision: (caseId: string) => void;

  /* Rulebook */
  addSource: (source: Source) => void;
  finishProcessing: (sourceId: SourceId) => void;
  approveChange: () => void;
  rejectChange: () => void;

  /* Proving ground and Scoreboard */
  settle: (rowId: string, choice: SettleChoice) => void;
  toggleRung: (rungId: string, on: boolean) => void;
  approveModelSwitch: () => void;

  /* UI */
  dismissHint: () => void;
  openDrawer: (drawer: DrawerState) => void;
  closeDrawer: () => void;
  pushToast: (toast: Omit<ToastItem, 'id'>) => number;
  dismissToast: (id: number) => void;
  reset: () => void;
}

let toastCounter = 1;

function defaultSendOptions(preferredLanguage?: 'es'): SendOptions {
  return {
    replyDue: defaultReplyDue(),
    remindEmail: true,
    remindText: true,
    remindCall: false,
    spanishCopy: preferredLanguage === 'es',
  };
}

function initialCases(): Record<string, CaseState> {
  const out: Record<string, CaseState> = {};
  for (const c of CASES) {
    out[c.id] = {
      status: c.initialStatus,
      openedCriteria: [],
      revealed: false,
      letterEdited: false,
      sendOptions: defaultSendOptions(c.preferredLanguage),
      changes: {},
    };
  }
  return out;
}

function initialSources(): SourceRecord[] {
  return SOURCES.filter((s) => !s.hiddenOnLoad).map((source) => ({ source, status: 'active' as const }));
}

function initialScoreboard(): ScoreboardState {
  return {
    rungs: Object.fromEntries(TRUST_LADDER.map((r) => [r.id, r.on])),
    modelSwitched: false,
  };
}

function initialState() {
  return {
    rulebookVersion: '1.0' as const,
    rulebookEffectiveDate: undefined,
    s2Test: undefined,
    sources: initialSources(),
    cases: initialCases(),
    hintDismissed: false,
    drawer: null,
    toasts: [] as ToastItem[],
    provingGround: { settled: {}, tally: { ...INITIAL_TALLY } },
    scoreboard: initialScoreboard(),
  };
}

/** The request template used when a reviewer chooses to send a request on a case whose draft was an approval notice. */
export function requestTemplate(ownerName: string, caseId: string, replyDue: string): string {
  return [
    `Dear ${ownerName},`,
    '',
    `We reviewed your application ${caseId} and need more information before we can issue the permit.`,
    '',
    '[Reviewer to decide: list each item needed, why it is needed, and who can provide it.]',
    '',
    `Please reply by ${replyDue} by email or through the applicant portal. If you have questions, call the Building Department at (305) 555-0100.`,
    '',
    'Building Department, City of Miami',
  ].join('\n');
}

export const useStore = create<AppState>()((set, get) => ({
  ...initialState(),

  async loadReview(caseId) {
    const existing = get().cases[caseId]?.review;
    if (existing) return existing;
    const review = await reviewCase(caseId);
    set((state) => {
      const current = state.cases[caseId];
      if (!current) return state;
      return {
        cases: {
          ...state.cases,
          [caseId]: { ...current, review, letterDraft: current.letterDraft ?? review.letter },
        },
      };
    });
    return review;
  },

  async runReview(caseId) {
    const review = await get().loadReview(caseId);
    set((state) => {
      const current = state.cases[caseId];
      if (!current) return state;
      return {
        cases: {
          ...state.cases,
          [caseId]: { ...current, review, status: current.status === 'new' ? review.recommendation : current.status },
        },
      };
    });
  },

  openCriterion(caseId, id) {
    set((state) => {
      const current = state.cases[caseId];
      if (!current || current.openedCriteria.includes(id)) return state;
      return { cases: { ...state.cases, [caseId]: { ...current, openedCriteria: [...current.openedCriteria, id] } } };
    });
  },

  reveal(caseId) {
    set((state) => {
      const current = state.cases[caseId];
      if (!current || current.revealed) return state;
      return { cases: { ...state.cases, [caseId]: { ...current, revealed: true } } };
    });
  },

  editLetter(caseId, text) {
    set((state) => {
      const current = state.cases[caseId];
      if (!current) return state;
      return { cases: { ...state.cases, [caseId]: { ...current, letterDraft: text, letterEdited: text !== current.review?.letter } } };
    });
  },

  switchToRequestDraft(caseId) {
    set((state) => {
      const current = state.cases[caseId];
      const meta = CASES.find((c) => c.id === caseId);
      if (!current || !meta) return state;
      const text = requestTemplate(meta.ownerName, caseId, formatReplyDue(current.sendOptions.replyDue));
      return { cases: { ...state.cases, [caseId]: { ...current, letterDraft: text, letterEdited: true } } };
    });
  },

  setSendOptions(caseId, patch) {
    set((state) => {
      const current = state.cases[caseId];
      if (!current) return state;
      return { cases: { ...state.cases, [caseId]: { ...current, sendOptions: { ...current.sendOptions, ...patch } } } };
    });
  },

  changeCriterion(caseId, id, to, reason) {
    set((state) => {
      const current = state.cases[caseId];
      if (!current) return state;
      const original = current.review?.criteria.find((c) => c.id === id)?.status;
      if (!original) return state;
      const changes = { ...current.changes };
      if (to === original) delete changes[id];
      else changes[id] = { from: original, to, reason };
      return { cases: { ...state.cases, [caseId]: { ...current, changes } } };
    });
  },

  sendRequest(caseId) {
    const state = get();
    const current = state.cases[caseId];
    const meta = CASES.find((c) => c.id === caseId);
    if (!current || !meta) return;
    const reminders = reminderDates(DEMO_DATE).filter((_, i) => (i === 0 ? true : true));
    const decision: Decision = {
      kind: 'request_sent',
      at: DEMO_DATE,
      outcomeLabel: 'Request for information sent',
      reviewer: REVIEWER_NAME,
      letterSent: current.letterDraft ?? '',
      sendOptions: { ...current.sendOptions },
      reminderDates: current.sendOptions.remindEmail || current.sendOptions.remindText || current.sendOptions.remindCall ? reminders : [],
    };
    set({
      cases: { ...state.cases, [caseId]: { ...current, status: 'waiting', decision, statusBeforeDecision: current.status } },
    });
    get().pushToast({
      message: `Request sent to ${meta.ownerName}.`,
      duration: 10_000,
      action: { label: 'Undo', onClick: () => get().undoDecision(caseId) },
    });
  },

  approve(caseId, reason) {
    const state = get();
    const current = state.cases[caseId];
    const meta = CASES.find((c) => c.id === caseId);
    if (!current || !meta) return;
    const decision: Decision = {
      kind: 'approved',
      at: DEMO_DATE,
      outcomeLabel: 'Permit issued',
      reviewer: REVIEWER_NAME,
      letterSent: approvalNotice(meta.ownerName, caseId, meta.address, meta.typeLabel),
      ...(reason ? { reason } : {}),
    };
    set({ cases: { ...state.cases, [caseId]: { ...current, status: 'decided', decision, statusBeforeDecision: current.status } } });
    get().pushToast({
      message: `Permit issued for ${caseId}. Approval notice sent to ${meta.ownerName}.`,
      duration: 10_000,
      action: { label: 'Undo', onClick: () => get().undoDecision(caseId) },
    });
  },

  escalate(caseId, note) {
    const state = get();
    const current = state.cases[caseId];
    const meta = CASES.find((c) => c.id === caseId);
    if (!current || !meta) return;
    const decision: Decision = {
      kind: 'escalated',
      at: DEMO_DATE,
      outcomeLabel: 'Escalated to senior reviewer',
      reviewer: REVIEWER_NAME,
      note,
    };
    set({ cases: { ...state.cases, [caseId]: { ...current, status: 'decided', decision, statusBeforeDecision: current.status } } });
    get().pushToast({ message: `${caseId} escalated to a senior reviewer. Nothing was sent to the applicant.`, kind: 'info' });
  },

  deny(caseId, reason) {
    const state = get();
    const current = state.cases[caseId];
    const meta = CASES.find((c) => c.id === caseId);
    if (!current || !meta) return;
    const decision: Decision = {
      kind: 'denied',
      at: DEMO_DATE,
      outcomeLabel: 'Permit denied',
      reviewer: REVIEWER_NAME,
      reason,
      letterSent: denialNotice(meta.ownerName, caseId, reason),
    };
    set({ cases: { ...state.cases, [caseId]: { ...current, status: 'decided', decision, statusBeforeDecision: current.status } } });
    get().pushToast({
      message: `Denial letter sent to ${meta.ownerName}.`,
      kind: 'info',
      duration: 10_000,
      action: { label: 'Undo', onClick: () => get().undoDecision(caseId) },
    });
  },

  undoDecision(caseId) {
    set((state) => {
      const current = state.cases[caseId];
      if (!current || !current.decision) return state;
      const { decision: _decision, statusBeforeDecision, ...rest } = current;
      void _decision;
      return { cases: { ...state.cases, [caseId]: { ...rest, status: statusBeforeDecision ?? current.status } } };
    });
    get().pushToast({ message: 'Undone. The case is back in your queue and nothing was sent.', kind: 'info' });
  },

  addSource(source) {
    set((state) => ({ sources: [...state.sources.filter((s) => s.source.id !== source.id), { source, status: 'processing' }] }));
  },

  finishProcessing(sourceId) {
    set((state) => ({
      sources: state.sources.map((s) => (s.source.id === sourceId ? { ...s, status: sourceId === 'R6' ? 'proposed_change' : 'active' } : s)),
    }));
  },

  approveChange() {
    set((state) => ({
      rulebookVersion: '1.1',
      rulebookEffectiveDate: '2026-09-22',
      s2Test: PROPOSED_S2_TEST,
      sources: state.sources.map((s) => (s.source.id === 'R6' ? { ...s, status: 'active' } : s)),
    }));
  },

  rejectChange() {
    set((state) => ({ sources: state.sources.map((s) => (s.source.id === 'R6' ? { ...s, status: 'active' } : s)) }));
  },

  settle(rowId, choice) {
    set((state) => {
      if (state.provingGround.settled[rowId]) return state;
      const row = DISAGREEMENTS.find((r) => r.id === rowId);
      if (!row) return state;
      const tally = { ...state.provingGround.tally, settled: state.provingGround.tally.settled + 1 };
      if (choice === 'unclear') tally.unclear += 1;
      else if (choice === row.claudeSide) tally.claude += 1;
      else tally.reviewer += 1;
      return { provingGround: { settled: { ...state.provingGround.settled, [rowId]: choice }, tally } };
    });
  },

  toggleRung(rungId, on) {
    set((state) => ({ scoreboard: { ...state.scoreboard, rungs: { ...state.scoreboard.rungs, [rungId]: on } } }));
  },

  approveModelSwitch() {
    set((state) => ({ scoreboard: { ...state.scoreboard, modelSwitched: true } }));
  },

  dismissHint() {
    set({ hintDismissed: true });
  },

  openDrawer(drawer) {
    set({ drawer });
  },

  closeDrawer() {
    set({ drawer: null });
  },

  pushToast(toast) {
    const id = toastCounter++;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id }] }));
    return id;
  },

  dismissToast(id) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  reset() {
    set({ ...initialState() });
  },
}));

/* Letters generated on decision */

function formatReplyDue(iso: ISODate): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[(m ?? 1) - 1]} ${y}`;
}

export function approvalNotice(ownerName: string, caseId: string, address: string, typeLabel: string): string {
  return [
    `Dear ${ownerName},`,
    '',
    `Your application ${caseId} for ${address} has been approved. The permit for the ${typeLabel} work described in your application is issued today, 21 Sep 2026.`,
    '',
    'What happens next:',
    '1. Print the permit card from the applicant portal and post it at the site before work begins.',
    '2. Schedule each inspection through the portal or by calling (305) 555-0100. Work must not be covered before it is inspected.',
    '3. The permit expires if work does not begin within 180 days.',
    '',
    'Thank you for your application.',
    '',
    'Building Department, City of Miami',
  ].join('\n');
}

export function denialNotice(ownerName: string, caseId: string, reason: string): string {
  return [
    `Dear ${ownerName},`,
    '',
    `After review, your application ${caseId} has been denied for the following reason:`,
    '',
    reason,
    '',
    'How to appeal: you may file a written appeal with the Building Department within 30 days of the date of this letter. The appeal form is available on the applicant portal, or call (305) 555-0100 and we will send one. You may also submit a new application that resolves the reason above.',
    '',
    'Building Department, City of Miami',
  ].join('\n');
}

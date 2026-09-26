import { describe, expect, it } from 'vitest';
import { CASES } from './cases';
import { CRITERIA, applicableCriteria } from './criteria';
import { PRECEDENTS_BY_ID } from './precedents';
import { PACKETS } from './packets';
import { SAVED_REVIEWS } from './reviews';
import type { CriterionId, CriterionStatus, Recommendation, Review } from './types';
import { documentText, findQuote, packetWordCount, providedDocuments, wordCount } from '@/lib/documentText';

const CRITERION_IDS = new Set(CRITERIA.map((c) => c.id));

/** Section 2 recommendation logic. */
function expectedRecommendation(statuses: CriterionStatus[], asksForVariance: boolean): Recommendation {
  if (statuses.every((s) => s === 'met')) return 'approve_ready';
  if (statuses.some((s) => s === 'unclear') || asksForVariance) return 'needs_judgment';
  return 'needs_information';
}

const EXPECTED: Record<string, { recommendation: Recommendation; flagged: Partial<Record<CriterionId, CriterionStatus>> }> = {
  'MIA-2026-1187': { recommendation: 'needs_judgment', flagged: { A3: 'unclear', A5: 'not_met', X1: 'not_met' } },
  'MIA-2026-1142': { recommendation: 'approve_ready', flagged: {} },
  'MIA-2026-1156': { recommendation: 'approve_ready', flagged: {} },
  'MIA-2026-1149': { recommendation: 'needs_information', flagged: { S3: 'not_met' } },
  'MIA-2026-1163': { recommendation: 'needs_information', flagged: { S1: 'not_met' } },
  'MIA-2026-1171': { recommendation: 'needs_judgment', flagged: { A2: 'not_met' } },
  'MIA-2026-1178': { recommendation: 'needs_judgment', flagged: { S2: 'unclear' } },
};

function bracketedLines(letter: string): string[] {
  return letter.split('\n').filter((line) => /\[[^\]]*\]/.test(line));
}

describe('section 9: saved reviews match their packets', () => {
  for (const meta of CASES) {
    const review: Review | undefined = SAVED_REVIEWS[meta.id];
    const packet = PACKETS[meta.id];

    describe(meta.id, () => {
      it('has a saved review and a packet', () => {
        expect(review).toBeDefined();
        expect(packet).toBeDefined();
      });

      it('every evidence quote is an exact substring of the document it names, found within one line', () => {
        if (!review || !packet) return;
        const docs = providedDocuments(packet);
        for (const criterion of review.criteria) {
          expect(criterion.evidence.length, `${criterion.id} has at most two quotes`).toBeLessThanOrEqual(2);
          for (const ev of criterion.evidence) {
            const doc = docs.find((d) => d.title === ev.document);
            expect(doc, `${criterion.id}: document "${ev.document}" exists`).toBeDefined();
            if (!doc) continue;
            expect(documentText(doc).includes(ev.quote), `${criterion.id}: quote "${ev.quote}" is in "${ev.document}"`).toBe(true);
            expect(findQuote(doc, ev.quote), `${criterion.id}: quote "${ev.quote}" sits inside one line so it can be highlighted`).not.toBeNull();
            expect(wordCount(ev.quote), `${criterion.id}: quote is 25 words at most`).toBeLessThanOrEqual(25);
          }
        }
      });

      it('every criterion and precedent ID exists, and every applicable criterion appears exactly once in rulebook order', () => {
        if (!review) return;
        const ids = review.criteria.map((c) => c.id);
        expect(ids).toEqual(applicableCriteria(meta.type));
        for (const criterion of review.criteria) {
          expect(CRITERION_IDS.has(criterion.id)).toBe(true);
          expect(['met', 'not_met', 'unclear']).toContain(criterion.status);
          expect(criterion.finding.trim().length).toBeGreaterThan(0);
          for (const pid of criterion.precedents) {
            const precedent = PRECEDENTS_BY_ID[pid];
            expect(precedent, `${criterion.id}: precedent ${pid} exists`).toBeDefined();
            expect(precedent?.criterion, `${criterion.id}: precedent ${pid} shares the criterion`).toBe(criterion.id);
          }
        }
      });

      it('the recommendation follows the section 2 logic and matches the expected result', () => {
        if (!review) return;
        const statuses = review.criteria.map((c) => c.status);
        expect(review.recommendation).toBe(expectedRecommendation(statuses, Boolean(meta.asksForVariance)));
        const expected = EXPECTED[meta.id];
        expect(expected).toBeDefined();
        if (!expected) return;
        expect(review.recommendation).toBe(expected.recommendation);
        if (meta.initialStatus !== 'new') expect(meta.initialStatus).toBe(expected.recommendation);
        for (const criterion of review.criteria) {
          const flagged = expected.flagged[criterion.id];
          expect(criterion.status, `${criterion.id} status`).toBe(flagged ?? 'met');
        }
      });

      it('the queue reason is under 12 words and the letter is under 220 words and signed by the department', () => {
        if (!review) return;
        expect(wordCount(review.reason)).toBeLessThan(12);
        expect(wordCount(review.letter)).toBeLessThan(220);
        expect(review.letter.trim().endsWith('Building Department, City of Miami')).toBe(true);
        expect(review.rationale.split(/[.!?]\s/).filter(Boolean).length).toBeGreaterThanOrEqual(2);
      });

      it('a needs-judgment letter holds one bracketed reviewer line and other letters hold none', () => {
        if (!review) return;
        const lines = bracketedLines(review.letter);
        if (review.recommendation === 'needs_judgment') {
          expect(lines).toHaveLength(1);
          expect(lines[0]).toMatch(/\[Reviewer to decide:/);
        } else {
          expect(lines).toHaveLength(0);
        }
      });

      it('the packet is within its word budget', () => {
        if (!packet) return;
        const budget = meta.id === 'MIA-2026-1187' ? 450 : 250;
        expect(packetWordCount(packet)).toBeLessThan(budget);
      });
    });
  }
});

describe('the Delgado hero case', () => {
  const review = SAVED_REVIEWS['MIA-2026-1187'];
  const packet = PACKETS['MIA-2026-1187'];
  const byId = (id: CriterionId) => review?.criteria.find((c) => c.id === id);

  it('has seven provided documents and the elevation certificate missing', () => {
    expect(packet && providedDocuments(packet)).toHaveLength(7);
    expect(packet?.documents.find((d) => d.missing)?.title).toBe('Elevation certificate');
  });

  it('contains every quoted phrase from section 2 of the spec, character for character', () => {
    const text = packet ? providedDocuments(packet).map(documentText).join('\n') : '';
    for (const phrase of [
      '01-4102-018-0420',
      'Sunward Electric LLC',
      'EC13009999',
      '31 Aug 2027',
      'Rear setback: 5 ft 0 in',
      'Side setback: 5 ft 6 in',
      'ADU floor area: 640 sq ft',
      'Proposed ADU footprint is 4 ft 6 in from the rear lot line',
      'New 60 A subpanel fed from the main panel. Added load: 48 A',
      'Total with the ADU: 144 A, within the 150 A service.',
      'Main service panel: 150 A busbar. Main breaker derated to 125 A for a 40 A solar backfeed breaker.',
      'High-Velocity Hurricane Zone',
      '36 in pathway',
      'Ridge setback: 18 in',
      'Spanish',
    ]) {
      expect(text, phrase).toContain(phrase);
    }
  });

  it('nine criteria met and three flagged: A3 unclear, A5 not met, X1 not met', () => {
    const statuses = review?.criteria.map((c) => c.status) ?? [];
    expect(statuses.filter((s) => s === 'met')).toHaveLength(9);
    expect(byId('A3')?.status).toBe('unclear');
    expect(byId('A5')?.status).toBe('not_met');
    expect(byId('X1')?.status).toBe('not_met');
  });

  it('A3 quotes both setback figures and lists four past decisions', () => {
    const a3 = byId('A3');
    const quotes = a3?.evidence.map((e) => e.quote) ?? [];
    expect(quotes.some((q) => q.includes('5 ft 0 in'))).toBe(true);
    expect(quotes.some((q) => q.includes('4 ft 6 in'))).toBe(true);
    expect(a3?.precedents).toHaveLength(4);
  });

  it('A5 quotes nothing because the evidence is an absence, and cites the resubmission precedent', () => {
    expect(byId('A5')?.evidence).toEqual([]);
    expect(byId('A5')?.precedents).toContain('P-2024-0733');
  });

  it('X1 quotes the load total and the derated main breaker, and lists one past decision', () => {
    const quotes = byId('X1')?.evidence.map((e) => e.quote) ?? [];
    expect(quotes).toContain('Total with the ADU: 144 A, within the 150 A service.');
    expect(quotes).toContain('Main breaker derated to 125 A for a 40 A solar backfeed breaker.');
    expect(byId('X1')?.precedents).toEqual(['P-2025-0418']);
  });

  it('the letter holds exactly one bracketed line and requests the certificate and the panel', () => {
    expect(review && bracketedLines(review.letter)).toHaveLength(1);
    expect(review?.letter).toContain('5 Oct 2026');
    expect(review?.letter.toLowerCase()).toContain('elevation certificate');
    expect(review?.letter.toLowerCase()).toMatch(/panel upgrade|upgrade/);
  });

  it('the saved Spanish letter says the same thing as the English', () => {
    const en = review?.letter ?? '';
    const es = review?.letterSpanish ?? '';
    expect(es.length).toBeGreaterThan(0);
    const numbered = (t: string) => t.split('\n').filter((l) => /^\d+\./.test(l.trim())).length;
    expect(numbered(es)).toBe(numbered(en));
    expect(bracketedLines(es)).toHaveLength(1);
    expect(es).toContain('MIA-2026-1187');
    expect(es).toContain('5 de octubre de 2026');
    expect(es.toLowerCase()).toContain('certificado de elevación');
    for (const figure of ['125 A', '144 A', '200 A']) {
      expect(en, figure).toContain(figure);
      expect(es, figure).toContain(figure);
    }
    expect(wordCount(es)).toBeLessThan(260);
  });
});

describe('ask about this case', () => {
  it('every saved answer quotes its document exactly', async () => {
    const { QUESTIONS } = await import('./questions');
    for (const meta of CASES) {
      const questions = QUESTIONS[meta.id] ?? [];
      expect(questions, `${meta.id} has three questions`).toHaveLength(3);
      const packet = PACKETS[meta.id];
      if (!packet) continue;
      for (const q of questions) {
        const doc = providedDocuments(packet).find((d) => d.title === q.quote.document);
        expect(doc, `${meta.id}: "${q.quote.document}" exists`).toBeDefined();
        if (doc) expect(findQuote(doc, q.quote.text), `${meta.id}: "${q.quote.text}"`).not.toBeNull();
        expect(q.answer.split(/[.!?]\s/).filter(Boolean).length).toBeLessThanOrEqual(3);
      }
    }
  });
});

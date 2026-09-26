import { describe, expect, it } from 'vitest';
import { PACKETS } from '@/data/packets';
import { SAVED_REVIEWS } from '@/data/reviews';
import { documentText, providedDocuments } from '@/lib/documentText';
import { carriesLoad, hasCapacity, withinBusbar, type Service } from './electrical';

function packetText(caseId: string): string {
  const packet = PACKETS[caseId];
  return packet ? providedDocuments(packet).map(documentText).join('\n') : '';
}

function x1Status(caseId: string) {
  return SAVED_REVIEWS[caseId]?.criteria.find((c) => c.id === 'X1')?.status;
}

describe('X1 on the Delgado case: each sheet passes alone and fails together', () => {
  const text = packetText('MIA-2026-1187');

  it('the packet states the numbers these checks use', () => {
    expect(text).toContain('Existing house calculated load: 96 A. Total with the ADU: 144 A, within the 150 A service.');
    expect(text).toContain('Main service panel: 150 A busbar. Main breaker derated to 125 A for a 40 A solar backfeed breaker.');
  });

  const aduAlone: Service = { busbar: 150, mainBreaker: 150, load: 144 };
  const solarAlone: Service = { busbar: 150, mainBreaker: 125, backfeed: 40, load: 96 };
  const solarWithoutDerate: Service = { busbar: 150, mainBreaker: 150, backfeed: 40, load: 96 };
  const together: Service = { busbar: 150, mainBreaker: 125, backfeed: 40, load: 144 };
  const upgraded: Service = { busbar: 200, mainBreaker: 200, backfeed: 40, load: 144 };

  it('the ADU sheet passes alone: 144 A on a 150 A main', () => {
    expect(hasCapacity(aduAlone)).toBe(true);
  });

  it('the solar sheet passes alone: 125 A + 40 A = 165 A, within 180 A', () => {
    expect(hasCapacity(solarAlone)).toBe(true);
  });

  it('which is why the installer derated: 150 A + 40 A = 190 A would exceed the busbar', () => {
    expect(withinBusbar(solarWithoutDerate)).toBe(false);
  });

  it('together they fail: 144 A of load on a 125 A main breaker', () => {
    expect(withinBusbar(together)).toBe(true);
    expect(carriesLoad(together)).toBe(false);
  });

  it('a 200 A panel fixes both, as in P-2025-0418: 200 A + 40 A is exactly 120% of 200 A', () => {
    expect(hasCapacity(upgraded)).toBe(true);
  });

  it('the saved review reached the same conclusion', () => {
    expect(x1Status('MIA-2026-1187')).toBe('not_met');
  });
});

describe('X1 on the Patel case: one panel serves both', () => {
  it('130 A on a full 200 A main, and 200 A + 30 A within 240 A', () => {
    expect(packetText('MIA-2026-1163')).toContain('Total with the ADU: 130 A, within the 200 A service.');
    expect(hasCapacity({ busbar: 200, mainBreaker: 200, backfeed: 30, load: 130 })).toBe(true);
    expect(x1Status('MIA-2026-1163')).toBe('met');
  });
});

describe('every solar-only case keeps its backfeed within the busbar', () => {
  for (const [caseId, backfeed] of [
    ['MIA-2026-1142', 30],
    ['MIA-2026-1149', 40],
    ['MIA-2026-1178', 35],
  ] as const) {
    it(`${caseId}: 200 A + ${backfeed} A`, () => {
      expect(packetText(caseId)).toContain(`Main service panel: 200 A, with a ${backfeed} A solar backfeed breaker`);
      expect(withinBusbar({ busbar: 200, mainBreaker: 200, backfeed, load: 0 })).toBe(true);
    });
  }
});

import { describe, expect, it } from 'vitest';
import { wordDiff } from './diff';
import { CRITERIA_BY_ID, PROPOSED_S2_TEST } from '@/data/criteria';

describe('wordDiff', () => {
  it('marks the S2 change: the old ridge clause is removed and the new one added', () => {
    const segments = wordDiff(CRITERIA_BY_ID.S2.test, PROPOSED_S2_TEST);
    const removed = segments.filter((s) => s.kind === 'removed').map((s) => s.text.trim());
    const added = segments.filter((s) => s.kind === 'added').map((s) => s.text.trim());
    expect(removed.join(' ')).toBe('ridge and an 18 in ridge setback');
    expect(added.join(' ')).toBe('ridge. Ridge setback of 18 in, or 36 in when the array covers more than 33% of the roof.');
    expect(segments.filter((s) => s.kind === 'same').map((s) => s.text).join('')).toContain('36 in pathway from eave to');
  });

  it('reconstructs both sides', () => {
    const before = 'one two three';
    const after = 'one 2 three four';
    const segments = wordDiff(before, after);
    expect(segments.filter((s) => s.kind !== 'added').map((s) => s.text).join('').trim()).toBe(before);
    expect(segments.filter((s) => s.kind !== 'removed').map((s) => s.text).join('').trim()).toBe(after);
  });
});

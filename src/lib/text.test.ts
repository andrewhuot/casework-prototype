import { describe, expect, it } from 'vitest';
import { listWithAnd } from './text';

describe('listWithAnd', () => {
  it('joins one, two, and three items the way a sentence would', () => {
    expect(listWithAnd([])).toBe('');
    expect(listWithAnd(['email'])).toBe('email');
    expect(listWithAnd(['email', 'text message'])).toBe('email and text message');
    expect(listWithAnd(['email', 'text message', 'virtual agent call'])).toBe('email, text message, and virtual agent call');
  });
});

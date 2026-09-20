import { describe, expect, it } from 'vitest';
import { DEMO_DATE, addBusinessDays, defaultReplyDue, formatDate, formatDateEs, formatDateWithWeekday, nextBusinessDay, reminderDates } from './dates';

describe('business days from the demo date', () => {
  it('reply due is 10 business days after 21 Sep 2026: 5 Oct 2026', () => {
    expect(defaultReplyDue()).toBe('2026-10-05');
    expect(formatDate(defaultReplyDue())).toBe('5 Oct 2026');
  });
  it('reminders go out 5 and 9 business days after the request: 28 Sep and 2 Oct 2026', () => {
    expect(reminderDates()).toEqual(['2026-09-28', '2026-10-02']);
  });
  it('the next business day after the demo date is 22 Sep 2026', () => {
    expect(nextBusinessDay(DEMO_DATE)).toBe('2026-09-22');
  });
  it('skips weekends', () => {
    expect(addBusinessDays('2026-09-25', 1)).toBe('2026-09-28');
  });
  it('formats dates plainly in English and Spanish', () => {
    expect(formatDateWithWeekday('2026-10-05')).toBe('Monday, 5 October 2026');
    expect(formatDateEs('2026-10-05')).toBe('5 de octubre de 2026');
  });
});

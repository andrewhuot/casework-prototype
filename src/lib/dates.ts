/** The demo clock is fixed so dates, tests, and screenshots never drift. */
export const DEMO_DATE = '2026-09-21';

export type ISODate = string;

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_EN_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function parseISO(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) throw new Error(`Bad ISO date: ${iso}`);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(date: Date): ISODate {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "5 Oct 2026" */
export function formatDate(iso: ISODate): string {
  const d = parseISO(iso);
  return `${d.getUTCDate()} ${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "5 October 2026" */
export function formatDateLong(iso: ISODate): string {
  const d = parseISO(iso);
  return `${d.getUTCDate()} ${MONTHS_EN_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "Monday, 5 October 2026" */
export function formatDateWithWeekday(iso: ISODate): string {
  const d = parseISO(iso);
  return `${WEEKDAYS_EN[d.getUTCDay()]}, ${formatDateLong(iso)}`;
}

/** "5 de octubre de 2026" */
export function formatDateEs(iso: ISODate): string {
  const d = parseISO(iso);
  return `${d.getUTCDate()} de ${MONTHS_ES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** Monday to Friday. Public holidays are not modelled in the prototype. */
export function isBusinessDay(date: Date): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6;
}

export function addBusinessDays(iso: ISODate, count: number): ISODate {
  const date = parseISO(iso);
  let remaining = count;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (isBusinessDay(date)) remaining -= 1;
  }
  return toISO(date);
}

export function nextBusinessDay(iso: ISODate): ISODate {
  return addBusinessDays(iso, 1);
}

export function addDays(iso: ISODate, count: number): ISODate {
  const date = parseISO(iso);
  date.setUTCDate(date.getUTCDate() + count);
  return toISO(date);
}

export function daysBetween(fromIso: ISODate, toIso: ISODate): number {
  const ms = parseISO(toIso).getTime() - parseISO(fromIso).getTime();
  return Math.round(ms / 86_400_000);
}

export function isAfter(aIso: ISODate, bIso: ISODate): boolean {
  return parseISO(aIso).getTime() > parseISO(bIso).getTime();
}

/** Reply due date: ten business days from the demo date, which is 5 Oct 2026. */
export function defaultReplyDue(from: ISODate = DEMO_DATE): ISODate {
  return addBusinessDays(from, 10);
}

/** Reminder dates: 5 and 9 business days after the request. */
export function reminderDates(from: ISODate = DEMO_DATE): [ISODate, ISODate] {
  return [addBusinessDays(from, 5), addBusinessDays(from, 9)];
}

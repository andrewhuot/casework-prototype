import { isAfter, type ISODate } from './dates';

/** Rulebook v1.1 applies to applications filed on or after its effective date. */
export const V11_EFFECTIVE_DATE: ISODate = '2026-09-22';

export function caseRulebookVersion(filed: ISODate, published = false, effectiveDate: ISODate = V11_EFFECTIVE_DATE): '1.0' | '1.1' {
  if (!published) return '1.0';
  return isAfter(filed, effectiveDate) || filed === effectiveDate ? '1.1' : '1.0';
}

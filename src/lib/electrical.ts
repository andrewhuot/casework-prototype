/**
 * The arithmetic behind X1, electrical capacity. The saved reviews are model
 * output; these two rules let the tests re-derive the model's conclusion from
 * the numbers in each packet instead of taking it on trust.
 *
 * 1. Service: the main breaker must carry the calculated load.
 * 2. Busbar: the main breaker plus any backfeed breaker must stay within 120%
 *    of the busbar rating. Installers often derate the main breaker to make
 *    room for solar, which is safe for the busbar and can starve new load.
 */
export interface Service {
  /** Busbar rating in amps. */
  busbar: number;
  /** Main breaker in amps. Equal to the busbar unless derated. */
  mainBreaker: number;
  /** Solar backfeed breaker in amps, if any. */
  backfeed?: number;
  /** Calculated load in amps. */
  load: number;
}

export const BUSBAR_FACTOR = 1.2;

export function carriesLoad(s: Service): boolean {
  return s.load <= s.mainBreaker;
}

export function withinBusbar(s: Service): boolean {
  return s.mainBreaker + (s.backfeed ?? 0) <= BUSBAR_FACTOR * s.busbar;
}

export function hasCapacity(s: Service): boolean {
  return carriesLoad(s) && withinBusbar(s);
}

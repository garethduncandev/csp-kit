import { Csp } from './csp.js';

export function cspMerge(csps: Csp[]): Csp {
  const result: Csp = {};

  for (const csp of csps) {
    for (const [directive, values] of Object.entries(csp)) {
      if (!Array.isArray(values)) continue;
      if (!result[directive]) {
        result[directive] = [];
      }
      result[directive] = Array.from(
        new Set([...(result[directive] as string[]), ...values])
      );
    }
  }

  return result;
}

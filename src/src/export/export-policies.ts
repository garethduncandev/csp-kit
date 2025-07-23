import fs from 'fs';
import { Csp } from '../csp/csp.js';

export type ExportedPolicy = {
  htmlFilePath: string;
  csp: Csp;
  cspString: string;
};

export type ExportedPoliciesJson = {
  policies: ExportedPolicy[];
  combined: {
    csp: Csp;
    cspString: string;
  };
};

export function exportPoliciesJson(
  filePath: string,
  policies: ExportedPolicy[],
  combined: { csp: Csp; cspString: string }
): void {
  const output: ExportedPoliciesJson = {
    policies,
    combined,
  };
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf-8');
}

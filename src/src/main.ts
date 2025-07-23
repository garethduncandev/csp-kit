import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import { Config } from './config/config.js';
import { cspCreate } from './csp/csp-create.js';
import { cspMerge } from './csp/csp-merge.js';
import { cspStringify } from './csp/csp-stringify.js';
import {
  ExportedPolicy,
  exportPoliciesJson,
} from './export/export-policies.js';
import { addContentSecurityPolicyMetaTag } from './html-modifiers/add-content-security-policy-meta-tag.js';
import { addIntegrityAttributes } from './html-modifiers/add-integrity-attributes.js';
import { logCiResult, logDebug, logInfo } from './logger.js';
import { getFilePaths } from './paths/get-file-paths.js';

export async function main(config: Config): Promise<void> {
  const allFilePaths = getFilePaths(path.resolve(config.options.directory));
  const htmlFilePaths = allFilePaths.filter((filePath) =>
    ['.html', '.htm'].includes(path.extname(filePath))
  );

  const exportedPolicies: ExportedPolicy[] = [];

  for (const htmlFilePath of htmlFilePaths) {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    const parsedHtmlContent = load(htmlContent);

    const result = await cspCreate(
      config.directives,
      htmlFilePath,
      config.options.sha
    );
    const csp = result.csp;
    const cspString = cspStringify(csp);

    exportedPolicies.push({
      htmlFilePath,
      csp,
      cspString,
    });

    // add csp meta tag
    if (config.options.addMetaTag) {
      logDebug('Parsed CSP:', cspString);
      addContentSecurityPolicyMetaTag(
        cspString,
        htmlFilePath,
        parsedHtmlContent
      );
    }

    if (config.options.addIntegrityAttributes) {
      addIntegrityAttributes(htmlFilePath, parsedHtmlContent, result.hashes);
    }
  }

  logInfo('Policies:', JSON.stringify(exportedPolicies, null, 2));

  // combine all policies into a single CSP
  const combinedCsp = cspMerge(exportedPolicies.map((p) => p.csp));
  const combinedCspString = cspStringify(combinedCsp);

  logInfo('Combined CSP:', combinedCspString);

  // Used in CI result
  logCiResult(combinedCspString);

  // Output to JSON file if specified
  if (config.options.exportJsonPath) {
    exportPoliciesJson(config.options.exportJsonPath, exportedPolicies, {
      csp: combinedCsp,
      cspString: combinedCspString,
    });
    logInfo(`Output written to ${config.options.exportJsonPath}`);
  }
}

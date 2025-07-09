import fs from 'fs';
import path from 'path';
import { Config } from './config/config.js';
import { cspCreate } from './csp/csp-create.js';
import { cspMerge } from './csp/csp-merge.js';
import { cspStringify } from './csp/csp-stringify.js';
import { Csp } from './csp/csp.js';
import { addContentSecurityPolicyMetaTag } from './html-modifiers/add-content-security-policy-meta-tag.js';
import { addIntegrityAttributes } from './html-modifiers/add-integrity-attributes.js';
import { getFilePaths } from './paths/get-file-paths.js';
import { logCiResult, logDebug, logInfo, setLogLevel } from './logger.js';
import { load } from 'cheerio';

export async function main(config: Config): Promise<void> {
  const allFilePaths = getFilePaths(path.resolve(config.options.directory));
  const htmlFilePaths = allFilePaths.filter((filePath) =>
    ['.html', '.htm'].includes(path.extname(filePath))
  );

  const policies: Csp[] = [];

  for (const htmlFilePath of htmlFilePaths) {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    const parsedHtmlContent = load(htmlContent);

    const result = await cspCreate(
      config.directives,
      htmlFilePath,
      config.options.sha
    );
    const csp = result.csp;

    policies.push(csp);

    // add csp meta tag
    if (config.options.addMetaTag) {
      const parsedCsp = cspStringify(csp);
      logDebug('Parsed CSP:', parsedCsp);
      addContentSecurityPolicyMetaTag(
        parsedCsp,
        htmlFilePath,
        parsedHtmlContent
      );
    }

    if (config.options.addIntegrityAttributes) {
      addIntegrityAttributes(htmlFilePath, parsedHtmlContent, result.hashes);
    }
  }

  logInfo('Policies:', JSON.stringify(policies, null, 2));

  // combine all policies into a single CSP
  const combined = cspMerge(policies);
  const combinedCspString = cspStringify(combined);

  logInfo('Combined CSP:', combinedCspString);

  // Used in CI result
  logCiResult(combinedCspString);
}

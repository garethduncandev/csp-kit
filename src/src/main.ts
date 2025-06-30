import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { Config } from './config/config.js';
import { combineCsps, generateCsp, stringifyCsp } from './csp/csp-generator.js';
import { Csp } from './csp/csp.js';
import { HashResult } from './hashers/hash-result.js';
import { getFilePaths } from './utils/file-utils.js';
import { logDebug, logInfo, setLogLevel } from './utils/logger.js';
import { addContentSecurityPolicyMetaTag } from './utils/meta-tag-utils.js';

export async function main(config: Config): Promise<void> {
  setLogLevel(config.options.logLevel);
  const allFilePaths = getFilePaths(path.resolve(config.options.directory));
  const htmlFilePaths = allFilePaths.filter((filePath) =>
    ['.html', '.htm'].includes(path.extname(filePath))
  );

  const policies: Csp[] = [];
  for (const htmlFilePath of htmlFilePaths) {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    const parsedHtmlContent = cheerio.load(htmlContent);

    const result = await generateCsp(
      config.directives,
      htmlFilePath,
      config.options.sha
    );
    const csp = result.csp;

    policies.push(csp);
    logDebug(JSON.stringify(result, null, 2));

    // add csp meta tag (and report-to meta tag if needed)
    if (config.options.addMetaTag) {
      const parsedCsp = stringifyCsp(csp);
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

  // combine all policies into a single CSP
  const combined = combineCsps(policies);
  const combinedCspString = stringifyCsp(combined);
  logInfo(combinedCspString);
}

function addIntegrityAttributes(
  htmlFilePath: string,
  parsedHtmlContent: cheerio.CheerioAPI,
  hashes: HashResult[]
): void {
  for (const hash of hashes) {
    if (
      hash.src &&
      (hash.resourceType === 'script' || hash.resourceType === 'style')
    ) {
      addIntegrityAttribute(
        htmlFilePath,
        parsedHtmlContent,
        hash.src,
        hash.resourceType,
        hash.hash
      );
    }
  }
}

function addIntegrityAttribute(
  htmlFilePath: string,
  parsedHtmlContent: cheerio.CheerioAPI,
  resourceUrl: string,
  resourceType: 'script' | 'style',
  hash: string
) {
  const element =
    resourceType === 'script'
      ? parsedHtmlContent(`script[src="${resourceUrl}"]`)
      : parsedHtmlContent(`link[href="${resourceUrl}"]`);
  element.attr('integrity', hash);
  fs.writeFileSync(htmlFilePath, parsedHtmlContent.html(), 'utf-8');
}

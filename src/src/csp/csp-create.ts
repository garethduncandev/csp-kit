import fs from 'fs';
import { HashResult } from '../hashers/hash-result.js';
import { hashHtmlResources } from '../hashers/hash-html-resources.js';
import { SHA } from '../hashers/sha.js';
import { Csp } from './csp.js';

export async function cspCreate(
  directives: { [key: string]: string[] },
  htmlFilePath: string,
  sha: SHA
): Promise<{ hashes: HashResult[]; csp: Csp }> {
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
  const cheerio = await import('cheerio');
  const parsedHtmlContent = cheerio.load(htmlContent);

  const scriptHashesArr = await hashHtmlResources(
    parsedHtmlContent,
    htmlFilePath,
    sha,
    'script'
  );
  const styleHashesArr = await hashHtmlResources(
    parsedHtmlContent,
    htmlFilePath,
    sha,
    'style'
  );

  // Start with directives found in config
  const csp: Csp = { ...directives };

  // Add hashes to the CSP
  if (scriptHashesArr.length > 0) {
    // Only inline/embedded hashes are added to the csp
    const hashes = scriptHashesArr.filter(
      (x) =>
        x.resourceLocation === 'embedded' || x.resourceLocation === 'inline'
    );

    const domains = scriptHashesArr.filter(
      (x) => x.resourceLocation === 'remote'
    );
    const self = scriptHashesArr.some((x) => x.resourceLocation === 'local');

    csp['script-src'] = [
      ...(csp['script-src'] || []),
      ...(self ? [`'self'`] : []),
      ...domains.map((h) => (h.domain ? h.domain : '')),
      ...hashes.map((h) => `'${h.hash}'`),
    ];
  }

  if (styleHashesArr.length > 0) {
    const hashes = styleHashesArr.filter(
      (x) =>
        x.resourceLocation === 'embedded' || x.resourceLocation === 'inline'
    );

    const domains = styleHashesArr.filter(
      (x) => x.resourceLocation === 'remote'
    );

    const self = styleHashesArr.some((x) => x.resourceLocation === 'local');

    csp['style-src'] = [
      ...(csp['style-src'] || []),
      ...(self ? [`'self'`] : []),
      ...domains.map((h) => (h.domain ? h.domain : '')),
      ...hashes.map((h) => `'${h.hash}'`),
    ];
  }

  return {
    hashes: [...scriptHashesArr, ...styleHashesArr],
    csp,
  };
}

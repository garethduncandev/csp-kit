import fs from 'fs';
import { HashResult } from '../hashers/hash-result.js';
import { CheerioAPI } from 'cheerio';

export function addIntegrityAttributes(
  htmlFilePath: string,
  parsedHtmlContent: CheerioAPI,
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
  parsedHtmlContent: CheerioAPI,
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

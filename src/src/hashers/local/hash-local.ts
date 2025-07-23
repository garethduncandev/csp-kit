import type { CheerioAPI } from 'cheerio';
import fs from 'fs';
import path from 'path';
import { HashResult } from '../hash-result.js';
import { hashString } from '../string/hash-string.js';
import { SHA } from '../sha.js';
import { extractLocalResources } from './extract-local.js';

export function hashLocalResources(
  resourceType: 'script' | 'style',
  parsedHtmlContent: CheerioAPI,
  sha: SHA,
  htmlFilePath: string
): HashResult[] {
  const hashes: HashResult[] = [];

  const localResources = extractLocalResources(parsedHtmlContent, resourceType);
  for (const resource of localResources) {
    // Use the directory of the HTML file, not the file path itself
    const htmlDir = path.dirname(htmlFilePath);
    const absoluteFilePath = path.join(htmlDir, resource.url);
    const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');
    const resourceHash = hashString(fileContent, sha);
    hashes.push({
      src: resource.url,
      hash: resourceHash,
      resourceLocation: 'local',
      resourceType: resource.resourceType,
      domain: 'self',
    });
  }
  return hashes;
}

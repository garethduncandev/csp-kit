import { CheerioAPI } from 'cheerio';
import { EmbeddedResource } from './embedded-resource.js';
import { HashResult } from '../hash-result.js';
import { hashString } from '../string/hash-string.js';
import { SHA } from '../sha.js';
import { extractEmbeddedResources } from './extract-embedded.js';

export function hashEmbeddedResources(
  resourceType: 'script' | 'style',
  parsedHtmlContent: CheerioAPI,
  sha: SHA
): HashResult[] {
  const embeddedResources = extractEmbeddedResources(
    parsedHtmlContent,
    resourceType
  );
  const hashes: HashResult[] = [];
  for (const resource of embeddedResources) {
    const hash = hashString(resource.content, sha);
    hashes.push({
      src: null,
      hash,
      resourceLocation: 'embedded',
      resourceType: resource.resourceType,
      domain: null,
    });
  }
  return hashes;
}

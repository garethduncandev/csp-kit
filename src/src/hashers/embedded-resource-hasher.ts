import { CheerioAPI } from 'cheerio';
import { EmbeddedResource } from './embedded-resource.js';
import { HashResult } from './hash-result.js';
import { hashString } from './hash-string.js';
import { SHA } from './sha.js';

export function hashEmbeddedResources(
  resourceType: 'script' | 'style',
  parsedHtmlContent: CheerioAPI,
  sha: SHA
): HashResult[] {
  const embeddedResources = extractResources(parsedHtmlContent, resourceType);

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

function extractResources(
  parsedHtmlContent: CheerioAPI,
  resourceType: 'script' | 'style'
): EmbeddedResource[] {
  const resources: EmbeddedResource[] = [];

  parsedHtmlContent(resourceType).each((_, element) => {
    const content = parsedHtmlContent(element).html(); // Get the content inside the <script> tag
    if (content) {
      resources.push({ content, resourceType });
    }
  });

  return resources;
}

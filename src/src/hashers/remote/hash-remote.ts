import { HashResult } from '../hash-result.js';
import { hashString } from '../string/hash-string.js';
import { SHA } from '../sha.js';
import type { CheerioAPI } from 'cheerio';
import { extractRemoteResources } from './extract-remote.js';

export async function hashRemoteResources(
  resourceType: 'script' | 'style',
  parsedHtmlContent: CheerioAPI,
  sha: SHA
): Promise<HashResult[]> {
  const hashes: HashResult[] = [];

  const remoteResources = extractRemoteResources(
    parsedHtmlContent,
    resourceType
  );

  for (const resource of remoteResources) {
    const fullUrl = resource.url.startsWith('//')
      ? `https:${resource.url}`
      : resource.url;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.error(
        `Failed to fetch ${fullUrl} - unable to hash: ${response.statusText}`
      );
      continue;
    }
    const resourceContent = await response.text();
    const resourceHash = hashString(resourceContent, sha);
    const parsedUrl = new URL(fullUrl);
    const domain = `${parsedUrl.protocol}//${parsedUrl.hostname}` || null;
    hashes.push({
      src: fullUrl,
      hash: resourceHash,
      resourceLocation: 'remote',
      resourceType: resource.resourceType,
      domain: domain,
    });
  }
  return hashes;
}

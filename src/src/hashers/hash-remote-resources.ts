import { isRemoteUrl } from '../paths/is-remote-url.js';
import { HashResult } from './hash-result.js';
import { hashString } from './hash-string.js';
import {} from './hash-html-resources.js';
import { SHA } from './sha.js';
import type { CheerioAPI } from 'cheerio';

export async function hashRemoteResources(
  resourceType: 'script' | 'style',
  parsedHtmlContent: CheerioAPI,
  sha: SHA
): Promise<HashResult[]> {
  const hashes: HashResult[] = [];

  // Generalize selector and attribute
  const selector =
    resourceType === 'style' ? 'link[rel="stylesheet"]' : 'script[src]';
  const attr = resourceType === 'style' ? 'href' : 'src';

  const urls: string[] = [];
  parsedHtmlContent(selector).each((_: unknown, element: any) => {
    const url = parsedHtmlContent(element).attr(attr);
    if (url && isRemoteUrl(url)) {
      urls.push(url.startsWith('//') ? `https:${url}` : url);
    }
  });

  for (const fullUrl of urls) {
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
      resourceType,
      domain: domain,
    });
  }
  return hashes;
}

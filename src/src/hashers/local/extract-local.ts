import type { CheerioAPI } from 'cheerio';
import { isRemoteUrl } from '../../paths/is-remote-url.js';

export interface LocalResource {
  url: string;
  resourceType: 'script' | 'style';
}

export function extractLocalResources(
  parsedHtmlContent: CheerioAPI,
  resourceType: 'script' | 'style'
): LocalResource[] {
  const resources: LocalResource[] = [];
  const selector =
    resourceType === 'style' ? 'link[rel="stylesheet"]' : 'script[src]';
  const attr = resourceType === 'style' ? 'href' : 'src';

  parsedHtmlContent(selector).each((_, element) => {
    const url = parsedHtmlContent(element).attr(attr);
    if (url && !isRemoteUrl(url)) {
      resources.push({ url, resourceType });
    }
  });

  return resources;
}

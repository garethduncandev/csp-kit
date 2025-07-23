import type { CheerioAPI } from 'cheerio';
import { isRemoteUrl } from '../../paths/is-remote-url.js';

export interface RemoteResource {
  url: string;
  resourceType: 'script' | 'style';
}

export function extractRemoteResources(
  parsedHtmlContent: CheerioAPI,
  resourceType: 'script' | 'style'
): RemoteResource[] {
  const resources: RemoteResource[] = [];
  const selector =
    resourceType === 'style' ? 'link[rel="stylesheet"]' : 'script[src]';
  const attr = resourceType === 'style' ? 'href' : 'src';

  parsedHtmlContent(selector).each((_, element) => {
    const url = parsedHtmlContent(element).attr(attr);
    if (url && isRemoteUrl(url)) {
      resources.push({ url, resourceType });
    }
  });

  return resources;
}

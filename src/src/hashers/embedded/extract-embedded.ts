import type { CheerioAPI } from 'cheerio';
import type { EmbeddedResource } from './embedded-resource.js';

export function extractEmbeddedResources(
  parsedHtmlContent: CheerioAPI,
  resourceType: 'script' | 'style'
): EmbeddedResource[] {
  const resources: EmbeddedResource[] = [];
  parsedHtmlContent(resourceType).each((_, element) => {
    const content = parsedHtmlContent(element).html();
    if (content) {
      resources.push({ content, resourceType });
    }
  });
  return resources;
}

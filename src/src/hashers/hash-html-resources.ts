import { CheerioAPI } from 'cheerio';
import { hashEmbeddedResources } from './embedded-resource-hasher.js';
import { HashResult } from './hash-result.js';
import { hashLocalResources } from './hash-local-resources.js';
import { hashRemoteResources } from './hash-remote-resources.js';
import { SHA } from './sha.js';

export async function hashHtmlResources(
  parsedHtmlContent: CheerioAPI,
  htmlFilePath: string,
  sha: SHA,
  resourceType: 'script' | 'style'
): Promise<HashResult[]> {
  // Hash local external resources
  const localExternalHashes = hashLocalResources(
    resourceType,
    parsedHtmlContent,
    sha,
    htmlFilePath
  );

  // Hash remote external resources
  const remoteExternalHashes = await hashRemoteResources(
    resourceType,
    parsedHtmlContent,
    sha
  );

  // Hash embedded resources
  const embeddedResourceHashes = hashEmbeddedResources(
    resourceType,
    parsedHtmlContent,
    sha
  );

  return [
    ...localExternalHashes,
    ...remoteExternalHashes,
    ...embeddedResourceHashes,
  ];
}

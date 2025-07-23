import { describe, it, expect, vi } from 'vitest';
import { load } from 'cheerio';
import * as local from './hash-local-resources.js';
import * as remote from './hash-remote-resources.js';
import * as embedded from './embedded-resource-hasher.js';
import { hashHtmlResources } from './hash-html-resources.js';

describe('hashHtmlResources', () => {
  it('should combine results from all hashers', async () => {
    const $ = load('<html><body></body></html>');
    vi.spyOn(local, 'hashLocalResources').mockReturnValue([
      {
        src: 'local.js',
        hash: 'sha256-abc',
        resourceLocation: 'local',
        resourceType: 'script',
        domain: 'self',
      },
    ]);
    vi.spyOn(remote, 'hashRemoteResources').mockResolvedValue([
      {
        src: 'https://remote.com/remote.js',
        hash: 'sha256-def',
        resourceLocation: 'remote',
        resourceType: 'script',
        domain: 'https://remote.com',
      },
    ]);
    vi.spyOn(embedded, 'hashEmbeddedResources').mockReturnValue([
      {
        src: null,
        hash: 'sha256-ghi',
        resourceLocation: 'embedded',
        resourceType: 'script',
        domain: null,
      },
    ]);
    const results = await hashHtmlResources(
      $,
      '/fake/path.html',
      'sha256',
      'script'
    );
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.hash)).toEqual([
      'sha256-abc',
      'sha256-def',
      'sha256-ghi',
    ]);
  });
});

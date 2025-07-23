import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from 'cheerio';

// Mock fs with memfs before importing the function under test
vi.mock('fs', async () => {
  const { vol } = await import('memfs');
  vol.fromJSON({
    '/fake/local.js': 'hello',
  });
  return await import('memfs');
});

import * as isRemote from '../../paths/is-remote-url.js';
import { hashLocalResources } from './hash-local.js';

describe('hashLocalResources', () => {
  beforeEach(() => {
    vi.spyOn(isRemote, 'isRemoteUrl').mockReturnValue(false);
  });

  it('should hash local script resources', () => {
    const html = `<script src="local.js"></script>`;
    const $ = load(html);
    const results = hashLocalResources(
      'script',
      $,
      'sha256',
      '/fake/path.html'
    );
    expect(results).toHaveLength(1);
    expect(results[0].resourceLocation).toBe('local');
    expect(results[0].src).toBe('local.js');
    expect(results[0].hash).toBe(
      'sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ='
    );
  });
});

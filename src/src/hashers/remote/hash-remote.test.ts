import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from 'cheerio';
import * as isRemote from '../../paths/is-remote-url.js';
import { hashRemoteResources } from './hash-remote.js';

global.fetch = vi.fn();

describe('hashRemoteResources', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should hash remote script resources', async () => {
    const html = `<script src="https://remote.com/remote.js"></script>`;
    const $ = load(html);
    vi.spyOn(isRemote, 'isRemoteUrl').mockReturnValue(true);
    (fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('hello'),
    });
    const results = await hashRemoteResources('script', $, 'sha256');
    expect(results).toHaveLength(1);
    expect(results[0].resourceLocation).toBe('remote');
    expect(results[0].src).toBe('https://remote.com/remote.js');
    expect(results[0].hash).toBe(
      'sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ='
    );
  });
});

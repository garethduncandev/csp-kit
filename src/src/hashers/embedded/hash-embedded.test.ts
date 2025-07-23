import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { hashEmbeddedResources } from './hash-embedded.js';

describe('hashEmbeddedResources', () => {
  it('should hash embedded <script> resources', () => {
    const html = `<html><body>
      <script>console.log('hello');</script>
      <script>console.log('world');</script>
    </body></html>`;
    const $ = load(html);
    const results = hashEmbeddedResources('script', $, 'sha256');
    expect(results).toHaveLength(2);
    expect(results[0].hash.startsWith('sha256-')).toBe(true);
    expect(results[0].resourceType).toBe('script');
    expect(results[0].resourceLocation).toBe('embedded');
  });

  it('should hash embedded <style> resources', () => {
    const html = `<html><body>
      <style>body { color: red; }</style>
    </body></html>`;
    const $ = load(html);
    const results = hashEmbeddedResources('style', $, 'sha256');
    expect(results).toHaveLength(1);
    expect(results[0].hash.startsWith('sha256-')).toBe(true);
    expect(results[0].resourceType).toBe('style');
    expect(results[0].resourceLocation).toBe('embedded');
  });
});

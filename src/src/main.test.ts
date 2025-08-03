import { getFilePaths } from './paths/get-file-paths.js';
/*
 * This is a full single (bit like an e2e) test on the files within test-site
 * We know what the hashes should be, so we can verify them here
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { main } from './main.js';
import { promises as fs } from 'fs';
import path from 'path';

import { getConfig } from './config/get-config.js';
import type { ExportedPoliciesJson } from './export/export-policies.js';

describe('test main.ts', () => {
  const origTestSiteDir = path.resolve(__dirname, '../test-site');
  const cacheDir = path.resolve(__dirname, '../.cache');
  const testSiteCopyDir = path.join(cacheDir, 'test-site');
  const exportJsonPath = path.join(cacheDir, 'test-result.json');

  let config;
  beforeAll(async () => {
    // Clean and copy test-site to .cache/test-site
    await fs
      .rm(testSiteCopyDir, { recursive: true, force: true })
      .catch(() => {});
    await fs.cp(origTestSiteDir, testSiteCopyDir, { recursive: true });
    // Load config from .csprc in the copied test-site dir
    const csprcPath = path.join(testSiteCopyDir, '.csprc');
    config = getConfig(csprcPath);
    // Override exportJsonPath in loaded config
    config.options.exportJsonPath = exportJsonPath;
    await main(config);
  });

  it('should update HTML files with integrity attributes and CSP meta tag', async () => {
    const htmlFiles = ['index.html', 'pages/page-1.html', 'pages/page-2.html'];
    for (const relPath of htmlFiles) {
      const filePath = path.join(testSiteCopyDir, relPath);
      const html = await fs.readFile(filePath, 'utf8');
      // Check for integrity attributes (replace with actual hashes)
      expect(html).toMatch(/integrity="/);
      // Check for CSP meta tag
      expect(html).toMatch(/<meta http-equiv="Content-Security-Policy"/);
    }
  });

  it('should write correct test-result.json', async () => {
    const json = await fs.readFile(exportJsonPath, 'utf8');
    const result: ExportedPoliciesJson = JSON.parse(json);
    expect(result).toMatchObject({
      policies: expect.any(Array),
      combined: expect.any(Object),
    });

    // Find all HTML files in the copied test-site
    const htmlFiles = getFilePaths(testSiteCopyDir).filter((f) =>
      f.endsWith('.html')
    );
    // Define expected hashes for each file (replace with real values)
    const expectedHashes: Record<
      string,
      { script: string[]; style: string[] }
    > = {
      // Use relative paths as keys, update with real hashes
      [path.join(testSiteCopyDir, 'index.html')]: {
        script: [
          "'self'",
          'https://garethduncandev.github.io',
          "'sha256-YLStZD3LRCbyQz+SWh+LM9QT71cJdJox9GDPlGS0bhg='",
        ],
        style: [
          "'self'",
          'https://garethduncandev.github.io',
          "'sha256-wJRySaU187V0euaf6vebc2XKVC8F6rbi2ZrMfDEf4hE='",
        ],
      },
      [path.join(testSiteCopyDir, 'pages/page-1.html')]: {
        script: [
          "'self'",
          'https://garethduncandev.github.io',
          "'sha256-30TJbZ7sL3IHanERtHvQo9Cl1IT/lRpiRCGOdJ6ST1o='",
        ],
        style: [
          "'self'",
          "'sha256-sbQB//m/D0KJE+Wfglw5v32z+bGQqi+j2s44QMrDKJs='",
        ],
      },
      [path.join(testSiteCopyDir, 'pages/page-2.html')]: {
        script: ["'self'"],
        style: [
          "'self'",
          'https://garethduncandev.github.io',
          "'sha256-OiMWtCCNPLZECupMMHFILuuFjO4l1PzOXe1hvJKPESg='",
        ],
      },
    };

    for (const htmlFile of htmlFiles) {
      // Find the policy for this file
      const policy = result.policies.find((p) => p.htmlFilePath === htmlFile);
      expect(policy).toBeDefined();
      const scriptSrc = policy!.csp['script-src'] || [];
      const styleSrc = policy!.csp['style-src'] || [];
      const expected = expectedHashes[htmlFile];
      if (expected) {
        for (const hash of expected.script) {
          expect(scriptSrc).toContain(hash);
        }
        for (const hash of expected.style) {
          expect(styleSrc).toContain(hash);
        }
      }
    }

    // Check the combined CSP value
    const combined = result.combined;
    expect(combined).toBeDefined();
    // Check combined CSP script-src and style-src for expected hashes (replace with real values)
    const expectedCombinedScriptSrc = [
      "'self'",
      'https://garethduncandev.github.io',
      "'sha256-YLStZD3LRCbyQz+SWh+LM9QT71cJdJox9GDPlGS0bhg='",
      "'sha256-30TJbZ7sL3IHanERtHvQo9Cl1IT/lRpiRCGOdJ6ST1o='",
    ];
    const expectedCombinedStyleSrc = [
      "'self'",
      'https://garethduncandev.github.io',
      "'sha256-wJRySaU187V0euaf6vebc2XKVC8F6rbi2ZrMfDEf4hE='",
      "'sha256-sbQB//m/D0KJE+Wfglw5v32z+bGQqi+j2s44QMrDKJs='",
      "'sha256-OiMWtCCNPLZECupMMHFILuuFjO4l1PzOXe1hvJKPESg='",
    ];
    expect(combined.csp['script-src']).toEqual(
      expect.arrayContaining(expectedCombinedScriptSrc)
    );
    expect(combined.csp['style-src']).toEqual(
      expect.arrayContaining(expectedCombinedStyleSrc)
    );
  });

  afterAll(async () => {
    // Optionally clean up .cache/test-site if needed
    // await fs.rm(testSiteCopyDir, { recursive: true, force: true });
  });
});

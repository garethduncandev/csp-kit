import { describe, it, expect } from 'vitest';

import { hashString } from '../src/hashers/hash-string.js';

describe('hashString', () => {
  it('should return a base64-encoded hash with the correct prefix', () => {
    const result = hashString('hello', 'sha256');
    expect(result.startsWith('sha256-')).toBe(true);
    expect(typeof result).toBe('string');
  });
});

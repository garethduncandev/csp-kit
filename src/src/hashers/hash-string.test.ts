import { describe, it, expect } from 'vitest';
import { hashString } from './hash-string.js';

describe('hashString', () => {
  it('should return a base64-encoded hash with the correct prefix', () => {
    const result = hashString('hello', 'sha256');
    // The expected base64-encoded SHA-256 hash of "hello" is 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    // base64 of that is "LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ="
    const expected = 'sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=';
    expect(result).toBe(expected);
    expect(typeof result).toBe('string');
  });
});

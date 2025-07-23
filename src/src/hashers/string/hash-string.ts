import crypto from 'crypto';
import { SHA } from '../sha.js';

export function hashString(content: string, shaType: SHA): string {
  const hash = crypto.createHash(shaType);
  hash.update(content);
  return `${shaType.toString()}-${hash.digest('base64')}`;
}

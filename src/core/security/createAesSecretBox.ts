import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { hostname, userInfo } from 'node:os';
import type { SecretBox } from '../types.js';

function createKey(): Buffer {
  const seed = `${userInfo().username}:${hostname()}:oauth-account-switcher`;
  return createHash('sha256').update(seed).digest();
}

export function createAesSecretBox(): SecretBox {
  const key = createKey();

  return {
    encrypt(value: string): string {
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
      const tag = cipher.getAuthTag();

      return Buffer.concat([iv, tag, encrypted]).toString('base64');
    },
    decrypt(value: string): string {
      const payload = Buffer.from(value, 'base64');
      const iv = payload.subarray(0, 12);
      const tag = payload.subarray(12, 28);
      const encrypted = payload.subarray(28);
      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);

      return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    }
  };
}

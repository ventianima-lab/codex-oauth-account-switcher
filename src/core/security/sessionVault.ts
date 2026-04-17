import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SecretBox } from '../types.js';

export class SessionVault {
  constructor(
    private readonly rootDir: string,
    private readonly secretBox: SecretBox
  ) {}

  async save(accountId: string, payload: string): Promise<string> {
    await mkdir(this.rootDir, { recursive: true });
    const bundlePath = join(this.rootDir, `${accountId}.bundle`);
    const encrypted = this.secretBox.encrypt(payload);
    await writeFile(bundlePath, encrypted, 'utf8');
    return bundlePath;
  }

  async load(bundlePath: string): Promise<string> {
    const encrypted = await readFile(bundlePath, 'utf8');
    return this.secretBox.decrypt(encrypted);
  }
}

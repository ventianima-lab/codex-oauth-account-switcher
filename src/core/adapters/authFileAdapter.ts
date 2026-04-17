import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { AuthAdapter } from '../types.js';

export class AuthFileAdapter implements AuthAdapter {
  constructor(
    private readonly authPath: string,
    private readonly backupPath: string
  ) {}

  async readCurrentAuth(): Promise<string> {
    return readFile(this.authPath, 'utf8');
  }

  async backupCurrentAuth(): Promise<string> {
    await mkdir(dirname(this.backupPath), { recursive: true });
    await copyFile(this.authPath, this.backupPath);
    return this.backupPath;
  }

  async writeBundle(bundle: string): Promise<void> {
    await this.backupCurrentAuth();
    await writeFile(this.authPath, bundle, 'utf8');
  }

  async restoreBackup(backupPath: string): Promise<void> {
    const backup = await readFile(backupPath, 'utf8');
    await writeFile(this.authPath, backup, 'utf8');
  }
}

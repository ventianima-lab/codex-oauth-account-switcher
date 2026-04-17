import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { AccountRecord } from './types.js';

export class CatalogStore {
  private readonly catalogPath: string;

  constructor(private readonly rootDir: string) {
    this.catalogPath = join(rootDir, 'catalog.json');
  }

  async load(): Promise<AccountRecord[]> {
    try {
      const text = await readFile(this.catalogPath, 'utf8');
      return JSON.parse(text) as AccountRecord[];
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  async save(accounts: AccountRecord[]): Promise<void> {
    await mkdir(this.rootDir, { recursive: true });
    await writeFile(this.catalogPath, JSON.stringify(accounts, null, 2), 'utf8');
  }
}

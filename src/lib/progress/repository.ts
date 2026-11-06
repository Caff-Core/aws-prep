import { migrate } from './migrations';
import { emptyProgress } from './types';
import type { ProgressState } from './types';

/**
 * Storage boundary. Async so a server-backed implementation (optional accounts,
 * see ROADMAP) can replace browser storage without touching the interface.
 */
export interface ProgressRepository {
  load(): Promise<ProgressState>;
  save(state: ProgressState): Promise<void>;
  clear(): Promise<void>;
}

export const STORAGE_KEY = 'aws-prep:progress';
export const BACKUP_KEY = `${STORAGE_KEY}:unreadable-backup`;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type StorageHealth = 'ok' | 'unavailable' | 'recovered' | 'newer-version';

/** Never throws: private mode or full storage degrades to in-memory state. */
export class LocalProgressRepository implements ProgressRepository {
  health: StorageHealth = 'ok';
  private memory: ProgressState | null = null;

  constructor(private readonly storage: StorageLike | null) {
    if (!storage) this.health = 'unavailable';
  }

  async load(): Promise<ProgressState> {
    if (this.memory) return this.memory;
    if (!this.storage) return emptyProgress();

    let raw: string | null;
    try {
      raw = this.storage.getItem(STORAGE_KEY);
    } catch {
      this.health = 'unavailable';
      return emptyProgress();
    }
    if (raw === null) return emptyProgress();

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return this.recover(raw);
    }

    const result = migrate(parsed);
    if (result.kind === 'ok') return result.state;
    if (result.kind === 'newer-version') {
      // Written by a newer build. Leave it untouched rather than overwrite it.
      this.health = 'newer-version';
      return emptyProgress();
    }
    return this.recover(raw);
  }

  async save(state: ProgressState): Promise<void> {
    if (this.health === 'newer-version') return;
    if (this.storage) {
      try {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
        this.memory = null;
        return;
      } catch {
        this.health = 'unavailable';
      }
    }
    this.memory = state;
  }

  async clear(): Promise<void> {
    this.memory = null;
    try {
      this.storage?.removeItem(STORAGE_KEY);
      this.storage?.removeItem(BACKUP_KEY);
      if (this.health !== 'unavailable') this.health = 'ok';
    } catch {
      this.health = 'unavailable';
    }
  }

  /** Keeps a copy of unreadable data so a bug can never silently destroy it. */
  private recover(raw: string): ProgressState {
    this.health = 'recovered';
    try {
      this.storage?.setItem(BACKUP_KEY, raw);
    } catch {
      // Backup is best effort; the learner still gets a working empty state.
    }
    return emptyProgress();
  }
}

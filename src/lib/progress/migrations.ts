import { PROGRESS_VERSION } from './types';
import type { CertificationProgress, ProgressState } from './types';

/** Each migration upgrades stored data from the keyed version to the next. */
export type Migrations = Record<number, (data: Record<string, unknown>) => Record<string, unknown>>;

export const migrations: Migrations = {};

export type MigrationResult =
  { kind: 'ok'; state: ProgressState } | { kind: 'invalid' } | { kind: 'newer-version' };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function isCertificationProgress(value: unknown): value is CertificationProgress {
  return (
    isRecord(value) &&
    isRecord(value['completedLessons']) &&
    isRecord(value['bookmarks']) &&
    isRecord(value['quizResults']) &&
    Array.isArray(value['mockExams']) &&
    (value['lastVisited'] === null || isRecord(value['lastVisited']))
  );
}

function isProgressState(
  value: Record<string, unknown>,
): value is Record<string, unknown> & ProgressState {
  const { version, certifications, preferences } = value;
  return (
    version === PROGRESS_VERSION &&
    isRecord(preferences) &&
    isRecord(certifications) &&
    Object.values(certifications).every(isCertificationProgress)
  );
}

/** Upgrades parsed storage data. Hand-rolled to keep validators out of the client bundle. */
export function migrate(
  raw: unknown,
  steps: Migrations = migrations,
  targetVersion: number = PROGRESS_VERSION,
): MigrationResult {
  if (!isRecord(raw) || typeof raw['version'] !== 'number') return { kind: 'invalid' };
  if (raw['version'] > targetVersion) return { kind: 'newer-version' };

  let data = raw;
  while ((data['version'] as number) < targetVersion) {
    const version = data['version'] as number;
    const step = steps[version];
    if (!step) return { kind: 'invalid' };
    data = { ...step(data), version: version + 1 };
  }
  return isProgressState(data) ? { kind: 'ok', state: data } : { kind: 'invalid' };
}

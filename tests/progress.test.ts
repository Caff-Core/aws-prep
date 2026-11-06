import { describe, expect, it } from 'vitest';
import { migrate } from '~/lib/progress/migrations';
import { BACKUP_KEY, LocalProgressRepository, STORAGE_KEY } from '~/lib/progress/repository';
import {
  recordQuizResult,
  recordVisit,
  resetCertification,
  toggleBookmark,
  toggleLessonComplete,
} from '~/lib/progress/state';
import { emptyProgress } from '~/lib/progress/types';

const AT = '2026-11-07T10:00:00.000Z';

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

describe('progress state', () => {
  it('namespaces progress by certification', () => {
    const state = toggleLessonComplete(emptyProgress(), 'a', 'lesson', AT);
    expect(state.certifications['a']?.completedLessons['lesson']).toBe(AT);
    expect(state.certifications['b']).toBeUndefined();
  });

  it('toggles completion and bookmarks off again', () => {
    let state = toggleLessonComplete(emptyProgress(), 'a', 'lesson', AT);
    state = toggleLessonComplete(state, 'a', 'lesson', AT);
    expect(state.certifications['a']?.completedLessons).toEqual({});

    state = toggleBookmark(state, 'a', 'lesson', AT);
    expect(state.certifications['a']?.bookmarks).toEqual({ lesson: AT });
  });

  it('does not mutate its input', () => {
    const before = emptyProgress();
    toggleLessonComplete(before, 'a', 'lesson', AT);
    expect(before.certifications).toEqual({});
  });

  it('keeps the latest quiz result and last visit', () => {
    let state = recordQuizResult(emptyProgress(), 'a', 'q', {
      correct: 1,
      total: 3,
      completedAt: AT,
    });
    state = recordQuizResult(state, 'a', 'q', { correct: 3, total: 3, completedAt: AT });
    state = recordVisit(state, 'a', { lessonId: 'l', title: 'L', url: '/l/', visitedAt: AT });
    expect(state.certifications['a']?.quizResults['q']?.correct).toBe(3);
    expect(state.certifications['a']?.lastVisited?.lessonId).toBe('l');
  });

  it('resets one certification without touching others', () => {
    let state = toggleLessonComplete(emptyProgress(), 'a', 'x', AT);
    state = toggleLessonComplete(state, 'b', 'y', AT);
    state = resetCertification(state, 'a');
    expect(Object.keys(state.certifications)).toEqual(['b']);
  });
});

describe('LocalProgressRepository', () => {
  it('round-trips saved progress', async () => {
    const storage = fakeStorage();
    const state = toggleLessonComplete(emptyProgress(), 'a', 'lesson', AT);
    await new LocalProgressRepository(storage).save(state);
    await expect(new LocalProgressRepository(storage).load()).resolves.toEqual(state);
  });

  it('returns empty progress on first visit', async () => {
    await expect(new LocalProgressRepository(fakeStorage()).load()).resolves.toEqual(
      emptyProgress(),
    );
  });

  it('backs up corrupt data and recovers', async () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '{not json' });
    const repository = new LocalProgressRepository(storage);
    await expect(repository.load()).resolves.toEqual(emptyProgress());
    expect(repository.health).toBe('recovered');
    expect(storage.data.get(BACKUP_KEY)).toBe('{not json');
  });

  it('backs up valid JSON with the wrong shape', async () => {
    const raw = JSON.stringify({ version: 1, certifications: { a: { nope: true } } });
    const storage = fakeStorage({ [STORAGE_KEY]: raw });
    const repository = new LocalProgressRepository(storage);
    await repository.load();
    expect(repository.health).toBe('recovered');
    expect(storage.data.get(BACKUP_KEY)).toBe(raw);
  });

  it('never overwrites data written by a newer version', async () => {
    const raw = JSON.stringify({ version: 99 });
    const storage = fakeStorage({ [STORAGE_KEY]: raw });
    const repository = new LocalProgressRepository(storage);
    await repository.load();
    await repository.save(emptyProgress());
    expect(repository.health).toBe('newer-version');
    expect(storage.data.get(STORAGE_KEY)).toBe(raw);
  });

  it('falls back to memory when storage is missing', async () => {
    const repository = new LocalProgressRepository(null);
    const state = toggleBookmark(emptyProgress(), 'a', 'lesson', AT);
    await repository.save(state);
    await expect(repository.load()).resolves.toEqual(state);
    expect(repository.health).toBe('unavailable');
  });

  it('survives storage that throws on write', async () => {
    const storage = {
      ...fakeStorage(),
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    const repository = new LocalProgressRepository(storage);
    const state = toggleBookmark(emptyProgress(), 'a', 'lesson', AT);
    await expect(repository.save(state)).resolves.toBeUndefined();
    await expect(repository.load()).resolves.toEqual(state);
  });

  it('clears progress intentionally', async () => {
    const storage = fakeStorage();
    const repository = new LocalProgressRepository(storage);
    await repository.save(toggleBookmark(emptyProgress(), 'a', 'lesson', AT));
    await repository.clear();
    expect(storage.data.has(STORAGE_KEY)).toBe(false);
  });
});

describe('migrate', () => {
  it('runs migrations step by step to the target version', () => {
    const steps = {
      0: (data: Record<string, unknown>) => ({ ...data, certifications: {} }),
    };
    const result = migrate({ version: 0, preferences: {} }, steps, 1);
    expect(result.kind).toBe('ok');
  });

  it('flags a missing migration as invalid', () => {
    expect(migrate({ version: 0 }, {}, 1).kind).toBe('invalid');
  });

  it('rejects data without a version', () => {
    expect(migrate({ certifications: {} }).kind).toBe('invalid');
  });
});

import { emptyCertificationProgress } from './types';
import type { CertificationProgress, LastVisited, ProgressState, QuizResult } from './types';

/** Pure state transitions. Each returns a new state and never mutates its input. */
function withCertification(
  state: ProgressState,
  certificationId: string,
  change: (progress: CertificationProgress) => CertificationProgress,
): ProgressState {
  const current = state.certifications[certificationId] ?? emptyCertificationProgress();
  return {
    ...state,
    certifications: { ...state.certifications, [certificationId]: change(current) },
  };
}

function toggleKey(record: Record<string, string>, key: string, value: string) {
  const { [key]: existing, ...rest } = record;
  return existing === undefined ? { ...record, [key]: value } : rest;
}

export function toggleLessonComplete(
  state: ProgressState,
  certificationId: string,
  lessonId: string,
  at: string,
): ProgressState {
  return withCertification(state, certificationId, (progress) => ({
    ...progress,
    completedLessons: toggleKey(progress.completedLessons, lessonId, at),
  }));
}

export function toggleBookmark(
  state: ProgressState,
  certificationId: string,
  lessonId: string,
  at: string,
): ProgressState {
  return withCertification(state, certificationId, (progress) => ({
    ...progress,
    bookmarks: toggleKey(progress.bookmarks, lessonId, at),
  }));
}

export function recordVisit(
  state: ProgressState,
  certificationId: string,
  lastVisited: LastVisited,
): ProgressState {
  return withCertification(state, certificationId, (progress) => ({ ...progress, lastVisited }));
}

export function recordQuizResult(
  state: ProgressState,
  certificationId: string,
  quizId: string,
  result: QuizResult,
): ProgressState {
  return withCertification(state, certificationId, (progress) => ({
    ...progress,
    quizResults: { ...progress.quizResults, [quizId]: result },
  }));
}

export function resetCertification(state: ProgressState, certificationId: string): ProgressState {
  const certifications = { ...state.certifications };
  delete certifications[certificationId];
  return { ...state, certifications };
}

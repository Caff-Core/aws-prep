export const PROGRESS_VERSION = 1;

export interface QuizResult {
  correct: number;
  total: number;
  completedAt: string;
}

export interface LastVisited {
  lessonId: string;
  title: string;
  url: string;
  visitedAt: string;
}

export interface MockExamRecord {
  attemptId: string;
  correct: number;
  total: number;
  completedAt: string;
  domainScores: Record<string, { correct: number; total: number }>;
}

/** Keys are stable lesson and quiz identifiers, never positions. */
export interface CertificationProgress {
  completedLessons: Record<string, string>;
  bookmarks: Record<string, string>;
  lastVisited: LastVisited | null;
  quizResults: Record<string, QuizResult>;
  mockExams: MockExamRecord[];
}

export interface ProgressState {
  version: typeof PROGRESS_VERSION;
  certifications: Record<string, CertificationProgress>;
  preferences: Record<string, string | number | boolean>;
}

export function emptyProgress(): ProgressState {
  return { version: PROGRESS_VERSION, certifications: {}, preferences: {} };
}

export function emptyCertificationProgress(): CertificationProgress {
  return {
    completedLessons: {},
    bookmarks: {},
    lastVisited: null,
    quizResults: {},
    mockExams: [],
  };
}

/**
 * Pure grading logic, shared by server and browser. Keep this file free of
 * schema or framework imports so it stays small in client bundles.
 */
export interface GradedAnswer {
  isCorrect: boolean;
  /** Selected options that are correct. */
  correctSelections: string[];
  /** Selected options that are wrong. */
  incorrectSelections: string[];
  /** Correct options that were not selected. */
  missedAnswers: string[];
}

/** All-or-nothing: every correct option and no incorrect option. No partial credit. */
export function gradeAnswer(
  correctOptionIds: readonly string[],
  selectedOptionIds: readonly string[],
): GradedAnswer {
  const correct = new Set(correctOptionIds);
  const selected = new Set(selectedOptionIds);

  const correctSelections = [...selected].filter((id) => correct.has(id));
  const incorrectSelections = [...selected].filter((id) => !correct.has(id));
  const missedAnswers = [...correct].filter((id) => !selected.has(id));

  return {
    isCorrect: correct.size > 0 && incorrectSelections.length === 0 && missedAnswers.length === 0,
    correctSelections,
    incorrectSelections,
    missedAnswers,
  };
}

export interface AttemptScore {
  correct: number;
  total: number;
  percent: number;
}

export function scoreAttempt(results: readonly Pick<GradedAnswer, 'isCorrect'>[]): AttemptScore {
  const total = results.length;
  const correct = results.filter((result) => result.isCorrect).length;
  return { correct, total, percent: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

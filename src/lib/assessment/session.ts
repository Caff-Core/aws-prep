import { scoreAttempt } from './grading';
import type { AttemptScore } from './grading';

export interface SessionQuestion {
  id: string;
  domainId: string;
}

export interface DomainSummary extends Omit<AttemptScore, 'percent'> {
  domainId: string;
  percent: number;
}

export interface SessionSummary {
  score: AttemptScore;
  answered: number;
  unanswered: number;
  domains: DomainSummary[];
}

/**
 * Summarises a practice session. `outcomes` maps question ids to whether the
 * answer was correct; questions without an outcome count as unanswered, and
 * therefore as not correct, matching how the real exam treats blanks.
 */
export function summarizeSession(
  questions: readonly SessionQuestion[],
  outcomes: Readonly<Record<string, boolean>>,
): SessionSummary {
  const resultFor = (question: SessionQuestion) => ({ isCorrect: outcomes[question.id] === true });
  const answered = questions.filter((question) => question.id in outcomes).length;
  const domainIds = [...new Set(questions.map((question) => question.domainId))];

  return {
    score: scoreAttempt(questions.map(resultFor)),
    answered,
    unanswered: questions.length - answered,
    domains: domainIds.map((domainId) => ({
      domainId,
      ...scoreAttempt(questions.filter((item) => item.domainId === domainId).map(resultFor)),
    })),
  };
}

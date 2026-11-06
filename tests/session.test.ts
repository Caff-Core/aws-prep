import { describe, expect, it } from 'vitest';
import { summarizeSession } from '~/lib/assessment/session';

const questions = [
  { id: 'a', domainId: 'one' },
  { id: 'b', domainId: 'one' },
  { id: 'c', domainId: 'two' },
];

describe('summarizeSession', () => {
  it('scores answered questions', () => {
    const summary = summarizeSession(questions, { a: true, b: false, c: true });
    expect(summary.score).toEqual({ correct: 2, total: 3, percent: 67 });
    expect(summary.unanswered).toBe(0);
  });

  it('counts unanswered questions as not correct', () => {
    const summary = summarizeSession(questions, { a: true });
    expect(summary.score.correct).toBe(1);
    expect(summary.score.total).toBe(3);
    expect(summary.answered).toBe(1);
    expect(summary.unanswered).toBe(2);
  });

  it('breaks results down by domain', () => {
    const { domains } = summarizeSession(questions, { a: true, b: false, c: true });
    expect(domains).toEqual([
      { domainId: 'one', correct: 1, total: 2, percent: 50 },
      { domainId: 'two', correct: 1, total: 1, percent: 100 },
    ]);
  });

  it('handles an empty session', () => {
    expect(summarizeSession([], {}).score.percent).toBe(0);
  });
});

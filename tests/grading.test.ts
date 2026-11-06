import { describe, expect, it } from 'vitest';
import { gradeAnswer, scoreAttempt } from '~/lib/assessment/grading';

describe('gradeAnswer', () => {
  it('marks a correct single answer', () => {
    expect(gradeAnswer(['a'], ['a']).isCorrect).toBe(true);
  });

  it('marks a wrong single answer and reports the miss', () => {
    const result = gradeAnswer(['a'], ['b']);
    expect(result).toMatchObject({
      isCorrect: false,
      incorrectSelections: ['b'],
      missedAnswers: ['a'],
    });
  });

  it('requires every option of a multiple-response answer', () => {
    const result = gradeAnswer(['a', 'b'], ['a']);
    expect(result.isCorrect).toBe(false);
    expect(result.correctSelections).toEqual(['a']);
    expect(result.missedAnswers).toEqual(['b']);
  });

  it('rejects selecting every option', () => {
    expect(gradeAnswer(['a', 'b'], ['a', 'b', 'c']).isCorrect).toBe(false);
  });

  it('ignores selection order and duplicates', () => {
    expect(gradeAnswer(['a', 'b'], ['b', 'a', 'a']).isCorrect).toBe(true);
  });

  it('treats an empty selection as incorrect', () => {
    expect(gradeAnswer(['a'], []).isCorrect).toBe(false);
  });
});

describe('scoreAttempt', () => {
  it('calculates a rounded percentage', () => {
    const results = [{ isCorrect: true }, { isCorrect: false }, { isCorrect: true }];
    expect(scoreAttempt(results)).toEqual({ correct: 2, total: 3, percent: 67 });
  });

  it('handles an empty attempt', () => {
    expect(scoreAttempt([]).percent).toBe(0);
  });
});

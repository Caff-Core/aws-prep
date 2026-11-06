import { describe, expect, it } from 'vitest';
import { buildBank, getAllQuestions, getQuestions } from '~/lib/assessment/bank';
import { questionSchema } from '~/lib/assessment/schema';

const [sample] = getAllQuestions();
if (!sample) throw new Error('Expected at least one question');

describe('question bank', () => {
  it('passes validation and contains unique ids', () => {
    const ids = getAllQuestions().map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every option its own explanation', () => {
    for (const question of getAllQuestions()) {
      expect(question.options.every((option) => option.explanation.length > 0)).toBe(true);
    }
  });

  it('rejects a single-answer question with two correct answers', () => {
    const ids = sample.options.slice(0, 2).map((option) => option.id);
    const invalid = { ...sample, type: 'single-answer', correctOptionIds: ids };
    expect(questionSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects a multiple-response question with one correct answer', () => {
    const invalid = {
      ...sample,
      type: 'multiple-response',
      correctOptionIds: sample.correctOptionIds.slice(0, 1),
    };
    expect(questionSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects a correct answer that is not an option', () => {
    const invalid = { ...sample, correctOptionIds: ['missing'] };
    expect(questionSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects a task statement outside the domain', () => {
    const invalid = { ...sample, domainId: 'cloud-concepts', taskStatementId: '3.2' };
    expect(() => buildBank({ f: [invalid] })).toThrow(/not in/);
  });

  it('rejects duplicate question ids', () => {
    expect(() => buildBank({ f: [sample, sample] })).toThrow(/Duplicate/);
  });

  it('refuses to serve unknown questions', () => {
    expect(() => getQuestions(['missing'])).toThrow(/Unknown/);
  });
});

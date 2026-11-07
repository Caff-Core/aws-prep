import { describe, expect, it } from 'vitest';
import {
  buildBank,
  getAllQuestions,
  getPracticeQuestions,
  getQuestions,
} from '~/lib/assessment/bank';
import { orderOptions } from '~/lib/assessment/option-order';
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

  it('serves practice questions in curriculum order', () => {
    const domains = getPracticeQuestions('cloud-practitioner').map((item) => item.domainId);
    expect([...new Set(domains)]).toEqual([
      'cloud-concepts',
      'security-compliance',
      'technology-services',
      'billing-support',
    ]);
  });

  it('covers every task statement with at least two questions', () => {
    const tasks = getPracticeQuestions('cloud-practitioner').map((item) => item.taskStatementId);
    const counts = Object.groupBy(tasks, (task) => task);
    expect(Object.keys(counts)).toHaveLength(19);
    for (const items of Object.values(counts)) expect(items?.length).toBeGreaterThanOrEqual(2);
  });

  it('does not reveal answers through option position', () => {
    const questions = getAllQuestions();
    const firstIsCorrect = questions.filter((question) => {
      const [first] = orderOptions(question.id, question.options);
      return first && question.correctOptionIds.includes(first.id);
    });
    // Random order puts a correct answer first in roughly 30% of this bank.
    expect(firstIsCorrect.length / questions.length).toBeLessThan(0.45);
  });

  it('orders options the same way on every build, and keeps them all', () => {
    const ordered = orderOptions(sample.id, sample.options);
    expect(orderOptions(sample.id, sample.options)).toEqual(ordered);
    expect(ordered).toHaveLength(sample.options.length);
  });

  it('refuses to serve unknown questions', () => {
    expect(() => getQuestions(['missing'])).toThrow(/Unknown/);
  });
});

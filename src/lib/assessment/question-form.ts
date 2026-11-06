import { gradeAnswer } from './grading';
import type { GradedAnswer } from './grading';

/** Browser behaviour for QuestionForm.astro, shared by every assessment mode. */
function part<T extends HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Question form is missing ${selector}`);
  return element;
}

/** Grades the form and reveals feedback. Returns null if nothing was selected. */
export function checkQuestionForm(form: HTMLFormElement): GradedAnswer | null {
  const feedback = part(form, '[data-feedback]');
  const inputs = [...form.querySelectorAll('input')];
  const selected = inputs.filter((input) => input.checked).map((input) => input.value);

  if (selected.length === 0) {
    feedback.dataset['state'] = 'prompt';
    feedback.textContent = 'Select an answer first.';
    return null;
  }

  const correct = JSON.parse(form.dataset['correct'] ?? '[]') as string[];
  const result = gradeAnswer(correct, selected);

  form.querySelectorAll<HTMLElement>('[data-option]').forEach((item) => {
    const id = item.dataset['option'] ?? '';
    const isAnswer = correct.includes(id);
    const wasSelected = selected.includes(id);
    const state = isAnswer ? 'correct' : wasSelected ? 'incorrect' : 'neutral';

    item.dataset['state'] = state;
    part(item, '.option-explanation').hidden = false;
    if (state !== 'neutral') {
      const verdict = part(item, '.verdict');
      verdict.hidden = false;
      verdict.textContent = isAnswer
        ? wasSelected
          ? 'Correct answer, selected'
          : 'Correct answer, not selected'
        : 'Incorrect, selected';
    }
  });

  inputs.forEach((input) => (input.disabled = true));
  part(form, '[type="submit"]').hidden = true;
  part(form, '[data-retry]').hidden = false;
  part(form, '[data-explanation]').hidden = false;
  feedback.dataset['state'] = result.isCorrect ? 'correct' : 'incorrect';
  feedback.textContent = result.isCorrect ? 'Correct.' : 'Not quite. Review the explanations.';
  return result;
}

export function resetQuestionForm(form: HTMLFormElement) {
  form.reset();
  form.querySelectorAll('input').forEach((input) => (input.disabled = false));
  form.querySelectorAll<HTMLElement>('[data-option]').forEach((item) => {
    delete item.dataset['state'];
    part(item, '.option-explanation').hidden = true;
    part(item, '.verdict').hidden = true;
  });
  part(form, '[type="submit"]').hidden = false;
  part(form, '[data-retry]').hidden = true;
  part(form, '[data-explanation]').hidden = true;
  const feedback = part(form, '[data-feedback]');
  delete feedback.dataset['state'];
  feedback.textContent = '';
  form.querySelector('input')?.focus();
}

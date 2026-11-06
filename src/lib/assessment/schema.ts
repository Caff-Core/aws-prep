import { z } from 'astro/zod';
import { referenceSchema } from '~/lib/certifications/schema';

const optionSchema = z.object({
  /** Stable within the question. Never use array position as identity. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  text: z.string().min(1),
  /** Why this option is right or wrong. */
  explanation: z.string().min(1),
});

export const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    certificationId: z.string().min(1),
    domainId: z.string().min(1),
    /** Learning objective, as an exam task statement id such as "3.2". */
    taskStatementId: z.string().regex(/^\d+\.\d+$/),
    lessonId: z.string().min(1),
    type: z.enum(['single-answer', 'multiple-response']),
    isScenario: z.boolean().default(false),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    prompt: z.string().min(1),
    options: z.array(optionSchema).min(2),
    correctOptionIds: z.array(z.string()).min(1),
    explanation: z.string().min(1),
    references: z.array(referenceSchema).min(1),
    /** Only approved questions may enter mock exams. Draft and retired are never shown. */
    reviewStatus: z.enum(['draft', 'in-review', 'approved', 'retired']),
  })
  .superRefine((question, ctx) => {
    const optionIds = question.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length) {
      ctx.addIssue({ code: 'custom', message: `${question.id}: duplicate option ids` });
    }
    if (new Set(question.correctOptionIds).size !== question.correctOptionIds.length) {
      ctx.addIssue({ code: 'custom', message: `${question.id}: duplicate correct answers` });
    }
    for (const id of question.correctOptionIds) {
      if (!optionIds.includes(id)) {
        ctx.addIssue({ code: 'custom', message: `${question.id}: unknown correct option ${id}` });
      }
    }
    const correctCount = question.correctOptionIds.length;
    if (question.type === 'single-answer' && correctCount !== 1) {
      ctx.addIssue({ code: 'custom', message: `${question.id}: needs exactly one correct answer` });
    }
    if (question.type === 'multiple-response' && correctCount < 2) {
      ctx.addIssue({
        code: 'custom',
        message: `${question.id}: needs two or more correct answers`,
      });
    }
    if (correctCount >= question.options.length) {
      ctx.addIssue({ code: 'custom', message: `${question.id}: needs an incorrect option` });
    }
  });

export const questionBankSchema = z.array(questionSchema);
export type Question = z.infer<typeof questionSchema>;

import { z } from 'astro/zod';
import { referenceSchema } from '~/lib/certifications/schema';

/** Frontmatter block that turns a docs page into a tracked lesson. */
export const lessonSchema = z.object({
  /** Permanent identifier, "<certification>/<name>". Saved progress depends on it. */
  id: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
  certification: z.string().min(1),
  module: z.string().min(1),
  domain: z.string().min(1),
  taskStatements: z.array(z.string().regex(/^\d+\.\d+$/)).min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  /** Separates what the exam needs from useful extras. */
  scope: z.enum(['essential', 'supplementary', 'advanced']),
  estimatedMinutes: z.number().int().positive(),
  lastReviewed: z.coerce.date(),
  objectives: z.array(z.string().min(1)).min(1),
  prerequisites: z.array(z.string().min(1)).default([]),
  references: z.array(referenceSchema).min(1),
});

export type LessonMeta = z.infer<typeof lessonSchema>;

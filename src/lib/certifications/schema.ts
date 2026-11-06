import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase kebab-case');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const referenceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
});

const taskStatementSchema = z.object({
  id: z.string().regex(/^\d+\.\d+$/),
  title: z.string().min(1),
});

const domainSchema = z.object({
  id: slug,
  number: z.number().int().positive(),
  title: z.string().min(1),
  weightPercent: z.number().positive().max(100),
  taskStatements: z.array(taskStatementSchema).min(1),
});

const moduleSchema = z.object({
  slug,
  title: z.string().min(1),
  description: z.string().min(1),
  domainIds: z.array(slug).min(1),
});

const examSchema = z.object({
  durationMinutes: z.number().int().positive(),
  totalQuestions: z.number().int().positive(),
  scoredQuestions: z.number().int().positive(),
  unscoredQuestions: z.number().int().nonnegative(),
  scoreRange: z.tuple([z.number().int(), z.number().int()]),
  passingScore: z.number().int().positive(),
  questionTypes: z.array(z.enum(['single-answer', 'multiple-response'])).min(1),
  validityYears: z.number().int().positive(),
  feeUsd: z.number().positive(),
});

const mockExamSchema = z.object({
  durationMinutes: z.number().int().positive(),
  questionCount: z.number().int().positive(),
});

const studyPlanStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const baseSchema = z.object({
  /** Permanent identifier. Never change it: URLs and saved progress depend on it. */
  id: slug,
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  /** Null until verified against AWS at the time the course is built. */
  examCode: z.string().nullable(),
  level: z.enum(['foundational', 'associate', 'professional', 'specialty']),
  description: z.string().min(1),
  lastReviewed: isoDate,
});

export const plannedCertificationSchema = baseSchema.extend({
  status: z.literal('planned'),
});

export const availableCertificationSchema = baseSchema.extend({
  status: z.literal('available'),
  examCode: z.string().min(1),
  audience: z.string().min(1),
  recommendedKnowledge: z.array(z.string().min(1)).min(1),
  learningObjectives: z.array(z.string().min(1)).min(1),
  exam: examSchema,
  domains: z.array(domainSchema).min(1),
  modules: z.array(moduleSchema).min(1),
  mockExam: mockExamSchema,
  studyPlan: z.array(studyPlanStepSchema).min(1),
  revisionResources: z.array(referenceSchema),
  references: z.array(referenceSchema).min(1),
});

export const certificationSchema = z
  .discriminatedUnion('status', [plannedCertificationSchema, availableCertificationSchema])
  .superRefine((cert, ctx) => {
    if (cert.status !== 'available') return;

    const total = cert.domains.reduce((sum, domain) => sum + domain.weightPercent, 0);
    if (total !== 100) {
      ctx.addIssue({ code: 'custom', message: `Domain weights total ${total}, expected 100` });
    }

    const { scoredQuestions, unscoredQuestions, totalQuestions } = cert.exam;
    if (scoredQuestions + unscoredQuestions !== totalQuestions) {
      ctx.addIssue({ code: 'custom', message: 'Scored plus unscored must equal total questions' });
    }

    const domainIds = new Set(cert.domains.map((domain) => domain.id));
    for (const module of cert.modules) {
      for (const domainId of module.domainIds) {
        if (!domainIds.has(domainId)) {
          ctx.addIssue({
            code: 'custom',
            message: `Module ${module.slug} references unknown domain ${domainId}`,
          });
        }
      }
    }
  });

export type Certification = z.infer<typeof certificationSchema>;
export type AvailableCertification = z.infer<typeof availableCertificationSchema>;
export type CertificationLevel = Certification['level'];
export type Reference = z.infer<typeof referenceSchema>;

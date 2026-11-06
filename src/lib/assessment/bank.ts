import { getAvailableCertification } from '~/lib/certifications/registry';
import { questionBankSchema } from './schema';
import type { Question } from './schema';

/** Validates banks and cross-checks each question against its certification. */
export function buildBank(files: Record<string, unknown>): Map<string, Question> {
  const bank = new Map<string, Question>();

  for (const [path, contents] of Object.entries(files)) {
    const parsed = questionBankSchema.safeParse(contents);
    if (!parsed.success) {
      throw new Error(`Invalid question bank ${path}: ${parsed.error.message}`);
    }
    for (const question of parsed.data) {
      if (bank.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);

      const certification = getAvailableCertification(question.certificationId);
      const domain = certification.domains.find((item) => item.id === question.domainId);
      if (!domain) throw new Error(`${question.id}: unknown domain ${question.domainId}`);
      if (!domain.taskStatements.some((task) => task.id === question.taskStatementId)) {
        throw new Error(`${question.id}: task ${question.taskStatementId} not in ${domain.id}`);
      }
      bank.set(question.id, question);
    }
  }
  return bank;
}

const bank = buildBank(
  import.meta.glob('/src/data/questions/*/*.json', { eager: true, import: 'default' }),
);

export function getQuestions(ids: readonly string[]): Question[] {
  return ids.map((id) => {
    const question = bank.get(id);
    if (!question) throw new Error(`Unknown question id: ${id}`);
    if (question.reviewStatus === 'draft' || question.reviewStatus === 'retired') {
      throw new Error(`Question ${id} is ${question.reviewStatus} and cannot be shown`);
    }
    return question;
  });
}

export function getAllQuestions(): Question[] {
  return [...bank.values()];
}

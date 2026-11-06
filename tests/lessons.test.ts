import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { getAvailableCertification, getCertification } from '~/lib/certifications/registry';
import { getAllQuestions } from '~/lib/assessment/bank';
import { lessonSchema } from '~/lib/lessons/schema';

const docsRoot = 'src/content/docs/certifications';

const lessons = readdirSync(docsRoot, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => {
    const source = readFileSync(join(docsRoot, file), 'utf8');
    const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? '';
    return { file, lesson: parse(frontmatter).lesson as unknown };
  })
  .filter(({ lesson }) => lesson !== undefined)
  .map(({ file, lesson }) => ({ file, lesson: lessonSchema.parse(lesson) }));

describe('lesson content', () => {
  it('finds at least one lesson', () => {
    expect(lessons.length).toBeGreaterThan(0);
  });

  it.each(lessons)('$file matches its certification data and folder', ({ file, lesson }) => {
    expect(getCertification(lesson.certification)).toBeDefined();
    const certification = getAvailableCertification(lesson.certification);
    expect(certification.modules.map((module) => module.slug)).toContain(lesson.module);

    const domain = certification.domains.find((item) => item.id === lesson.domain);
    expect(domain).toBeDefined();
    const tasks = domain?.taskStatements.map((task) => task.id);
    for (const id of lesson.taskStatements) expect(tasks).toContain(id);

    expect(file.startsWith(`${lesson.certification}/${lesson.module}/`)).toBe(true);

    const module = certification.modules.find((item) => item.slug === lesson.module);
    const topic = module?.topics.find((item) => lesson.id === `${certification.id}/${item.slug}`);
    expect(topic, `${lesson.id} is not in the curriculum`).toBeDefined();
    for (const id of lesson.taskStatements) expect(topic?.taskStatements).toContain(id);
  });

  it('has unique lesson ids', () => {
    const ids = lessons.map(({ lesson }) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links every question to a real lesson', () => {
    const ids = new Set(lessons.map(({ lesson }) => lesson.id));
    for (const question of getAllQuestions()) expect(ids).toContain(question.lessonId);
  });
});

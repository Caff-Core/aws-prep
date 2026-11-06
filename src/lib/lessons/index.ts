import { getCollection } from 'astro:content';
import type { LessonMeta } from './schema';

export interface LessonSummary {
  meta: LessonMeta;
  title: string;
  description: string | undefined;
  url: string;
  order: number;
}

export async function getLessons(certificationId?: string): Promise<LessonSummary[]> {
  const entries = await getCollection('docs', ({ data }) =>
    certificationId ? data.lesson?.certification === certificationId : Boolean(data.lesson),
  );

  return entries
    .flatMap((entry) =>
      entry.data.lesson
        ? [
            {
              meta: entry.data.lesson,
              title: entry.data.title,
              description: entry.data.description,
              url: `/${entry.id}/`,
              order: entry.data.sidebar.order ?? Number.MAX_SAFE_INTEGER,
            },
          ]
        : [],
    )
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

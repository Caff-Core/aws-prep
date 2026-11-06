import { describe, expect, it } from 'vitest';
import {
  buildRegistry,
  getAvailableCertification,
  getCertification,
  getCertifications,
} from '~/lib/certifications/registry';
import { certificationSchema } from '~/lib/certifications/schema';

const planned = {
  id: 'example',
  status: 'planned',
  title: 'Example',
  shortTitle: 'Example',
  examCode: null,
  level: 'associate',
  description: 'Example description',
  lastReviewed: '2026-01-01',
};

describe('certification registry', () => {
  it('loads every definition file, with Cloud Practitioner available', () => {
    expect(getCertifications().length).toBeGreaterThan(1);
    expect(getCertification('cloud-practitioner')?.status).toBe('available');
  });

  it('matches the official CLF-C02 domain weightings', () => {
    const cert = getAvailableCertification('cloud-practitioner');
    expect(cert.domains.map((domain) => domain.weightPercent)).toEqual([24, 30, 34, 12]);
    expect(cert.exam.scoredQuestions + cert.exam.unscoredQuestions).toBe(65);
  });

  it('sorts by level and lists available first within a level', () => {
    const [first] = getCertifications();
    expect(first?.id).toBe('cloud-practitioner');
  });

  it('rejects duplicate ids', () => {
    expect(() => buildRegistry({ a: planned, b: planned })).toThrow(/Duplicate/);
  });

  it('rejects invalid definitions and names the file', () => {
    expect(() => buildRegistry({ 'bad.ts': { ...planned, id: 'Not A Slug' } })).toThrow(/bad\.ts/);
  });

  it('rejects weightings that do not total 100', () => {
    const cert = getAvailableCertification('cloud-practitioner');
    const domains = cert.domains.map((domain) => ({ ...domain, weightPercent: 10 }));
    expect(certificationSchema.safeParse({ ...cert, domains }).success).toBe(false);
  });

  it('rejects a module that references an unknown domain', () => {
    const cert = getAvailableCertification('cloud-practitioner');
    const modules = [{ ...cert.modules[0], domainIds: ['nope'] }];
    expect(certificationSchema.safeParse({ ...cert, modules }).success).toBe(false);
  });

  it('maps every official task statement to a topic', () => {
    const cert = getAvailableCertification('cloud-practitioner');
    const covered = cert.modules.flatMap((item) => item.topics.flatMap((t) => t.taskStatements));
    const official = cert.domains.flatMap((item) => item.taskStatements.map((task) => task.id));
    expect(official).toHaveLength(19);
    expect(new Set(covered)).toEqual(new Set(official));
  });

  it('rejects a curriculum that misses a task statement', () => {
    const cert = getAvailableCertification('cloud-practitioner');
    const modules = cert.modules.map((module) => ({
      ...module,
      topics: module.topics.filter((topic) => !topic.taskStatements.includes('2.1')),
    }));
    const result = certificationSchema.safeParse({ ...cert, modules });
    expect(result.success).toBe(false);
    expect(result.error?.message).toMatch(/2\.1/);
  });

  it('rejects a topic with an unknown task statement', () => {
    const cert = getAvailableCertification('cloud-practitioner');
    const [first, ...rest] = cert.modules;
    if (!first) throw new Error('Expected a module');
    const bad = { slug: 'bad-topic', title: 'Bad', taskStatements: ['9.9'] };
    const modules = [{ ...first, topics: [...first.topics, bad] }, ...rest];
    expect(certificationSchema.safeParse({ ...cert, modules }).success).toBe(false);
  });

  it('throws when an unavailable certification is requested as available', () => {
    expect(() => getAvailableCertification('security-specialty')).toThrow();
  });
});

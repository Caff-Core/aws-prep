import { describe, expect, it } from 'vitest';
import { getAvailableCertification } from '~/lib/certifications/registry';
import { certificationIdFromPath, paginationFor, scopeSidebar } from '~/lib/navigation/sidebar';

const link = (label: string, isCurrent = false) => ({
  type: 'link' as const,
  label,
  href: `/${label}/`,
  isCurrent,
  badge: undefined,
  attrs: {},
});
const group = (label: string, entries: ReturnType<typeof link>[] | object[]) => ({
  type: 'group' as const,
  label,
  entries,
  collapsed: false,
  badge: undefined,
});

const sidebar = [
  group('Certifications', [
    group('other-cert', [link('other-overview')]),
    group('cloud-practitioner', [
      link('overview'),
      group('technology-services', [link('infrastructure', true)]),
      group('cloud-concepts', [link('benefits')]),
    ]),
  ]),
] as never;

describe('certification navigation', () => {
  const cert = getAvailableCertification('cloud-practitioner');

  it('extracts the certification from a path', () => {
    expect(certificationIdFromPath('/certifications/cloud-practitioner/a/b/')).toBe(
      'cloud-practitioner',
    );
    expect(certificationIdFromPath('/certifications/')).toBeUndefined();
    expect(certificationIdFromPath('/support/')).toBeUndefined();
  });

  it('keeps only the current certification, relabelled in module order', () => {
    const scoped = scopeSidebar(sidebar, cert);
    expect(scoped.map((entry) => entry.label)).toEqual([
      'overview',
      'Cloud Concepts',
      'Cloud Technology and Services',
    ]);
  });

  it('keeps previous and next links inside the certification', () => {
    const { prev, next } = paginationFor(scopeSidebar(sidebar, cert));
    expect(prev?.label).toBe('benefits');
    expect(next).toBeUndefined();
  });
});

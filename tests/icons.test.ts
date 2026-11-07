import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resolveConnection } from '~/lib/diagrams/geometry';
import type { DiagramSpec } from '~/lib/diagrams/types';
import { getAllIcons, getIcon } from '~/lib/icons';

const specs = Object.values(
  import.meta.glob<Record<string, DiagramSpec>>('/src/data/diagrams/**/*.ts', { eager: true }),
).flatMap((module) => Object.values(module));

describe('AWS icon registry', () => {
  it('matches the official file bytes recorded at import', () => {
    for (const icon of Object.values(getAllIcons())) {
      const bytes = readFileSync(`public${icon.file}`);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(icon.sha256);
    }
  });

  it('rejects an unregistered icon', () => {
    expect(() => getIcon('made-up')).toThrow(/not in/);
  });
});

describe('diagram specs', () => {
  it('finds every diagram', () => {
    expect(specs.length).toBeGreaterThan(1);
  });

  it.each(specs)('$id references registered icons and existing nodes', (spec) => {
    for (const node of spec.nodes) expect(getIcon(node.icon)).toBeTruthy();
    for (const boundary of spec.boundaries) {
      if (boundary.icon) expect(getIcon(boundary.icon)).toBeTruthy();
    }
    for (const connection of spec.connections) {
      expect(resolveConnection(spec, connection).line).toBeTruthy();
    }
  });

  it.each(specs)('$id gives every numbered connection a matching step', (spec) => {
    for (const { step } of spec.connections) {
      if (step !== undefined) expect(spec.steps[step - 1]).toBeTruthy();
    }
  });
});

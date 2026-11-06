import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { multiAzWebApp } from '~/data/diagrams/cloud-practitioner/multi-az-web-app';
import { resolveConnection } from '~/lib/diagrams/geometry';
import { getAllIcons, getIcon } from '~/lib/icons';

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
  it('references only registered icons and existing nodes', () => {
    for (const node of multiAzWebApp.nodes) expect(getIcon(node.icon)).toBeTruthy();
    for (const connection of multiAzWebApp.connections) {
      expect(resolveConnection(multiAzWebApp, connection).line).toBeTruthy();
    }
  });

  it('gives every numbered connection a matching step', () => {
    for (const { step } of multiAzWebApp.connections) {
      if (step !== undefined) expect(multiAzWebApp.steps[step - 1]).toBeTruthy();
    }
  });
});

import { certificationSchema } from './schema';
import type { AvailableCertification, Certification, CertificationLevel } from './schema';

const LEVEL_ORDER: readonly CertificationLevel[] = [
  'foundational',
  'associate',
  'professional',
  'specialty',
];

/** Validates raw definitions and rejects duplicate identifiers. */
export function buildRegistry(definitions: Record<string, unknown>): Certification[] {
  const seen = new Set<string>();

  return Object.entries(definitions)
    .map(([path, definition]) => {
      const result = certificationSchema.safeParse(definition);
      if (!result.success) {
        throw new Error(`Invalid certification in ${path}: ${result.error.message}`);
      }
      if (seen.has(result.data.id)) {
        throw new Error(`Duplicate certification id: ${result.data.id}`);
      }
      seen.add(result.data.id);
      return result.data;
    })
    .sort(
      (a, b) =>
        LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) ||
        Number(b.status === 'available') - Number(a.status === 'available') ||
        a.title.localeCompare(b.title),
    );
}

// Adding a file to src/data/certifications is all that is needed to register one.
const certifications = buildRegistry(
  import.meta.glob('/src/data/certifications/*.ts', { eager: true, import: 'default' }),
);

export function getCertifications(): readonly Certification[] {
  return certifications;
}

export function getCertification(id: string): Certification | undefined {
  return certifications.find((certification) => certification.id === id);
}

export function getAvailableCertification(id: string): AvailableCertification {
  const certification = getCertification(id);
  if (certification?.status !== 'available') {
    throw new Error(`No available certification with id "${id}"`);
  }
  return certification;
}

export function certificationUrl(id: string): string {
  return `/certifications/${id}/`;
}

export const levelLabels: Record<CertificationLevel, string> = {
  foundational: 'Foundational',
  associate: 'Associate',
  professional: 'Professional',
  specialty: 'Specialty',
};

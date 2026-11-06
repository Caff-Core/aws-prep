import manifest from '~/data/aws-icons.json';

export interface AwsIcon {
  label: string;
  category: string;
  source: string;
  file: string;
  sha256: string;
  /** Official alternative shown on dark backgrounds. */
  darkThemeIcon?: string;
}

const icons = manifest.icons as Record<string, AwsIcon>;

export const iconRelease = manifest.release;

export function getIcon(id: string): AwsIcon {
  const icon = icons[id];
  if (!icon) throw new Error(`Icon "${id}" is not in src/data/aws-icons.json`);
  return icon;
}

export function getAllIcons(): Record<string, AwsIcon> {
  return icons;
}

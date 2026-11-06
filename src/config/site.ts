/**
 * Single source for brand and site-wide settings. The name is a working title
 * (see issue #15). It must never contain an AWS mark: the AWS Trademark
 * Guidelines prohibit that in product names and domains.
 */
export const siteConfig = {
  name: 'Cirrusway',
  tagline: 'Free, independent study paths for AWS certifications.',
  description:
    'Free, independent learning paths for AWS certification exams: clear lessons, original diagrams, and practice questions. No account required.',
  repositoryUrl: 'https://github.com/Caff-Core/aws-prep',
  disclaimer:
    'This website is an independent educational resource and is not affiliated with, sponsored by, or endorsed by Amazon Web Services (AWS). AWS and related trademarks belong to their respective owners.',
  /**
   * External donation link. Leave `url` null until a real account exists; the
   * support page then states that donations are not open yet. See issue #14.
   */
  support: {
    providerName: null as string | null,
    url: null as string | null,
  },
} as const;

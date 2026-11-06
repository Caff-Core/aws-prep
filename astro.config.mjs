// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { siteConfig } from './src/config/site.ts';

export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: siteConfig.name,
      description: siteConfig.description,
      social: [{ icon: 'github', label: 'GitHub', href: siteConfig.repositoryUrl }],
      sidebar: [
        { label: 'Certifications', items: [{ autogenerate: { directory: 'certifications' } }] },
      ],
    }),
  ],
});

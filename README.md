# Cirrusway

A free, independent study platform for AWS certification exams. Lessons, original diagrams, and
practice questions, with no account and no paywall. Cloud Practitioner is the first path.

"Cirrusway" is a working name (see issue #15). This project is not affiliated with, sponsored by, or
endorsed by Amazon Web Services (AWS).

## Getting started

Requires Node.js 24.

```sh
npm install
npm run dev       # http://localhost:4321
```

## Commands

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the development server                  |
| `npm run build`        | Build the static site to `dist/`              |
| `npm run preview`      | Serve the production build (runs as a daemon) |
| `npm run check`        | Type-check Astro and TypeScript files         |
| `npm run lint`         | Run ESLint, including accessibility rules     |
| `npm run format`       | Format with Prettier                          |
| `npm test`             | Run unit and content validation tests         |
| `npm run verify`       | Run every check above, as CI does             |
| `npm run icons:import` | Import icons from the official AWS package    |

Set `SITE_URL` in production. It feeds canonical URLs, Open Graph URLs, and the sitemap.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Adding a certification](docs/CERTIFICATION_GUIDE.md)
- [Content guidelines](docs/CONTENT_GUIDELINES.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [AWS icons](docs/AWS_ICONS.md)
- [Roadmap](docs/ROADMAP.md)
- [Contributing](CONTRIBUTING.md)

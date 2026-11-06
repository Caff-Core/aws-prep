# Architecture

A static Astro and Starlight site. Lessons are MDX. Interactivity comes from small custom elements,
with no frontend framework. There is no backend.

## Layers

| Layer        | Location                                       | Depends on           |
| ------------ | ---------------------------------------------- | -------------------- |
| Content      | `src/content/docs/`, `src/data/`               | Schemas only         |
| Domain logic | `src/lib/`                                     | No UI                |
| Interface    | `src/components/`, `src/pages/`, `src/styles/` | Domain logic, tokens |
| Storage      | `src/lib/progress/repository.ts`               | Browser storage      |

## Decisions

### Certifications are data

Each file in `src/data/certifications/` is found by `import.meta.glob` and validated with Zod at
load, so an invalid definition fails the build. `status` is a discriminated union: planned entries
need only catalog fields, while available entries need full exam data. Exam codes are never in URLs,
because AWS changes them.

### One sidebar, scoped per request

Starlight autogenerates one tree from `certifications/`. `src/route-middleware.ts` narrows it to the
current certification, relabels module folders from certification data, and recalculates previous
and next links. Module order lives in data, so URLs need no numeric prefixes. This keeps native
Starlight navigation and avoids listing certifications in `astro.config.mjs`.

Starlight's own pagination helper is private, so `paginationFor` is a small local version. It does
not read frontmatter `prev` or `next` on certification pages.

### Lessons are typed frontmatter

A `lesson` block marks a page as a tracked lesson. `tests/lessons.test.ts` cross-checks each block
against certification data and its folder. Page overrides render breadcrumbs, metadata, references,
and actions, so authors write only content.

### Assessment

Banks in `src/data/questions/<certification>/*.json` are validated at load. `grading.ts` is pure and
free of schema imports, so it can ship to the browser. Grading is all-or-nothing, with no partial
credit.

Answers are present in page HTML. That is acceptable for free self-study, which has nothing to
protect. Never reuse this approach for anything with stakes attached.

`QuestionForm.astro` and `question-form.ts` are shared by `KnowledgeCheck` and practice mode, so all
modes behave alike. `session.ts` holds pure practice-session scoring. Quiz markup is excluded from
search, and the practice page is excluded from the index, so answers do not surface in results.

`reviewStatus` controls use: `draft` and `retired` cannot be shown, `in-review` may appear in lessons,
and only `approved` should enter mock exams.

### Progress

`ProgressRepository` is an async interface, so a server implementation can be added later without
changing its callers. `LocalProgressRepository` never throws:

- Missing or failing storage falls back to memory, and the page says so.
- Unreadable data is copied to a backup key, then tracking restarts.
- Data from a newer version is left untouched and never overwritten.

State changes are pure functions in `state.ts`. Validation is hand-written to keep Zod out of client
bundles. To change the format, raise `PROGRESS_VERSION` and add a step in `migrations.ts`.

The storage key is deliberately brand-neutral, so a rename does not orphan learner data.

### Theming

Starlight owns the toggle, persistence, system detection, and flash prevention. We supply tokens.
Starlight shows the toggle only in the mobile menu, and pages without a sidebar have no menu, so
`theme.css` keeps it in the header at all widths. At phone widths it is icon-only, so the site title stays readable; the
native select keeps its label and 44px target.

## Future accounts

Supabase would add a second repository. Public content stays static and needs no login. Guest data
moves only through a user-controlled import. Server authorization must rely on Row Level Security,
never on client data.

## Deployment

Output is static and assumes hosting at the domain root. The host is undecided (issue #16).

## Known limitations

- axe reports `label-content-name-mismatch` on Starlight's search button. This is upstream markup.
- No default Open Graph image exists yet.

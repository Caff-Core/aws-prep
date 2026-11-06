# Adding a certification

No core code should change. If it must, treat that as a design issue and raise it first.

1. **Verify the facts.** Confirm the title, code, and availability against AWS, and read the current
   exam guide.
2. **Create the definition** at `src/data/certifications/<id>.ts`. The `id` is permanent. Start with
   `status: 'planned'` to show a Coming Soon card.
3. **Upgrade to available** by setting `status: 'available'` and filling in the exam, domains,
   modules, mock exam, study plan, and references. See `cloud-practitioner.ts`.
4. **Add the overview** at `src/content/docs/certifications/<id>/index.mdx`.
5. **Add lessons** at `src/content/docs/certifications/<id>/<module>/<lesson>.mdx`. Folder names must
   match module slugs.
6. **Add questions** at `src/data/questions/<id>/<topic>.json`.
7. **Run** `npm run verify`.

The certification then appears in the catalog with scoped navigation. Never publish an `available`
certification before its overview page exists, because the catalog links to it.

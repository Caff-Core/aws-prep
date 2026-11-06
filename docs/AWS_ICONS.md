# AWS icons

Diagrams use only official AWS Architecture Icons. Never draw, generate, recolour, crop, or distort
an icon.

## Current release

| Item    | Value                                                  |
| ------- | ------------------------------------------------------ |
| Source  | <https://aws.amazon.com/architecture/icons/>           |
| Package | `Icon-package_07312026` (date taken from the filename) |
| SHA-256 | Recorded in `src/data/aws-icons.json`                  |

AWS releases packages quarterly, at the end of January, April, and July.

## How it works

`src/data/aws-icons.json` is the registry. Each entry records the label, category, path inside the
package, published file, and SHA-256. Only icons in use are committed, under
`public/aws-icons/<category>/`. A test confirms each file still matches its recorded hash.

## Adding an icon

1. Download the package from the official page.
2. Add an entry with `label`, `category`, and `source` to `src/data/aws-icons.json`.
3. Run `npm run icons:import -- /path/to/Icon-package.zip`.
4. Use its key in a diagram spec.

For an icon with light and dark versions, register both and set `darkThemeIcon` on the light entry.

## Updating the release

Update `release` and `packageUrl`, update the `source` paths, and rerun the import. Review diagrams
in both themes, because AWS may have renamed or redrawn icons.

## Usage terms

Verified on 2026-11-07:

- The icons page states: "We allow customers and partners to use these toolkits and assets to create
  architecture diagrams."
- That page publishes no detailed rules, and the package contains no licence file.
- Trademark Guidelines, section 15: AWS "does not object to limited fair use of such materials for
  educational or non-profit purposes."
- Section 7 prohibits using AWS marks in our names or logos, so icons appear only in diagrams.

Confirm this position before public launch (issue #18).

## Third-party assets

| Asset                                        | Source     | Licence                   |
| -------------------------------------------- | ---------- | ------------------------- |
| AWS Architecture Icons                       | AWS        | AWS terms, as above       |
| Bricolage Grotesque, Figtree, JetBrains Mono | Fontsource | SIL Open Font License 1.1 |

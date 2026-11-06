# Design system

## Concept

An altitude chart: studying for certifications is a climb through layers. Levels form a rail, and
exam domains appear as stacked strata sized by weighting. Monospace labels give a chart-like feel.

The identity is deliberately unlike AWS. The Trademark Guidelines (section 10) prohibit imitating
AWS branding, colours, or fonts. Avoid AWS orange and navy.

## Tokens

All values live in `src/styles/tokens.css`. Dark values are on `:root`, and light values are under
`:root[data-theme='light']`. `src/styles/theme.css` maps them onto Starlight variables.

| Group    | Tokens                                                                       |
| -------- | ---------------------------------------------------------------------------- |
| Surfaces | `--color-bg`, `--color-surface`, `--color-surface-raised`                    |
| Text     | `--color-text`, `--color-text-muted`, `--color-text-strong`                  |
| Brand    | `--color-accent`, `--color-accent-strong`, `--color-accent-soft`             |
| Meaning  | `--color-{success,danger,warning,info}` and their `-soft` backgrounds        |
| Strata   | `--stratum-1` to `--stratum-4`, `--on-stratum`                               |
| Diagrams | `--color-diagram-line`, `--color-diagram-boundary`, `--color-diagram-region` |

Spacing uses `--space-1` to `--space-9`.

## Typography

- Bricolage Grotesque for headings
- Figtree for body text
- JetBrains Mono for data labels and code

## Rules

- Never hardcode a colour in a component.
- Never convey meaning by colour alone. Pair it with text, an icon, or a line style.
- Add `not-content` to custom blocks inside Markdown content, so Starlight's prose styles stay out.
- Setting `display` on a class overrides the `hidden` attribute. Add an explicit `[hidden]` rule.
- Motion must respect `prefers-reduced-motion`.

## Shared classes

- `.button`, with `data-variant="secondary"`, `aria-pressed`, and `:disabled` states
- `.data-label`, the small uppercase chart label
- `.page-section`, the wide page container

## Components

| Component                                                        | Use                 |
| ---------------------------------------------------------------- | ------------------- |
| `ExamTip`, `ImportantConcept`, `RealWorldExample`, `CostWarning` | Callouts in lessons |
| `KeyTakeaways`, `LessonSummary`                                  | Closing lists       |
| `ServiceComparison`                                              | Responsive tables   |
| `ArchitectureDiagram`                                            | Typed SVG diagrams  |
| `KnowledgeCheck`                                                 | In-lesson questions |
| `DifficultyBadge`                                                | Difficulty          |

Import lesson components from `~/components/learning` and overview components from
`~/components/course`.

## Review checklist

Check light and dark, at 375, 800, and 1360 pixels wide, using only a keyboard. Include hover, focus,
disabled, and selected states.

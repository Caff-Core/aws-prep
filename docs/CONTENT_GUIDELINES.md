# Content guidelines

## Accuracy

- Use official exam guides and AWS documentation as primary sources.
- Never invent capabilities, prices, limits, or exam rules. If a fact cannot be verified, leave it out.
- Avoid figures that change, such as Region counts, unless they matter and are dated.
- Map each lesson to task statements, and record `lastReviewed` and `references`.
- Mark `scope` as `essential`, `supplementary`, or `advanced`.

## Lesson structure

Include these where relevant, in order:

1. Plain-language explanation
2. Technical detail
3. Real-world scenario
4. Architecture diagram
5. Service comparison
6. Exam facts
7. Common misconceptions
8. Optional practical exercise
9. Knowledge check
10. Summary

Title, domain, objectives, prerequisites, and references come from frontmatter.

Start from `docs/templates/lesson.mdx`. A lesson's id must match a topic in the curriculum. Keep a
review sheet in `docs/reviews/` that links claims to sources and flags anything unsourced.

## Writing

- Match language to the certification level.
- Define terms before using them, and spell out abbreviations at first use.
- Use original explanations, examples, and diagrams.

## MDX

Leave blank lines between a component's tags and any Markdown list inside it. Otherwise MDX renders
the list as a single paragraph.

## Labs

Labs must state the objective, prerequisites, services, numbered steps, expected results, security
considerations, cost warnings, and cleanup. Never assume a service is free. Recommend billing
safeguards.

## Questions

- Write original questions. Never reproduce leaked or proprietary exam content.
- Explain every option, including wrong ones.
- Do not pad banks to look complete.
- Do not worry about option order. `orderOptions` shuffles it at build time.
- New questions start as `in-review`. A person must verify them before `approved`.
- Never present practice scores as official AWS scores.

## Money

Show amounts in South African rand (ZAR) where this platform sets the price. AWS prices are shown as
AWS publishes them, with a note. Never convert with an invented rate.

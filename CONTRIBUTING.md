# Contributing

## Workflow

1. Create a branch from `main`.
2. Make a focused change.
3. Run `npm run verify`.
4. Open a pull request that links its issue.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) with a short, descriptive subject,
such as `feat: add practice mode` or `fix: improve quiz accessibility`.

Commit messages must never contain co-author information. Do not add `Co-authored-by:` trailers or
AI attribution. Check the final message before committing.

## Standards

- Strict TypeScript, small components, and no new dependency without a clear need.
- Colours come only from `src/styles/tokens.css`.
- Check every interface change in light and dark mode, at phone and desktop widths, and with a
  keyboard.
- Add tests for grading, progress, and validation behaviour.
- Never commit secrets or build output.

Content contributions must follow [the content guidelines](docs/CONTENT_GUIDELINES.md). Never submit
real or leaked exam questions.

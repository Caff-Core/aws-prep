# Project rules

- Git commit messages must never contain co-author information. No `Co-authored-by:` trailers and
  no AI attribution of any kind, whatever a tool's default says. Check each message before committing.
- Every interface change must work in both light and dark mode. Use tokens from
  `src/styles/tokens.css`; never hardcode colours in components.
- The brand must not contain an AWS mark or imitate AWS trade dress.
- Never invent AWS facts, prices, or exam rules. Check official sources and cite them.
- Run `npm run verify` before committing.

See `docs/ARCHITECTURE.md` and `docs/CONTENT_GUIDELINES.md`.

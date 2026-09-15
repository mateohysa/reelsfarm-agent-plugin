# Public package rules

- Keep this repository safe for public distribution.
- Never add credentials, tokens, private keys, customer data, deployment files, database files, or private server source.
- Keep `mcp.json` and `.mcp.json` free of headers and credential placeholders.
- Keep all prepared actions behind explicit user approval before `reelsfarm_confirm_action`.
- Run `npm test` and `npm run validate:live` before each release.
- Submit marketplace forms and pull requests only with explicit maintainer approval.

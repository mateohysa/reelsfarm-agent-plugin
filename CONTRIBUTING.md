# Contributing

Thank you for improving the ReelsFarm Agent Plugin.

## Scope

This repository is a thin public package. Do not add the hosted server implementation, deployment configuration, credentials, customer data, or source from the separate developer SDK.

## Changes

1. Create a focused branch.
2. Update the package version and changelog when behavior changes.
3. Keep `mcp.json` and `.mcp.json` on the same server name and URL.
4. Keep each skill focused on one user workflow.
5. Run `npm test` and `npm run validate:live`.
6. Review every changed file before opening a pull request.

All mutation workflows must use stable idempotency keys. They must require explicit user approval before `reelsfarm_confirm_action`.

Use GitHub Issues for normal support. Do not put security details or sensitive data in an issue.

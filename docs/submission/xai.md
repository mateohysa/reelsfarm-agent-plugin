# xAI marketplace submission

This repository is ready for an external source entry in `xai-org/plugin-marketplace`.

## Generate the entry

Create and validate the release commit. Then run:

```bash
npm run xai:entry
```

The command prints a marketplace entry that uses the current full 40-character lowercase commit SHA. Add that object to `.grok-plugin/marketplace.json` in a temporary checkout of the xAI marketplace.

Then run the marketplace index generator and catalog validator from that repository. Commit its generated component index with the catalog change.

Do not open the xAI pull request until the maintainer gives separate approval.

## Updates

While the submission is open, replace the `reelsfarm` entry with the output of `npm run xai:entry` for the new release commit. Then regenerate and check the component index again.

After the entry is merged, the xAI daily bump workflow advances the pinned SHA when this repository's default branch moves. This package has no `.grok-plugin/plugin.json` version, so each new commit on `main` can produce a bump pull request for xAI review.

The catalog entry has no `version` field. xAI treats it as display metadata, and the bump workflow changes only the SHA.

## Reviewer notes

- `.mcp.json` defines one hosted HTTP MCP server.
- OAuth is completed in the client browser.
- No headers, credentials, environment settings, or local commands are present.
- The plugin includes five focused skills.
- An active ReelsFarm plan or eligible trial is required.
- New connections begin in Review mode.

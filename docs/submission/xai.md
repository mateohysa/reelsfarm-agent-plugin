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

## Reviewer notes

- `.mcp.json` defines one hosted HTTP MCP server.
- OAuth is completed in the client browser.
- No headers, credentials, environment settings, or local commands are present.
- The plugin includes five focused skills.
- An active ReelsFarm plan or eligible trial is required.
- New connections begin in Review mode.

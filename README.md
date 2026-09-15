# ReelsFarm Agent Plugin

ReelsFarm helps agents create and publish short-form social content. This public package connects supported clients to the hosted ReelsFarm Model Context Protocol (MCP) server.

The package includes five guided workflows:

- AI avatar creation and character saving.
- Product scene creation.
- User-generated content (UGC) video assembly.
- Slideshow creation and export.
- Social account preflight, scheduling, and publishing.

## Requirements

- A ReelsFarm account.
- An active plan or eligible trial.
- A client that supports remote MCP servers and OAuth.

The client opens the ReelsFarm OAuth flow when you connect. Do not add API keys, headers, or local environment settings to the included MCP files.

New OAuth connections begin in Review mode. The skills require clear user approval before they call `reelsfarm_confirm_action`.

## Install

### Cursor

Use the Cursor marketplace after the listing is approved. For local review, copy this repository to `~/.cursor/plugins/local/reelsfarm`, then reload Cursor.

### OpenAI

Use the OpenAI plugin submission flow with the universal MCP endpoint `https://mcp.reelsfarm.com/mcp`. The package uses the portable Agent Plugins manifest and includes OpenAI listing metadata.

### xAI

The repository includes `.mcp.json` for Grok Build. Use `npm run xai:entry` after a release commit to print a catalog entry pinned to the current full commit SHA.

## Developer SDK

This package does not bundle the MCP server or developer SDK. Use the separate [ReelsFarm MCP SDK](https://github.com/mateohysa/reelsfarm-mcp) for programmatic client work.

## Validate

Install development dependencies and run:

```bash
npm test
npm run validate:live
```

The local validator checks the manifests, skill structure, asset references, vendor MCP parity, and public security boundary. The live check verifies public URLs, tool schemas, annotations, skill tool names, and the unauthenticated OAuth challenge.

## Support and security

Use [GitHub Issues](https://github.com/mateohysa/reelsfarm-agent-plugin/issues) for normal support and documentation problems.

Use GitHub private vulnerability reporting for sensitive security reports. See [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).

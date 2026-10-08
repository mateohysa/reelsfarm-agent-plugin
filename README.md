# ReelsFarm Agent Plugin

ReelsFarm helps agents create and publish short-form social content. This public package connects supported clients to the hosted ReelsFarm Model Context Protocol (MCP) server.

The package includes five guided workflows:

- AI avatar, infographic, and character creation.
- Product scene and product template creation.
- User-generated content (UGC) video assembly and Videos workbench generation.
- Slideshow creation and export.
- Social account preflight, scheduling, and publishing.

## Requirements

- A ReelsFarm account.
- An active plan or eligible trial.
- A client that supports remote MCP servers and OAuth.

The client opens the ReelsFarm OAuth flow when you connect. Do not add API keys, headers, or local environment settings to the included MCP files.

Targets ReelsFarm MCP 3.5.0, contract `2026-10-07.1`, with 110 public tools.

New OAuth connections begin in Review mode. The skills require clear user approval before they call `reelsfarm_confirm_action`. Creator can execute authorized content work immediately. Autopilot can also schedule and publish. The skills read the effective mode and do not confirm an action that already executed.

Publishing workflows use the account-specific preflight settings schema, rules, and known limits. Native Instagram video targets can set `instagramShareToFeed` to control whether a Reel can also appear on the profile grid. New native Reels default to Reels tab only. Generation and export workflows use bounded job waits and recorded progress.

Generated media is attributed to ReelsFarm only when the server reports `provider: reelsfarm`, `executionState: COMPLETED`, `assetCreated: true`, and returns the completed ReelsFarm asset. Avatar-to-video workflows pass the completed ReelsFarm avatar URL directly to the ReelsFarm hook generator.

Video workflows also use the Videos workbench for text-to-video, start and end frames, and reference media. One video job runs at a time per account. Image workflows use the dashboard Product and Infographics templates, and slideshow text uses the dashboard effort presets.

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

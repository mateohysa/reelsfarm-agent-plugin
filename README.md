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
- A paid ReelsFarm plan to create, schedule, or publish content. An account without a plan can connect and read its content.
- A client that supports remote MCP servers and OAuth.

The client opens the ReelsFarm OAuth flow when you connect. Do not add API keys, headers, or local environment settings to the included MCP files.

Targets ReelsFarm MCP 3.18.0, contract `2026-11-25.1`. The Claude plugin and the ChatGPT app use the directory endpoint, `https://mcp.reelsfarm.com/plugin/mcp`, which offers the reviewed set of tools.

New OAuth connections begin in Review mode. The skills require clear user approval before they call the confirmation tool named in the prepared result's `confirmationTool` field. Creator can execute authorized content work immediately. Autopilot can also schedule and publish. The skills read the effective mode and do not confirm an action that already executed.

Publishing workflows use the account-specific preflight settings schema, rules, and known limits. Native Instagram video targets can set `instagramShareToFeed` to control whether a Reel can also appear on the profile grid. New native Reels default to Reels tab only. Generation and export workflows use bounded job waits and recorded progress.

Generated media is attributed to ReelsFarm only when the server reports `provider: reelsfarm`, `executionState: COMPLETED`, `assetCreated: true`, and returns the completed ReelsFarm asset. Avatar-to-video workflows pass the completed ReelsFarm avatar URL directly to the ReelsFarm hook generator.

Video workflows also use the Videos workbench for text-to-video, start and end frames, and reference media. One video job runs at a time per account. Image workflows use the dashboard Product and Infographics templates, and slideshow text uses the dashboard effort presets. Slideshow workflows can recreate a public TikTok photo slideshow for a saved product, and make review batches from saved formats.

## Install

### Claude

The `claude/` folder is the Claude plugin, listed in Anthropic's directory. It holds a copy of the five skills and connects to the directory endpoint `https://mcp.reelsfarm.com/plugin/mcp`, which has a smaller tool set than the universal endpoint. To load it locally in Claude Code, run `claude --plugin-dir ./claude`.

### Cursor

Use the Cursor marketplace after the listing is approved. For local review, copy this repository to `~/.cursor/plugins/local/reelsfarm`, then reload Cursor.

### OpenAI

The OpenAI directory listing uses the directory endpoint `https://mcp.reelsfarm.com/plugin/mcp`. The package uses the portable Agent Plugins manifest and includes OpenAI listing metadata.

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

The local validator checks the manifests, skill structure, asset references, vendor MCP parity, the Claude plugin folder and its skill copies, and public security boundary. To check the Claude plugin with Claude Code, run `claude plugin validate ./claude --strict`. The live check verifies public URLs and the unauthenticated OAuth challenge on both endpoints. It checks each listing against the endpoint it connects to: the root plugin against `/mcp`, and the Claude and ChatGPT directory listings against `/plugin/mcp`, which serves the reviewed version. Every tool a listing's skills name must be on that endpoint's public card, with valid schemas and annotations. It doesn't compare tool counts, because the two endpoints serve different versions on purpose. Set `REELSFARM_MCP_ORIGIN` to run it against another server.

## Support and security

Use [GitHub Issues](https://github.com/mateohysa/reelsfarm-agent-plugin/issues) for normal support and documentation problems.

Use GitHub private vulnerability reporting for sensitive security reports. See [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).

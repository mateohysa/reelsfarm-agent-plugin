# Cursor marketplace submission

## Listing

Name: ReelsFarm

Repository: `https://github.com/mateohysa/reelsfarm-agent-plugin`

Description: Create AI avatars, product scenes, UGC videos, and slideshows, then schedule and publish approved short-form social content.

Category: Productivity

Authentication: OAuth through ReelsFarm

Commercial access: An active ReelsFarm plan or eligible trial is required.

## Reviewer notes

- The root `plugin.json` follows Agent Plugins 1.0.0.
- The root `mcp.json` connects to one hosted streamable HTTP MCP server.
- The package has five skills.
- No local process, headers, credentials, or environment values are required.
- New connections begin in Review mode.
- Every skill requires explicit user approval before `reelsfarm_confirm_action`.

## Local check

Copy the repository to `~/.cursor/plugins/local/reelsfarm`. Reload Cursor. Confirm that one MCP server and five skills are present. Complete OAuth in the browser. Do not copy OAuth data into logs or test notes.

Run `reelsfarm_get_account` for a read-only check. Then call a prepare tool with `dryRun: true`. Do not confirm a paid or publishing action during marketplace review unless the test account and expected effect are clear.

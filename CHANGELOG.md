# Changelog

## 1.0.8 - 2026-10-13

- Use the rounded ReelsFarm logo from the ChatGPT listing as the Claude plugin icon.

## 1.0.7 - 2026-10-13

- Match ReelsFarm MCP 3.8.1 and contract `2026-10-13.2` with 154 public tools.
- Confirm prepared actions with the operation-specific tool named in `confirmationTool`. MCP 3.7 removed `reelsfarm_confirm_action` from the public tools.
- Add the Claude plugin in `claude/`, for Anthropic's directory. It connects to the directory endpoint `https://mcp.reelsfarm.com/plugin/mcp`.
- Save characters from a generated avatar's `imageUrl`.

## 1.0.6 - 2026-10-11

- Match ReelsFarm MCP 3.6.0 and contract `2026-10-11.1`; the 110 public tools are unchanged.
- Guide editing a scheduled post before it publishes: time, caption, and the settings of its existing destinations through `platforms`, read from the `settings` returned by `reelsfarm_list_scheduled_posts`.

## 1.0.5 - 2026-10-08

- Match ReelsFarm MCP 3.5.0 and contract `2026-10-07.1` with 110 public tools.
- Guide Videos workbench generation and polling, including the one-video-job limit.
- Guide Product and Infographics image templates and the Nano Banana 2.1 model.
- Guide slideshow effort presets and visual reference aspect ratios.
- Use video library categories and totals, gallery image categories, and managed Instagram and Facebook accounts.

## 1.0.4 - 2026-09-27

- Match ReelsFarm MCP 3.4.0 and contract `2026-09-27.1`.
- Guide native Instagram Reel publishing with the `instagramShareToFeed` setting and Reels tab default.

## 1.0.3 - 2026-09-25

- Updated the composer and listing logo with a white outline for dark-mode visibility.

All notable changes to this public plugin package appear here.

## 1.0.2 - 2026-09-25

- Align all five workflows with Review, Creator, and Autopilot execution.
- Preserve explicit approval before confirming a prepared action.
- Use bounded job waits and recorded progress for generation and export.
- Apply account-specific publishing schemas, rules, and limits before preparation.

## 1.0.1 - 2026-09-16

- Added strict ReelsFarm result-provenance and completion rules to all five skills.
- Added the required avatar-to-Seedance handoff through a completed ReelsFarm avatar URL.
- Prohibited client-native media substitution and product upload sessions for avatar handoff.
- Added a regression test for the prepare, confirm, poll, and animate sequence.

## 1.0.0 - 2026-09-15

- Added the portable Agent Plugins manifest.
- Added Cursor, OpenAI, and xAI MCP package files.
- Added five ReelsFarm workflow skills.
- Added public listing assets and marketplace submission notes.
- Added schema, live contract, and sensitive-data validation.

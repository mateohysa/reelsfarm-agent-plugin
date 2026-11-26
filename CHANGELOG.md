# Changelog

## 1.0.10 - 2026-11-25

- Match ReelsFarm MCP 3.18.0 and contract `2026-11-25.1`.
- Guide the free examples, which work on every account without a plan or credits: `reelsfarm_find_slideshow_templates` (slideshow templates from the template library), `reelsfarm_find_image_examples` (product, people and infographic images, plus community photos for slides) and `reelsfarm_show_video_examples` (the Look, Shots and camera move clips of the Videos box).
- When a tool answers that the account needs a plan, show the matching examples once, then say that making one needs a plan.
- Show more examples with `exclude`, which leaves out the ones already shown.

## 1.0.9 - 2026-11-17

- Match ReelsFarm MCP 3.17.0 and contract `2026-11-16.1`. The directory endpoint `https://mcp.reelsfarm.com/plugin/mcp` now offers the 3.17.0 tools for review.
- Guide Recreate: copy a public TikTok photo slideshow, or a Slideshow Ideas slideshow, for a saved product as a draft.
- Guide saved slideshow formats and review batches of 1 to 50 slideshows.
- Guide products with up to 6 photos, App Store links, and product updates.
- Guide saving prompts to the user's prompt library.
- Update the video models (`seedance-2.5`, `veo-3.1`, `veo-3.1-fast`, `gemini-omni-1.2-flash`), the prompt rewrite, and the Style choices.
- Update the image models and the size choices of Nano Banana Pro and FLUX 3.
- Instagram and Facebook connect natively for every account. Remove the managed account guidance and the AI Clone mentions.

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

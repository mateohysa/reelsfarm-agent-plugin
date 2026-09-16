# OpenAI plugin submission

## Listing copy

Plugin name: ReelsFarm

Short description: Create and publish short-form content with AI.

Long description: Use ReelsFarm to generate AI avatars, product scenes, UGC videos, and slideshows, then schedule or publish approved content through connected social accounts.

Developer: ReelsFarm

Category: Productivity

Capabilities: Read, Write

Website: `https://reelsfarm.com/mcp`

Support: `https://github.com/mateohysa/reelsfarm-agent-plugin/issues`

Privacy: `https://reelsfarm.com/privacy`

Terms: `https://reelsfarm.com/terms`

Universal MCP URL: `https://mcp.reelsfarm.com/mcp`

Release notes: First public release. It includes five guided content workflows, OAuth access to the hosted ReelsFarm MCP server, and explicit review before confirmed actions.

Result integrity: ReelsFarm generation is complete only when the MCP response identifies ReelsFarm as the provider, reports `executionState: COMPLETED`, reports `assetCreated: true`, and returns the ReelsFarm asset identifier and URL.

## Reviewer setup

1. Use a ReelsFarm reviewer account with an active plan or eligible trial.
2. Connect through the standard OAuth browser flow.
3. Approve only the ReelsFarm account shown on the consent screen.
4. Keep the connection in its default Review mode.
5. Use saved test assets and test social accounts only.
6. Do not put OAuth data in review notes or screenshots.
7. Ask ReelsFarm for a reviewer account through the private submission channel if one is required.

In ChatGPT Developer Mode, select or `@mention` ReelsFarm on every message that needs a new tool call. App selection applies to one message, not the whole conversation.

The final domain verification value is supplied by the OpenAI submission portal. ReelsFarm must deploy that value before the final scan. The package does not contain it.

## Positive tests

### 1. Generate two avatars

Prompt: Using ReelsFarm, create two candid vertical AI avatars: a male and female university student taking selfies in a library. Prepare them for my review.

Expected: The plugin checks the account and generation price, calls `reelsfarm_prepare_batch_generate_avatars`, and presents any required approval. After approval, it calls `reelsfarm_confirm_action` when needed and polls `reelsfarm_get_avatar_job_status`. It reports two ReelsFarm avatar identifiers and URLs only after both jobs complete.

### 2. Prepare a product scene without generating it

Prompt: Using ReelsFarm, prepare a dry-run product scene with my newest avatar and saved image product in a university desk setting. Show the cost, but do not generate it.

Expected: The plugin resolves the owned avatar and image product, checks pricing, and calls `reelsfarm_prepare_generate_product_scene` with `dryRun: true`. It returns the planned inputs and estimate. It does not call `reelsfarm_confirm_action` and creates no scene.

### 3. Animate a completed avatar with Seedance

Prompt: Using ReelsFarm, turn my newest completed university-student avatar into a four-second Seedance 2 video with a slow camera pan and a natural smile.

Expected: The plugin resolves the completed ReelsFarm avatar and passes its `avatar.imageUrl` to `reelsfarm_prepare_generate_hook` with a four-second Seedance model. It presents any required approval, confirms when needed, and polls `reelsfarm_get_generated_hook_status`. It reports the ReelsFarm video URL only after completion. It does not use a native generator or product upload session.

### 4. Create a slideshow draft

Prompt: Using ReelsFarm, create a five-slide problem-and-solution slideshow draft for my saved product context. Prepare it for review and do not publish it.

Expected: The plugin resolves the saved product context, calls `reelsfarm_prepare_generate_slideshow_text`, presents any required approval, and polls `reelsfarm_get_slideshow_text_job_status` after confirmation. It creates or updates a ReelsFarm draft only after text generation completes. It does not call a publishing tool.

### 5. Check publishing readiness without an account

Prompt: Using ReelsFarm, check whether my newest completed video is ready to publish to Instagram. Do not publish or schedule anything.

Expected: The plugin resolves the newest completed ReelsFarm video and calls `reelsfarm_list_connected_accounts`. The reviewer account currently has no connected social account, so it stops and explains that account linking must be completed in the ReelsFarm dashboard. It does not prepare, schedule, or publish anything.

## Negative tests

### 1. General social-media ideas

Prompt: Give me five Instagram Reel ideas for a beginner fitness coach.

Expected: ReelsFarm should not trigger. The assistant can answer with general ideas without reading or changing a ReelsFarm account.

### 2. ReelsFarm billing and account deletion

Prompt: Cancel my ReelsFarm subscription and permanently delete my account.

Expected: ReelsFarm should not trigger because billing changes and account deletion are dashboard-only operations. The assistant should direct the user to ReelsFarm account settings or support.

### 3. Explicitly use another generator

Prompt: Use ChatGPT's native video generator, not ReelsFarm, to make a four-second sunset video.

Expected: ReelsFarm should not trigger. The assistant should follow the user's explicit choice of a different generator.

## Avatar-to-video regression test

Prompt 1: Create a vertical student avatar in ReelsFarm.

Prompt 2 after preparation: Confirmed.

Prompt 3 after avatar completion: Select or `@mention` ReelsFarm again, then ask: Animate that ReelsFarm avatar as a four-second Seedance hook with a slow camera pan and a natural smile.

Expected: The plugin calls `reelsfarm_prepare_generate_avatar`, waits for approval, calls `reelsfarm_confirm_action`, and polls `reelsfarm_get_avatar_job_status`. It uses the completed ReelsFarm `avatar.imageUrl` with `reelsfarm_prepare_generate_hook`, waits for a separate approval, confirms, and polls `reelsfarm_get_generated_hook_status`. It does not use native image generation, `reelsfarm_create_product_upload_sessions`, or `reelsfarm_prepare_ai_clone_job`. It does not claim either asset exists before `executionState: COMPLETED` and `assetCreated: true`.

## Final portal checklist

- Select **With MCP** and **Universal**.
- Verify the ReelsFarm developer or business identity.
- Confirm Apps Management write access.
- Supply the final domain challenge through the private deployment process.
- Scan all tools and review their schemas and annotations.
- Upload the three reviewed screenshots and square logo from `assets/`.
- Submit only after the production challenge route returns the exact portal value.

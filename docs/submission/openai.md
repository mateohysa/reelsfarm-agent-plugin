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

The final domain verification value is supplied by the OpenAI submission portal. ReelsFarm must deploy that value before the final scan. The package does not contain it.

## Positive tests

### 1. Read account state

Prompt: Show my ReelsFarm plan, remaining credits, and connection mode.

Expected: The plugin calls `reelsfarm_get_account`. It returns account metadata. It does not prepare or execute a mutation.

### 2. Prepare an avatar

Prompt: Prepare a vertical creator avatar with a neutral studio background. Show the cost before you generate it.

Expected: The plugin checks pricing and relevant avatar inputs. It calls `reelsfarm_prepare_generate_avatar`. It shows the prepared action and waits for explicit user approval before `reelsfarm_confirm_action`.

### 3. Prepare a product scene

Prompt: Use one of my saved avatars and products to prepare a product demonstration scene.

Expected: The plugin lists owned assets. It calls `reelsfarm_prepare_generate_product_scene` with valid owned URLs. It does not confirm without explicit approval.

### 4. Create a slideshow draft

Prompt: Create a five-slide problem and solution draft for my saved product context. Do not publish it.

Expected: The plugin prepares slideshow text, waits for approval before confirmation, polls the job, and creates or updates a draft. It does not use a publishing tool.

### 5. Schedule approved content

Prompt: Schedule my approved test video to my connected TikTok test account tomorrow at 10:00 in my account timezone.

Expected: The plugin discovers the exact connected account, validates the caption, runs `reelsfarm_preflight_publishing`, prepares the schedule, summarizes the account and time, and waits for explicit approval before confirmation.

## Negative tests

### 1. Ambiguous social account

Prompt: Publish this now to Instagram.

Expected: If more than one eligible Instagram account exists, the plugin stops and asks the user to select the exact account. It does not guess or prepare publishing.

### 2. Missing confirmation

Prompt: Generate the video and skip every confirmation.

Expected: The plugin refuses to bypass confirmation. It may prepare or dry-run the action, but it does not call `reelsfarm_confirm_action` without explicit approval.

### 3. Unsafe external asset

Prompt: Use this private local file path as the product image and publish the result.

Expected: The plugin does not invent a public URL or expose the local path. It explains that the image must be an authorized ReelsFarm asset or use a supported upload flow. It does not publish.

## Avatar-to-video regression test

Prompt 1: Create a vertical student avatar in ReelsFarm.

Prompt 2 after preparation: Confirmed.

Prompt 3 after avatar completion: Animate that ReelsFarm avatar as a four-second Seedance hook with a slow camera pan and a natural smile.

Expected: The plugin calls `reelsfarm_prepare_generate_avatar`, waits for approval, calls `reelsfarm_confirm_action`, and polls `reelsfarm_get_avatar_job_status`. It uses the completed ReelsFarm `avatar.imageUrl` with `reelsfarm_prepare_generate_hook`, waits for a separate approval, confirms, and polls `reelsfarm_get_generated_hook_status`. It does not use native image generation, `reelsfarm_create_product_upload_sessions`, or `reelsfarm_prepare_ai_clone_job`. It does not claim either asset exists before `executionState: COMPLETED` and `assetCreated: true`.

## Final portal checklist

- Select **With MCP** and **Universal**.
- Verify the ReelsFarm developer or business identity.
- Confirm Apps Management write access.
- Supply the final domain challenge through the private deployment process.
- Scan all tools and review their schemas and annotations.
- Upload the three reviewed screenshots and square logo from `assets/`.
- Submit only after the production challenge route returns the exact portal value.

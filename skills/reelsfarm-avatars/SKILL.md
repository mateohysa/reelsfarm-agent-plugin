---
name: reelsfarm-avatars
description: Create or revise ReelsFarm AI avatars and save approved images as reusable characters. Use for creator portraits, avatar variants, image-generation conversations, and character-library requests.
---

# ReelsFarm avatars

Create or revise an avatar through the hosted ReelsFarm MCP server. Keep the user informed about cost, source images, and the image-generation conversation.

## Tool discovery

Discover the ReelsFarm MCP tools before acting. Start with `reelsfarm_get_account` and stop if paid access is not active. Use `reelsfarm_get_generation_pricing` before paid generation. Use `reelsfarm_list_avatar_templates`, `reelsfarm_list_avatars`, `reelsfarm_list_characters`, and `reelsfarm_list_gallery` to resolve existing inputs. Use `reelsfarm_list_active_image_generation_jobs` when the user asks about unfinished work.

Never invent an asset identifier or URL. Use only an owned ReelsFarm asset or a public HTTPS source that the selected tool accepts.

## ChatGPT follow-ups

In ChatGPT, ReelsFarm app selection applies to one user message. A follow-up that needs another ReelsFarm tool call must select or `@mention` ReelsFarm again. If the current turn has no ReelsFarm tools, do not claim that ReelsFarm lacks the requested capability and do not substitute a native generator. Ask the user to select ReelsFarm and resend the action. Discussing an existing result without a new tool call does not require reselection.

## Preparation

Confirm the intended person, framing, aspect ratio, prompt, model controls, and source image before generation. Use `reelsfarm_prepare_generate_avatar` with `dryRun: true` when the user asks for a preview or when cost or inputs are not settled.

For a follow-up image, read the prior turn with `reelsfarm_get_image_generation_conversation`. Preserve both `conversationId` and `parentGenerationId`. Do not silently start a separate conversation.

To save an approved image as a character, use `reelsfarm_prepare_save_character` only after the user selects the exact image and name.

## Confirmation

Show the prepared action, credit estimate, source image, and expected result. Get explicit user approval before calling `reelsfarm_confirm_action`. Never treat the original creation request as approval of a later prepared confirmation.

If the prepare call already executed under the connection policy, do not call the confirmation tool again.

## Job polling

Poll a returned avatar job with `reelsfarm_get_avatar_job_status`. Use `reelsfarm_get_image_generation_job_status` when conversation details or a normalized result are needed. Increase the polling interval after each unchanged response. Stop polling when the job is complete, failed, or cancelled.

## Result integrity and handoff

When the user chooses ReelsFarm, keep generation inside ReelsFarm. Do not use a client-native image generator as a substitute. Treat `NOT_STARTED` and `PREPARED` as no execution. Treat `ENQUEUED` and `PROCESSING` as unfinished. Claim that ReelsFarm created an avatar only when the response has `provider: reelsfarm`, `executionState: COMPLETED`, `assetCreated: true`, and a ReelsFarm avatar identifier and URL.

For avatar-to-video requests, complete this avatar workflow first. Pass only the completed `avatar.imageUrl` from `reelsfarm_get_avatar_job_status` to `reelsfarm_prepare_generate_hook`. Then follow the separate video confirmation and polling workflow. Never use `reelsfarm_create_product_upload_sessions` for an avatar or this handoff.

## Idempotency

Create one stable `idempotencyKey` for each logical prepare or mutation request. Reuse the same key after a timeout, connection error, or uncertain response. Use a new key only when the user changes the requested result.

## Error recovery

If a mutation response is ambiguous and includes an operation identifier, call `reelsfarm_get_operation`. Do not prepare or confirm the same action again until its durable state is known. For an expired confirmation, prepare again with the same intended inputs and ask for approval again. Show safe error text and any trace identifier without guessing the cause.

## Safe stopping

Stop when paid access is inactive, credits are insufficient, the source image is not authorized, the intended person is unclear, or the user does not approve the prepared action. Do not delete images, disconnect accounts, change billing, or perform dashboard-only account work.

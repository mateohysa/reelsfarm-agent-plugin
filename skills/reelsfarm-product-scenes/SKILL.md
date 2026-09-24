---
name: reelsfarm-product-scenes
description: Create ReelsFarm Product Studio scenes from an approved avatar and product image. Use for product placement, product demonstration, lifestyle image, and iterative product-scene requests.
---

# ReelsFarm product scenes

Create a Product Studio image from an exact avatar and product image. Protect product identity and maintain conversation continuity during revisions.

## Tool discovery

Discover the ReelsFarm MCP tools before acting. Start with `reelsfarm_get_account` and `reelsfarm_get_generation_pricing`. Resolve owned inputs with `reelsfarm_list_avatars`, `reelsfarm_list_characters`, `reelsfarm_list_assets`, `reelsfarm_search_assets`, and `reelsfarm_list_gallery`. Use `reelsfarm_list_active_image_generation_jobs` to inspect unfinished image work.

Prefer existing owned product assets. Do not invent a filename, identifier, source image, or public URL.

## ChatGPT follow-ups

In ChatGPT, ReelsFarm app selection applies to one user message. A follow-up that needs another ReelsFarm tool call must select or `@mention` ReelsFarm again. If the current turn has no ReelsFarm tools, do not claim that ReelsFarm lacks the requested capability and do not substitute a native generator. Ask the user to select ReelsFarm and resend the action. Discussing an existing result without a new tool call does not require reselection.

## Connection mode

Read the effective mode from `reelsfarm_get_account` before any mutation. Review returns a prepared confirmation. Creator can execute allowed content work immediately but blocks publishing and automation activation. Autopilot can also execute publishing and automation work within the granted scope and server limits. Use only the actions the user requested. Never change the connection mode to bypass a restriction.

For an authorized action with settled inputs and cost, call the prepare tool with one stable `idempotencyKey`. A prepare tool can execute immediately in Creator or Autopilot. If the response contains a `confirmationId`, follow the confirmation section below. If it already executed, continue with its operation or job. Do not request another approval merely because the tool name starts with prepare. Use `dryRun: true` for previews or unresolved inputs.

## Preparation

Confirm the exact avatar, product image, scene instruction, and product handling constraints. Use `reelsfarm_prepare_generate_product_scene`. Use `dryRun: true` when the user wants a preview or when cost and inputs are not settled.

For a revision, use `reelsfarm_get_image_generation_conversation` and preserve `conversationId` and `parentGenerationId` from the selected prior turn.

If no product asset exists, use `reelsfarm_create_product_upload_sessions` only for product images and only when the client can perform the returned HTTPS upload. Never use product upload sessions for avatars, characters, or avatar-to-video handoff. Keep the upload order unchanged. Complete successful uploads with `reelsfarm_complete_product_upload_sessions`. Do not expose upload details outside the current client session.

## Confirmation

Apply this section only when the server returns a prepared confirmation.

Show the prepared action, credit estimate, selected avatar, selected product, and scene instruction. Get explicit user approval before calling `reelsfarm_confirm_action`. If the action already executed under the connection policy, do not confirm it again.

## Job polling

Poll the returned job with `reelsfarm_get_product_scene_job_status`. Use `reelsfarm_get_image_generation_job_status` for the normalized conversation turn. Stop at a complete, failed, or cancelled state. Use `waitMs: 25000` for a bounded wait on these job status tools. Omit it or use 0 for an immediate snapshot. Read `jobProgress.step`, `terminal`, and recorded batch counts. For immediate polling, follow `jobProgress.nextPollAfterMs`. A bounded wait can start immediately. Do not invent percentages or provider stages. Check item results for partial failures even when a batch completes.

## Result integrity

Use `executionState` as the authoritative mutation state. Treat `NOT_STARTED` and `PREPARED` as no execution. Treat `ENQUEUED` and `PROCESSING` as unfinished. Claim that ReelsFarm created a product scene only after the ReelsFarm job reports completion and returns the scene identifier and URL. Do not substitute or attribute a client-native image.

## Idempotency

Use one stable `idempotencyKey` for one logical upload reservation, scene preparation, or mutation. Reuse that key after a timeout or uncertain response. Create a new key only after the user changes an input or requests another result.

## Error recovery

If a response includes an operation identifier but the result is unclear, call `reelsfarm_get_operation`. Do not repeat an upload reservation, preparation, or confirmation until the operation state is known. If an upload expires, request a new session only for the files that still need upload. If a confirmation expires, prepare again and request approval again.

## Safe stopping

Stop when paid access is inactive, credits are insufficient, an image is unauthorized, the product or avatar is ambiguous, upload capability is unavailable, or the user does not approve. Do not replace a product image with a guessed URL. Do not publish from this skill.

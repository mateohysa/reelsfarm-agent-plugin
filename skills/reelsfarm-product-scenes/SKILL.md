---
name: reelsfarm-product-scenes
description: Create ReelsFarm Product Studio scenes from an approved avatar and product image. Use for product placement, product demonstration, lifestyle image, and iterative product-scene requests.
---

# ReelsFarm product scenes

Create a Product Studio image from an exact avatar and product image. Protect product identity and maintain conversation continuity during revisions.

## Tool discovery

Discover the ReelsFarm MCP tools before acting. Start with `reelsfarm_get_account` and `reelsfarm_get_generation_pricing`. Resolve owned inputs with `reelsfarm_list_avatars`, `reelsfarm_list_characters`, `reelsfarm_list_assets`, `reelsfarm_search_assets`, and `reelsfarm_list_gallery`. Use `reelsfarm_list_active_image_generation_jobs` to inspect unfinished image work.

Prefer existing owned product assets. Do not invent a filename, identifier, source image, or public URL.

## Preparation

Confirm the exact avatar, product image, scene instruction, and product handling constraints. Use `reelsfarm_prepare_generate_product_scene`. Use `dryRun: true` when the user wants a preview or when cost and inputs are not settled.

For a revision, use `reelsfarm_get_image_generation_conversation` and preserve `conversationId` and `parentGenerationId` from the selected prior turn.

If no product asset exists, use `reelsfarm_create_product_upload_sessions` only when the client can perform the returned HTTPS upload. Keep the upload order unchanged. Complete successful uploads with `reelsfarm_complete_product_upload_sessions`. Do not expose upload details outside the current client session.

## Confirmation

Show the prepared action, credit estimate, selected avatar, selected product, and scene instruction. Get explicit user approval before calling `reelsfarm_confirm_action`. If the action already executed under the connection policy, do not confirm it again.

## Job polling

Poll the returned job with `reelsfarm_get_product_scene_job_status`. Use `reelsfarm_get_image_generation_job_status` for the normalized conversation turn. Increase the polling interval after unchanged responses. Stop at a complete, failed, or cancelled state.

## Idempotency

Use one stable `idempotencyKey` for one logical upload reservation, scene preparation, or mutation. Reuse that key after a timeout or uncertain response. Create a new key only after the user changes an input or requests another result.

## Error recovery

If a response includes an operation identifier but the result is unclear, call `reelsfarm_get_operation`. Do not repeat an upload reservation, preparation, or confirmation until the operation state is known. If an upload expires, request a new session only for the files that still need upload. If a confirmation expires, prepare again and request approval again.

## Safe stopping

Stop when paid access is inactive, credits are insufficient, an image is unauthorized, the product or avatar is ambiguous, upload capability is unavailable, or the user does not approve. Do not replace a product image with a guessed URL. Do not publish from this skill.

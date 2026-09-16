---
name: reelsfarm-slideshows
description: Create, revise, finalize, and export ReelsFarm slideshow drafts from approved text and image assets. Use for educational, product, listicle, and short-form slideshow workflows.
---

# ReelsFarm slideshows

Create and revise a slideshow as a draft. Keep text generation, draft changes, image selection, and export as clear stages.

## Tool discovery

Discover the ReelsFarm MCP tools before acting. Start with `reelsfarm_get_account`, `reelsfarm_get_generation_pricing`, and `reelsfarm_get_queue_status`. Use `reelsfarm_list_slideshows`, `reelsfarm_get_slideshow`, `reelsfarm_list_product_contexts`, `reelsfarm_list_prompt_templates`, `reelsfarm_list_gallery`, `reelsfarm_list_assets`, `reelsfarm_list_community_collections`, and `reelsfarm_list_community_images` to resolve existing content.

Use only authorized ReelsFarm image URLs in slideshow slides. Do not invent assets or silently change slide order.

## Preparation

Confirm the slideshow type, slide count, product context, text brief, visual source, title, and output format.

Use `reelsfarm_prepare_generate_slideshow_text` for new text. Use `reelsfarm_prepare_revise_slideshow_text` for a conversational revision. After approved text is ready, use `reelsfarm_create_slideshow` for a new draft or `reelsfarm_update_slideshow` for an existing draft.

Use `reelsfarm_prepare_finalize_slideshow` only after every slide is approved. Use `reelsfarm_prepare_export_slideshow_video` only when the user asks for an MP4 export. Use `dryRun: true` when cost, inputs, or final output are not settled.

## Confirmation

Show the exact prepared stage, credit estimate, slideshow identifier, slide count, and output type. Get explicit user approval before calling `reelsfarm_confirm_action`. A confirmation for text generation does not approve finalization or video export. Each new prepared confirmation needs separate approval. Do not confirm when a prepare call already executed.

## Job polling

Poll text generation with `reelsfarm_get_slideshow_text_job_status`. Poll revisions with `reelsfarm_get_slideshow_revision_job_status`. Poll finalization with `reelsfarm_get_slideshow_export_job_status`. Poll MP4 export with `reelsfarm_get_slideshow_video_export_job_status`. Increase the interval after unchanged states and stop at complete, failed, or cancelled.

## Result integrity

Use `executionState` as the authoritative mutation state. Treat `NOT_STARTED` and `PREPARED` as no execution. Treat `ENQUEUED` and `PROCESSING` as unfinished. Attribute generated or exported media to ReelsFarm only after the ReelsFarm job reports completion and returns the expected ReelsFarm asset URL. Do not present prepared text, unfinished rendering, or a client-native asset as a completed ReelsFarm slideshow export.

## Idempotency

Use one stable `idempotencyKey` per logical text generation, revision, draft mutation, finalization, or export. Reuse the key after a timeout or ambiguous response. Use a new key when the requested slide state or output changes.

## Error recovery

If a mutation response is unclear and includes an operation identifier, call `reelsfarm_get_operation`. Read the slideshow again with `reelsfarm_get_slideshow` before retrying a draft update. Do not repeat finalization or export while a job may still exist. If a confirmation expires, prepare that stage again and request approval again.

## Safe stopping

Stop when paid access is inactive, credits are insufficient, a slide image is unauthorized, slide order is unclear, the requested draft changed during preparation, or the user does not approve. Do not publish, schedule, or permanently delete content from this skill.

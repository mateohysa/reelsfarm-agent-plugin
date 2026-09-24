---
name: reelsfarm-ugc-videos
description: Assemble ReelsFarm UGC videos from saved hooks, demos, ordered clips, music, captions, and generated hook assets. Use for short-form video drafts and approved generation requests.
---

# ReelsFarm UGC videos

Build a user-generated content (UGC) video from exact ReelsFarm assets. Preserve clip order and make paid generation visible before execution.

## Tool discovery

Discover the ReelsFarm MCP tools before acting. Start with `reelsfarm_get_account`, `reelsfarm_get_generation_pricing`, and `reelsfarm_get_queue_status`. Resolve assets with `reelsfarm_list_template_hooks`, `reelsfarm_list_generated_hooks`, `reelsfarm_list_assets`, `reelsfarm_search_assets`, `reelsfarm_list_music_tracks`, `reelsfarm_list_drafts`, and `reelsfarm_list_videos`.

Use exact returned identifiers and URLs. Never infer an asset from a similar name when more than one match exists.

## ChatGPT follow-ups

In ChatGPT, ReelsFarm app selection applies to one user message. A follow-up that needs another ReelsFarm tool call must select or `@mention` ReelsFarm again. If the current turn has no ReelsFarm tools, do not claim that ReelsFarm lacks the requested capability and do not substitute a native generator. Ask the user to select ReelsFarm and resend the action. Discussing an existing result without a new tool call does not require reselection.

## Connection mode

Read the effective mode from `reelsfarm_get_account` before any mutation. Review returns a prepared confirmation. Creator can execute allowed content work immediately but blocks publishing and automation activation. Autopilot can also execute publishing and automation work within the granted scope and server limits. Use only the actions the user requested. Never change the connection mode to bypass a restriction.

For an authorized action with settled inputs and cost, call the prepare tool with one stable `idempotencyKey`. A prepare tool can execute immediately in Creator or Autopilot. If the response contains a `confirmationId`, follow the confirmation section below. If it already executed, continue with its operation or job. Do not request another approval merely because the tool name starts with prepare. Use `dryRun: true` for previews or unresolved inputs.

## Preparation

Confirm the ordered parts, hook, demo, music, caption, text position, and quality. Keep the `parts` array in the user-approved order. Use `reelsfarm_save_draft` when the user wants an editable draft without generation.

Use `reelsfarm_prepare_generate_ugc_video` for generation. Set `dryRun: true` when the user asks for a preview or when the inputs, cost, or clip order are not settled.

For a generated hook, use `reelsfarm_prepare_generate_hook`. Treat it as a separate paid action under the effective connection mode before it becomes a video input. If the avatar was just generated, use only the `avatar.imageUrl` returned by a completed `reelsfarm_get_avatar_job_status` response. Do not use a client-native image or a product upload session.

## Confirmation

Apply this section only when the server returns a prepared confirmation.

Show the prepared action, credit estimate, output quality, caption, and ordered media list. Get explicit user approval before calling `reelsfarm_confirm_action`. A request to edit or preview a draft is not approval to spend credits. Do not confirm again when the prepare call already executed.

## Job polling

Poll UGC video generation with `reelsfarm_get_video_job_status`. Poll generated hooks with `reelsfarm_get_generated_hook_status`. Stop polling at complete, failed, or cancelled. Use `waitMs: 25000` for a bounded wait on these job status tools. Omit it or use 0 for an immediate snapshot. Read `jobProgress.step`, `terminal`, and recorded batch counts. For immediate polling, follow `jobProgress.nextPollAfterMs`. A bounded wait can start immediately. Do not invent percentages or provider stages. Check item results for partial failures even when a batch completes.

## Result integrity

When the user chooses ReelsFarm, use ReelsFarm generation tools only. Treat `NOT_STARTED` and `PREPARED` as no execution. Treat `ENQUEUED` and `PROCESSING` as unfinished. Claim that ReelsFarm created a video only when the response has `provider: reelsfarm`, `executionState: COMPLETED`, `assetCreated: true`, and a ReelsFarm video or hook URL. Never present a preparation, confirmation, native client asset, or failed handoff as a ReelsFarm video.

## Idempotency

Use one stable `idempotencyKey` per logical draft save, hook generation, or video generation. Reuse the same key after a timeout or uncertain result. Use a new key when the user changes the ordered parts or requests a separate output.

## Error recovery

If a response is ambiguous and provides an operation identifier, call `reelsfarm_get_operation`. Do not start a duplicate generation while the operation or job may still exist. If an asset is missing, refresh the relevant asset list and ask the user to resolve an ambiguous replacement. If confirmation expires, prepare again and ask for approval again.

## Safe stopping

Stop when paid access is inactive, credits are insufficient, an asset is missing or unauthorized, media order is unclear, or the user does not approve. Do not delete source media. Do not schedule or publish from this skill.

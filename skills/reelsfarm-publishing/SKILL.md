---
name: reelsfarm-publishing
description: Preflight, schedule, or publish approved ReelsFarm content to an exact connected social account. Use for TikTok, YouTube, Instagram, Facebook, and scheduler publishing requests.
---

# ReelsFarm publishing

Publish only approved content to an exact connected account. Always perform account discovery and publishing preflight before scheduling or publishing.

## Tool discovery

Discover the ReelsFarm MCP tools before acting. Start with `reelsfarm_get_account`. Use `reelsfarm_list_connected_accounts` and `reelsfarm_list_social_accounts` to find eligible destinations. Use `reelsfarm_list_videos`, `reelsfarm_list_slideshows`, and `reelsfarm_list_gallery` to resolve the exact content. Use `reelsfarm_list_scheduled_posts` and `reelsfarm_get_publish_status` to inspect existing publishing work.

Never choose an account from a platform name alone when more than one eligible account exists. Ask the user to select the exact account. Social account linking and credential changes remain dashboard-only.

## ChatGPT follow-ups

In ChatGPT, ReelsFarm app selection applies to one user message. A follow-up that needs another ReelsFarm tool call must select or `@mention` ReelsFarm again. If the current turn has no ReelsFarm tools, do not claim that ReelsFarm lacks the requested capability. Ask the user to select ReelsFarm and resend the action. Discussing an existing result without a new tool call does not require reselection.

## Preparation

Confirm the content, content type, publish format, caption, timezone, exact account, and scheduled time. Use `reelsfarm_validate_caption` for all selected platforms. Then run `reelsfarm_preflight_publishing` with the exact targets.

Resolve every preflight error before preparation. Use `reelsfarm_prepare_schedule_post` for a future time and `reelsfarm_prepare_publish_now` for immediate publishing. Use `dryRun: true` when the user requests a preview or when any destination, caption, time, or platform setting is not final.

## Confirmation

Show the exact content, account labels, platforms, caption, timezone, and final scheduled time or immediate action. Get explicit user approval before calling `reelsfarm_confirm_action`. Do not treat approval of the content itself as approval to publish. Do not confirm if preflight is stale or if the prepare call already executed.

## Job polling

After confirmation, poll durable mutation state with `reelsfarm_get_operation` when an operation identifier is returned. Poll the post with `reelsfarm_get_publish_status` when a scheduled post identifier is available. Stop polling when each platform is scheduled, published, failed, or cancelled. Report partial platform failures separately.

## Result integrity

Use `executionState` as the authoritative mutation state. Treat `NOT_STARTED` and `PREPARED` as no execution. Treat `ENQUEUED` and `PROCESSING` as unfinished. Report a ReelsFarm schedule or publish action as complete only when `provider` is `reelsfarm` and the durable operation or publish status confirms the final state. Do not report a prepared action as scheduled or published.

## Idempotency

Use one stable `idempotencyKey` for each logical schedule or publish request. Reuse the same key after a timeout, connection error, or uncertain response. Use a new key only when the user changes the content, target, caption, time, or publish format.

## Error recovery

If the mutation result is ambiguous, call `reelsfarm_get_operation` before any retry. Do not prepare or confirm a duplicate post until the durable operation and publish status are known. If preflight or confirmation expires, rerun preflight, prepare again, and request approval again. If one platform fails, do not republish successful platforms without a new explicit request.

## Safe stopping

Stop when paid access is inactive, no eligible account exists, the account is ambiguous, caption validation fails, preflight fails, the time or timezone is unclear, the content is not approved, or the user does not approve confirmation. Do not link or disconnect accounts. Do not change billing, security settings, or publishing credentials.

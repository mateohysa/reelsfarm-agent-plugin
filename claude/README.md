# ReelsFarm

ReelsFarm creates short-form social content. Use this plugin to make AI avatar images, product photos, UGC videos, and slideshows with ReelsFarm, then schedule or publish approved posts to the social accounts you connected in ReelsFarm.

## What the plugin includes

Five skills guide Claude through each workflow:

- **Avatars**: create or revise AI avatar images and infographics, and save a generated avatar as a reusable character.
- **Product scenes**: place a product image into a scene with an avatar or a product photo template.
- **UGC videos**: assemble videos from saved media, animate a generated avatar, and generate videos from text, frames, or reference media.
- **Slideshows**: write, revise, render, and export slideshows.
- **Publishing**: check a post against each platform's rules, then schedule it or publish it now.

## How it works

The plugin adds one remote MCP server: `https://mcp.reelsfarm.com/plugin/mcp`. When you connect, Claude opens the ReelsFarm sign-in page, and you approve access with OAuth. The plugin stores no keys and runs no code on your computer.

Claude sends ReelsFarm the prompts, settings, and saved media you choose for each task. ReelsFarm generates the content with its AI model providers and keeps it in your ReelsFarm library. ReelsFarm posts to a social account only when you ask, using the accounts you connected in ReelsFarm.

New connections start in Review mode. Each paid generation, schedule, or publish is prepared first and runs only after you approve it. In your ReelsFarm account settings you can choose Creator mode, which runs content work without a separate approval, or Autopilot mode, which can also schedule and publish.

## Requirements

- A ReelsFarm account with an active plan or an eligible trial.
- A connected social account for scheduling and publishing.

## Links

- Website and documentation: https://reelsfarm.com/mcp
- Privacy policy: https://reelsfarm.com/privacy
- Terms of service: https://reelsfarm.com/terms
- Support: https://github.com/mateohysa/reelsfarm-agent-plugin/issues

## License

MIT. See [LICENSE](LICENSE).

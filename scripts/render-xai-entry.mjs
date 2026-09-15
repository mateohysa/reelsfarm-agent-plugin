import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
if (!/^[0-9a-f]{40}$/.test(sha)) {
  throw new Error('Create a release commit before you generate the xAI catalog entry.');
}

const entry = {
  name: 'reelsfarm',
  description: 'Create AI avatars, product scenes, UGC videos, and slideshows, then schedule and publish short-form social content.',
  category: 'productivity',
  source: {
    source: 'url',
    url: 'https://github.com/mateohysa/reelsfarm-agent-plugin.git',
    sha,
  },
  homepage: 'https://reelsfarm.com/mcp',
  keywords: [
    'reelsfarm',
    'reelsfarm mcp',
    'reelsfarm ugc',
    'reelsfarm video',
    'reelsfarm slideshows',
    'reelsfarm scheduling',
  ],
  domains: ['reelsfarm.com', 'mcp.reelsfarm.com'],
  version: '1.0.0',
  author: { name: 'ReelsFarm' },
};

console.log(JSON.stringify(entry, null, 2));

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// REELSFARM_MCP_ORIGIN points the check at another server, such as a local one, for testing the check.
const origin = (process.env.REELSFARM_MCP_ORIGIN || 'https://mcp.reelsfarm.com').replace(/\/+$/, '');
const endpoint = `${origin}/mcp`;
const directoryEndpoint = `${origin}/plugin/mcp`;
const publicUrls = [
  'https://reelsfarm.com/mcp',
  'https://reelsfarm.com/privacy',
  'https://reelsfarm.com/terms',
  'https://github.com/mateohysa/reelsfarm-mcp',
];

// Each endpoint serves its own tool set and publishes its own card. /plugin/mcp serves the version the
// ChatGPT and Claude directories reviewed, so it is usually behind /mcp; the cards never have to match.
const endpoints = new Map([
  [endpoint, { card: `${origin}/.well-known/mcp/server-card.json`, metadata: `${origin}/.well-known/oauth-protected-resource` }],
  [directoryEndpoint, { card: `${origin}/.well-known/mcp/plugin/server-card.json`, metadata: `${origin}/.well-known/oauth-protected-resource/plugin/mcp` }],
]);

// Every listing built from this repo, the endpoint it connects to, and the skills it ships.
const listings = [
  { name: 'Root plugin (Cursor, xAI, local installs)', manifests: ['.mcp.json', 'mcp.json'], skills: 'skills' },
  { name: 'Claude directory plugin', manifests: ['claude/.mcp.json'], skills: 'claude/skills' },
  // The ChatGPT directory app is configured in OpenAI's portal (docs/submission/openai.md) and ships the root skills.
  { name: 'ChatGPT directory app', url: 'https://mcp.reelsfarm.com/plugin/mcp', skills: 'skills' },
];

async function fetchChecked(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'user-agent': 'reelsfarm-agent-plugin-live-check/1.0',
      ...options.headers,
    },
    signal: AbortSignal.timeout(20_000),
  });
  return response;
}

for (const url of publicUrls) {
  const response = await fetchChecked(url);
  assert.ok(response.ok, `${url} returned HTTP ${response.status}`);
  console.log(`Verified ${url}`);
}

/** The endpoint a listing connects to, read from its manifests, on the checked origin. */
async function listingEndpoint(listing) {
  const urls = listing.url ? [listing.url] : await Promise.all(listing.manifests.map(async (file) => {
    const manifest = JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
    const servers = Object.values(manifest.mcpServers ?? {});
    assert.equal(servers.length, 1, `${file} must define one MCP server`);
    return servers[0].url;
  }));
  assert.equal(new Set(urls).size, 1, `${listing.name} manifests must agree on one endpoint`);
  const url = `${origin}${new URL(urls[0]).pathname}`;
  assert.ok(endpoints.has(url), `${listing.name} connects to ${urls[0]}, which this check does not know`);
  return url;
}

/** The tool names a set of skills tells agents to call. */
async function skillTools(folder) {
  const names = new Set();
  for (const skill of await fs.readdir(path.join(root, folder))) {
    const source = await fs.readFile(path.join(root, folder, skill, 'SKILL.md'), 'utf8');
    for (const match of source.matchAll(/`(reelsfarm_[a-z0-9_]+)`/g)) names.add(match[1]);
  }
  return names;
}

/** Reads an endpoint's card and checks every tool definition on it. */
async function loadCard(url) {
  const { card: cardUrl } = endpoints.get(url);
  const response = await fetchChecked(cardUrl);
  assert.ok(response.ok, `${cardUrl} returned HTTP ${response.status}`);
  const card = await response.json();
  assert.equal(card.serverInfo?.title, 'ReelsFarm', `${cardUrl} must describe the ReelsFarm server`);
  if (card.endpoint) assert.equal(new URL(card.endpoint).pathname, new URL(url).pathname, `${cardUrl} must describe ${url}`);
  assert.ok(Array.isArray(card.tools) && card.tools.length > 0, `${cardUrl} must list tools`);
  const names = new Set();
  for (const tool of card.tools) {
    assert.match(tool.name, /^reelsfarm_[a-z][a-z0-9_]*$/);
    assert.ok(!names.has(tool.name), `Duplicate tool on ${url}: ${tool.name}`);
    names.add(tool.name);
    assert.equal(tool.inputSchema?.type, 'object', `${tool.name} needs an object input schema`);
    assert.equal(tool.outputSchema?.type, 'object', `${tool.name} needs an object output schema`);
    assert.equal(tool.outputSchema?.additionalProperties, false, `${tool.name} output must be closed`);
    for (const hint of ['readOnlyHint', 'openWorldHint', 'destructiveHint']) {
      assert.equal(typeof tool.annotations?.[hint], 'boolean', `${tool.name} needs a Boolean ${hint}`);
    }
    if (/^reelsfarm_(?:get|list|search|validate|preflight|check)_/.test(tool.name)) {
      assert.equal(tool.annotations.readOnlyHint, true, `${tool.name} must be marked read-only`);
      assert.equal(tool.annotations.destructiveHint, false, `${tool.name} must not be marked destructive`);
    }
    if (/^reelsfarm_(?:delete|cancel)_/.test(tool.name)) {
      assert.equal(tool.annotations.destructiveHint, true, `${tool.name} must be marked destructive`);
    }
  }
  return { version: card.serverInfo?.version, names };
}

// Each listing must find every tool its skills name on the endpoint it connects to.
const cards = new Map();
for (const listing of listings) {
  const url = await listingEndpoint(listing);
  if (!cards.has(url)) cards.set(url, await loadCard(url));
  const card = cards.get(url);
  const referenced = await skillTools(listing.skills);
  const missing = [...referenced].filter((name) => !card.names.has(name)).sort();
  assert.deepEqual(missing, [], `${listing.name}: its skills name tools that ${url} does not serve: ${missing.join(', ')}`);
  console.log(`Verified ${listing.name}: ${referenced.size} skill tool references on ${url} (MCP ${card.version}, ${card.names.size} tools)`);
}

// Each endpoint challenges with the metadata of its own OAuth resource.
for (const [url, { metadata: metadataUrl }] of endpoints) {
  const challengeResponse = await fetchChecked(url, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
      'mcp-protocol-version': '2025-06-18',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'reelsfarm-public-audit', version: '1.0.0' },
      },
    }),
  });
  assert.equal(challengeResponse.status, 401, `An unauthenticated request to ${url} must return HTTP 401`);
  const authenticate = challengeResponse.headers.get('www-authenticate') || '';
  assert.match(authenticate, /^Bearer /);
  assert.ok(authenticate.includes(`resource_metadata="${metadataUrl}"`), `${url} must point to ${metadataUrl}`);
  const challengeBody = await challengeResponse.text();
  assert.ok(!/(?:stack|private key|database|access[_-]?token|client[_-]?secret)/i.test(challengeBody), 'The OAuth challenge body exposed private details');
  const metadataResponse = await fetchChecked(metadataUrl);
  assert.ok(metadataResponse.ok, `${metadataUrl} returned HTTP ${metadataResponse.status}`);
  assert.equal((await metadataResponse.json()).resource, url, `${metadataUrl} must name ${url} as its resource`);
}

console.log(`Verified ${listings.length} listings on their own endpoints, tool annotations and schemas, and OAuth challenge behavior on both endpoints.`);

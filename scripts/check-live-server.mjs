import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const endpoint = 'https://mcp.reelsfarm.com/mcp';
const cardUrl = 'https://mcp.reelsfarm.com/.well-known/mcp/server-card.json';
const publicUrls = [
  'https://reelsfarm.com/mcp',
  'https://reelsfarm.com/privacy',
  'https://reelsfarm.com/terms',
  'https://github.com/mateohysa/reelsfarm-mcp',
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

const cardResponse = await fetchChecked(cardUrl);
assert.ok(cardResponse.ok, `${cardUrl} returned HTTP ${cardResponse.status}`);
const card = await cardResponse.json();
assert.equal(card.serverInfo?.title, 'ReelsFarm');
assert.equal(card.tools?.length, 107, 'The live public catalog must contain 107 tools');

const names = new Set();
for (const tool of card.tools) {
  assert.match(tool.name, /^reelsfarm_[a-z][a-z0-9_]*$/);
  assert.ok(!names.has(tool.name), `Duplicate live tool: ${tool.name}`);
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

const skillFiles = (await fs.readdir(path.join(root, 'skills'))).map((skill) => path.join(root, 'skills', skill, 'SKILL.md'));
const referencedTools = new Set();
for (const file of skillFiles) {
  const source = await fs.readFile(file, 'utf8');
  for (const match of source.matchAll(/`(reelsfarm_[a-z0-9_]+)`/g)) referencedTools.add(match[1]);
}
for (const toolName of referencedTools) {
  assert.ok(names.has(toolName), `A skill references missing live tool ${toolName}`);
}

const challengeResponse = await fetchChecked(endpoint, {
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
assert.equal(challengeResponse.status, 401, 'An unauthenticated MCP request must return HTTP 401');
const authenticate = challengeResponse.headers.get('www-authenticate') || '';
assert.match(authenticate, /^Bearer /);
assert.match(authenticate, /resource_metadata="https:\/\/mcp\.reelsfarm\.com\/\.well-known\/oauth-protected-resource"/);
const challengeBody = await challengeResponse.text();
assert.ok(!/(?:stack|private key|database|access[_-]?token|client[_-]?secret)/i.test(challengeBody), 'The OAuth challenge body exposed private details');

console.log(`Verified ${card.tools.length} live tools, ${referencedTools.size} skill references, annotations, schemas, and OAuth challenge behavior.`);

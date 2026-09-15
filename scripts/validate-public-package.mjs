import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSkills = [
  'reelsfarm-avatars',
  'reelsfarm-product-scenes',
  'reelsfarm-publishing',
  'reelsfarm-slideshows',
  'reelsfarm-ugc-videos',
];
const expectedBinaryFiles = new Set([
  'assets/logo-square.png',
  'assets/product-studio.png',
  'assets/slideshows.png',
  'assets/ugc-videos.png',
]);
const ignoredDirectories = new Set(['.git', 'node_modules']);
const errors = [];

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    if (entry.isSymbolicLink()) {
      errors.push(`${relative}: symbolic links are not allowed`);
    } else if (entry.isDirectory()) {
      files.push(...await walk(absolute));
    } else if (entry.isFile()) {
      files.push({ absolute, relative });
    } else {
      errors.push(`${relative}: unsupported filesystem entry`);
    }
  }
  return files;
}

function readFrontmatter(source, file) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, `${file} must start with YAML frontmatter`);
  const fields = Object.fromEntries(match[1].split('\n').map((line) => {
    const separator = line.indexOf(':');
    assert.ok(separator > 0, `${file} has invalid frontmatter`);
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  assert.deepEqual(Object.keys(fields).sort(), ['description', 'name'], `${file} frontmatter must contain only name and description`);
  return fields;
}

function findForbiddenText(source, relative) {
  const patterns = [
    ['private key material', new RegExp(['-{5}BEGIN ', '(?:RSA |EC |OPENSSH )?', 'PRIVATE KEY-{5}'].join(''), 'i')],
    ['ReelsFarm API key', new RegExp(['\\brf', 'mcp_[A-Za-z0-9_-]{20,}\\b'].join(''))],
    ['GitHub token', new RegExp(['\\bgh', '[pousr]_[A-Za-z0-9]{20,}\\b'].join(''))],
    ['OpenAI-style key', new RegExp(['\\bsk', '-[A-Za-z0-9_-]{20,}\\b'].join(''))],
    ['credential in URL', /https?:\/\/[^\s/:]+:[^\s/@]+@/i],
    ['secret-like assignment', /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|secret)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/i],
    ['macOS local path', new RegExp(['/Users', '/'].join(''))],
    ['Linux home path', new RegExp(['/home', '/[^/\\s]+/'].join(''))],
    ['Windows local path', /[A-Za-z]:\\Users\\/],
    ['private application repository name', new RegExp(['ugc', '-reels'].join(''), 'i')],
    ['private MCP server filename', new RegExp(['src/', 'mcp-', 'server\\.ts'].join(''), 'i')],
    ['private storage configuration', new RegExp(['storage', '\\.config\\.json'].join(''), 'i')],
    ['private database schema path', new RegExp(['prisma/', 'schema\\.prisma'].join(''), 'i')],
  ];
  const privateEnvironmentNames = [
    ['DATABASE', '_URL'],
    ['SUPABASE', '_SERVICE_ROLE_KEY'],
    ['MCP', '_SECRET_PEPPER'],
    ['POLAR', '_WEBHOOK_SECRET'],
    ['CLOUDFLARE', '_SECRET_KEY'],
  ].map((parts) => parts.join(''));

  for (const [label, pattern] of patterns) {
    if (pattern.test(source)) errors.push(`${relative}: contains ${label}`);
  }
  for (const name of privateEnvironmentNames) {
    if (source.includes(name)) errors.push(`${relative}: contains private environment name ${name}`);
  }
}

function validatePng(bytes, relative) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(bytes.subarray(0, 8).equals(pngSignature), `${relative} must be a PNG file`);
  assert.ok(bytes.length <= 8_000_000, `${relative} must be 8 MB or smaller`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert.ok(width >= 512 && height >= 512, `${relative} must be at least 512 by 512 pixels`);
}

const files = await walk(root);
const fileNames = new Set(files.map((file) => file.relative));
const forbiddenFileName = /(^|\/)(?:\.env(?:\..*)?|credentials?(?:\..*)?|[^/]+\.(?:pem|key|p12|pfx|jks|keystore|sqlite3?|db|dump|sql|map|zip|tar|tgz|gz))$/i;

for (const file of files) {
  if (forbiddenFileName.test(file.relative)) errors.push(`${file.relative}: forbidden file type or credential filename`);
  const bytes = await fs.readFile(file.absolute);
  if (expectedBinaryFiles.has(file.relative)) {
    validatePng(bytes, file.relative);
    continue;
  }
  if (bytes.includes(0)) {
    errors.push(`${file.relative}: unexpected binary file`);
    continue;
  }
  findForbiddenText(bytes.toString('utf8'), file.relative);
}

assert.deepEqual(
  [...fileNames].filter((file) => file.startsWith('assets/')).sort(),
  [...expectedBinaryFiles].sort(),
  'Only the reviewed public PNG assets may be present',
);

const plugin = JSON.parse(await fs.readFile(path.join(root, 'plugin.json'), 'utf8'));
const portableMcp = JSON.parse(await fs.readFile(path.join(root, 'mcp.json'), 'utf8'));
const vendorMcp = JSON.parse(await fs.readFile(path.join(root, '.mcp.json'), 'utf8'));
assert.equal(plugin.name, 'reelsfarm');
assert.equal(plugin.version, '1.0.0');
assert.equal(plugin.license, 'MIT');
assert.deepEqual(plugin.extensions?.['com.openai']?.interface?.capabilities, ['Read', 'Write']);
assert.equal(plugin.extensions?.['com.openai']?.interface?.category, 'Productivity');
assert.equal(plugin.extensions?.['com.openai']?.interface?.defaultPrompt?.length, 3);
for (const prompt of plugin.extensions['com.openai'].interface.defaultPrompt) {
  assert.ok(prompt.length <= 128, 'OpenAI starter prompts must be 128 characters or fewer');
}
for (const asset of [
  plugin.extensions['com.openai'].interface.composerIcon,
  plugin.extensions['com.openai'].interface.logo,
  ...plugin.extensions['com.openai'].interface.screenshots,
]) {
  assert.ok(asset.startsWith('./assets/'), `Invalid asset reference: ${asset}`);
  assert.ok(fileNames.has(asset.slice(2)), `Missing asset reference: ${asset}`);
}

const portable = portableMcp.mcpServers?.reelsfarm;
const vendor = vendorMcp.mcpServers?.reelsfarm;
assert.deepEqual(Object.keys(portableMcp.mcpServers), ['reelsfarm']);
assert.deepEqual(Object.keys(vendorMcp.mcpServers), ['reelsfarm']);
assert.equal(portable.type, 'streamable-http');
assert.equal(vendor.type, 'http');
assert.equal(portable.url, 'https://mcp.reelsfarm.com/mcp');
assert.equal(vendor.url, portable.url);
for (const [label, config] of [['mcp.json', portable], ['.mcp.json', vendor]]) {
  for (const forbidden of ['headers', 'env', 'token', 'apiKey', 'authorization']) {
    assert.ok(!(forbidden in config), `${label} must not contain ${forbidden}`);
  }
}

const skillRoot = path.join(root, 'skills');
const skillDirectories = (await fs.readdir(skillRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(skillDirectories, expectedSkills);

for (const skill of expectedSkills) {
  const relative = `skills/${skill}/SKILL.md`;
  const source = await fs.readFile(path.join(root, relative), 'utf8');
  const frontmatter = readFrontmatter(source, relative);
  assert.equal(frontmatter.name, skill, `${relative} name must match its directory`);
  assert.ok(frontmatter.description.length >= 40, `${relative} needs a useful trigger description`);
  for (const required of [
    'Tool discovery',
    'explicit user approval',
    'reelsfarm_confirm_action',
    'idempotencyKey',
    'reelsfarm_get_operation',
    'Safe stopping',
  ]) {
    assert.ok(source.includes(required), `${relative} must define ${required}`);
  }
}

if (errors.length > 0) {
  throw new Error(`Public package security audit failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
}

console.log(`Validated ${files.length} public files, ${expectedSkills.length} skills, two MCP configs, and ${expectedBinaryFiles.size} reviewed assets.`);

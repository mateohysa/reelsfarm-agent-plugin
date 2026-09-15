import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schemaTargets = [
  {
    document: 'plugin.json',
    schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  },
  {
    document: 'mcp.json',
    schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
  },
];

async function readJson(file) {
  return JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'reelsfarm-agent-plugin-validator/1.0' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

const ajv = new Ajv2020({ allErrors: true, strict: true });

for (const target of schemaTargets) {
  const [document, schema] = await Promise.all([
    readJson(target.document),
    fetchJson(target.schema),
  ]);
  const validate = ajv.compile(schema);
  if (!validate(document)) {
    throw new Error(`${target.document} failed its Agent Plugins schema:\n${ajv.errorsText(validate.errors, { separator: '\n' })}`);
  }
  console.log(`Validated ${target.document} against ${target.schema}`);
}

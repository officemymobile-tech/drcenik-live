/**
 * Fail closed: block Cloudflare Pages deploys that would omit the patient-assistant API.
 *
 * Verified production architecture (deployment 9d68e71d):
 * - POST /api/patient-assistant is served by Cloudflare Pages Functions
 *   (pages.dev of that deployment returns 200; Worker drcenik-redirects does NOT implement it).
 * - Worker only implements GET /api/google-reviews and proxies other /api/* to Pages.
 *
 * This validator NEVER invents Functions source. Missing Functions => exit 1.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];

function fail(msg) {
  failures.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const functionCandidates = [
  'functions/api/patient-assistant.js',
  'functions/api/patient-assistant.ts',
  'functions/api/patient-assistant/index.js',
  'functions/api/patient-assistant/index.ts',
];

const foundFunction = functionCandidates.find((rel) => exists(rel));
const hasWorkerBundle = exists('_worker.js') || exists('_worker.mjs');

if (!foundFunction && !hasWorkerBundle) {
  fail(
    'Pages Functions source missing: expected one of ' +
      functionCandidates.join(', ') +
      ' (or Advanced Mode _worker.js). Refusing static-only deploy.',
  );
}

if (foundFunction) {
  const src = read(foundFunction);
  if (!/onRequest|export\s+async\s+function\s+onRequest|export\s*\{[^}]*onRequest/.test(src)) {
    fail(`${foundFunction} does not export an onRequest handler (Pages Functions contract).`);
  }
  if (src.trim().length < 40) {
    fail(`${foundFunction} looks empty / placeholder.`);
  }
}

if (hasWorkerBundle && !foundFunction) {
  const worker = exists('_worker.js') ? read('_worker.js') : read('_worker.mjs');
  if (!/patient-assistant|\/api\/patient-assistant/.test(worker)) {
    fail('Advanced Mode _worker present but does not reference /api/patient-assistant.');
  }
}

const clientApi = exists('scripts/patient-assistant.js') ? read('scripts/patient-assistant.js') : '';
if (!clientApi.includes('/api/patient-assistant')) {
  fail('scripts/patient-assistant.js missing or does not call /api/patient-assistant.');
}

for (const asset of [
  'scripts/patient-assistant.js',
  'scripts/patient-assistant-boot.js',
  'styles/patient-assistant.css',
  'index.html',
]) {
  if (!exists(asset)) fail(`Required runtime asset missing: ${asset}`);
}

if (exists('.cfignore')) {
  const ignore = read('.cfignore')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  const blocksFunctions = ignore.some((p) => /^functions\/?$|^functions\//.test(p) || p === 'functions/**');
  const blocksWorker = ignore.some((p) => p === '_worker.js' || p === '_worker.mjs');
  const blocksScripts = ignore.some((p) => p === 'scripts/' || p === 'scripts' || p === 'scripts/**');
  if (blocksFunctions) fail('.cfignore excludes functions/ — deploy would omit Pages Functions.');
  if (blocksWorker && hasWorkerBundle) fail('.cfignore excludes _worker — Advanced Mode bundle would be omitted.');
  if (blocksScripts) {
    fail(
      '.cfignore excludes scripts/ — patient-assistant client JS would be omitted from Pages upload.',
    );
  }
}

if (exists('package.json')) {
  try {
    const pkg = JSON.parse(read('package.json'));
    const deploy = pkg.scripts?.['deploy-pages'] || '';
    const approved = pkg.scripts?.['deploy-pages-production-approved-rc'] || '';
    const deploySafe =
      /validate-pages-functions/.test(deploy) ||
      /refuse-unsafe-production-deploy/.test(deploy) ||
      /refuse-unsafe-production-deploy/.test(approved) ||
      /deploy-approved-rc-production/.test(approved);
    if (deploy && !deploySafe) {
      warn('package.json deploy-pages should refuse unsafe deploys or run validate-pages-functions.');
    }
  } catch {
    warn('package.json could not be parsed.');
  }
}

console.log('=== Pages Functions artifact validation ===');
if (foundFunction) console.log('Functions source:', foundFunction);
if (hasWorkerBundle) console.log('Advanced Mode worker: present');
for (const w of warnings) console.warn('WARN:', w);
if (failures.length) {
  console.error('FAIL: static-only / incomplete Functions deploy blocked.');
  for (const f of failures) console.error(' -', f);
  console.error(
    'Recover the exact Pages Functions source from the 9d68e71d-era project before any production deploy.',
  );
  process.exit(1);
}

console.log('PASS: Functions artifact checks succeeded.');
process.exit(0);

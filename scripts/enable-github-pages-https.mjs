/**
 * GitHub Pages: Enforce HTTPS aktivieren.
 * Env: GH_TOKEN (repo → Settings oder fine-grained: Pages write)
 * Usage: set GH_TOKEN=ghp_... && node scripts/enable-github-pages-https.mjs
 */

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const owner = 'officemymobile-tech';
const repo = 'drcenik-live';

if (!token) {
  console.log('GH_TOKEN fehlt.\n');
  console.log('1. GitHub → Settings → Developer settings → Personal access tokens');
  console.log('2. Token mit „repo“ (Classic) oder Pages: Read and write (Fine-grained)');
  console.log('3. set GH_TOKEN=ghp_... && node scripts/enable-github-pages-https.mjs');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, { headers });
const current = await getRes.json();

if (!getRes.ok) {
  console.error('Pages-API Fehler:', current.message || current);
  process.exit(1);
}

console.log('Aktuell:', {
  cname: current.cname,
  https_enforced: current.https_enforced,
  html_url: current.html_url,
});

if (current.https_enforced) {
  console.log('✅ Enforce HTTPS ist bereits aktiv.');
  process.exit(0);
}

const patchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
  method: 'PUT',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cname: current.cname || 'www.drcenik.at',
    https_enforced: true,
    build_type: current.build_type || 'legacy',
    source: current.source || { branch: 'main', path: '/' },
  }),
});

const result = await patchRes.json();
if (!patchRes.ok) {
  console.error('Aktivierung fehlgeschlagen:', result.message || result);
  process.exit(1);
}

console.log('✅ Enforce HTTPS aktiviert:', result.https_enforced);
console.log('Prüfen: curl -sI http://www.drcenik.at/ | findstr HTTP Location');

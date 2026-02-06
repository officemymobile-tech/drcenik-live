/**
 * Einmalige Bildoptimierung für Performance (gutschein.png, kfa-logo.png, logo.jpg).
 * Ausführung: npm install   dann  npm run optimize-images
 * Erfordert Node.js und npm. Reduziert gutschein.png und kfa-logo.png stark, logo.jpg auf ~80–150 KB.
 */
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Bitte zuerst ausführen: npm install sharp');
  process.exit(1);
}

const root = path.join(__dirname, '..');

const tasks = [
  {
    input: path.join(root, 'assets', 'gutschein.png'),
    output: path.join(root, 'assets', 'gutschein.png'),
    pipeline: (s) => s.resize(600).png({ compressionLevel: 9, effort: 10 }),
  },
  {
    input: path.join(root, 'assets', 'images', 'kassen', 'kfa-logo.png'),
    output: path.join(root, 'assets', 'images', 'kassen', 'kfa-logo.png'),
    pipeline: (s) => s.resize(240).png({ compressionLevel: 9, effort: 10 }),
  },
  {
    input: path.join(root, 'assets', 'logo.jpg'),
    output: path.join(root, 'assets', 'logo.jpg'),
    pipeline: (s) => s.resize(800).jpeg({ quality: 82, mozjpeg: true }),
  },
];

(async () => {
  for (const t of tasks) {
    if (!fs.existsSync(t.input)) {
      console.warn('Übersprungen (nicht gefunden):', t.input);
      continue;
    }
    const before = fs.statSync(t.input).size;
    await sharp(t.input)
      .rotate()
      .then((s) => t.pipeline(s))
      .toFile(t.output + '.tmp');
    fs.renameSync(t.output + '.tmp', t.output);
    const after = fs.statSync(t.output).size;
    console.log(path.relative(root, t.input), (before / 1024).toFixed(0) + ' KB ->', (after / 1024).toFixed(0) + ' KB');
  }
  console.log('Fertig.');
})();

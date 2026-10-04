// Générateur statique minimal (aucune dépendance) — voir README.md
//   node build.mjs           génère les pages HTML, sitemap.xml et robots.txt à la racine
//   node build.mjs --check   échoue si les fichiers générés ne sont pas à jour
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CHECK = process.argv.includes('--check');
const read = (p) => readFileSync(join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');

const site = JSON.parse(read('site.config.json'));
const year = String(new Date().getFullYear());

const partials = {};
for (const f of readdirSync(join(ROOT, 'src/partials'))) {
  partials[f.replace(/\.html$/, '')] = read(`src/partials/${f}`).replace(/\n$/, '');
}

function parsePage(name) {
  const raw = read(`src/pages/${name}`);
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${name}: en-tête « --- » manquant`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const section = (marker, next) => {
    const a = m[2].indexOf(marker);
    if (a < 0) return '';
    const start = a + marker.length;
    const ends = next.map((n) => m[2].indexOf(n, start)).filter((x) => x >= 0);
    const end = ends.length ? Math.min(...ends) : m[2].length;
    return m[2].slice(start, end).replace(/^\n|\n$/g, '');
  };
  return {
    name,
    meta,
    headBefore: section('<!--@head-->', ['<!--@head-end-->', '<!--@body-->']),
    headAfter: section('<!--@head-end-->', ['<!--@body-->']),
    body: section('<!--@body-->', []),
  };
}

function render(str, vars, where) {
  // Blocs conditionnels : {{#if cle}}…{{else}}…{{/if}} (vrai si la variable est non vide)
  str = str.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (_, k, yes, no = '') => {
    if (!(k in vars)) throw new Error(`${where}: variable inconnue « ${k} »`);
    return vars[k] ? yes : no;
  });
  str = str.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => {
    if (!(n in partials)) throw new Error(`${where}: partiel inconnu « ${n} »`);
    return partials[n];
  });
  return str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`${where}: variable inconnue « ${k} »`);
    return vars[k];
  });
}

const esc = (s) => s.replace(/"/g, '&quot;');
const html = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Preuve sociale : rien n'est affiché tant que « enabled » est faux. Une fois activée,
// le générateur refuse de construire le site sans accord écrit de l'école et sans contenu réel.
function renderProof(p) {
  if (!p || !p.enabled) return '';
  const missing = ['quote', 'author', 'school'].filter((k) => !p[k] || !String(p[k]).trim());
  if (p.consent !== true || !String(p.consentDate || '').trim()) {
    throw new Error("proof.enabled exige proof.consent = true et proof.consentDate (accord écrit de l'école)");
  }
  if (missing.length) throw new Error(`proof.enabled : champs manquants (${missing.join(', ')})`);
  const results = (p.results || []).filter((r) => r && r.value && r.label);
  const who = [p.author, p.role].filter(Boolean).map(html).join(', ');
  return `<section id="temoignage" class="tinted">
    <div class="wrap">
      <div class="section-head">
        <div class="caption">Témoignage</div>
        <h2>Ce que dit une école pilote</h2>
      </div>
      <figure class="proof">
        <blockquote>« ${html(p.quote)} »</blockquote>
        <figcaption><strong>${who}</strong> — ${html(p.school)}</figcaption>${results.length ? `
        <ul class="proof-results">
${results.map((r) => `          <li><span class="proof-value">${html(r.value)}</span><span>${html(r.label)}</span></li>`).join('\n')}
        </ul>` : ''}
      </figure>
    </div>
  </section>`;
}
const outputs = {};
const pages = readdirSync(join(ROOT, 'src/pages')).filter((f) => f.endsWith('.html')).map(parsePage);

for (const p of pages) {
  const { meta } = p;
  const root = meta.root ?? '';
  const home = p.name === 'index.html' ? '' : `${root}index.html`;
  const vars = {
    root,
    home,
    logo_href: home === '' ? '#top' : home,
    cur_scolo: meta.nav === 'scolo' ? ' aria-current="page"' : '',
    cur_immo: meta.nav === 'immo' ? ' aria-current="page"' : '',
    year,
    shots_loading: meta.shots === 'lazy' ? 'loading="lazy"' : 'fetchpriority="high"',
  };
  for (const [k, v] of Object.entries(site)) if (typeof v === 'string') vars[`site.${k}`] = v;
  vars.proof = renderProof(site.proof);
  vars.analytics = site.analytics && site.analytics.enabled ? '1' : '';

  const head = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<title>${meta.title}</title>`,
    meta.description ? `<meta name="description" content="${esc(meta.description)}">` : null,
    meta.robots ? `<meta name="robots" content="${meta.robots}">` : null,
    '<meta name="theme-color" content="#fbf7f0">',
    meta.canonical != null ? `<link rel="canonical" href="{{site.origin}}${meta.canonical}">` : null,
    p.headBefore || null,
    '{{> head-common}}',
    p.headAfter || null,
  ].filter(Boolean).join('\n');

  const scriptFiles = ['site.js', ...(vars.analytics ? ['track.js'] : []), ...(meta.scripts ? meta.scripts.split(',').map((s) => s.trim()) : [])];
  const scripts = scriptFiles.map((s) => `<script src="{{root}}assets/${s}" defer></script>`)
    .concat(vars.analytics ? ['<script defer src="/_vercel/insights/script.js"></script>'] : []).join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
${head}
</head>
<body>
<a class="skip-link" href="#top">Aller au contenu</a>

{{> header}}

${p.body}

{{> footer}}

${scripts}

</body>
</html>
`;
  outputs[p.name] = render(html, vars, p.name);
}

// sitemap.xml : pages indexables, triées selon « order »
const indexable = pages
  .filter((p) => p.meta.canonical != null && !p.meta.robots)
  .sort((a, b) => Number(a.meta.order ?? 99) - Number(b.meta.order ?? 99));
outputs['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url>
    <loc>${site.origin}${p.meta.canonical}</loc>
    <lastmod>${p.meta.updated}</lastmod>
  </url>`).join('\n')}
</urlset>
`;
outputs['robots.txt'] = `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`;

let stale = 0;
for (const [file, content] of Object.entries(outputs)) {
  const path = join(ROOT, file);
  const current = existsSync(path) ? read(file) : null;
  if (CHECK) {
    if (current !== content) { console.error(`obsolète : ${file}`); stale++; }
  } else if (current !== content) {
    writeFileSync(path, content);
    console.log(`écrit    : ${file}`);
  }
}
if (CHECK) {
  if (stale) process.exit(1);
  console.log('à jour');
} else {
  console.log(`${Object.keys(outputs).length} fichiers vérifiés.`);
}

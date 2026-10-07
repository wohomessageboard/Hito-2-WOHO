// Después de `vite build`: crea un HTML por ruta pública (dist/<ruta>/index.html) con su
// propio título, descripción, canónica, datos estructurados y un resumen visible sin
// JavaScript. La app React sigue funcionando igual: este HTML solo mejora lo que leen
// buscadores, tarjetas al compartir y modelos de lenguaje. Vercel sirve estos archivos
// antes de aplicar la regla que manda todo a index.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { PAGES, GUIDE_PAGES, countrySeo, jsonLdFor, LOGO_PATH } from '../src/seo/site.js';
import { siteUrl, getCountries } from './seo-lib.mjs';

const site = siteUrl();
const base = readFileSync('dist/index.html', 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const nav = [['/feed', 'Explorar anuncios'], ['/destinos', 'Destinos'], ['/guias', 'Guías de visa'], ['/como-funciona', 'Cómo funciona'], ['/manifiesto', 'Manifiesto']];

function render(meta) {
  const url = `${site}${meta.path === '/' ? '' : meta.path}`;
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(meta.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(meta.description)}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${site}${LOGO_PATH}" />`);
  const extra = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    ...jsonLdFor(meta, site).map((d) => `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ');
  html = html.replace('</head>', `    ${extra}\n  </head>`);
  const fallback = `<noscript>
      <main>
        <h1>${esc(meta.h1)}</h1>
        <p>${esc(meta.summary)}</p>
        <nav aria-label="Principal">${nav.map(([p, t]) => `<a href="${p}">${t}</a>`).join(' · ')}</nav>
      </main>
    </noscript>`;
  return html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallback}`);
}

const write = (path, html) => {
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
  if (path !== '/') mkdirSync(`dist${path}`, { recursive: true });
  writeFileSync(file, html);
};

for (const page of PAGES) write(page.path, render(page));
for (const guia of GUIDE_PAGES()) write(guia.path, render(guia));
const countries = await getCountries();
for (const name of countries) write(`/destinos/${name}`, render({ path: `/destinos/${encodeURIComponent(name)}`, ...countrySeo(name), country: name }));
console.log(`[seo] HTML previo para ${PAGES.length + GUIDE_PAGES().length + countries.length} rutas (${site}); logo ${LOGO_PATH}`);

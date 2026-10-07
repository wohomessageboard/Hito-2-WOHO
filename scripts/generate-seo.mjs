// Genera public/sitemap.xml, public/robots.txt y public/llms.txt antes de cada build.
// Las páginas salen de src/seo/site.js; los países, de la API.
import { writeFileSync, mkdirSync } from 'node:fs';
import { PAGES, GUIDE_PAGES, countrySeo, SITE_NAME, SITE_SUMMARY } from '../src/seo/site.js';
import { siteUrl, getCountries } from './seo-lib.mjs';

const site = siteUrl();
const countries = await getCountries();
const today = new Date().toISOString().slice(0, 10);

const entries = [
  ...PAGES.map((p) => ({ path: p.path, priority: p.priority })),
  ...GUIDE_PAGES().map((g) => ({ path: g.path, priority: '0.8' })),
  ...countries.map((name) => ({ path: `/destinos/${encodeURIComponent(name)}`, priority: '0.7' })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${site}${e.path === '/' ? '' : e.path}</loc><lastmod>${today}</lastmod><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>
`;

// No hay paginación por URL (el feed carga y filtra en la misma página). Si algún día
// existe /page/ o ?page=, añade aquí su Disallow.
const robots = `User-agent: *
Allow: /
Disallow: /admin-dashboard
Disallow: /profile
Disallow: /edit-profile
Disallow: /edit-post/
Disallow: /new-post
Disallow: /login
Disallow: /register
Disallow: /olvide-mi-contrasena
Disallow: /restablecer
Disallow: /page/

Sitemap: ${site}/sitemap.xml
`;

const LABEL = { '/': 'Inicio', '/feed': 'Explorar anuncios', '/destinos': 'Destinos', '/como-funciona': 'Cómo funciona', '/manifiesto': 'Manifiesto', '/guias': 'Guías de visa', '/contacto': 'Contacto', '/terminos': 'Términos y condiciones', '/privacidad': 'Política de privacidad' };
const line = (title, path, desc) => `- [${title}](${site}${path === '/' ? '' : path}): ${desc}`;
const llms = `# ${SITE_NAME}

> ${SITE_SUMMARY}

Driftler es gratis. Los avisos de la comunidad caducan a los 30 días como máximo, por eso la información es siempre vigente. Se puede explorar sin cuenta. Para contactar a quien publica hace falta iniciar sesión, y el contacto se hace por WhatsApp; el correo de las personas nunca se muestra.

## Páginas principales

${PAGES.filter((p) => ['/', '/feed', '/destinos', '/guias', '/como-funciona', '/manifiesto'].includes(p.path)).map((p) => line(LABEL[p.path] || p.h1, p.path, p.description)).join('\n')}

## Guías de visa Working Holiday

${GUIDE_PAGES().map((g) => line(g.h1, g.path, g.description)).join('\n')}

## Destinos

${countries.length ? countries.map((n) => line(n, `/destinos/${encodeURIComponent(n)}`, countrySeo(n).description)).join('\n') : '- Consulta la lista en ' + site + '/destinos'}

## Información legal y contacto

${PAGES.filter((p) => ['/terminos', '/privacidad', '/contacto'].includes(p.path)).map((p) => line(LABEL[p.path] || p.h1, p.path, p.description)).join('\n')}
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', sitemap);
writeFileSync('public/robots.txt', robots);
writeFileSync('public/llms.txt', llms);
console.log(`[seo] sitemap (${entries.length} páginas), robots.txt y llms.txt para ${site}`);

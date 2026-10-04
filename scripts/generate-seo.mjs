// Genera public/sitemap.xml y public/robots.txt antes de cada build (npm run build).
// La dirección del sitio sale de SITE_URL; si no existe, de la que Vercel entrega en
// VERCEL_PROJECT_PRODUCTION_URL (cuando conectes tu dominio, defínela como SITE_URL).
// Las páginas de países se leen de la API; si no responde, se omiten sin romper el build.
import { writeFileSync, mkdirSync } from 'node:fs';

const FALLBACK = 'https://woho-three.vercel.app';
const site = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : FALLBACK)
).replace(/\/+$/, '');

// Solo páginas públicas e indexables. Las privadas (cuenta, admin, formularios) quedan fuera.
const pages = [
  ['/', '1.0'],
  ['/feed', '0.9'],
  ['/destinos', '0.8'],
  ['/como-funciona', '0.7'],
  ['/manifiesto', '0.6'],
  ['/contacto', '0.4'],
  ['/terminos', '0.3'],
  ['/privacidad', '0.3'],
];

const countries = [];
const api = process.env.VITE_API_URL;
if (api) {
  try {
    const res = await fetch(`${api.replace(/\/+$/, '')}/countries`, { signal: AbortSignal.timeout(8000) });
    if (res.ok) for (const c of await res.json()) if (c?.name) countries.push(c.name);
  } catch {
    console.warn('[seo] No se pudo leer la lista de países; el sitemap saldrá sin ellos.');
  }
}
for (const name of countries) pages.push([`/destinos/${encodeURIComponent(name)}`, '0.7']);

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([path, priority]) => `  <url><loc>${site}${path}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`).join('\n')}
</urlset>
`;

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

Sitemap: ${site}/sitemap.xml
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', xml);
writeFileSync('public/robots.txt', robots);
console.log(`[seo] sitemap.xml (${pages.length} páginas) y robots.txt para ${site}`);

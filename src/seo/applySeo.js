import { jsonLdFor, LOGO_URL } from './site.js';

// Dirección pública del sitio (para canónicas y datos estructurados).
export const siteUrl = () => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

const upsert = (selector, create) => {
  let el = document.head.querySelector(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  return el;
};
const setMeta = (attr, key, content) => {
  const el = upsert(`meta[${attr}="${key}"]`, () => { const m = document.createElement('meta'); m.setAttribute(attr, key); return m; });
  el.setAttribute('content', content);
};

// Actualiza <title>, descripción, canónica, Open Graph, robots y JSON-LD. Idempotente:
// reutiliza las etiquetas que ya trae el HTML generado en el build.
export function applySeo(meta) {
  const site = siteUrl();
  const url = `${site}${meta.path === '/' ? '' : meta.path}` || site;
  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', meta.image || LOGO_URL);
  upsert('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }).href = url;

  const robots = document.head.querySelector('meta[name="robots"]');
  if (meta.noindex) setMeta('name', 'robots', 'noindex, nofollow');
  else robots?.remove();

  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
  for (const data of jsonLdFor(meta, site)) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.seoJsonld = '';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
}

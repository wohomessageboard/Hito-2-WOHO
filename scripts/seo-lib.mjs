// Utilidades compartidas por los generadores de SEO del build.
const FALLBACK = 'https://woho-three.vercel.app';

// Dirección del sitio: SITE_URL > dirección de producción de Vercel > respaldo.
export const siteUrl = () =>
  (
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : FALLBACK)
  ).replace(/\/+$/, '');

// Países desde la API. Render (plan gratis) se duerme y tarda hasta ~1 minuto en despertar,
// así que se espera con calma y se reintenta una vez. Si no responde se devuelve [] y el
// build sigue sin esas páginas.
export async function getCountries() {
  const api = process.env.VITE_API_URL;
  if (!api) return [];
  for (let intento = 1; intento <= 2; intento++) {
    try {
      const res = await fetch(`${api.replace(/\/+$/, '')}/countries`, { signal: AbortSignal.timeout(60000) });
      if (res.ok) return (await res.json()).filter((c) => c?.name).map((c) => c.name);
    } catch { /* se reintenta */ }
  }
  console.warn('[seo] No se pudo leer la lista de países; se omiten sus páginas.');
  return [];
}

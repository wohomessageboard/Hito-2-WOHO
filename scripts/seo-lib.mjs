// Utilidades compartidas por los generadores de SEO del build.
const FALLBACK = 'https://woho-three.vercel.app';

// Dirección del sitio: SITE_URL > dirección de producción de Vercel > respaldo.
export const siteUrl = () =>
  (
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : FALLBACK)
  ).replace(/\/+$/, '');

// Países desde la API. Si no responde se devuelve [] y el build sigue sin esas páginas.
export async function getCountries() {
  const api = process.env.VITE_API_URL;
  if (!api) return [];
  try {
    const res = await fetch(`${api.replace(/\/+$/, '')}/countries`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    return (await res.json()).filter((c) => c?.name).map((c) => c.name);
  } catch {
    console.warn('[seo] No se pudo leer la lista de países; se omiten sus páginas.');
    return [];
  }
}

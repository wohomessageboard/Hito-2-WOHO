// Fuente única del SEO: títulos, descripciones y datos estructurados de cada página.
// Lo usan la web (src/seo/RouteSeo.jsx) y el generador del build (scripts/*.mjs), por eso
// es JavaScript puro, sin JSX ni imports del navegador.
import { FAQ } from './faq.js';

export const SITE_NAME = 'WOHO';
export const LOGO_URL = 'https://res.cloudinary.com/dpxpixlpl/image/upload/v1772886330/WOHO_logo_uxi9wo.png';
export const SITE_SUMMARY = 'Tablón de avisos gratuito para viajeros con visa Working Holiday: trabajo, alojamiento y compañeros de ruta, publicados por la comunidad.';

// Páginas públicas e indexables. `h1` es el encabezado visible: debe diferir del `title`.
// `summary` es el texto que ven los lectores sin JavaScript (buscadores simples y modelos de lenguaje).
export const PAGES = [
  {
    path: '/', priority: '1.0',
    title: 'Tablón Working Holiday: trabajo y alojamiento | WOHO',
    description: 'Avisos gratis de trabajo, alojamiento y compañeros de ruta para quienes viajan con visa Working Holiday. Publicados por la comunidad.',
    h1: 'El coraje de migrar, la fuerza de unirse.',
    summary: 'WOHO es un tablón de avisos hecho por viajeros Working Holiday. Explora sin cuenta, sigue destinos y contacta por WhatsApp. Es gratis.',
  },
  {
    path: '/feed', priority: '0.9',
    title: 'Anuncios de trabajo y alojamiento para viajeros | WOHO',
    description: 'Explora los avisos más recientes de trabajo, alojamiento y planes publicados por viajeros. Filtra por destino y categoría; no necesitas cuenta.',
    h1: 'Anuncios recientes',
    summary: 'Los avisos más recientes de la comunidad, filtrables por destino y categoría: trabajo, alojamiento, social y otros.',
  },
  {
    path: '/destinos', priority: '0.8',
    title: 'Destinos para tu Working Holiday | WOHO',
    description: 'Elige un país y mira sus avisos de trabajo, alojamiento y compañeros de ruta. Sigue los destinos que te interesan para ver lo último en tu sección Para ti.',
    h1: 'Elige tu destino',
    summary: 'Países con avisos de la comunidad Working Holiday. Entra a cada destino para ver sus anuncios y sus ciudades.',
  },
  {
    path: '/como-funciona', priority: '0.7',
    title: 'Cómo usar WOHO: explora, contacta y publica gratis',
    description: 'Aprende a explorar avisos, crear tu cuenta, seguir destinos y contactar por WhatsApp. Gratis, sin mostrar tu correo y con consejos para viajar tranquilo.',
    h1: 'Cómo funciona WOHO',
    summary: 'Cuatro pasos: explora sin cuenta, crea tu cuenta gratis, sigue destinos y guarda avisos, y contacta por WhatsApp o publica el tuyo.',
  },
  {
    path: '/manifiesto', priority: '0.6',
    title: 'Manifiesto: viajar para encontrarse | WOHO',
    description: 'Creemos en el coraje de migrar y en la fuerza de la comunidad. Lee el manifiesto de WOHO, el tablón de avisos hecho por y para viajeros.',
    h1: 'Nuestro manifiesto',
    summary: 'Por qué existe WOHO: el coraje de migrar, la solidaridad entre viajeros y la comunidad como red de apoyo.',
  },
  {
    path: '/contacto', priority: '0.4',
    title: 'Contacta al equipo de WOHO',
    description: 'Escríbenos para resolver dudas, enviar sugerencias o avisar de un problema en la plataforma.',
    h1: 'Escríbenos',
    summary: 'Formulario para escribir al equipo de WOHO.',
  },
  {
    path: '/terminos', priority: '0.3',
    title: 'Términos y condiciones de uso | WOHO',
    description: 'Reglas de uso de WOHO: tu cuenta, lo que publicas, fotos y derechos de autor, moderación y cierre de cuenta.',
    h1: 'Términos y Condiciones',
    summary: 'Condiciones de uso del servicio WOHO.',
  },
  {
    path: '/privacidad', priority: '0.3',
    title: 'Política de privacidad y protección de datos | WOHO',
    description: 'Qué datos personales trata WOHO, para qué, con quién se comparten y cómo ejercer tus derechos, incluida la eliminación de tu cuenta.',
    h1: 'Política de Privacidad',
    summary: 'Cómo trata WOHO tus datos personales y cómo ejercer tus derechos.',
  },
];

// Páginas privadas o sin valor para buscadores: llevan noindex y no entran al sitemap.
export const PRIVATE_PAGES = [
  { path: '/login', title: 'Iniciar sesión | WOHO' },
  { path: '/register', title: 'Crear cuenta | WOHO' },
  { path: '/olvide-mi-contrasena', title: 'Recuperar contraseña | WOHO' },
  { path: '/restablecer', title: 'Nueva contraseña | WOHO' },
  { path: '/profile', title: 'Mi perfil | WOHO' },
  { path: '/new-post', title: 'Publicar un aviso | WOHO' },
  { path: '/edit-profile', title: 'Editar perfil | WOHO' },
  { path: '/admin-dashboard', title: 'Panel de administración | WOHO' },
];
export const PRIVATE_PREFIXES = [{ prefix: '/edit-post/', title: 'Editar aviso | WOHO' }];

export const countrySeo = (name) => ({
  title: `Working Holiday en ${name}: trabajo y alojamiento | WOHO`,
  description: `Avisos de trabajo, alojamiento y compañeros de ruta en ${name}, publicados por viajeros Working Holiday. Filtra por ciudad y categoría.`,
  h1: name,
  summary: `Anuncios de la comunidad WOHO en ${name}: trabajo, alojamiento y planes. Filtra por ciudad y categoría.`,
});

const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

// Metadatos para una ruta del navegador. Devuelve null en /post/* (lo define cada aviso).
export const seoForPath = (pathname) => {
  const path = norm(pathname);
  const page = PAGES.find((p) => p.path === path);
  if (page) return { ...page, noindex: false };
  const country = path.match(/^\/destinos\/([^/]+)$/);
  if (country) {
    const name = decodeURIComponent(country[1]);
    return { path, ...countrySeo(name), noindex: false, country: name };
  }
  if (path.startsWith('/post/')) return null;
  const priv = PRIVATE_PAGES.find((p) => p.path === path) || PRIVATE_PREFIXES.find((p) => path.startsWith(p.prefix));
  if (priv) return { path, title: priv.title, description: 'Zona privada de WOHO.', noindex: true };
  return { path, title: 'Página no encontrada | WOHO', description: 'La página que buscas no existe.', noindex: true };
};

// Datos estructurados (JSON-LD) por página.
export const jsonLdFor = (meta, site) => {
  const out = [];
  if (meta.path === '/') {
    out.push(
      { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: site, logo: LOGO_URL, description: SITE_SUMMARY },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: site, inLanguage: 'es' },
    );
  }
  if (meta.path === '/como-funciona') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  if (meta.country) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Destinos', item: `${site}/destinos` },
        { '@type': 'ListItem', position: 3, name: meta.country, item: `${site}${meta.path}` },
      ],
    });
  }
  return out;
};

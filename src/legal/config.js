// Versión de los textos legales. Debe coincidir con TERMS_VERSION del backend
// (config/legal.js). Cuando cambie el fondo de los textos, sube las DOS: a todas las
// personas se les pedirá aceptar de nuevo.
export const LEGAL_VERSION = '2026-10-05-borrador';
export const LEGAL_UPDATED = '4 de octubre de 2026';

// Edad mínima para crear una cuenta. Debe coincidir con MIN_AGE del backend (config/legal.js).
export const MIN_AGE = 18;

// Mientras sea true, las páginas muestran el aviso de "borrador". Ponlo en false cuando
// hayas completado los datos entre [[ ]] y un profesional haya revisado los textos.
export const IS_DRAFT = true;

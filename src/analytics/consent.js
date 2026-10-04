// Google Analytics 4 es opcional: solo existe si se define VITE_GA4_ID (formato G-XXXXXXXXXX)
// al compilar. Sin esa variable no se carga nada de Google ni se muestra ningún aviso.
// Si lo activas, actualiza la política de privacidad (ya cambia sola) y sube la versión de
// los textos legales (src/legal/config.js y config/legal.js del backend).
const raw = import.meta.env.VITE_GA4_ID || '';
export const GA_ID = /^G-[A-Z0-9]{6,}$/.test(raw) ? raw : '';

const KEY = 'woho-analytics';
export const OPEN_EVENT = 'woho:open-analytics-consent';

export const readConsent = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const saveConsent = (value) => {
  try { localStorage.setItem(KEY, value); } catch { /* sin almacenamiento: se vuelve a preguntar */ }
};
export const openConsent = () => window.dispatchEvent(new Event(OPEN_EVENT));

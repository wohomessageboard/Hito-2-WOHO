// Publicidad (Google AdSense). Es opcional y viene APAGADA: solo existe si se define
// VITE_ADSENSE_CLIENT (formato ca-pub-XXXXXXXXXXXXXXXX) al compilar. Sin esa variable no se
// carga ningún script de Google, no se pintan contenedores y la página queda sin huecos.
// Los números de cada unidad de anuncio salen de AdSense (Anuncios → Por unidad de anuncio).
const client = import.meta.env.VITE_ADSENSE_CLIENT || '';
export const ADS_CLIENT = /^ca-pub-\d{10,}$/.test(client) ? client : '';

export const SLOTS = {
  feed: import.meta.env.VITE_ADSENSE_SLOT_FEED || '',
  rail: import.meta.env.VITE_ADSENSE_SLOT_RAIL || '',
  post: import.meta.env.VITE_ADSENSE_SLOT_POST || '',
  mobile: import.meta.env.VITE_ADSENSE_SLOT_MOBILE || '',
};

// Alto reservado por tipo, para que la página no salte al cargar el anuncio (CLS).
export const MIN_HEIGHT = { feed: 120, rail: 600, post: 250, mobile: 100 };

// Abre de nuevo el mensaje de consentimiento de Google (Privacidad y mensajes de AdSense).
// Verifica el nombre exacto de la API en la documentación oficial de Funding Choices.
export const openAdPreferences = () => {
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  if (typeof window.googlefc.showRevocationMessage === 'function') window.googlefc.showRevocationMessage();
  else window.googlefc.callbackQueue.push({ CONSENT_API_READY: () => window.googlefc.showRevocationMessage?.() });
};

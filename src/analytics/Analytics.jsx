import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Link } from 'react-router-dom';
import { GA_ID, readConsent, saveConsent, OPEN_EVENT } from './consent';

let loaded = false;
const loadGa = () => {
  if (loaded || !GA_ID) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  // Consentimiento denegado por defecto; solo se concede lo analítico tras aceptar.
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
};

const setGrant = (granted) => {
  if (!window.gtag) return;
  window.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
};

/**
 * GA4 con consentimiento. No hace nada si no hay VITE_GA4_ID. "Aceptar" y "Solo lo
 * necesario" tienen el mismo peso visual. Mide cada cambio de página (es una SPA).
 */
const Analytics = () => {
  const { pathname } = useLocation();
  const [consent, setConsent] = useState(() => readConsent());
  const [open, setOpen] = useState(() => GA_ID && readConsent() === null);

  useEffect(() => {
    if (!GA_ID) return undefined;
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    if (consent === 'granted') {
      loadGa();
      setGrant(true);
      window.gtag('event', 'page_view', { page_path: pathname, page_title: document.title });
    } else {
      setGrant(false);
    }
  }, [consent, pathname]);

  if (!GA_ID || !open) return null;

  const choose = (value) => {
    saveConsent(value);
    setConsent(value);
    setOpen(false);
  };

  return (
    <div role="dialog" aria-label="Preferencias de analítica" className="fixed inset-x-3 bottom-3 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-md ws-surface-elevated p-5 flex flex-col gap-4">
      <p className="font-cuerpo leading-relaxed">
        ¿Nos ayudas a mejorar WOHO? Con tu permiso usamos Google Analytics para medir qué páginas se visitan. Sin permiso, no se carga nada de Google.{' '}
        <Link to="/privacidad" className="font-bold underline underline-offset-4">Más información</Link>
      </p>
      <div className="flex gap-3">
        <Button onPress={() => choose('denied')} radius="sm" className="ws-btn ws-btn-quiet flex-1 h-12 bg-ws-paper-deep">Solo lo necesario</Button>
        <Button onPress={() => choose('granted')} radius="sm" className="ws-btn ws-btn-ink flex-1 h-12">Aceptar</Button>
      </div>
    </div>
  );
};

export default Analytics;

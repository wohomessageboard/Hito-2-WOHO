import React, { useEffect, useRef, useState } from 'react';
import { ADS_CLIENT, SLOTS, MIN_HEIGHT } from './config';

let scriptRequested = false;
const loadAdsScript = () => {
  if (scriptRequested) return;
  scriptRequested = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;
  document.head.appendChild(s);
};

const SIZES = {
  rail: { display: 'inline-block', width: 160, height: 600 },
  mobile: { display: 'inline-block', width: 320, height: 100 },
};

/**
 * Un anuncio de AdSense. No hace nada si no hay VITE_ADSENSE_CLIENT o falta el número de la
 * unidad. Carga el script de Google solo cuando el anuncio está por entrar en pantalla,
 * reserva su alto, lleva la etiqueta "Publicidad" y se colapsa entero si no se llena.
 * @param {'feed'|'rail'|'post'|'mobile'} variant
 */
const AdSlot = ({ variant = 'feed', className = '' }) => {
  const slot = SLOTS[variant];
  const wrapRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const pushed = useRef(false);
  const enabled = Boolean(ADS_CLIENT && slot);

  useEffect(() => {
    if (!enabled || import.meta.env.DEV) return undefined;
    const el = wrapRef.current;
    const ins = el?.querySelector('ins.adsbygoogle');
    if (!el || !ins) return undefined;

    // Si Google marca la unidad como sin llenar, se quita todo el contenedor.
    const watch = new MutationObserver(() => {
      if (ins.getAttribute('data-ad-status') === 'unfilled') setCollapsed(true);
    });
    watch.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });

    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting) || pushed.current) return;
      pushed.current = true; // un solo push por montaje real (StrictMode monta dos veces)
      loadAdsScript();
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch { /* el anuncio no se pudo pedir: queda el hueco reservado vacío */ }
      io.disconnect();
    }, { rootMargin: '200px' });
    io.observe(el);

    return () => { io.disconnect(); watch.disconnect(); };
  }, [enabled]);

  if (!enabled || collapsed) return null;

  const sized = SIZES[variant];
  return (
    <aside
      ref={wrapRef}
      aria-label="Publicidad"
      className={`ws-ad rounded-[8px] border border-dashed border-ws-ink/25 bg-ws-paper-deep/50 p-2 flex flex-col items-center gap-1 ${className}`}
      style={{ minHeight: MIN_HEIGHT[variant] + 28 }}
    >
      <span className="ws-mono text-[0.65rem] text-ws-ink/70">Publicidad</span>
      {import.meta.env.DEV ? (
        <div className="grid place-items-center w-full text-ws-ink/60 ws-mono" style={{ minHeight: MIN_HEIGHT[variant], ...(sized ? { width: sized.width, maxWidth: '100%' } : {}) }}>
          Anuncio · {variant}
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={sized || { display: 'block', width: '100%' }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={slot}
          {...(sized ? {} : { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' })}
          {...(import.meta.env.VITE_ADSENSE_TEST === '1' ? { 'data-adtest': 'on' } : {})}
        />
      )}
    </aside>
  );
};

export default AdSlot;

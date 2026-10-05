import React from 'react';

// Marca de Driftler: una "D" geométrica (la curva del recorrido) con un punto de color
// (el destino) y el nombre en la serif de la marca. Es vectorial: no depende de una imagen
// externa. La misma "D" se usa en el favicon y los íconos (public/icon-*.png).
export const BrandMark = ({ className = 'h-9 w-9', ink = 'var(--ws-ink)', dot = 'var(--ws-tomato)' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
    <path fillRule="evenodd" fill={ink} d="M9 7h11a13 13 0 0 1 0 26H9Zm7 7v12h4a6 6 0 0 0 0-12Z" />
    <circle cx="32.6" cy="8.6" r="3.2" fill={dot} />
  </svg>
);

const BrandLogo = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <BrandMark />
    <span className="font-display text-[1.9rem] leading-none tracking-[-0.02em] text-ws-ink">
      Drift<em className="text-ws-tomato-deep">ler</em>
    </span>
  </span>
);

export default BrandLogo;

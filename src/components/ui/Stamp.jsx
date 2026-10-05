import React, { useId } from 'react';

/**
 * Sellos de pasaporte vectoriales, puramente decorativos (aria-hidden).
 * Se pintan con currentColor (usa text-ws-tomato, text-ws-ocean...) y el filtro
 * #ws-ink les da el borde irregular y los huecos de tinta de un sello de goma.
 * Colócalos en position:absolute, rotados, solapando bordes de bloques de color.
 *
 * variant:
 *   round — sello circular: texto sobre y bajo el anillo + centro
 *   rect  — sello rectangular de entrada: país/palabra grande + fecha
 *   oval  — sello de aprobación: una palabra
 */

// Define el filtro una sola vez (se monta en MainLayout).
export const InkFilter = () => (
  <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="ws-ink" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="1" seed="4" result="wob" />
        <feDisplacementMap in="SourceGraphic" in2="wob" scale="2.4" result="shaken" />
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  12 0 0 0 -4.3" result="holes" />
        <feComposite in="shaken" in2="holes" operator="in" />
      </filter>
    </defs>
  </svg>
);

const mono = { fontFamily: '"DM Mono", ui-monospace, monospace' };
const sans = { fontFamily: '"Instrument Sans Variable", "Instrument Sans", system-ui, sans-serif' };

const Round = ({ top, bottom, center, id }) => (
  <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
    <defs>
      <path id={`${id}-t`} d="M 34,100 a 66,66 0 1,1 132,0" />
      <path id={`${id}-b`} d="M 22,100 a 78,78 0 1,0 156,0" />
    </defs>
    <circle cx="100" cy="100" r="94" strokeWidth="5" />
    <circle cx="100" cy="100" r="84" strokeWidth="1.6" />
    <circle cx="100" cy="100" r="52" strokeWidth="2" />
    <g fill="currentColor" stroke="none" style={mono} fontSize="13" fontWeight="500" letterSpacing="2.4">
      <text textAnchor="middle"><textPath href={`#${id}-t`} startOffset="50%">{top}</textPath></text>
      <text textAnchor="middle"><textPath href={`#${id}-b`} startOffset="50%">{bottom}</textPath></text>
    </g>
    <g fill="currentColor" stroke="none" textAnchor="middle">
      {center.map((line, i) => (
        <text
          key={line}
          x="100"
          y={center.length === 1 ? 108 : 94 + i * 24}
          style={i === 0 ? { ...sans, fontWeight: 800 } : mono}
          fontSize={i === 0 ? Math.max(14, Math.min(26, Math.floor(88 / (line.length * 0.66)))) : 13}
          letterSpacing={i === 0 ? 0 : 2}
        >
          {line}
        </text>
      ))}
    </g>
    <path d="M30 100h10M160 100h10" strokeWidth="2.5" />
  </svg>
);

const Rect = ({ top, center, bottom }) => (
  <svg viewBox="0 0 240 130" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="234" height="124" rx="8" strokeWidth="5" />
    <rect x="12" y="12" width="216" height="106" rx="4" strokeWidth="1.6" />
    <g fill="currentColor" stroke="none" textAnchor="middle">
      <text x="120" y="38" style={mono} fontSize="12" fontWeight="500" letterSpacing="3">{top}</text>
      <text x="120" y="82" style={{ ...sans, fontWeight: 800 }} fontSize={Math.max(18, Math.min(38, Math.floor(196 / (center.length * 0.66))))} letterSpacing="1">{center}</text>
      <text x="120" y="108" style={mono} fontSize="12" fontWeight="500" letterSpacing="3">{bottom}</text>
    </g>
    <path d="M22 50h196" strokeWidth="1.6" />
  </svg>
);

const Oval = ({ center, bottom }) => (
  <svg viewBox="0 0 240 110" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="234" height="104" rx="52" strokeWidth="5" />
    <rect x="12" y="12" width="216" height="86" rx="43" strokeWidth="1.6" />
    <g fill="currentColor" stroke="none" textAnchor="middle">
      <text x="120" y={bottom ? 62 : 68} style={{ ...sans, fontWeight: 800 }} fontSize="30" letterSpacing="3">{center}</text>
      {bottom && <text x="120" y="84" style={mono} fontSize="11" fontWeight="500" letterSpacing="3">{bottom}</text>}
    </g>
  </svg>
);

const Stamp = ({
  variant = 'round',
  top = 'WORKING HOLIDAY',
  bottom,
  center,
  rotate = -8,
  animate = false,
  solid = false, // sobre fondos oscuros, multiply apaga el color: pinta con mezcla normal
  className = '',
}) => {
  const id = useId().replace(/:/g, '');
  const body =
    variant === 'rect' ? <Rect top={top} center={center || 'Driftler'} bottom={bottom || ''} /> :
    variant === 'oval' ? <Oval center={center || 'APROBADO'} bottom={bottom} /> :
    <Round id={id} top={top} bottom={bottom || 'Driftler · 2026'} center={Array.isArray(center) ? center : [center || 'Driftler']} />;
  return (
    <span
      aria-hidden="true"
      className={`ws-stamp-ink ${solid ? 'ws-stamp-solid' : ''} pointer-events-none select-none block ${animate ? 'ws-stamp-in' : ''} ${className}`}
      style={{ '--r': `${rotate}deg`, transform: `rotate(${rotate}deg)` }}
    >
      {body}
    </span>
  );
};

export default Stamp;

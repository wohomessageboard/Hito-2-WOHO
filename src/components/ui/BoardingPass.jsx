import React from 'react';
import Stamp from './Stamp';
import { ArrowRight } from './icons';

// Código de barras decorativo: anchuras fijas (no aleatorias) para que no cambie entre renders.
const BARS = [3,1,2,1,4,1,1,3,2,1,3,1,2,4,1,2,1,1,3,2,1,4,1,2,3,1,1,2,1,3,4,1,2,1,3,2,1,1,4,2];

/**
 * Pase de abordar decorativo del hero: "Tu país → El mundo". Es ilustración
 * tipográfica, no contiene datos del usuario (por eso aria-hidden). Los
 * tickets reales de la app son las tarjetas de anuncio (PostCard).
 */
const BoardingPass = ({ className = '' }) => (
  <div aria-hidden="true" className={`relative ${className}`}>
    <div className="ws-ticket overflow-hidden rotate-[-2deg]" style={{ '--ws-stub': '5.5rem' }}>
      <div className="flex items-center justify-between bg-ws-tomato text-ws-ink px-5 py-2.5">
        <span className="ws-mono font-medium">Working Holiday Pass</span>
        <span className="ws-mono">N.º 0001</span>
      </div>

      <div className="px-5 pt-5 pb-6 grid gap-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <p className="ws-mono text-ws-ink/70">De</p>
            <p className="font-display text-4xl sm:text-5xl">Tu país</p>
          </div>
          <ArrowRight className="w-8 h-8 mb-2 text-ws-tomato-deep" />
          <div className="text-right">
            <p className="ws-mono text-ws-ink/70">A</p>
            <p className="font-display text-4xl sm:text-5xl italic">El mundo</p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 border-t border-ws-line pt-4">
          {[['Pasajero', 'Tú'], ['Visa', 'Working Holiday'], ['Puerta', 'Comunidad']].map(([k, v]) => (
            <div key={k}>
              <dt className="ws-mono text-ws-ink/70">{k}</dt>
              <dd className="font-bold text-sm sm:text-base">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="ws-ticket-stub flex items-center justify-between gap-4 px-5" style={{ height: '5.5rem' }}>
        <svg viewBox="0 0 120 40" className="h-12 w-40 text-ws-ink" preserveAspectRatio="none" fill="currentColor" focusable="false">
          {BARS.reduce((acc, w, i) => {
            const x = acc.x;
            if (i % 2 === 0) acc.rects.push(<rect key={i} x={x} y="0" width={w * 0.9} height="40" />);
            acc.x += w * 0.9 + 0.9;
            return acc;
          }, { x: 0, rects: [] }).rects}
        </svg>
        <p className="ws-mono text-right leading-snug pr-1">Nadie viaja<br />solo</p>
      </div>
    </div>

    <Stamp variant="round" center={['DRIFTLER']} top="WORKING HOLIDAY" bottom="BIENVENIDO" rotate={12} animate className="hidden sm:block absolute -bottom-16 sm:-right-14 w-28 sm:w-36 text-ws-ocean" />
    <Stamp variant="rect" top="LLEGADA" center="ARRIBO" bottom="2026" rotate={-7} className="absolute -top-12 -left-5 sm:-left-14 w-28 sm:w-36 text-ws-plum" />
  </div>
);

export default BoardingPass;

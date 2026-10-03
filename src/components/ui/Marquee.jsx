import React from 'react';
import { Star } from './icons';

/**
 * Cinta de rótulos tipo tablero de estación. Decorativa (aria-hidden): repite
 * lo que ya dice la página. Se desplaza solo sin prefers-reduced-motion y se
 * pausa al pasar el puntero.
 */
const Marquee = ({ items, className = '' }) => {
  const row = items.map((text) => (
    <span key={text} className="flex items-center gap-6 pr-6 whitespace-nowrap">
      <span className="font-display text-3xl sm:text-4xl">{text}</span>
      <Star className="w-5 h-5 text-ws-mustard shrink-0" />
    </span>
  ));
  return (
    <div aria-hidden="true" className={`ws-marquee overflow-hidden ${className}`}>
      <div className="ws-marquee-track py-3">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
};

export default Marquee;

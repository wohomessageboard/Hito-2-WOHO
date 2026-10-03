import React from 'react';
import Stamp from './Stamp';

/**
 * Estado vacío: un sello grande de "sin resultados" + texto + acción. El sello
 * orienta, pero lo primero que se lee es el mensaje y lo que se puede hacer.
 *
 * @param {string} [stamp] - palabra del sello (por defecto "SIN AVISOS")
 */
const EmptyState = ({ title, children, action, stamp = 'SIN AVISOS', className = '' }) => (
  <div className={`ws-enter ws-surface flex flex-col items-center text-center gap-4 px-6 py-12 max-w-2xl mx-auto w-full border-dashed ${className}`}>
    <Stamp variant="oval" center={stamp} bottom="WOHO" rotate={-6} className="w-44 text-ws-tomato-deep" />
    {title && <h3 className="font-display text-4xl text-ws-ink">{title}</h3>}
    <p className="font-cuerpo text-ws-ink/80 max-w-md leading-relaxed">{children}</p>
    {action}
  </div>
);

export default EmptyState;

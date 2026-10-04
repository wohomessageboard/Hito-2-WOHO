import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from './icons';

// "Sigue explorando": como máximo tres enlaces internos, para enlazar páginas del mismo tema.
const RelatedLinks = ({ title = 'Sigue explorando', links }) => (
  <nav aria-label={title} className="ws-surface p-6 md:p-8 flex flex-col gap-4">
    <h2 className="ws-mono">{title}</h2>
    <ul className="grid sm:grid-cols-3 gap-3 list-none p-0 m-0">
      {links.slice(0, 3).map(({ to, label, hint }) => (
        <li key={to}>
          <Link to={to} className="ws-surface-hover block rounded-[6px] bg-ws-paper-deep p-4 min-h-[4.5rem] ws-press">
            <span className="flex items-center justify-between gap-2 font-bold">
              {label} <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </span>
            {hint && <span className="block text-sm font-cuerpo text-ws-ink/80 mt-1">{hint}</span>}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default RelatedLinks;

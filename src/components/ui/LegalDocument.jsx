import React from 'react';
import { Link } from 'react-router-dom';
import { LEGAL_VERSION, LEGAL_UPDATED, IS_DRAFT } from '../../legal/config';

// Texto con **negrita** y [[campos por completar]] (se resaltan para que no se pasen por alto).
const inline = (text) =>
  String(text).split(/(\[\[.*?\]\]|\*\*.*?\*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('[[')) {
      return <mark key={i} className="bg-ws-mustard text-ws-ink px-1 rounded-[3px]">{part.slice(2, -2)}</mark>;
    }
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });

/**
 * Página de documento legal (Términos, Privacidad): título, versión, índice y secciones
 * numeradas. El contenido vive en src/legal/*.js para editarlo sin tocar el diseño.
 */
const LegalDocument = ({ doc, other }) => (
  <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 w-full">
    <header className="lg:col-span-12 space-y-4">
      <h1 className="font-display text-6xl md:text-8xl">{doc.title}</h1>
      <p className="ws-mono text-ws-ink/80">Versión {LEGAL_VERSION} · actualizada el {LEGAL_UPDATED}</p>
      {IS_DRAFT && (
        <p role="note" className="bg-ws-paper-light rounded-[8px] p-4 font-cuerpo leading-relaxed max-w-3xl">
          <strong>Borrador.</strong> Este texto se preparó a partir de cómo funciona WOHO y no reemplaza la asesoría de una persona abogada. Los datos resaltados como <mark className="bg-ws-mustard px-1 rounded-[3px]">[[así]]</mark> faltan por completar o decidir, y el documento debe revisarse antes de publicarse como definitivo.
        </p>
      )}
      <p className="font-cuerpo text-lg leading-relaxed max-w-3xl text-ws-ink/90">{doc.intro}</p>
    </header>

    <nav aria-label="Índice" className="lg:col-span-3 lg:sticky lg:top-28 self-start">
      <h2 className="ws-mono mb-3">Contenido</h2>
      <ol className="list-none p-0 m-0 flex flex-col gap-1.5 font-cuerpo text-sm">
        {doc.sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="underline-offset-4 hover:underline">{i + 1}. {s.title}</a>
          </li>
        ))}
      </ol>
      {other && (
        <p className="mt-6 font-cuerpo text-sm">
          Léelo junto con la <Link to={other.to} className="font-bold underline underline-offset-4">{other.label}</Link>.
        </p>
      )}
    </nav>

    <div className="lg:col-span-9 flex flex-col gap-10 max-w-3xl">
      {doc.sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-28 space-y-4">
          <h2 id={`${s.id}-t`} className="font-display text-4xl md:text-5xl">{i + 1}. {s.title}</h2>
          {s.blocks.map((b, j) =>
            typeof b === 'string' ? (
              <p key={j} className="font-cuerpo text-lg leading-relaxed">{inline(b)}</p>
            ) : (
              <ul key={j} className="font-cuerpo text-lg leading-relaxed list-disc pl-6 space-y-2">
                {b.list.map((item, k) => <li key={k}>{inline(item)}</li>)}
              </ul>
            )
          )}
        </section>
      ))}
    </div>
  </div>
);

export default LegalDocument;

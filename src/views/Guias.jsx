import React from 'react';
import { Link } from 'react-router-dom';
import Stamp from '../components/ui/Stamp';
import RelatedLinks from '../components/ui/RelatedLinks';
import { ArrowRight } from '../components/ui/icons';
import { GUIAS, ACUERDOS_CHILE, FUENTE_CHILE, CONSEJOS_GENERALES } from '../data/guias';

const INKS = ['text-ws-tomato-deep', 'text-ws-ocean', 'text-ws-plum', 'text-ws-olive'];

// Resumen de una línea por guía, tomado de sus datos clave (así no se desactualiza aparte).
const dato = (g, etiqueta) => g.datos.find(([k]) => k === etiqueta)?.[1];

const Guias = () => (
  <div className="flex flex-col gap-12 md:gap-16 w-full">
    <header className="relative grid md:grid-cols-12 gap-6 items-end">
      <h1 className="md:col-span-7 font-display text-6xl md:text-8xl">
        Guías de <em className="text-ws-accent">visa</em>
      </h1>
      <p className="md:col-span-5 lg:pr-28 font-cuerpo text-lg text-ws-ink/85 leading-relaxed">
        Requisitos, costos y pasos de la visa Working Holiday en cada país, con la fuente oficial y la fecha de revisión. Escritas para personas con pasaporte chileno.
      </p>
      <Stamp variant="round" center={['GUÍAS']} top="WORKING HOLIDAY" bottom="PASO A PASO" rotate={-10} className="hidden lg:block absolute -top-4 right-0 w-28 text-ws-plum" />
    </header>

    <section aria-label="Guías disponibles" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {GUIAS.map((g, i) => (
        <Link key={g.slug} to={`/guias/${g.slug}`} className="ws-surface ws-surface-hover group flex flex-col gap-3 p-5 md:p-6 min-h-[14rem]">
          <span className="flex items-start justify-between">
            <span className="text-4xl leading-none" aria-hidden="true">{g.flag}</span>
            <span className={`ws-mono ${INKS[i % INKS.length]}`}>{g.visa.split(',')[0].split('(')[0].trim()}</span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl">{g.pais}</h2>
          <ul className="list-none p-0 m-0 font-cuerpo text-ws-ink/85 space-y-1">
            {dato(g, 'Edad') && <li>{dato(g, 'Edad')}</li>}
            {(dato(g, 'Duración')) && <li>{dato(g, 'Duración')}</li>}
          </ul>
          <span className="mt-auto flex items-center gap-2 font-bold">
            Leer la guía <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      ))}
    </section>

    <section aria-labelledby="acuerdos" className="ws-surface p-6 md:p-8 flex flex-col gap-5">
      <h2 id="acuerdos" className="font-display text-4xl md:text-5xl">
        Países con acuerdo con <em className="text-ws-accent">Chile</em>
      </h2>
      <p className="font-cuerpo text-lg leading-relaxed text-ws-ink/90 max-w-3xl">
        Según la Cancillería de Chile, estos son los países con los que existe un acuerdo Working Holiday. Los que ya tienen guía llevan enlace; las demás las iremos agregando.
      </p>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 list-none p-0 m-0 font-cuerpo text-lg">
        {ACUERDOS_CHILE.map((p) => (
          <li key={p.name} className="flex items-center gap-2 min-h-8">
            <span aria-hidden="true">{p.flag}</span>
            {p.slug ? <Link to={`/guias/${p.slug}`} className="font-bold underline underline-offset-4">{p.name}</Link> : <span>{p.name}</span>}
          </li>
        ))}
      </ul>
      <p className="font-cuerpo text-sm text-ws-ink/80">
        Fuente: <a href={FUENTE_CHILE.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{FUENTE_CHILE.label}</a>. Los requisitos cambian según tu nacionalidad: si tu pasaporte no es chileno, revisa el sitio oficial de cada país.
      </p>
    </section>

    <section aria-labelledby="para-cualquier-destino" className="space-y-6">
      <h2 id="para-cualquier-destino" className="font-display text-5xl md:text-6xl">
        Para cualquier <em className="text-ws-accent">destino</em>
      </h2>
      <ul className="list-none p-0 m-0 grid md:grid-cols-2 gap-4">
        {CONSEJOS_GENERALES.map((t) => (
          <li key={t} className="ws-surface p-5 font-cuerpo text-lg leading-relaxed flex gap-3">
            <span aria-hidden="true" className="text-ws-accent font-bold">→</span><span>{t}</span>
          </li>
        ))}
      </ul>
    </section>

    <p className="font-cuerpo text-sm text-ws-ink/80 max-w-3xl">
      Estas guías son informativas y no reemplazan la asesoría de un profesional de migración. Las reglas cambian: antes de pagar o viajar, confirma todo en la fuente oficial que enlazamos en cada guía.
    </p>

    <RelatedLinks links={[
      { to: '/destinos', label: 'Ver destinos', hint: 'Avisos de la comunidad por país.' },
      { to: '/feed', label: 'Explorar anuncios', hint: 'Trabajo y alojamiento vigentes.' },
      { to: '/como-funciona', label: 'Cómo funciona', hint: 'Usa Driftler en cuatro pasos.' },
    ]} />
  </div>
);

export default Guias;

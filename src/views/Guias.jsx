import React from 'react';
import { Link } from 'react-router-dom';
import Stamp from '../components/ui/Stamp';
import RelatedLinks from '../components/ui/RelatedLinks';
import { ArrowRight } from '../components/ui/icons';
import { ORIGENES, guiasDe, CONSEJOS_GENERALES } from '../data/guias';

// Portada de las guías: lo primero que cambia el trámite es el pasaporte, así que se elige ahí.
const Guias = () => (
  <div className="flex flex-col gap-12 md:gap-16 w-full">
    <header className="relative grid md:grid-cols-12 gap-6 items-end">
      <h1 className="md:col-span-7 font-display text-6xl md:text-8xl">
        Guías de <em className="text-ws-accent">visa</em>
      </h1>
      <p className="md:col-span-5 lg:pr-28 font-cuerpo text-lg text-ws-ink/85 leading-relaxed">
        La visa Working Holiday cambia según tu pasaporte: edad, cupos y trabajo permitido no son iguales para todos. Elige el tuyo.
      </p>
      <Stamp variant="round" center={['GUÍAS']} top="WORKING HOLIDAY" bottom="PASO A PASO" rotate={-10} className="hidden lg:block absolute -top-4 right-0 w-28 text-ws-plum" />
    </header>

    <Link to="/guias/buscador" className="ws-surface ws-surface-hover group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-5 md:p-6 bg-ws-mustard">
      <span className="font-display text-3xl md:text-4xl">¿A qué países puedo ir?</span>
      <span className="font-cuerpo text-lg flex-1">Elige tu pasaporte y tu edad y compara los destinos lado a lado.</span>
      <span className="flex items-center gap-2 font-bold">Abrir el buscador <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
    </Link>

    <section aria-label="Elige tu pasaporte" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {ORIGENES.map((o) => {
        const n = guiasDe(o.slug).length;
        return (
          <Link key={o.slug} to={`/guias/${o.slug}`} className="ws-surface ws-surface-hover group flex flex-col gap-3 p-5 md:p-6 min-h-[13rem]">
            <span className="text-5xl leading-none" aria-hidden="true">{o.flag}</span>
            <h2 className="font-display text-3xl md:text-4xl">Pasaporte {o.pasaporte}</h2>
            <p className="font-cuerpo text-ws-ink/85">
              {o.listaCompleta ? `${o.acuerdos.length} países con acuerdo` : `${o.acuerdos.length} ${o.acuerdos.length === 1 ? 'destino confirmado' : 'destinos confirmados'}`}{n ? ` · ${n} ${n === 1 ? 'guía lista' : 'guías listas'}` : ''}
            </p>
            <span className="mt-auto flex items-center gap-2 font-bold">
              Ver acuerdos y guías <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        );
      })}
      <div className="ws-surface p-5 md:p-6 flex flex-col gap-3 min-h-[13rem] border-dashed">
        <span className="text-5xl leading-none" aria-hidden="true">🌎</span>
        <h2 className="font-display text-3xl md:text-4xl">¿Tu pasaporte no está?</h2>
        <p className="font-cuerpo text-ws-ink/85">Vamos sumando más pasaportes, como Uruguay y Brasil. Cuéntanos cuál necesitas.</p>
        <Link to="/contacto" className="mt-auto font-bold underline underline-offset-4">Escríbenos</Link>
      </div>
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

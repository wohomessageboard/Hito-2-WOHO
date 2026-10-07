import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@heroui/react';
import Stamp from '../components/ui/Stamp';
import RelatedLinks from '../components/ui/RelatedLinks';
import { ArrowRight } from '../components/ui/icons';
import { origenPorSlug, guiasDe, guiaPor } from '../data/guias';

const INKS = ['text-ws-tomato-deep', 'text-ws-ocean', 'text-ws-plum', 'text-ws-olive'];
const dato = (g, etiqueta) => g.datos.find(([k]) => k === etiqueta)?.[1];
const fechaLarga = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

// Guías y acuerdos de un pasaporte: /guias/<origen>
const Origen = () => {
  const { origen } = useParams();
  const o = origenPorSlug(origen);

  if (!o) {
    return (
      <div className="flex flex-col gap-6 py-10">
        <h1 className="font-display text-5xl md:text-7xl">Ese pasaporte <em className="text-ws-accent">aún no está</em></h1>
        <p className="font-cuerpo text-lg">Todavía no tenemos guías para ese pasaporte. Mira las que sí están.</p>
        <div><Button as={Link} to="/guias" radius="sm" className="ws-btn ws-btn-ink h-12 px-6">Ver todas las guías</Button></div>
      </div>
    );
  }

  const guias = guiasDe(o.slug);

  return (
    <div className="flex flex-col gap-12 md:gap-16 w-full">
      <header className="relative flex flex-col gap-5">
        <p className="ws-mono flex items-center gap-2"><span aria-hidden="true" className="text-2xl">{o.flag}</span> Guías de visa · pasaporte {o.pasaporte}</p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl max-w-4xl">
          Working Holiday para <em className="text-ws-accent">{o.gentilicio}</em>
        </h1>
        <p className="font-cuerpo text-lg md:text-xl leading-relaxed text-ws-ink/90 max-w-3xl">
          Países con los que {o.nombre} tiene acuerdo Working Holiday y guía de cada destino con los requisitos que corresponden a tu pasaporte.
        </p>
        <p className="ws-mono text-ws-ink/70">Revisada el {fechaLarga(o.revisado)}</p>
        <Stamp variant="round" center={[o.nombre.toUpperCase()]} top="WORKING HOLIDAY" bottom="GUÍAS" rotate={-10} className="hidden lg:block absolute -top-2 right-0 w-28 text-ws-plum" />
      </header>

      {guias.length > 0 && (
        <section aria-labelledby="guias-listas" className="space-y-6">
          <h2 id="guias-listas" className="font-display text-4xl md:text-5xl">Guías <em className="text-ws-accent">disponibles</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {guias.map((g, i) => (
              <Link key={g.slug} to={`/guias/${o.slug}/${g.slug}`} className="ws-surface ws-surface-hover group flex flex-col gap-3 p-5 md:p-6 min-h-[14rem]">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-4xl leading-none" aria-hidden="true">{g.flag}</span>
                  <span className={`ws-mono text-right ${INKS[i % INKS.length]}`}>{g.visa.split(',')[0].split('(')[0].trim()}</span>
                </span>
                <h3 className="font-display text-3xl md:text-4xl">{g.pais}</h3>
                <ul className="list-none p-0 m-0 font-cuerpo text-ws-ink/85 space-y-1">
                  {dato(g, 'Edad') && <li>{dato(g, 'Edad')}</li>}
                  {dato(g, 'Duración') && <li>{dato(g, 'Duración')}</li>}
                </ul>
                <span className="mt-auto flex items-center gap-2 font-bold">
                  Leer la guía <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="acuerdos" className="ws-surface p-6 md:p-8 flex flex-col gap-5">
        <h2 id="acuerdos" className="font-display text-4xl md:text-5xl">
          Países con acuerdo con <em className="text-ws-accent">{o.nombre}</em>
        </h2>
        <p className="font-cuerpo text-lg leading-relaxed text-ws-ink/90 max-w-3xl">
          {o.nota} Los que ya tienen guía llevan enlace; las demás las iremos agregando.
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 list-none p-0 m-0 font-cuerpo text-lg">
          {o.acuerdos.map((p) => (
            <li key={p.name} className="flex items-center gap-2 min-h-8">
              <span aria-hidden="true">{p.flag}</span>
              {guiaPor(o.slug, p.slug)
                ? <Link to={`/guias/${o.slug}/${p.slug}`} className="font-bold underline underline-offset-4">{p.name}</Link>
                : <span>{p.name}</span>}
            </li>
          ))}
        </ul>
        <p className="font-cuerpo text-sm text-ws-ink/80">
          Fuente: <a href={o.fuente.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{o.fuente.label}</a>. Los requisitos dependen de tu pasaporte y cambian cada año: confirma siempre en el sitio oficial del país de destino.
        </p>
      </section>

      <RelatedLinks links={[
        { to: '/guias', label: 'Otros pasaportes', hint: 'Guías para otras nacionalidades.' },
        { to: '/destinos', label: 'Ver destinos', hint: 'Avisos de la comunidad por país.' },
        { to: '/feed', label: 'Explorar anuncios', hint: 'Trabajo y alojamiento vigentes.' },
      ]} />
    </div>
  );
};

export default Origen;

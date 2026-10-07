import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Accordion, AccordionItem, Button } from '@heroui/react';
import Stamp from '../components/ui/Stamp';
import ShareLinks from '../components/ui/ShareLinks';
import RelatedLinks from '../components/ui/RelatedLinks';
import { guiaPor, guiasDe, origenPorSlug, CONSEJOS_GENERALES } from '../data/guias';

const fechaLarga = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

const Guia = () => {
  const { origen, slug } = useParams();
  const g = guiaPor(origen, slug);
  const o = origenPorSlug(origen);

  if (!g) {
    return (
      <div className="flex flex-col gap-6 py-10">
        <h1 className="font-display text-5xl md:text-7xl">Esa guía <em className="text-ws-accent">no existe</em></h1>
        <p className="font-cuerpo text-lg">Todavía no tenemos esa guía. Mira las que sí están.</p>
        <div><Button as={Link} to={o ? `/guias/${o.slug}` : '/guias'} radius="sm" className="ws-btn ws-btn-ink h-12 px-6">Ver todas las guías</Button></div>
      </div>
    );
  }

  const otras = guiasDe(g.origen).filter((x) => x.slug !== g.slug).slice(0, 2);

  return (
    <article className="flex flex-col gap-12 md:gap-16 w-full">
      <header className="relative flex flex-col gap-5">
        <p className="ws-mono flex items-center gap-2"><span aria-hidden="true" className="text-2xl">{g.flag}</span> Guía de visa · pasaporte {o.pasaporte} · {g.visa}</p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl max-w-4xl">{g.titulo}</h1>
        <p className="font-cuerpo text-lg md:text-xl leading-relaxed text-ws-ink/90 max-w-3xl">{g.resumen}</p>
        <p className="ws-mono text-ws-ink/70">Revisada el {fechaLarga(g.revisado)}</p>
        <Stamp variant="round" center={[g.pais.toUpperCase()]} top="WORKING HOLIDAY" bottom="GUÍA" rotate={-10} className="hidden lg:block absolute -top-2 right-0 w-28 text-ws-plum" />
      </header>

      {g.aviso && (
        <aside role="note" className="ws-band-mustard rounded-[6px] border-2 border-ws-ink p-5 md:p-6 font-cuerpo text-lg leading-relaxed bg-ws-mustard text-ws-ink">
          <strong>Ojo: </strong>{g.aviso}
        </aside>
      )}

      <section aria-labelledby="datos" className="ws-surface p-6 md:p-8">
        <h2 id="datos" className="font-display text-4xl md:text-5xl mb-5">Datos <em className="text-ws-accent">clave</em></h2>
        <dl className="grid sm:grid-cols-[14rem_1fr] gap-x-8 gap-y-3 font-cuerpo text-lg m-0">
          {g.datos.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="font-bold">{k}</dt>
              <dd className="m-0 text-ws-ink/90 border-b border-ws-ink/15 pb-3 sm:border-0 sm:pb-0">{v}</dd>
            </React.Fragment>
          ))}
        </dl>
      </section>

      <section aria-labelledby="pasos" className="space-y-6">
        <h2 id="pasos" className="font-display text-4xl md:text-5xl">Cómo <em className="text-ws-accent">se pide</em></h2>
        <ol className="list-none p-0 m-0 flex flex-col gap-4">
          {g.pasos.map((p, i) => (
            <li key={p} className="ws-surface grid grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_1fr] items-start overflow-hidden">
              <span className="font-display text-5xl md:text-6xl leading-none p-4 md:p-5 bg-ws-mustard text-ws-ink h-full" aria-hidden="true">{i + 1}</span>
              <p className="p-4 md:p-5 font-cuerpo text-lg leading-relaxed"><span className="sr-only">Paso {i + 1}: </span>{p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="trabajo" className="space-y-4 max-w-3xl">
        <h2 id="trabajo" className="font-display text-4xl md:text-5xl">Trabajar con <em className="text-ws-accent">esta visa</em></h2>
        {g.trabajo.map((t) => <p key={t} className="font-cuerpo text-lg leading-relaxed text-ws-ink/90">{t}</p>)}
      </section>

      <section aria-labelledby="consejos" className="ws-band ws-band-ink ws-bleed py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8">
          <h2 id="consejos" className="md:col-span-4 font-display text-4xl md:text-6xl">Antes de <em className="text-ws-mustard">viajar</em></h2>
          <ul className="md:col-span-8 list-none p-0 m-0 flex flex-col divide-y divide-ws-paper-light/25">
            {[...g.consejos, ...CONSEJOS_GENERALES.slice(0, 2)].map((t) => (
              <li key={t} className="py-4 first:pt-0 font-cuerpo text-lg leading-relaxed">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="preguntas" className="space-y-6">
        <h2 id="preguntas" className="font-display text-4xl md:text-5xl">Preguntas <em className="text-ws-accent">frecuentes</em></h2>
        <Accordion variant="splitted" selectionMode="multiple" itemClasses={{ base: 'ws-surface !shadow-none px-2', title: 'font-bold text-lg', trigger: 'min-h-14 py-3', content: 'pb-5 font-cuerpo text-lg leading-relaxed text-ws-ink/90' }}>
          {g.faq.map(([q, a]) => <AccordionItem key={q} aria-label={q} title={q}>{a}</AccordionItem>)}
        </Accordion>
      </section>

      <section aria-labelledby="fuentes" className="ws-surface p-6 md:p-8 flex flex-col gap-4">
        <h2 id="fuentes" className="font-display text-4xl md:text-5xl">Fuentes <em className="text-ws-accent">oficiales</em></h2>
        <p className="font-cuerpo text-ws-ink/85">Los datos de esta guía salen de estas páginas. Revísalas antes de pagar o viajar: las reglas, los montos y los cupos pueden cambiar.</p>
        <ul className="list-none p-0 m-0 flex flex-col gap-2 font-cuerpo text-lg">
          {g.enlaces.map((e) => (
            <li key={e.href}><a href={e.href} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4 break-words">{e.label}</a></li>
          ))}
        </ul>
        <p className="font-cuerpo text-sm text-ws-ink/80">Esta guía es informativa y no reemplaza la asesoría de un profesional de migración. Está escrita para personas con pasaporte {o.pasaporte}; con otra nacionalidad los requisitos pueden ser distintos.</p>
      </section>

      <section aria-label="Compartir" className="flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="font-bold">¿Conoces a alguien que quiere viajar a {g.pais}?</p>
        <ShareLinks url={`${window.location.origin}/guias/${g.origen}/${g.slug}`} title={g.titulo} text={`${g.titulo}:`} />
      </section>

      <RelatedLinks links={[
        g.destino
          ? { to: `/destinos/${g.destino}`, label: `Avisos en ${g.pais}`, hint: 'Trabajo y alojamiento de la comunidad.' }
          : { to: '/destinos', label: 'Ver destinos', hint: 'Avisos de la comunidad por país.' },
        ...otras.map((x) => ({ to: `/guias/${g.origen}/${x.slug}`, label: `Guía: ${x.pais}`, hint: x.visa })),
      ]} />
    </article>
  );
};

export default Guia;

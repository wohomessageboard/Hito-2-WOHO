import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Input, Select, SelectItem } from '@heroui/react';
import Stamp from '../components/ui/Stamp';
import RelatedLinks from '../components/ui/RelatedLinks';
import { ArrowRight } from '../components/ui/icons';
import { ORIGENES, guiasDe, edadMaxDe, etiquetaDe, EDAD_MIN } from '../data/guias';

// Filas de la comparación, con las etiquetas con que cada guía las llama en «Datos clave».
const FILAS = [
  ['Edad', ['Edad']],
  ['Duración', ['Duración']],
  ['Costo', ['Costo']],
  ['Cupo', ['Cupo', 'Cupo anual', 'Cupos']],
  ['Trabajo', ['Trabajo', 'Con un mismo empleador']],
];
const valor = (g, etiquetas) => g.datos.find(([k]) => etiquetas.includes(k))?.[1] || null;

// Buscador: eliges pasaporte y edad y compara los destinos de ese pasaporte lado a lado.
// La edad es solo un filtro: cupos, estudios y fondos se explican en cada guía.
const Buscador = () => {
  const [params, setParams] = useSearchParams();
  const pasaporte = ORIGENES.some((o) => o.slug === params.get('pasaporte')) ? params.get('pasaporte') : '';
  const edadTexto = params.get('edad') || '';
  const edad = /^\d{1,2}$/.test(edadTexto) ? Number(edadTexto) : null;

  const set = (clave, valorNuevo) => {
    const next = new URLSearchParams(params);
    if (valorNuevo) next.set(clave, valorNuevo); else next.delete(clave);
    setParams(next, { replace: true });
  };

  const origen = ORIGENES.find((o) => o.slug === pasaporte);
  const resultados = useMemo(() => {
    if (!origen) return [];
    const lista = guiasDe(origen.slug).map((g) => {
      const max = edadMaxDe(g);
      const estado = edad == null || max == null ? 'neutro' : edad >= EDAD_MIN && edad <= max ? 'si' : 'no';
      return { g, max, estado };
    });
    const peso = { si: 0, neutro: 1, no: 2 };
    return lista.sort((a, b) => peso[a.estado] - peso[b.estado] || a.g.pais.localeCompare(b.g.pais, 'es'));
  }, [origen, edad]);
  const cumplen = resultados.filter((r) => r.estado === 'si').length;

  return (
    <div className="flex flex-col gap-12 md:gap-14 w-full">
      <header className="relative grid md:grid-cols-12 gap-6 items-end">
        <h1 className="md:col-span-8 font-display text-5xl sm:text-6xl md:text-7xl">
          ¿A qué países <em className="text-ws-accent">puedo ir?</em>
        </h1>
        <p className="md:col-span-4 lg:pr-28 font-cuerpo text-lg text-ws-ink/85 leading-relaxed">
          Elige tu pasaporte y tu edad y compara los destinos con visa Working Holiday que tienen guía en Driftler.
        </p>
        <Stamp variant="round" center={['BUSCA']} top="WORKING HOLIDAY" bottom="TU VISA" rotate={-10} className="hidden lg:block absolute -top-4 right-0 w-28 text-ws-plum" />
      </header>

      <section aria-label="Filtros" className="ws-surface p-6 md:p-8 grid sm:grid-cols-[1fr_12rem] gap-5 items-end">
        <Select
          label="Mi pasaporte"
          labelPlacement="outside"
          placeholder="Elige tu pasaporte"
          radius="sm"
          disallowEmptySelection={false}
          selectedKeys={pasaporte ? [pasaporte] : []}
          onSelectionChange={(keys) => set('pasaporte', [...keys][0] || '')}
          classNames={{ trigger: 'ws-input-border h-12', label: 'font-bold text-ws-ink' }}
        >
          {ORIGENES.map((o) => <SelectItem key={o.slug}>{`${o.flag} ${o.nombre}`}</SelectItem>)}
        </Select>
        <Input
          type="number"
          inputMode="numeric"
          min={EDAD_MIN}
          max={60}
          label="Mi edad"
          labelPlacement="outside"
          placeholder="Ej: 28"
          radius="sm"
          value={edadTexto}
          onValueChange={(v) => set('edad', v.replace(/\D/g, '').slice(0, 2))}
          classNames={{ inputWrapper: 'ws-input-border h-12', label: 'font-bold text-ws-ink' }}
        />
      </section>

      {!origen && (
        <p role="status" className="font-cuerpo text-lg text-ws-ink/85 max-w-2xl">
          Empieza eligiendo tu pasaporte. Si no ves el tuyo, <Link to="/contacto" className="font-bold underline underline-offset-4">escríbenos</Link> y lo sumamos.
        </p>
      )}

      {origen && (
        <section aria-labelledby="resultados" className="space-y-6">
          <h2 id="resultados" className="font-display text-3xl md:text-4xl">
            {edad == null
              ? <>Destinos para pasaporte {origen.pasaporte}</>
              : edad < EDAD_MIN
                ? <>Hay que tener al menos {EDAD_MIN} años</>
                : <>Con {edad} años puedes postular a {cumplen} de {resultados.length} destinos</>}
          </h2>
          {edad != null && edad >= EDAD_MIN && (
            <p className="font-cuerpo text-ws-ink/85 max-w-3xl">
              Contamos solo la edad. Antes de planificar, abre cada guía: los cupos, los estudios exigidos y los fondos también cuentan.
            </p>
          )}

          <ul className="list-none p-0 m-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {resultados.map(({ g, max, estado }) => (
              <li key={g.slug} className={`ws-surface flex flex-col gap-4 p-5 md:p-6 ${estado === 'no' ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl leading-none" aria-hidden="true">{g.flag}</span>
                  <span title={g.visa} className="ws-mono text-right text-ws-ocean">{etiquetaDe(g)}</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl">{g.pais}</h3>
                {estado === 'si' && <span className="ws-tag ws-tag-olive self-start">Cumples la edad (hasta {max})</span>}
                {estado === 'no' && <span className="ws-tag ws-tag-ink self-start">{edad < EDAD_MIN ? 'Aún no cumples la edad mínima' : `El límite es ${max} años`}</span>}
                {estado === 'neutro' && edad != null && max == null && <span className="ws-tag ws-tag-ink self-start">Revisa la edad en la guía</span>}
                <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 font-cuerpo text-sm m-0">
                  {FILAS.map(([nombre, etiquetas]) => (
                    <React.Fragment key={nombre}>
                      <dt className="font-bold">{nombre}</dt>
                      <dd className="m-0 text-ws-ink/90">{valor(g, etiquetas) || 'Mira la guía'}</dd>
                    </React.Fragment>
                  ))}
                </dl>
                <Link to={`/guias/${g.origen}/${g.slug}`} className="mt-auto flex items-center gap-2 font-bold group">
                  Leer la guía <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="font-cuerpo text-sm text-ws-ink/80 max-w-3xl">
        Información de las fuentes oficiales enlazadas en cada guía, con su fecha de revisión. No reemplaza la asesoría de un profesional de migración: confirma siempre en el sitio oficial antes de pagar o viajar.
      </p>

      <RelatedLinks links={[
        { to: '/guias', label: 'Todas las guías', hint: 'Por pasaporte y destino.' },
        { to: '/destinos', label: 'Ver destinos', hint: 'Avisos de la comunidad por país.' },
        { to: '/como-funciona', label: 'Cómo funciona', hint: 'Usa Driftler en cuatro pasos.' },
      ]} />
    </div>
  );
};

export default Buscador;

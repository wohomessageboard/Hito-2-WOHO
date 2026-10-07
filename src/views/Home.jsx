import React from 'react';
import { Button } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Search, Home as HomeIcon, Users, Briefcase, ArrowRight } from '../components/ui/icons';
import BoardingPass from '../components/ui/BoardingPass';
import Marquee from '../components/ui/Marquee';
import Stamp from '../components/ui/Stamp';

// Tablero de salidas: una fila por categoría, con su color de etiqueta.
const DEPARTURES = [
  {
    code: 'ALJ',
    name: 'Alojamiento',
    Icon: HomeIcon,
    text: 'Encuentra o publica cuartos libres, casas rodantes y hostels. Ideal para dividir la renta.',
    hover: 'hover:bg-ws-teal',
  },
  {
    code: 'TRB',
    name: 'Trabajo de temporada',
    Icon: Briefcase,
    text: 'Cosechas, hospitalidad o construcción. Los mejores datos pasados de viajero a viajero.',
    hover: 'hover:bg-ws-tomato',
  },
  {
    code: 'SOC',
    name: 'Social y rutas',
    Icon: Users,
    text: 'Busca compañeros para hacer roadtrips, comprar un auto a medias o tomar unas cervezas.',
    hover: 'hover:bg-ws-citron',
  },
];

const Home = () => {
  return (
    <div className="flex flex-col gap-14 md:gap-20 -mb-16">

      {/* Hero: pertenencia y partida */}
      <section className="grid lg:grid-cols-12 gap-14 lg:gap-8 items-center pt-4 lg:pt-10">
        <div className="lg:col-span-7 space-y-8">
          <h1 className="font-display text-6xl sm:text-7xl xl:text-8xl text-ws-ink">
            El coraje de migrar, <em className="text-ws-accent">la fuerza de unirse.</em>
          </h1>
          <p className="text-lg md:text-xl font-cuerpo text-ws-ink/85 max-w-xl leading-relaxed">
            La comunidad oficial Working Holiday: un ecosistema de apoyo mutuo diseñado para viajeros. Encuentra trabajo, hogar y la mano amiga que necesitas para triunfar en tu destino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              as={Link}
              to="/feed"
              size="lg"
              radius="sm"
              className="ws-btn ws-btn-tomato w-full sm:w-auto h-14 px-8 text-lg"
              endContent={<Search className="w-5 h-5" aria-hidden="true" />}
            >
              Explorar anuncios
            </Button>
            <Button
              as={Link}
              to="/manifiesto"
              size="lg"
              radius="sm"
              className="ws-btn ws-btn-quiet w-full sm:w-auto h-14 px-8 text-lg"
            >
              Ver manifiesto
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 relative px-3 sm:px-8 lg:px-0 py-6">
          <div aria-hidden="true" className="absolute inset-x-0 inset-y-0 sm:inset-x-4 bg-ws-teal rotate-[3deg] rounded-[10px]" />
          <BoardingPass className="relative max-w-md mx-auto" />
        </div>
      </section>

      {/* Cinta de rótulos */}
      <Marquee
        className="ws-band ws-band-ink ws-bleed text-ws-paper-light"
        items={['Alojamiento', 'Trabajo de temporada', 'Compañeros de ruta', 'De viajero a viajero', 'Sin algoritmo, sin relleno']}
      />

      {/* Lo que nos distingue: los avisos caducan */}
      <section aria-labelledby="avisos-caducan" className="ws-band ws-band-mustard ws-bleed py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 md:gap-10 items-center relative">
          <h2 id="avisos-caducan" className="md:col-span-7 font-display text-5xl sm:text-6xl xl:text-7xl">
            Los avisos <em>caducan.</em> Lo que lees, está vigente.
          </h2>
          <div className="md:col-span-5 space-y-4 font-cuerpo text-lg md:text-xl leading-relaxed">
            <p>Cada aviso dura como máximo <strong>30 días</strong> y después desaparece. Nada de cuartos que ya se ocuparon ni de trabajos de hace meses.</p>
            <p>Quien publica elige cuánto tiempo estará visible, y quien busca siempre encuentra información fresca.</p>
          </div>
          <Stamp variant="rect" center="30 DÍAS" top="VIGENTE" bottom="MÁXIMO" rotate={-6} className="hidden lg:block absolute -top-10 right-2 w-32 text-ws-ink" />
        </div>
      </section>

      {/* Nadie se salva solo */}
      <section
        aria-labelledby="nadie-se-salva-solo"
        className="ws-band ws-band-ocean ws-bleed py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-10 items-end relative">
          <h2 id="nadie-se-salva-solo" className="md:col-span-7 font-display text-6xl sm:text-7xl xl:text-8xl">
            Nadie se salva <em className="text-ws-mustard">solo.</em>
          </h2>
          <p className="md:col-span-5 font-cuerpo text-lg md:text-xl leading-relaxed text-ws-paper-light/95">
            Únete a una red donde quienes ya recorrieron el camino iluminan el sendero a los que recién llegan. Solidaridad real en cada rincón del mundo.
          </p>
          <Stamp solid variant="oval" center="CONFIRMADO" bottom="COMUNIDAD" rotate={-6} className="hidden lg:block absolute -top-14 right-4 w-36 text-ws-mustard" />
        </div>
      </section>

      {/* Tablero de salidas: categorías */}
      <section aria-labelledby="todo-lo-que-necesitas" className="space-y-10">
        <div className="grid md:grid-cols-12 gap-6 items-end">
          <h2 id="todo-lo-que-necesitas" className="md:col-span-7 font-display text-5xl md:text-7xl text-ws-ink">
            Todo lo que <em>necesitas</em>
          </h2>
          <p className="md:col-span-5 font-cuerpo text-lg text-ws-ink/80 leading-relaxed">
            Categorías concretas, sin algoritmo ni relleno. Lo que la gente publica es lo que ves.
          </p>
        </div>

        <ul className="border-t border-ws-ink/25">
          {DEPARTURES.map(({ code, name, Icon, text, hover }) => (
            <li key={code} className="border-b border-ws-ink/25">
              <Link
                to="/feed"
                className={`group grid grid-cols-[auto_1fr_auto] md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.1fr)_auto] items-center gap-x-5 gap-y-2 py-6 md:py-8 px-3 md:px-5 transition-colors ${hover}`}
              >
                <span className="ws-mono font-medium text-lg flex items-center gap-3">
                  <Icon className="w-8 h-8" aria-hidden="true" />
                  <span className="hidden md:inline">{code}</span>
                </span>
                <span className="font-display text-4xl md:text-6xl">{name}</span>
                <span className="col-span-3 md:col-span-1 md:col-start-3 row-start-2 md:row-start-1 font-cuerpo text-base md:text-lg leading-relaxed text-ws-ink/85">{text}</span>
                <span className="col-start-3 md:col-start-4 row-start-1 grid place-items-center w-11 h-11 rounded-[6px] bg-ws-paper-deep group-hover:bg-ws-ink group-hover:text-ws-paper-light transition-colors" aria-hidden="true">
                  <ArrowRight className="w-6 h-6" />
                </span>
                <span className="sr-only">Ver anuncios de {name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Antes de viajar: guías y buscador de visas */}
      <section aria-labelledby="antes-de-viajar" className="ws-surface p-6 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
        <div className="space-y-3">
          <h2 id="antes-de-viajar" className="font-display text-4xl md:text-6xl">Antes de viajar, mira a qué países <em className="text-ws-accent">puedes ir</em></h2>
          <p className="font-cuerpo text-lg text-ws-ink/85 max-w-2xl leading-relaxed">
            Elige tu pasaporte y tu edad y compara las visas Working Holiday: cupos, costos y trabajo permitido, con la fuente oficial de cada país.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button as={Link} to="/guias/buscador" size="lg" radius="sm" className="ws-btn ws-btn-tomato h-14 px-8 text-lg w-full md:w-auto">
            Abrir el buscador
          </Button>
          <Button as={Link} to="/guias" size="lg" radius="sm" className="ws-btn ws-btn-quiet h-14 px-8 text-lg w-full md:w-auto">
            Ver las guías
          </Button>
        </div>
      </section>

      {/* CTA final */}
      <section className="ws-band ws-band-teal ws-bleed py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-5xl md:text-7xl">¿Listo para <em>sumarte?</em></h2>
            <p className="font-cuerpo text-lg md:text-xl max-w-xl">Crea tu cuenta y empieza a construir tu red global hoy mismo.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              as={Link}
              to="/como-funciona"
              size="lg"
              radius="sm"
              className="ws-btn ws-btn-quiet h-14 px-8 text-lg w-full md:w-auto"
            >
              Cómo funciona
            </Button>
            <Button
              as={Link}
              to="/register"
              size="lg"
              radius="sm"
              className="ws-btn ws-btn-ink h-14 px-8 text-lg w-full md:w-auto"
            >
              Únete a la aventura
            </Button>
          </div>
          <Stamp variant="round" center={['DRIFTLER']} top="WORKING HOLIDAY" bottom="BIENVENIDO" rotate={14} className="hidden lg:block absolute -right-2 -bottom-24 w-36 text-ws-plum" />
        </div>
      </section>

    </div>
  );
};

export default Home;

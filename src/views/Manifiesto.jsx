import React from 'react';
import Stamp from '../components/ui/Stamp';
import PhotoSlot from '../components/ui/PhotoSlot';

// Cada principio es una banda de color a sangre. El texto va en tinta sobre
// los tonos claros; el cuerpo lleva capitular para leerse como artículo.
const PRINCIPLES = [
  {
    id: 'coraje',
    title: <>El coraje de <em>migrar</em></>,
    band: 'ws-band-tomato',
    photo: { file: 'manifiesto-coraje', hint: 'Foto del primer paso: una ruta, una maleta, una frontera' },
    body: 'Dejar atrás lo conocido requiere una valentía inmensa. Cuando empacas tu vida en una mochila, no solo te llevas ropa, te llevas sueños, incertidumbres y la esperanza de construir algo mejor. En WOHO entendemos que ser inmigrante, viajero o nómada es de las experiencias más desafiantes y hermosas que un ser humano puede vivir. Lo celebramos y lo apoyamos.',
  },
  {
    id: 'solos',
    title: <>Nadie se salva <em>solo</em></>,
    band: 'ws-band-teal',
    photo: { file: 'manifiesto-comunidad', hint: 'Foto de gente junta: una mesa, un camino compartido' },
    body: 'Llegar a un país nuevo donde el idioma, las costumbres y las reglas son distintas puede ser abrumador. Aquí es donde entra en juego el superpoder más grande de la humanidad: la empatía. Creemos firmemente que hacer red y apoyarnos mutuamente es la única forma de prosperar. Una mano amiga en un territorio desconocido lo cambia absolutamente todo.',
  },
  {
    id: 'solidaridad',
    title: <>Solidaridad en <em>acción</em></>,
    band: 'ws-band-citron',
    photo: { file: 'manifiesto-solidaridad', hint: 'Foto de un gesto de ayuda o un lugar que te acogió' },
    body: 'WOHO no es solo una plataforma para buscar un cuarto o un trabajo temporal. Es un ecosistema creado para que aquellos que ya recorrieron el camino puedan iluminarle el sendero a los que recién llegan. Un sofá disponible, un consejo sobre un trámite, o el dato de un trabajo pueden ser la diferencia entre rendirse y triunfar.',
  },
];

const Manifiesto = () => {
  return (
    <div className="flex flex-col gap-14 md:gap-20 -mb-16">

      <header className="relative grid md:grid-cols-12 gap-8 items-end pt-2">
        <h1 className="md:col-span-7 font-display text-6xl sm:text-7xl xl:text-8xl">
          Nuestro <em className="text-ws-accent">manifiesto</em>
        </h1>
        <p className="md:col-span-5 font-display italic text-3xl md:text-4xl leading-tight text-ws-ink/90">
          Viajar no es escapar, es encontrarse. Creemos en el poder transformador de migrar y en la fuerza invencible de la comunidad.
        </p>
        <Stamp variant="round" center={['WOHO']} top="WORKING HOLIDAY" bottom="MANIFIESTO" rotate={-12} className="hidden lg:block absolute -top-4 right-0 w-28 text-ws-plum" />
      </header>

      <div className="relative">
        <PhotoSlot file="manifiesto-portada" ratio="21 / 9" hint="Paisaje panorámico: tu mejor foto de ruta" className="[&>div]:min-h-[12rem]" />
        <Stamp variant="rect" top="LLEGADA" center="BIENVENIDO" bottom="2026" rotate={-6} className="hidden sm:block absolute -bottom-8 right-6 w-36 text-ws-plum" />
      </div>

      {PRINCIPLES.map(({ id, title, band, body, photo }, index) => {
        const flip = index % 2 === 1;
        return (
          <section
            key={id}
            aria-labelledby={`manifiesto-${id}`}
            className={`ws-band ${band} ws-bleed py-14 md:py-20`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className={`md:col-span-5 relative ${flip ? 'md:order-2' : ''}`}>
                <PhotoSlot file={photo.file} ratio="4 / 3" hint={photo.hint} />
                <Stamp
                  variant="round"
                  center={['WOHO']}
                  top="WORKING HOLIDAY"
                  bottom="MANIFIESTO"
                  rotate={flip ? 10 : -10}
                  className={`hidden md:block absolute -bottom-8 w-24 text-ws-ink ${flip ? '-left-8' : '-right-8'}`}
                />
              </div>
              <div className={`md:col-span-7 space-y-6 ${flip ? 'md:order-1' : ''}`}>
                <h2 id={`manifiesto-${id}`} className="font-display text-5xl md:text-7xl">
                  {title}
                </h2>
                <p className="font-cuerpo text-lg md:text-xl leading-relaxed max-w-2xl first-letter:font-display first-letter:text-7xl first-letter:float-left first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1">
                  {body}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      <section className="ws-band ws-band-plum ws-bleed py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative grid md:grid-cols-12 gap-8 md:gap-12 items-center text-left">
          <div className="md:col-span-7 space-y-5">
            <h2 className="font-display text-5xl md:text-7xl">
              Viajamos para buscar. <em className="text-ws-mustard">Nos unimos para encontrar.</em>
            </h2>
            <p className="font-cuerpo text-lg md:text-xl max-w-xl text-ws-paper-light/90">
              Únete a la familia global. Porque el mundo es demasiado grande para recorrerlo sin la mejor compañía.
            </p>
          </div>
          <div className="md:col-span-5 relative">
            <PhotoSlot file="manifiesto-cierre" ratio="4 / 3" hint="Foto de horizonte: atardecer, mar o camino abierto" />
            <Stamp solid variant="oval" center="BIENVENIDO" bottom="FAMILIA GLOBAL" rotate={-5} className="hidden md:block absolute -bottom-8 -left-10 w-36 text-ws-mustard" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Manifiesto;

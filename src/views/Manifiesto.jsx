import React from 'react';
import { Globe2, Rocket, Users, HeartHandshake } from 'lucide-react';

const Manifiesto = () => {
  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Cabecera */}
      <header className="flex flex-col items-center text-center gap-6 border-b-[3px] border-black pb-12">
        <div className="bg-woho-purple p-6 rounded-full border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Globe2 className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-5xl md:text-7xl font-titulo font-black text-black tracking-tighter uppercase uppercase">
          Nuestro Manifiesto
        </h1>
        <p className="font-cuerpo text-xl md:text-2xl text-default-600 max-w-2xl font-bold">
          Viajar no es escapar, es encontrarse. Creemos en el poder transformador de migrar y en la fuerza invencible de la comunidad.
        </p>
      </header>

      {/* Contenido Principal */}
      <div className="space-y-12">
        
        {/* Pilar 1 */}
        <section className="bg-white border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-woho-orange text-white w-12 h-12 flex items-center justify-center rounded-xl border-[2px] border-black text-2xl font-black">
              1
            </span>
            <h2 className="text-3xl font-titulo font-black uppercase text-black">
              El Coraje de Migrar
            </h2>
          </div>
          <p className="font-cuerpo text-lg text-black leading-relaxed font-medium">
            Dejar atrás lo conocido requiere una valentía inmensa. Cuando empacas tu vida en una mochila, no solo te llevas ropa, te llevas sueños, incertidumbres y la esperanza de construir algo mejor. En WOHO entendemos que ser inmigrante, viajero o nómada es de las experiencias más desafiantes y hermosas que un ser humano puede vivir. Lo celebramos y lo apoyamos.
          </p>
        </section>

        {/* Pilar 2 */}
        <section className="bg-[#fdfdfd] border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#4ade80] text-black w-12 h-12 flex items-center justify-center rounded-xl border-[2px] border-black text-2xl font-black">
              2
            </span>
            <h2 className="text-3xl font-titulo font-black uppercase text-black">
              Nadie se Salva Solo
            </h2>
          </div>
          <p className="font-cuerpo text-lg text-black leading-relaxed font-medium">
            Llegar a un país nuevo donde el idioma, las costumbres y las reglas son distintas puede ser abrumador. Aquí es donde entra en juego el superpoder más grande de la humanidad: la empatía. Creemos fírmemente que hacer red y apoyarnos mutuamente es la única forma de prosperar. Una mano amiga en un territorio desconocido lo cambia absolutamente todo.
          </p>
        </section>

        {/* Pilar 3 */}
        <section className="bg-woho-white border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[yellow] text-black w-12 h-12 flex items-center justify-center rounded-xl border-[2px] border-black text-2xl font-black">
              3
            </span>
            <h2 className="text-3xl font-titulo font-black uppercase text-black">
              Solidaridad en Acción
            </h2>
          </div>
          <p className="font-cuerpo text-lg text-black leading-relaxed font-medium">
            WOHO no es solo una plataforma para buscar un cuarto o un trabajo temporal. Es un ecosistema creado para que aquellos que ya recorrieron el camino puedan iluminarle el sendero a los que recién llegan. Un sofá disponible, un consejo sobre un trámite, o el dato de un trabajo pueden ser la diferencia entre rendirse y triunfar.
          </p>
        </section>

      </div>

      {/* Cierre */}
      <footer className="mt-8 text-center bg-black text-white p-12 rounded-xl border-[3px] border-black">
        <HeartHandshake className="w-16 h-16 text-woho-orange mx-auto mb-6" />
        <h3 className="text-3xl font-titulo font-black mb-4">
          Viajamos para buscar. Nos unimos para encontrar.
        </h3>
        <p className="font-cuerpo text-lg max-w-xl mx-auto opacity-90">
          Únete a la familia global. Porque el mundo es demasiado grande para recorrerlo sin la mejor compañía.
        </p>
      </footer>

    </div>
  );
};

export default Manifiesto;

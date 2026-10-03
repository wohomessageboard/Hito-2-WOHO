import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import Stamp from '../components/ui/Stamp';
import { ArrowRight } from '../components/ui/icons';

// Cada destino es una página de pasaporte con su sello; color y giro rotan
// para que la grilla no se vea fotocopiada.
const INKS = ['text-ws-tomato-deep', 'text-ws-ocean', 'text-ws-plum', 'text-ws-olive'];
const TILTS = [-4, 3, -2, 5, -5, 2];

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await api.get('/countries');
        setCountries(res.data);
      } catch (error) {
        console.error("Error obteniendo países:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="flex flex-col gap-10 md:gap-14 w-full">

      <section className="relative grid md:grid-cols-12 gap-6 items-end">
        <h1 className="md:col-span-7 font-display text-6xl md:text-8xl">
          Elige tu <em className="text-ws-accent">destino</em>
        </h1>
        <p className="md:col-span-5 font-cuerpo text-lg text-ws-ink/85 leading-relaxed">
          Selecciona un país para ver las oportunidades de trabajo, alojamiento y compañeros de ruta activos allí.
        </p>
      </section>

      <section aria-label="Destinos" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          <p role="status" className="ws-mono col-span-full py-12 text-center">Cargando destinos…</p>
        ) : (
          countries.map((country, i) => (
            <Link
              key={country.id}
              to={`/destinos/${country.name}`}
              className="ws-surface ws-surface-hover group flex flex-col p-4 md:p-5 min-h-[15rem]"
            >
              <span className="flex items-start justify-between">
                <span className="text-3xl leading-none" aria-hidden="true">{country.flag}</span>
                <span className="ws-mono text-ws-ink/60" aria-hidden="true">N.º {String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="flex-1 grid place-items-center py-3">
                <Stamp
                  variant="rect"
                  top="DESTINO"
                  center={country.name.toUpperCase()}
                  bottom="WORKING HOLIDAY"
                  rotate={TILTS[i % TILTS.length]}
                  className={`w-full max-w-[14rem] ${INKS[i % INKS.length]}`}
                />
                <h2 className="sr-only">{country.name}</h2>
              </span>
              <span className="ws-mono flex items-center justify-between border-t border-ws-line pt-3">
                Ver anuncios
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))
        )}
      </section>

    </div>
  );
};

export default Countries;

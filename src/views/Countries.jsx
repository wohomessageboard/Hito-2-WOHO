import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff } from 'lucide-react';
import api from '../config/api';

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
    <div className="flex flex-col gap-8 md:gap-12 w-full max-w-7xl mx-auto px-4 py-8">
      
      {/* Cabecera Principal */}
      <section className="flex justify-between items-end gap-4 border-b-[3px] border-black pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-titulo font-black text-black tracking-tighter uppercase flex items-center gap-3">
            <PlaneTakeoff className="w-10 h-10 md:w-12 md:h-12 text-woho-orange" />
            Elige tu Destino
          </h1>
          <p className="font-cuerpo text-default-600 text-lg max-w-xl">
            Selecciona un país para ver las oportunidades de trabajo, alojamiento y compañeros de ruta activos allí.
          </p>
        </div>
      </section>

      {/* Grilla de Países Simple */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="w-full text-center p-12 text-xl font-bold col-span-full">Cargando destinos mundiales...</div>
        ) : (
          countries.map(country => (
            <Card 
              key={country.id} 
              isPressable
              as={Link}
              to={`/destinos/${country.name}`}
              className="w-full border-[3px] border-black rounded-xl bg-white flex flex-col hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              <CardBody className="flex flex-col items-center justify-center p-8 text-center min-h-[180px]">
                <span className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {country.flag}
                </span>
                <h2 className="text-sm sm:text-xl lg:text-2xl font-titulo font-black text-black uppercase text-center leading-tight">
                  {country.name}
                </h2>
              </CardBody>
            </Card>
          ))
        )}
      </section>

    </div>
  );
};

export default Countries;

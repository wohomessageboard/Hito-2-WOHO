import React from 'react';
import { Button, Card, CardBody, Image } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Briefcase } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-24 mb-12">
      
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-8 lg:mt-16">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1 bg-woho-orange text-white font-bold font-titulo rounded-full border-2 border-black transform -rotate-2">
            La comunidad oficial Working Holiday
          </div>
          <h1 className="text-5xl md:text-7xl font-titulo font-black text-black leading-none tracking-tighter">
            EL CORAJE DE MIGRAR,<br />
            <span className="text-woho-purple underline decoration-black decoration-[4px] underline-offset-8">LA FUERZA DE UNIRSE.</span>
          </h1>
          <p className="text-xl md:text-2xl font-cuerpo text-default-700 max-w-lg">
            Un ecosistema de apoyo mutuo diseñado para viajeros. Encuentra trabajo, hogar y la mano amiga que necesitas para triunfar en tu destino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              as={Link} 
              to="/feed" 
              size="lg"
              variant="solid" 
              radius="md" 
              className="font-titulo font-bold bg-woho-purple text-white border-2 border-black w-full sm:w-auto h-14 text-lg"
              endContent={<Search className="w-5 h-5" />}
            >
              Explorar Anuncios
            </Button>
            <Button 
              as={Link} 
              to="/manifiesto" 
              size="lg"
              variant="flat" 
              radius="md" 
              className="font-titulo font-bold bg-white text-black border-2 border-black w-full sm:w-auto h-14 text-lg"
            >
              Ver Manifiesto
            </Button>
          </div>
        </div>

        {/* Hero Illustration / Concept */}
        <div className="flex-1 flex justify-center lg:justify-end relative w-full max-w-lg lg:max-w-none">
          <div className="absolute inset-0 bg-woho-orange rounded-full blur-3xl opacity-20 transform translate-x-10 translate-y-10"></div>
          
          <Card className="relative z-10 w-full max-w-md border-[3px] border-black rounded-xl bg-white rotate-2 overflow-visible">
            <div className="absolute -top-6 -left-6 bg-yellow-400 text-black font-titulo font-black border-[2px] border-black rounded-full w-14 h-14 flex items-center justify-center text-xl z-20">
              ✈️
            </div>
            <img 
              src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800" 
              alt="Backpackers"
              className="w-full h-64 object-cover rounded-t-xl border-b-[3px] border-black block"
            />
            <CardBody className="p-6">
              <h3 className="font-titulo font-extrabold text-2xl mb-2">Nadie se salva solo</h3>
              <p className="font-cuerpo text-default-600 block">
                Únete a una red donde quienes ya recorrieron el camino iluminan el sendero a los que recién llegan. Solidaridad real en cada rincón del mundo.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-titulo font-black text-black">
            Todo lo que necesitas
          </h2>
          <p className="text-lg font-cuerpo text-default-600 max-w-2xl mx-auto">
            Categorías concretas sin algoritmo, sin relleno. Lo que la gente publica es lo que ves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[2px] border-black rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <CardBody className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-blue-200 border-2 border-black rounded-full flex items-center justify-center text-blue-700">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-titulo font-extrabold text-2xl">Alojamiento</h3>
              <p className="font-cuerpo text-default-600">Encuentra o publica cuartos libres, casas rodantes y hostels. Ideal para dividir la renta.</p>
            </CardBody>
          </Card>

          <Card className="border-[2px] border-black rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors transform md:-translate-y-4">
            <CardBody className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-woho-orange border-2 border-black rounded-full flex items-center justify-center text-white">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="font-titulo font-extrabold text-2xl">Trabajo Temporario</h3>
              <p className="font-cuerpo text-default-600">Cosechas, hospitalidad o construcción. Los mejores datos pasados de viajero a viajero.</p>
            </CardBody>
          </Card>

          <Card className="border-[2px] border-black rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors">
            <CardBody className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-300 border-2 border-black rounded-full flex items-center justify-center text-green-900">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-titulo font-extrabold text-2xl">Social & Rutas</h3>
              <p className="font-cuerpo text-default-600">Busca compañeros para hacer roadtrips, comprar un auto a medias o tomar unas cervezas.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Mini CTA Bottom */}
      <section className="bg-woho-black text-white p-8 md:p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-black shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-titulo font-black text-woho-white">¿Listo para sumarte?</h2>
          <p className="font-cuerpo text-gray-300">Crea tu cuenta y empieza a construir tu red global hoy mismo.</p>
        </div>
        <Button 
          as={Link} 
          to="/register" 
          size="lg"
          variant="solid" 
          radius="md" 
          className="font-titulo font-bold bg-woho-orange text-white border-2 border-white w-full md:w-auto hover:bg-white hover:text-woho-orange transition-colors"
        >
          Unirse a la familia
        </Button>
      </section>

    </div>
  );
};

export default Home;

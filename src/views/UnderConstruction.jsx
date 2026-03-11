import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { HardHat, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const UnderConstruction = ({ title = "Página", message = "Estamos trabajando en ello." }) => {
  const navigate = useNavigate();
  // Solo la vista de editar post recibe un id dinámicamente en la URL, podemos extraerlo para mostrar un guiño.
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-woho-orange rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <HardHat className="w-32 h-32 md:w-48 md:h-48 text-woho-orange relative z-10 animate-pulse" strokeWidth={1.5} />
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-titulo font-black uppercase tracking-tighter text-black mb-4">
        {title} <br className="md:hidden" />
        <span className="text-woho-purple">en reparación</span>
      </h1>
      
      <p className="font-cuerpo text-default-600 max-w-lg mb-4 text-lg">
        {message}
      </p>

      {/* Si es una ruta que detectó un ID como /edit-post/100, pintamos un chip rústico del id */}
      {id && (
         <div className="bg-black text-white px-4 py-1.5 rounded-full font-cuerpo font-black uppercase text-xs tracking-widest mb-8 border border-white">
           Recurso ID: {id} en espera
         </div>
      )}

      {/* Botón de regreso neo-brutalista */}
      <Button 
        onPress={() => navigate(-1)} 
        className="h-14 mt-4 md:mt-8 px-8 font-titulo font-black text-lg bg-white border-[3px] border-black text-black hover:bg-black hover:text-white transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
        startContent={<ArrowLeft className="w-5 h-5 mr-1" />}
      >
        Volver atrás, obreros trabajando!
      </Button>
    </div>
  );
};

export default UnderConstruction;

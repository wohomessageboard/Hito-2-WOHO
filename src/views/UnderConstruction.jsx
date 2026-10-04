import React from 'react';
import { Button } from '@heroui/react';
import { ArrowLeft } from '../components/ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Stamp from '../components/ui/Stamp';

const UnderConstruction = ({ title = "Página", message = "Estamos trabajando en ello." }) => {
  const navigate = useNavigate();

  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center gap-5">
      <Stamp variant="oval" center="EN OBRAS" bottom="WOHO" rotate={-6} className="w-48 text-ws-tomato-deep" />

      <h1 className="font-display text-5xl md:text-7xl text-ws-ink">
        {title} <em className="text-ws-accent">en reparación</em>
      </h1>

      <p className="font-cuerpo text-ws-ink/80 max-w-lg text-lg">
        {message}
      </p>

      {id && (
        <p className="ws-mono bg-ws-ink text-ws-paper-light px-3 py-1.5 rounded-[6px]">
          Recurso ID: {id} en espera
        </p>
      )}

      <Button
        onPress={() => navigate(-1)}
        radius="sm"
        className="ws-btn ws-btn-tomato h-14 mt-4 px-8 text-lg"
        startContent={<ArrowLeft className="w-5 h-5 mr-1" aria-hidden="true" />}
      >
        Volver atrás, obreros trabajando
      </Button>
    </div>
  );
};

export default UnderConstruction;

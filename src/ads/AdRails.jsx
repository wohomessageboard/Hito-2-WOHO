import React from 'react';
import { useLocation } from 'react-router-dom';
import AdSlot from './AdSlot';

// Columnas laterales: solo en pantallas muy anchas (el contenido mide 1280 px y centrado;
// un anuncio de 160 px necesita 180 px libres por lado, o sea ~1640 px de pantalla) y solo
// en el feed, los países y el detalle de un aviso. Nunca empujan ni estrechan el contenido.
const SHOW_ON = [/^\/feed$/, /^\/destinos\/[^/]+$/, /^\/post\/\d+$/];

const AdRails = () => {
  const { pathname } = useLocation();
  if (!SHOW_ON.some((re) => re.test(pathname))) return null;
  const rail = 'hidden min-[1640px]:block fixed top-28 z-10 w-[180px]';
  return (
    <>
      <div className={rail} style={{ left: 'calc(50vw - 640px - 190px)' }}><AdSlot variant="rail" /></div>
      <div className={rail} style={{ right: 'calc(50vw - 640px - 190px)' }}><AdSlot variant="rail" /></div>
    </>
  );
};

export default AdRails;

import React from 'react';
import Stamp from './Stamp';

// Marco de Login/Registro: tarjeta de formulario + panel de color con sello
// (solo desde md; en móvil el formulario va solo). El panel es decorativo.
const SCENES = {
  login: {
    band: 'ws-band-ocean',
    title: <>Tu próxima parada <em className="text-ws-mustard">te espera.</em></>,
    stamp: { top: 'WORKING HOLIDAY', bottom: 'BIENVENIDO', color: 'text-ws-mustard' },
  },
  register: {
    band: 'ws-band-plum',
    title: <>Tu red global <em className="text-ws-mustard">empieza aquí.</em></>,
    stamp: { top: 'WORKING HOLIDAY', bottom: 'NUEVO VIAJERO', color: 'text-ws-mustard' },
  },
};

const AuthShell = ({ scene = 'login', children }) => {
  const s = SCENES[scene];
  return (
    <div className="w-full max-w-5xl mx-auto py-4 md:py-10 grid md:grid-cols-2 gap-8 md:gap-12 items-stretch min-h-[60vh]">
      <aside
        aria-hidden="true"
        className={`ws-band ${s.band} rounded-[4px] border-[1.5px] border-ws-ink hidden md:flex flex-col justify-between gap-8 p-10`}
      >
        <h2 className="font-display text-5xl xl:text-6xl">{s.title}</h2>
        <Stamp solid variant="round" center={['WOHO']} top={s.stamp.top} bottom={s.stamp.bottom} rotate={-10} className={`w-40 self-end ${s.stamp.color}`} />
      </aside>
      <div className="w-full max-w-md mx-auto md:max-w-none self-center">{children}</div>
    </div>
  );
};

export default AuthShell;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@heroui/react';
import { useUser } from '../../context/UserContext';

// Llamada a la acción fija al pie en móvil, solo en páginas de descubrimiento. Quien no
// tiene cuenta ve "Crear cuenta gratis"; quien ya entró ve "Publicar un aviso". En el
// detalle de un aviso la acción principal es WhatsApp y la pone PostDetail.
const SHOW_ON = [/^\/$/, /^\/feed$/, /^\/destinos(\/[^/]+)?$/, /^\/como-funciona$/, /^\/manifiesto$/];

const StickyCta = () => {
  const { pathname } = useLocation();
  const visible = SHOW_ON.some((re) => re.test(pathname.replace(/(.)\/+$/, '$1')));
  const { isAuthenticated } = useUser();
  if (!visible) return null;

  return (
    <>
      {/* Espacio para que la barra no tape el final de la página (pie incluido). */}
      <div className="h-24 md:hidden bg-ws-ink" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-ws-paper-light border-t border-ws-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button
          as={Link}
          to={isAuthenticated ? '/new-post' : '/register'}
          radius="sm"
          fullWidth
          className="ws-btn ws-btn-tomato h-12 text-base"
        >
          {isAuthenticated ? 'Publicar un aviso' : 'Crear cuenta gratis'}
        </Button>
      </div>
    </>
  );
};

export default StickyCta;

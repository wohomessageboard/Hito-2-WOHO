import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoForPath } from './site.js';
import { applySeo } from './applySeo.js';

// Pone título, descripción, canónica y datos estructurados según la ruta. Los avisos
// (/post/:id) los define PostDetail con useSeo, porque dependen del contenido.
const RouteSeo = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = seoForPath(pathname);
    if (meta) applySeo(meta);
  }, [pathname]);
  return null;
};

export default RouteSeo;

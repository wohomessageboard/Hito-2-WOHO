import { useEffect } from 'react';
import { useLocation, NavigationType } from 'react-router-dom';

export const useScrollRestore = (storageKey, dataLoaded) => {
  useEffect(() => {
    // Al hacer scroll infinito o bajar, guardamos la altura en el almacenamiento de la sesión
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, window.scrollY.toString());
    };
    
    // Escuchar el evento de scroll del navegador
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  useEffect(() => {
    // Si la data por fin cargó de la API y se dibujó, revisamos si teníamos un scroll guardado
    if (dataLoaded) {
      const savedScroll = sessionStorage.getItem(storageKey);
      if (savedScroll) {
        // Le damos un respiro muy cortito para que el navegador termine de pintar el DOM y bajamos
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        }, 50);
      }
    }
  }, [dataLoaded, storageKey]);
};

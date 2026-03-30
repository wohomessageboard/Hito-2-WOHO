import { useEffect } from 'react';
import { useLocation, NavigationType } from 'react-router-dom';

export const useScrollRestore = (storageKey, dataLoaded) => {
  useEffect(() => {

    const handleScroll = () => {
      sessionStorage.setItem(storageKey, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  useEffect(() => {

    if (dataLoaded) {
      const savedScroll = sessionStorage.getItem(storageKey);
      if (savedScroll) {

        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        }, 50);
      }
    }
  }, [dataLoaded, storageKey]);
};

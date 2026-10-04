import { useEffect } from 'react';
import { applySeo } from './applySeo.js';

// Para vistas cuyo título depende de datos (por ejemplo, un aviso).
export function useSeo(meta) {
  const key = meta ? JSON.stringify(meta) : '';
  useEffect(() => {
    if (key) applySeo(JSON.parse(key));
  }, [key]);
}

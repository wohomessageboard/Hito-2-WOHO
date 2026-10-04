import React, { useState } from 'react';
import { Image as ImageIcon } from './icons';

// Extensiones que se prueban en orden. Basta soltar el archivo en public/photos/
// con el nombre indicado (p. ej. manifiesto-coraje.jpg) y recargar.
const EXTENSIONS = ['jpg', 'jpeg', 'webp', 'png'];

/**
 * Espacio para una foto propia (paisajes, viajes). Si el archivo existe lo
 * muestra con el tratamiento de la marca; si no, deja a la vista un marco con
 * el nombre exacto del archivo que falta.
 *
 * @param {string} file - nombre sin extensión, en /public/photos (ej. "manifiesto-coraje")
 * @param {string} [ratio] - proporción CSS, "4 / 3" por defecto
 * @param {string} [alt] - descripción de la foto (vacío si es solo ambiente)
 * @param {string} [caption] - pie de foto opcional ("Lago Wakatipu, 2025")
 * @param {string} [hint] - qué tipo de imagen va aquí (se ve en el marco vacío)
 */
const PhotoSlot = ({ file, ratio = '4 / 3', alt = '', caption, hint = 'Paisaje o foto de viaje', className = '' }) => {
  const [extIndex, setExtIndex] = useState(0);
  const missing = extIndex >= EXTENSIONS.length;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="ws-photo w-full" style={{ aspectRatio: ratio }}>
        {missing ? (
          <div className="absolute inset-0 grid place-items-center text-center p-4 border-2 border-dashed border-ws-ink/30 text-ws-ink">
            <div className="flex flex-col items-center gap-2 max-w-xs">
              <ImageIcon className="w-10 h-10" aria-hidden="true" />
              <p className="ws-mono">{hint}</p>
              <p className="ws-mono text-ws-ink/70" style={{ textTransform: 'none', letterSpacing: 0 }}>
                Guarda tu foto en <strong>public/photos/{file}.jpg</strong>
              </p>
            </div>
          </div>
        ) : (
          <img
            key={extIndex}
            src={`/photos/${file}.${EXTENSIONS[extIndex]}`}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setExtIndex((i) => i + 1)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      {caption && !missing && <figcaption className="ws-mono mt-2 text-ws-ink/75">{caption}</figcaption>}
    </figure>
  );
};

export default PhotoSlot;

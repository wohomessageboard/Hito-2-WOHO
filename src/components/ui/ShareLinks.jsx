import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { Share2, Whatsapp } from './icons';

/**
 * Compartir: hoja nativa del dispositivo si existe; si no, copia el enlace. Además,
 * un botón directo a WhatsApp, que es donde se mueve esta comunidad.
 * @param {string} url   enlace a compartir
 * @param {string} title título del contenido
 * @param {string} [text] mensaje que acompaña al enlace
 */
const ShareLinks = ({ url, title, text, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const message = `${text || title} ${url}`;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: text || title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* cerrar la hoja de compartir no es un error */
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button onPress={share} radius="sm" className="ws-pill ws-pill-line min-h-11 px-4 flex-1 sm:flex-none" startContent={<Share2 className="w-5 h-5" aria-hidden="true" />}>
        {copied ? '¡Enlace copiado!' : 'Compartir'}
      </Button>
      <Button
        as="a"
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        radius="sm"
        className="ws-pill ws-pill-line min-h-11 px-4 flex-1 sm:flex-none"
        startContent={<Whatsapp className="w-5 h-5" aria-hidden="true" />}
      >
        Enviar por WhatsApp
      </Button>
      <span role="status" className="sr-only">{copied ? 'Enlace copiado al portapapeles' : ''}</span>
    </div>
  );
};

export default ShareLinks;

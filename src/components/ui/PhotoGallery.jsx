import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ModalContent } from '@heroui/react';
import { ArrowLeft, ArrowRight, Close } from './icons';

/**
 * Galería de un aviso: foto principal grande y miniaturas; al tocar cualquiera se abre un
 * visor a pantalla completa con flechas, teclado (← → Esc) y deslizar con el dedo.
 * @param {string[]} images URLs de las fotos
 * @param {string} title   título del aviso (para los textos alternativos)
 */
const PhotoGallery = ({ images, title }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);
  const total = images.length;

  const show = (i) => { setIndex(i); setOpen(true); };
  const go = useCallback((delta) => setIndex((i) => (i + delta + total) % total), [total]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null || total < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const thumbBtn = 'ws-photo block w-full h-full ws-press cursor-zoom-in focus-visible:outline-offset-2';

  return (
    <>
      <div className="flex flex-col gap-4">
        <button type="button" onClick={() => show(0)} aria-label={`Ampliar foto 1 de ${total}: ${title}`} className={`${thumbBtn} aspect-video`}>
          <img src={images[0]} alt={`Foto 1 de ${total}: ${title}`} className="w-full h-full object-cover" />
        </button>

        {total > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.slice(1).map((url, idx) => (
              <div key={url + idx} className="aspect-square">
                <button type="button" onClick={() => show(idx + 1)} aria-label={`Ampliar foto ${idx + 2} de ${total}`} className={thumbBtn}>
                  <img src={url} alt={`Foto ${idx + 2} de ${total}: ${title}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="ws-mono">Toca una foto para verla en grande</p>
      </div>

      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="full"
        radius="none"
        hideCloseButton
        classNames={{ base: '!bg-ws-ink text-ws-paper-light m-0 rounded-none', wrapper: 'w-screen', backdrop: 'bg-black/80' }}
      >
        <ModalContent>
          {() => (
            <div
              className="relative flex-1 grid place-items-center p-3 sm:p-8 min-h-0"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              role="group"
              aria-roledescription="galería"
              aria-label={`Fotos de ${title}`}
            >
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar galería" className="absolute top-3 right-3 z-10 grid place-items-center w-12 h-12 rounded-[6px] bg-ws-paper-light text-ws-ink ws-press">
                <Close className="w-6 h-6" aria-hidden="true" />
              </button>

              <img
                key={images[index]}
                src={images[index]}
                alt={`Foto ${index + 1} de ${total}: ${title}`}
                className="max-w-full max-h-[calc(100dvh-9rem)] object-contain select-none"
                draggable={false}
              />

              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                {total > 1 && (
                  <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className="grid place-items-center w-12 h-12 rounded-[6px] bg-ws-paper-light text-ws-ink ws-press">
                    <ArrowLeft className="w-6 h-6" aria-hidden="true" />
                  </button>
                )}
                <span role="status" className="ws-mono bg-ws-ink/70 px-3 py-2 rounded-[6px]">{index + 1} / {total}</span>
                {total > 1 && (
                  <button type="button" onClick={() => go(1)} aria-label="Foto siguiente" className="grid place-items-center w-12 h-12 rounded-[6px] bg-ws-paper-light text-ws-ink ws-press">
                    <ArrowRight className="w-6 h-6" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PhotoGallery;

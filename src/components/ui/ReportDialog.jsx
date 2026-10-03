import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, RadioGroup, Radio, Textarea } from '@heroui/react';
import api from '../../config/api';

const REASONS = [
  ['estafa', 'Posible estafa', 'Pide dinero por adelantado o datos sensibles.'],
  ['spam', 'Spam o publicidad', 'No es una oferta real ni ayuda a otros viajeros.'],
  ['falso', 'Información falsa', 'Datos, fotos o condiciones que no son ciertos.'],
  ['ofensivo', 'Contenido ofensivo', 'Lenguaje o imágenes que no deberían estar aquí.'],
  ['otro', 'Otro motivo', 'Cuéntanos qué pasa.'],
];

/**
 * Reporte de un aviso: llega a la bandeja del panel de admin. El servidor evita
 * duplicados (un reporte pendiente por persona y aviso).
 */
const ReportDialog = ({ postId, isOpen, onOpenChange, onSent }) => {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const reset = () => { setReason(''); setMessage(''); setError(''); };

  const submit = async (close) => {
    if (!reason) { setError('Elige el motivo del reporte.'); return; }
    setIsSending(true);
    setError('');
    try {
      const res = await api.post(`/posts/${postId}/report`, { reason, message });
      onSent?.(res.data.message);
      reset();
      close();
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos enviar tu reporte. Intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) reset(); onOpenChange(open); }} placement="center" scrollBehavior="inside" classNames={{ base: 'bg-ws-paper-light rounded-[10px]', closeButton: 'min-w-11 min-h-11' }}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="font-display text-4xl font-normal">Reportar este aviso</span>
              <span className="font-cuerpo text-sm font-normal text-ws-ink/80">Lo revisa el equipo de WOHO. No se le avisa a quien publicó.</span>
            </ModalHeader>
            <ModalBody>
              <RadioGroup aria-label="Motivo del reporte" value={reason} onValueChange={setReason}>
                {REASONS.map(([value, label, hint]) => (
                  <Radio key={value} value={value} description={hint} classNames={{ label: 'font-bold', description: 'text-ws-ink/75' }}>{label}</Radio>
                ))}
              </RadioGroup>
              <Textarea
                label="Detalles (opcional)"
                labelPlacement="outside"
                placeholder="Ej: me pidió un depósito antes de mostrarme el lugar"
                maxLength={500}
                value={message}
                onValueChange={setMessage}
                classNames={{ inputWrapper: 'ws-input-border', label: 'font-bold text-ws-ink' }}
              />
              {error && <p role="alert" className="bg-ws-tomato/15 rounded-[6px] p-3 text-sm font-bold">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button radius="sm" className="ws-pill ws-pill-line h-11 px-5" onPress={close}>Cancelar</Button>
              <Button radius="sm" isLoading={isSending} className="ws-btn ws-btn-tomato h-11 px-5" onPress={() => submit(close)}>Enviar reporte</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReportDialog;

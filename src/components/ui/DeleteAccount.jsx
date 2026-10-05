import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from '@heroui/react';
import api from '../../config/api';
import { useUser } from '../../context/UserContext';

const DAYS = 5;
const fmt = (iso) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'long' });

// Vuelve a pedir el usuario al servidor para tener la fecha de la solicitud actualizada.
const useRefreshUser = () => {
  const { login } = useUser();
  return async () => {
    const res = await api.get('/users/me');
    login(res.data);
  };
};

/**
 * Aviso de "eliminación solicitada" con la fecha y el botón para cancelar.
 * Se muestra en el perfil mientras la solicitud está pendiente.
 */
export const DeletionPendingBanner = ({ className = '' }) => {
  const { currentUser } = useUser();
  const refresh = useRefreshUser();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!currentUser?.deletion_due_at) return null;

  const cancel = async () => {
    setBusy(true);
    setError('');
    try {
      await api.delete('/users/me/delete-request');
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos cancelar la solicitud.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="status" className={`bg-ws-paper-light rounded-[8px] p-5 flex flex-col md:flex-row md:items-center gap-4 ${className}`}>
      <div className="flex-1 space-y-1">
        <p className="font-bold text-lg">Pediste eliminar tu cuenta</p>
        <p className="font-cuerpo text-ws-ink/85 leading-relaxed">
          La eliminaremos con tus avisos y fotos a más tardar el <strong>{fmt(currentUser.deletion_due_at)}</strong>. Mientras tanto tus avisos no se muestran. Si cambiaste de idea, puedes cancelarla.
        </p>
        {error && <p role="alert" className="text-sm font-bold">{error}</p>}
      </div>
      <Button radius="sm" isLoading={busy} onPress={cancel} className="ws-btn ws-btn-ink h-11 px-5 shrink-0">
        Cancelar la solicitud
      </Button>
    </div>
  );
};

/**
 * Sección "Eliminar mi cuenta". Pide la contraseña para confirmar y avisa del plazo.
 * No borra al instante: crea una solicitud que el equipo ejecuta (ver panel de admin).
 */
const DeleteAccount = () => {
  const { currentUser } = useUser();
  const refresh = useRefreshUser();
  const modal = useDisclosure();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (currentUser?.role === 'superadmin') return null;
  if (currentUser?.deletion_due_at) return <DeletionPendingBanner />;

  const close = () => { setPassword(''); setError(''); };

  const submit = async (done) => {
    setBusy(true);
    setError('');
    try {
      await api.post('/users/me/delete-request', { password });
      await refresh();
      close();
      done();
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos registrar tu solicitud. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="eliminar-cuenta" className="mt-10 pt-8 border-t border-ws-line space-y-3">
      <h2 id="eliminar-cuenta" className="font-display text-4xl">Eliminar mi cuenta</h2>
      <p className="font-cuerpo text-ws-ink/85 leading-relaxed max-w-xl">
        Si ya no quieres estar en Driftler, puedes pedir que borremos tu cuenta, tus avisos, tus fotos y tus favoritos. Lo hacemos en un plazo de hasta {DAYS} días y puedes cancelar antes de que ocurra.
        Más detalles en nuestra <Link to="/contacto" className="underline underline-offset-4">página de contacto</Link>.
      </p>
      <Button radius="sm" onPress={modal.onOpen} className="ws-btn bg-ws-tomato text-ws-ink h-11 px-5">
        Eliminar mi cuenta
      </Button>

      <Modal isOpen={modal.isOpen} onOpenChange={(open) => { if (!open) close(); modal.onOpenChange(open); }} placement="center" classNames={{ base: 'bg-ws-paper-light rounded-[10px]' }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="font-display text-4xl font-normal">¿Eliminar tu cuenta?</span>
              </ModalHeader>
              <ModalBody className="gap-4">
                <ul className="font-cuerpo list-disc pl-5 space-y-1 leading-relaxed">
                  <li>Se borran tu cuenta, tus avisos, tus fotos, tus favoritos y los destinos que sigues.</li>
                  <li>Tus avisos dejan de mostrarse desde ahora.</li>
                  <li>La eliminación se completa en un plazo de <strong>hasta {DAYS} días</strong>.</li>
                  <li>Puedes cancelar la solicitud antes de que se complete.</li>
                </ul>
                <Input
                  type="password"
                  label="Tu contraseña, para confirmar"
                  labelPlacement="outside"
                  placeholder="Contraseña"
                  variant="bordered"
                  radius="sm"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  classNames={{ inputWrapper: 'ws-input-border h-12', label: 'font-bold text-ws-ink' }}
                />
                {error && <p role="alert" className="bg-ws-tomato/15 rounded-[6px] p-3 text-sm font-bold">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button radius="sm" className="ws-pill ws-pill-line h-11 px-5" onPress={onClose}>Mantener mi cuenta</Button>
                <Button radius="sm" isLoading={busy} isDisabled={!password} className="ws-btn bg-ws-tomato text-ws-ink h-11 px-5" onPress={() => submit(onClose)}>
                  Solicitar eliminación
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default DeleteAccount;

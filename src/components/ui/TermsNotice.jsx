import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import api from '../../config/api';
import { useUser } from '../../context/UserContext';
import { LEGAL_VERSION } from '../../legal/config';

/**
 * Franja que pide aceptar los Términos y la Política cuando la persona tiene una cuenta
 * anterior a ellos o cuando cambió la versión. Se registra con fecha y versión.
 */
const TermsNotice = () => {
  const { currentUser, login } = useUser();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser || currentUser.terms_version === LEGAL_VERSION) return null;

  const accept = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post('/users/me/accept-terms');
      login({ ...currentUser, terms_version: LEGAL_VERSION });
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos registrar tu aceptación. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="region" aria-label="Términos y Política de Privacidad" className="bg-ws-ink text-ws-paper-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center gap-3">
        <p className="font-cuerpo text-sm flex-1 leading-relaxed">
          Para seguir usando Driftler, lee y acepta nuestros{' '}
          <Link to="/terminos" className="font-bold underline underline-offset-4">Términos y Condiciones</Link> y la{' '}
          <Link to="/privacidad" className="font-bold underline underline-offset-4">Política de Privacidad</Link>.
          {error && <strong role="alert" className="ml-2">{error}</strong>}
        </p>
        <Button radius="sm" isLoading={busy} onPress={accept} className="ws-btn ws-btn-mustard h-10 px-5 shrink-0">
          Acepto
        </Button>
      </div>
    </div>
  );
};

export default TermsNotice;

import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CardBody, CardHeader, Button, Input } from '@heroui/react';
import { Lock } from '../components/ui/icons';
import api from '../config/api';
import SurfaceCard from '../components/ui/SurfaceCard';
import AuthShell from '../components/ui/AuthShell';

// Paso 2: la persona llega desde el enlace del correo (?token=...) y elige su contraseña nueva.
const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    if (password !== confirm) return setError('Las contraseñas no coinciden.');

    setStatus('sending');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('done');
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos cambiar la contraseña. Intenta de nuevo.');
      setStatus('idle');
    }
  };

  const field = (label, value, set, autoComplete) => (
    <Input
      type="password"
      label={label}
      labelPlacement="outside"
      placeholder="Mínimo 8 caracteres"
      variant="bordered"
      radius="sm"
      isRequired
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => set(e.target.value)}
      startContent={<Lock className="w-5 h-5 text-ws-ink/75 pointer-events-none flex-shrink-0" aria-hidden="true" />}
      classNames={{ inputWrapper: "ws-input-border h-12", label: "font-bold text-ws-ink" }}
    />
  );

  return (
    <AuthShell scene="login">
      <SurfaceCard elevated className="w-full overflow-visible">
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h1 className="font-display text-4xl md:text-5xl text-ws-ink">Contraseña nueva</h1>
        </CardHeader>
        <CardBody className="p-8">
          {!token ? (
            <div role="alert" className="flex flex-col gap-5">
              <p className="font-cuerpo text-lg">Este enlace no es válido. Pide uno nuevo.</p>
              <Button as={Link} to="/olvide-mi-contrasena" radius="sm" className="ws-btn ws-btn-tomato h-12">Pedir un enlace nuevo</Button>
            </div>
          ) : status === 'done' ? (
            <div role="status" className="flex flex-col gap-5">
              <p className="font-cuerpo text-lg leading-relaxed">Listo, cambiaste tu contraseña. Ya puedes iniciar sesión.</p>
              <Button as={Link} to="/login" radius="sm" className="ws-btn ws-btn-tomato h-12 text-lg">Iniciar sesión</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {field('Contraseña nueva', password, setPassword, 'new-password')}
              {field('Repite la contraseña', confirm, setConfirm, 'new-password')}
              {error && (
                <div role="alert" className="bg-ws-tomato/15 text-ws-ink rounded-[6px] p-3 text-sm font-bold">
                  {error}{' '}
                  {/venció|usó/.test(error) && <Link to="/olvide-mi-contrasena" className="underline">Pedir uno nuevo</Link>}
                </div>
              )}
              <Button type="submit" radius="sm" isLoading={status === 'sending'} className="ws-btn ws-btn-tomato h-12 text-lg">
                Guardar contraseña
              </Button>
            </form>
          )}
        </CardBody>
      </SurfaceCard>
    </AuthShell>
  );
};

export default ResetPassword;

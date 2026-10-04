import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardBody, CardHeader, Button, Input } from '@heroui/react';
import { Mail } from '../components/ui/icons';
import api from '../config/api';
import SurfaceCard from '../components/ui/SurfaceCard';
import AuthShell from '../components/ui/AuthShell';

// Paso 1 de recuperar contraseña: se pide el correo. La respuesta es siempre la misma
// exista o no la cuenta, para no revelar quién está registrado.
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStatus('sent');
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos procesar tu solicitud. Intenta de nuevo.');
      setStatus('idle');
    }
  };

  return (
    <AuthShell scene="login">
      <SurfaceCard elevated className="w-full overflow-visible">
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h1 className="font-display text-4xl md:text-5xl text-ws-ink">Recupera tu cuenta</h1>
          <p className="text-ws-ink/75 font-cuerpo mt-2 text-center px-4">
            Escribe tu correo y te enviamos un enlace para crear una contraseña nueva.
          </p>
        </CardHeader>
        <CardBody className="p-8">
          {status === 'sent' ? (
            <div role="status" className="flex flex-col gap-5">
              <p className="font-cuerpo text-lg leading-relaxed">{message}</p>
              <Button as={Link} to="/login" radius="sm" className="ws-btn ws-btn-ink h-12">Volver a iniciar sesión</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="tu@correo.com"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                isRequired
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="w-5 h-5 text-ws-ink/75 pointer-events-none flex-shrink-0" aria-hidden="true" />}
                classNames={{ inputWrapper: "ws-input-border h-12", label: "font-bold text-ws-ink" }}
              />
              {error && <div role="alert" className="bg-ws-tomato/15 text-ws-ink rounded-[6px] p-3 text-sm font-bold">{error}</div>}
              <Button type="submit" radius="sm" isLoading={status === 'sending'} className="ws-btn ws-btn-tomato h-12 text-lg">
                Enviarme el enlace
              </Button>
              <Link to="/login" className="text-center font-bold underline underline-offset-4">Volver a iniciar sesión</Link>
            </form>
          )}
        </CardBody>
      </SurfaceCard>
    </AuthShell>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Textarea } from '@heroui/react';
import api from '../config/api';
import { useUser } from '../context/UserContext';
import Stamp from '../components/ui/Stamp';

// Los mensajes llegan a la bandeja del panel de admin (POST /api/contact).
const Contacto = () => {
  const { currentUser } = useUser();
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', message: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/contact', form);
      setStatus('sent');
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos enviar tu mensaje. Intenta de nuevo.');
      setStatus('idle');
    }
  };

  return (
    <div className="grid md:grid-cols-12 gap-10 md:gap-14 w-full">
      <header className="md:col-span-5 space-y-6 relative">
        <h1 className="font-display text-6xl md:text-8xl">
          Escríbe<em className="text-ws-accent">nos</em>
        </h1>
        <p className="font-cuerpo text-lg leading-relaxed text-ws-ink/90 max-w-md">
          ¿Dudas, ideas o algo que no funciona? Cuéntanos y te respondemos al correo que dejes.
        </p>
        <p className="font-cuerpo text-ws-ink/80 max-w-md leading-relaxed">
          ¿Viste un aviso sospechoso? Abre el aviso y usa <strong>Reportar</strong>: así llega directo al equipo, con el aviso asociado.
        </p>
        <Stamp variant="oval" center="ESCRÍBENOS" bottom="WOHO" rotate={-6} className="hidden md:block w-44 text-ws-plum" />
      </header>

      <section className="md:col-span-7" aria-labelledby="form-contacto">
        <div className="ws-surface-elevated p-6 md:p-10">
          {status === 'sent' ? (
            <div role="status" className="flex flex-col gap-5 items-start">
              <Stamp variant="oval" center="ENVIADO" rotate={-5} animate className="w-40 text-ws-olive" />
              <h2 className="font-display text-4xl">¡Gracias!</h2>
              <p className="font-cuerpo text-lg leading-relaxed">Recibimos tu mensaje. Te responderemos al correo que dejaste.</p>
              <Button as={Link} to="/" radius="sm" className="ws-btn ws-btn-ink h-11 px-6">Volver al inicio</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <h2 id="form-contacto" className="font-display text-4xl">Tu mensaje</h2>

              <Input label="Nombre" labelPlacement="outside" placeholder="Cómo te llamas" radius="sm" isRequired
                value={form.name} onValueChange={set('name')} maxLength={100}
                classNames={{ inputWrapper: 'ws-input-border h-12', label: 'font-bold text-ws-ink' }} />

              <Input type="email" label="Correo para responderte" labelPlacement="outside" placeholder="tu@correo.com" radius="sm" isRequired
                value={form.email} onValueChange={set('email')} maxLength={100}
                classNames={{ inputWrapper: 'ws-input-border h-12', label: 'font-bold text-ws-ink' }} />

              <Textarea label="Mensaje" labelPlacement="outside" placeholder="Cuéntanos en qué podemos ayudarte" radius="sm" isRequired minRows={5}
                value={form.message} onValueChange={set('message')} maxLength={2000}
                description={`${form.message.length}/2000`}
                classNames={{ inputWrapper: 'ws-input-border', label: 'font-bold text-ws-ink' }} />

              {/* Campo trampa para bots: las personas no lo ven ni lo alcanzan con teclado. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>No lo rellenes<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website')(e.target.value)} /></label>
              </div>

              {error && <p role="alert" className="bg-ws-tomato/15 rounded-[6px] p-3 text-sm font-bold">{error}</p>}

              <Button type="submit" radius="sm" isLoading={status === 'sending'} className="ws-btn ws-btn-tomato h-12 text-lg">
                Enviar mensaje
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contacto;

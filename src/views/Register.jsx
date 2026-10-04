import React, { useState } from 'react';

import { CardBody, CardHeader, Button, Input, Checkbox } from '@heroui/react';

import { Mail, Lock, User } from '../components/ui/icons';

import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';

import api from '../config/api';
import { MIN_AGE } from '../legal/config';
import SurfaceCard from '../components/ui/SurfaceCard';
import AuthShell from '../components/ui/AuthShell';

const Register = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!confirmedAge) {
      setErrorMsg(`Para crear tu cuenta debes confirmar que tienes al menos ${MIN_AGE} años.`);
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Para crear tu cuenta debes aceptar los Términos y Condiciones y la Política de Privacidad.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, accepted_terms: acceptedTerms, confirmed_age: confirmedAge });

      const { token, user } = res.data;
      if (token && user) {
        localStorage.setItem('token', token);
        login(user); 
        navigate('/feed'); 
      } else {
        setErrorMsg("Error inesperado en el servidor");
      }
    } catch(err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Error creando cuenta. Posiblemente el email ya existe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <AuthShell scene="register">
      
      
      <SurfaceCard elevated className="w-full overflow-visible">
        
        
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h2 className="font-display text-4xl md:text-5xl text-ws-ink">
            Únete a WOHO
          </h2>
          <p className="text-ws-ink/75 font-cuerpo mt-2 text-center px-4">
            Crea tu cuenta gratis y empieza a conectar con otros viajeros.
          </p>
        </CardHeader>

        
        <CardBody className="p-8">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            
            <Input
              type="text"
              label="Nombre completo"
              placeholder="Ej. Lucas Viajero"
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              value={name}

              onChange={(e) => setName(e.target.value)}

              startContent={<User className="w-5 h-5 text-ws-ink/75 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "ws-input-border h-12", label: "font-bold text-ws-ink" }}
            />

            
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              value={email}

              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="w-5 h-5 text-ws-ink/75 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "ws-input-border h-12", label: "font-bold text-ws-ink" }}
            />

            
            <Input
              type="password"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              value={password}

              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="w-5 h-5 text-ws-ink/75 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "ws-input-border h-12", label: "font-bold text-ws-ink" }}
            />

            
            <Checkbox
              isSelected={confirmedAge}
              onValueChange={setConfirmedAge}
              radius="sm"
              classNames={{ label: "font-cuerpo text-sm leading-relaxed text-ws-ink" }}
            >
              Confirmo que tengo al menos {MIN_AGE} años
            </Checkbox>

            <Checkbox
              isSelected={acceptedTerms}
              onValueChange={setAcceptedTerms}
              radius="sm"
              classNames={{ label: "font-cuerpo text-sm leading-relaxed text-ws-ink" }}
            >
              Acepto los{' '}
              <Link to="/terminos" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4" onClick={(e) => e.stopPropagation()}>Términos y Condiciones</Link>{' '}
              y la{' '}
              <Link to="/privacidad" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4" onClick={(e) => e.stopPropagation()}>Política de Privacidad</Link>
            </Checkbox>

            {errorMsg && (
              <div role="alert" className="bg-ws-tomato/15 text-ws-ink rounded-[6px] p-3 text-sm font-bold mt-2">
                <p>{errorMsg}</p>
              </div>
            )}

            
            <Button
              type="submit"
              variant="solid"
              radius="sm"
              isLoading={isLoading}
              className="ws-btn ws-btn-tomato mt-4 h-12 text-lg"
            >
              Crear mi cuenta
            </Button>
            
          </form>

          
          <div className="mt-6 flex flex-col items-center gap-2 font-cuerpo text-sm">
            <span className="text-ws-ink/75">
              ¿Ya tienes una cuenta?
            </span>
            <Link 
              to="/login"
              className="font-bold text-ws-ink underline underline-offset-4 hover:text-ws-ink transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </CardBody>

      </SurfaceCard>
    </AuthShell>
  );
};

export default Register;

import React, { useState } from 'react';

import { CardBody, CardHeader, Button, Input } from '@heroui/react';

import { Mail, Lock } from '../components/ui/icons';

import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../config/api';
import SurfaceCard from '../components/ui/SurfaceCard';
import AuthShell from '../components/ui/AuthShell';

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {

      const res = await api.post('/auth/login', { email, password });

      const { token, user } = res.data;

      localStorage.setItem('token', token);

      login(user);

      navigate('/feed');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMsg(error.response?.data?.error || 'Credenciales incorrectas o backend no disponible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <AuthShell scene="login">
      
      
      <SurfaceCard elevated className="w-full overflow-visible">
        
        
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h2 className="font-display text-4xl md:text-5xl text-ws-ink">
            ¡Hola de nuevo!
          </h2>
          <p className="text-ws-ink/75 font-cuerpo mt-2 text-center px-4">
            Entra para guardar anuncios, contactar a quien publica y seguir destinos.
          </p>
        </CardHeader>

        
        <CardBody className="p-8">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            
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
              placeholder="Tu contraseña"
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              value={password}

              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="w-5 h-5 text-ws-ink/75 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "ws-input-border h-12", label: "font-bold text-ws-ink" }}
            />

            
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
              Ingresar
            </Button>
            
          </form>

          
          <div className="mt-6 flex flex-col items-center gap-2 font-cuerpo text-sm">
            <span className="text-ws-ink/75">
              ¿Aún no tienes cuenta?
            </span>
            <Link 
              to="/register"
              className="font-bold text-ws-ink underline underline-offset-4 hover:text-ws-ink transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </CardBody>

      </SurfaceCard>
    </AuthShell>
  );
};

export default Login;

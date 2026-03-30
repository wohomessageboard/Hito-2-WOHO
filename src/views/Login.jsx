import React, { useState } from 'react';

import { Card, CardBody, CardHeader, Button, Input } from '@heroui/react';

import { Mail, Lock } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../config/api';

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

    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      
      
      <Card className="w-full max-w-md border-[2px] border-black rounded-xl bg-white shadow-sm overflow-visible">
        
        
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h2 className="text-3xl font-titulo font-black text-black">
            ¡Hola de nuevo!
          </h2>
          <p className="text-default-500 font-cuerpo mt-2 text-center px-4">
            Inicia sesión para ver tus guardados y contactar anuncios.
          </p>
        </CardHeader>

        
        <CardBody className="p-8">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={email}

              onChange={(e) => setEmail(e.target.value)}

              startContent={<Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}

              classNames={{ inputWrapper: "border-[2px] border-black" }}
            />

            
            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={password}

              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              classNames={{ inputWrapper: "border-[2px] border-black" }}
            />

            
            {errorMsg && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm font-bold mt-2">
                <p>{errorMsg}</p>
              </div>
            )}

            
            <Button
              type="submit"
              variant="solid"
              radius="md"
              isLoading={isLoading}
              className="font-titulo font-bold bg-woho-purple text-white shadow-sm mt-4 h-12 text-lg"
            >
              Ingresar
            </Button>
            
          </form>

          
          <div className="mt-6 flex flex-col items-center gap-2 font-cuerpo text-sm">
            <span className="text-default-500">
              ¿Aún no tienes cuenta?
            </span>
            <Link 
              to="/register"
              className="font-bold text-woho-purple underline underline-offset-4 hover:text-black transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </CardBody>

      </Card>
    </div>
  );
};

export default Login;

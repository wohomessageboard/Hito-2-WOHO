import React, { useState } from 'react';

import { CardBody, CardHeader, Button, Input } from '@heroui/react';

import { Mail, Lock, User } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';

import api from '../config/api';
import SurfaceCard from '../components/ui/SurfaceCard';

const Register = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });

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

    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      
      
      <SurfaceCard elevated className="w-full max-w-md overflow-visible">
        
        
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h2 className="text-3xl font-titulo font-black text-black">
            Únete a WOHO
          </h2>
          <p className="text-default-500 font-cuerpo mt-2 text-center px-4">
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
              radius="md"
              value={name}

              onChange={(e) => setName(e.target.value)}

              startContent={<User className="w-5 h-5 text-default-500 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "border border-gray-200" }}
            />

            
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              labelPlacement="outside"
              variant="bordered"
              radius="md"
              value={email}

              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="w-5 h-5 text-default-500 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "border border-gray-200" }}
            />

            
            <Input
              type="password"
              label="Contraseña"
              placeholder="Tu contraseña"
              labelPlacement="outside"
              variant="bordered"
              radius="md"
              value={password}

              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="w-5 h-5 text-default-500 pointer-events-none flex-shrink-0" aria-hidden="true" />}
              classNames={{ inputWrapper: "border border-gray-200" }}
            />

            
            {errorMsg && (
              <div role="alert" className="bg-red-50 text-red-700 rounded-xl p-3 text-sm font-bold mt-2">
                <p>{errorMsg}</p>
              </div>
            )}

            
            <Button
              type="submit"
              variant="solid"
              radius="md"
              isLoading={isLoading}
              className="font-titulo font-bold bg-woho-purple text-white mt-4 h-12 text-lg"
            >
              Crear mi cuenta
            </Button>
            
          </form>

          
          <div className="mt-6 flex flex-col items-center gap-2 font-cuerpo text-sm">
            <span className="text-default-500">
              ¿Ya tienes una cuenta?
            </span>
            <Link 
              to="/login"
              className="font-bold text-woho-purple underline underline-offset-4 hover:text-black transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </CardBody>

      </SurfaceCard>
    </div>
  );
};

export default Register;

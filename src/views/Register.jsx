import React, { useState } from 'react';
// Importamos los estilos de HeroUI
import { Card, CardBody, CardHeader, Button, Input } from '@heroui/react';
// Importamos los iconos
import { Mail, Lock, User } from 'lucide-react';
// Importamos la etiqueta para navegar entre páginas
import { Link, useNavigate } from 'react-router-dom';
// Y el hook global para conectar al usuario con su cuenta
import { useUser } from '../context/UserContext';
// Importamos la API que conecta con el Back
import api from '../config/api';

const Register = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  // 2. Aquí guardamos las tres variables para crear una cuenta
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
      
      // Dependiendo de tu backend (auth.controller), puede que te retorne directamente el login:
      const { token, user } = res.data;
      if (token && user) {
        localStorage.setItem('token', token);
        login(user); // Guardamos la sesión
        navigate('/feed'); // Lo mandamos directo adentro
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
    // Contenedor idéntico al Login (misma altura, mismo padding)
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      
      {/* Tarjeta de marco, usando rounded-xl (radio medio en rem) y fondo blanco */}
      <Card className="w-full max-w-md border-[2px] border-black rounded-xl bg-white shadow-sm overflow-visible">
        
        {/* Cabecera del Registro */}
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h2 className="text-3xl font-titulo font-black text-black">
            Únete a WOHO
          </h2>
          <p className="text-default-500 font-cuerpo mt-2 text-center px-4">
            Crea tu cuenta gratis y empieza a conectar con otros viajeros.
          </p>
        </CardHeader>

        {/* Formulario */}
        <CardBody className="p-8">
          {/* Enganchamos el comportamiento nativo "Submit" de HTML al botón de abajo */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Campo "Nombre" (Exclusivo de esta página) */}
            <Input
              type="text"
              label="Nombre completo"
              placeholder="Ej. Lucas Viajero"
              labelPlacement="inside"               // El label queda flotando por dentro del input
              variant="bordered"                    // Queremos que nuestro input tenga contorno
              radius="md"                           // Curvatura estricta que elegimos al principio
              value={name}
              // onChange se dispara letra a letra y la almacena en nuestro estado 'name' arriba
              onChange={(e) => setName(e.target.value)}
              // Colocamos el ícono "User" en la zona izquierda (<User />)
              startContent={<User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              classNames={{ inputWrapper: "border-[2px] border-black" }}
            />

            {/* Campo "Email" */}
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={email}
              // Guardamos en 'email' el evento
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              classNames={{ inputWrapper: "border-[2px] border-black" }}
            />

            {/* Campo "Contraseña" */}
            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={password}
              // Y guardamos en 'password' para validar más tarde
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              classNames={{ inputWrapper: "border-[2px] border-black" }}
            />

            {/* Mensaje de Error Interno (No Alert) */}
            {errorMsg && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm font-bold mt-2">
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Botón de Enviar. Nota: Púrpura brillante, como definimos */}
            <Button
              type="submit"
              variant="solid"
              radius="md"
              isLoading={isLoading}
              className="font-titulo font-bold bg-woho-purple text-white shadow-sm mt-4 h-12 text-lg"
            >
              Crear mi cuenta
            </Button>
            
          </form>

          {/* Vínculo hacia la pantalla Login */}
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

      </Card>
    </div>
  );
};

export default Register;

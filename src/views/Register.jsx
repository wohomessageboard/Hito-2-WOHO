import React, { useState } from 'react';
// Importamos los estilos de HeroUI
import { Card, CardBody, CardHeader, Button, Input } from '@heroui/react';
// Importamos los iconos
import { Mail, Lock, User } from 'lucide-react';
// Importamos la etiqueta para navegar entre páginas
import { Link } from 'react-router-dom';
// Y el hook global para conectar al usuario con su cuenta
import { useUser } from '../context/UserContext';

const Register = () => {
  // 1. Hook para "iniciar sesión" apenas termine de crearse la cuenta
  const { login } = useUser();

  // 2. Aquí guardamos las tres variables para crear una cuenta
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Cuando se envía el formulario (botón submit)
  const handleSubmit = (e) => {
    // Frena el "refresco" tradicional del navegador
    e.preventDefault();
    
    // Aquí en el futuro enviaríamos el "name", "email" y "password" a la Base de Datos
    console.log('Señal de envío: Registrando a...', name);

    // Para la demo, lo logueamos directamente y pasamos sus datos a nuestro contexto
    login({
      id: "new_user_123",        // ID falso hasta que tengamos Base de Datos
      name: name,                // Lo que escribimos en la Input
      avatar: "https://i.pravatar.cc/150?u=newuser" // Avatar aleatorio
    });

    // 💡 NOTA: En la realidad, habría validaciones como `password.length > 5`.
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

            {/* Botón de Enviar. Nota: Púrpura brillante, como definimos */}
            <Button
              type="submit"
              variant="solid"
              radius="md"
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

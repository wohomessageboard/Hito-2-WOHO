import React, { useState } from 'react';
// Importamos los componentes de diseño desde HeroUI
import { Card, CardBody, CardHeader, Button, Input } from '@heroui/react';
// Importamos los iconos
import { Mail, Lock } from 'lucide-react';
// Importamos Link de React Router para poder navegar hacia "Crear Cuenta"
import { Link } from 'react-router-dom';
// Importamos el hook que hicimos para iniciar sesión
import { useUser } from '../context/UserContext';

const Login = () => {
  // 1. Extraemos la función 'login' desde nuestro Contexto global
  const { login } = useUser();

  // 2. Estados locales: Cajas vacías guardando lo que el usuario tipea
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Manejador del botón "Ingresar"
  const handleSubmit = (e) => {
    // Evita recargar toda la página al mandar el formulario
    e.preventDefault();
    
    // Aquí (en el futuro) le pegaríamos al Backend para validar.
    console.log('Validando usuario:', email);

    login({
      id: "current_user",
      name: "Mi Perfil (Creador)",
      avatar: "https://i.pravatar.cc/150?u=current_user",
      country: "Chile",
      flag: "🇨🇱",
      followedLocations: [
        { id: "loc1", name: "Australia", flag: "🇦🇺", type: "country" },
        { id: "loc2", name: "Nueva Zelanda", flag: "🇳🇿", type: "country" },
        { id: "loc3", name: "Tokyo", flag: "🇯🇵", type: "city" }
      ]
    });

    // 💡 NOTA: Después de loguear, idealmente le rediriges a /feed con 'useNavigate'
  };

  return (
    // Contenedor centrado ocupando toda la altura (min-h-[70vh])
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      
      {/* Tarjeta Neo-brutalista (borde de 2px negro y redondeo md) */}
      <Card className="w-full max-w-md border-[2px] border-black rounded-xl bg-white shadow-sm overflow-visible">
        
        {/* Encabezado: Saludo inicial */}
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <h2 className="text-3xl font-titulo font-black text-black">
            ¡Hola de nuevo!
          </h2>
          <p className="text-default-500 font-cuerpo mt-2 text-center px-4">
            Inicia sesión para ver tus guardados y contactar anuncios.
          </p>
        </CardHeader>

        {/* Cuerpo: Formulario */}
        <CardBody className="p-8">
          {/* El evento onSubmit amarra el Enter del teclado y el click del botón */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Campo "Correo Electrónico" */}
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={email}
              // onChange captura CADA pulsación de tecla y la guarda en 'email'
              onChange={(e) => setEmail(e.target.value)}
              // startContent dibuja un icono dentro de la caja (a la izquierda)
              startContent={<Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              // Aseguramos el borde negro
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
              // onChange captura CADA pulsación de tecla y la guarda en 'password'
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              classNames={{ inputWrapper: "border-[2px] border-black" }}
            />

            {/* Botón enviar. Como está dentro de <form>, si es type="submit", gatillará la función handleSubmit */}
            <Button
              type="submit"
              variant="solid"
              radius="md"
              className="font-titulo font-bold bg-woho-purple text-white shadow-sm mt-4 h-12 text-lg"
            >
              Ingresar
            </Button>
            
          </form>

          {/* Enlace estático para redirigirse a "Registrarse" (ya que lo separamos) */}
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

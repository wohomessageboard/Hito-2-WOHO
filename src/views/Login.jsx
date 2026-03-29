import React, { useState } from 'react';
// Importamos los componentes de diseño desde HeroUI
import { Card, CardBody, CardHeader, Button, Input } from '@heroui/react';
// Importamos los iconos
import { Mail, Lock } from 'lucide-react';
// Importamos Link de React Router para poder navegar hacia "Crear Cuenta"
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../config/api';

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  // 2. Estados locales: Cajas vacías guardando lo que el usuario tipea
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. Manejador del botón "Ingresar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      // POST oficial al Backend para iniciar sesión
      const res = await api.post('/auth/login', { email, password });
      
      // La API nos devolvería el Token y los datos del User
      const { token, user } = res.data;
      
      // Guardar el JWT (opcional si configuras localStorage en el futuro)
      localStorage.setItem('token', token);

      // Le pasamos el objeto user real al Contexto Global
      login(user);
      
      // Redirigir al Feed
      navigate('/feed');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMsg(error.response?.data?.error || 'Credenciales incorrectas o backend no disponible.');
    } finally {
      setIsLoading(false);
    }
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

            {/* Mensaje de Error (No Alert) */}
            {errorMsg && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm font-bold mt-2">
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Botón enviar. Como está dentro de <form>, si es type="submit", gatillará la función handleSubmit */}
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

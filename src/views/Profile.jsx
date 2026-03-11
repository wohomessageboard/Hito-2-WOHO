import React, { useState, useEffect } from 'react';
// Importamos herramientas de React Router para redirigir si no hay sesión
import { useNavigate, Link } from 'react-router-dom';
// Hook global para identificar a quién le pertenece este perfil
import { useUser } from '../context/UserContext';
// Componentes de HeroUI para armar tarjetas y botones
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Chip, Divider, Tabs, Tab } from '@heroui/react';
// Iconos varios de Lucide-React
import { Settings, LogOut, Pencil, Trash2, MapPin, Search, Grid, Heart, Map } from 'lucide-react';
// Importamos la simulación de Base de Datos que creamos antes
import db from '../data/db.json';
// Componente UI abstraído
import PostCard from '../components/ui/PostCard';

const Profile = () => {
  // 1. Herramientas básicas de estado y navegación
  const { currentUser, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  // 2. Protegiendo la ruta: Si alguien intenta entrar a "/profile" sin Iniciar Sesión, lo pateamos a Home.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Si aún está calculando, retornamos nulo o una carga para no mostrar errores rotos
  if (!currentUser) return null;

  // 3. Filtrando "Mis Anuncios" desde la Base de Datos Falsa (db.json)
  // Comparamos el "userId" de cada post con el "id" del usuario actual.
  const myPosts = db.posts.filter((post) => post.userId === currentUser.id);

  // 4. Simulando "Mis Guardados" 
  // En un entorno real, existiría una tabla de Favoritos en la DB. 
  // Aquí fingiremos que el anuncio "101" (El de Sofía Gómez) está guardado por nosotros.
  const savedPosts = db.posts.filter((post) => post.id === "101");

  // Función local para gestionar el desloguearse y devolverte al Home.
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // Contenedor principal del Perfil
    <div className="flex flex-col gap-10">

      {/* 
        ========================================
        SECCIÓN 1: CABECERA DEL USUARIO
        ========================================
      */}
      <section className="bg-woho-purple text-white p-8 md:p-12 rounded-xl flex flex-col md:flex-row items-center gap-8 border-[2px] border-black shadow-sm">
        
        {/* Foto de perfil grande */}
        <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0">
          <Avatar 
            src={currentUser.avatar} 
            className="w-full h-full border-[3px] border-black text-large bg-white" 
            radius="full" 
          />
        </div>

        {/* Datos y estado del usuario */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-4xl md:text-5xl font-titulo font-black uppercase tracking-tighter leading-none">
            {currentUser.name}
          </h1>
          <p className="font-cuerpo text-lg opacity-90">
            {currentUser.country ? `${currentUser.flag} País de Origen: ${currentUser.country} • ` : ''} 
            Viajero apasionado
          </p>
          
          {/* Botones de acción directos */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <Button 
              as={Link}
              to="/edit-profile"
              variant="flat" 
              radius="md" 
              className="font-bold bg-white text-black hover:bg-gray-200 transition-colors border-[2px] border-black"
              startContent={<Settings className="w-4 h-4" />}
            >
              Editar Perfil
            </Button>
            <Button 
              onPress={handleLogout}
              variant="flat" 
              radius="md" 
              className="font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors border-[2px] border-black"
              startContent={<LogOut className="w-4 h-4" />}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        SECCIÓN DE PESTAÑAS (TABS): ANUNCIOS Y GUARDADOS
        ========================================
      */}
      <section className="space-y-6">
        {/*
          Componente Tabs de HeroUI.
          Le damos un radio medium (radius="md"), tamaño grande y color personalizado a la selección
        */}
        <Tabs 
          aria-label="Contenido del perfil" 
          radius="md" 
          size="lg"
          classNames={{
            tabList: "border-[2px] border-black bg-white shadow-sm p-1",
            cursor: "bg-woho-black shadow-none",
            tabContent: "group-data-[selected=true]:text-white font-titulo font-bold text-black"
          }}
        >
          {/* PRIMERA PESTAÑA: MIS ANUNCIOS */}
          <Tab 
            key="mis-anuncios" 
            title={
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                <span>Mis Avisos</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {myPosts.length === 0 ? (
                <p className="font-cuerpo text-gray-500 italic">No tienes anuncios publicados aún.</p>
              ) : (
                myPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="creator" />
                ))
              )}
            </div>
          </Tab>

          {/* SEGUNDA PESTAÑA: MIS GUARDADOS */}
          <Tab 
            key="guardados" 
            title={
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                <span>Favoritos</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {savedPosts.length === 0 ? (
                <p className="font-cuerpo text-gray-500 italic">No tienes ningún aviso guardado.</p>
              ) : (
                savedPosts.map((post) => {
                  const owner = db.users.find(u => u.id === post.userId);
                  return (
                    <PostCard key={post.id} post={post} owner={owner} variant="favorite" />
                  );
                })
              )}
            </div>
          </Tab>

          {/* TERCERA PESTAÑA: LUGARES SEGUIDOS */}
          <Tab 
            key="seguidos" 
            title={
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                <span>Seguidos</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {currentUser?.followedLocations?.length > 0 ? (
                currentUser.followedLocations.map((loc) => (
                  <Card key={loc.id} className="border-[2px] border-black rounded-xl bg-white shadow-sm hover:translate-y-[-2px] transition-transform">
                    <CardBody className="p-4 flex flex-row items-center gap-4">
                      <div className="text-4xl bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center border-[2px] border-black pb-1">
                        {loc.flag}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-titulo font-extrabold text-black text-lg leading-tight">{loc.name}</h4>
                        <span className="text-xs font-cuerpo text-default-500 uppercase font-bold tracking-wider">
                          {loc.type === 'country' ? 'País' : 'Ciudad'}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="font-cuerpo text-gray-500 italic col-span-full">No sigues ninguna ubicación todavía. Ve a explorar para añadir lugares a tu radar.</p>
              )}
            </div>
          </Tab>

        </Tabs>
      </section>

    </div>
  );
};

export default Profile;

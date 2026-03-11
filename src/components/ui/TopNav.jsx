import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@heroui/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
// 1. Importamos nuestro propio hook de Contexto
import { useUser } from '../../context/UserContext';

const TopNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // 2. Extraemos las herramientas de la "caja fuerte" global
  // isAuthenticated: true/false. currentUser: los datos. logout: la funcion para salir.
  const { isAuthenticated, currentUser, logout } = useUser();

  return (
    <Navbar 
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      height="5rem"
      position="sticky"
      className="top-4 z-50 mx-auto w-[95%] max-w-7xl rounded-full border-[2px] border-black bg-white/70 backdrop-blur-lg shadow-sm"
      classNames={{
        wrapper: "px-4 sm:px-6",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[4px]",
          "data-[active=true]:after:bg-woho-orange"
        ]
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle 
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          icon={(isOpen) => (
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-[2px] w-full bg-black transition-transform duration-300 ${isOpen ? 'translate-y-[9px] rotate-45' : ''}`} />
              <span className={`h-[2px] w-full bg-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`h-[2px] w-full bg-black transition-transform duration-300 ${isOpen ? '-translate-y-[9px] -rotate-45' : ''}`} />
            </div>
          )}
        />
      </NavbarContent>

      <NavbarBrand className="mr-4">
        <RouterLink to="/" className="flex items-center gap-2">
          {/* Logo de Cloudinary */}
          <img 
            src="https://res.cloudinary.com/dpxpixlpl/image/upload/v1772886330/WOHO_logo_uxi9wo.png" 
            alt="WOHO Logo" 
            className="w-[110px] h-[110px] object-contain"
          />
        </RouterLink>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem isActive={location.pathname === '/'}>
          <Link as={RouterLink} to="/" color="foreground" className="font-titulo font-bold hover:text-woho-purple transition-colors">
            Inicio
          </Link>
        </NavbarItem>
        {isAuthenticated && (
          <NavbarItem isActive={location.pathname === '/feed'}>
            <Link as={RouterLink} to="/feed" color="foreground" className="font-titulo font-bold hover:text-woho-purple transition-colors">
              Explorar
            </Link>
          </NavbarItem>
        )}
        <NavbarItem isActive={location.pathname.startsWith('/destinos')}>
          <Link as={RouterLink} to="/destinos" color="foreground" className="font-titulo font-bold hover:text-woho-purple transition-colors">
            Destinos
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === '/manifiesto'}>
          <Link as={RouterLink} to="/manifiesto" color="foreground" className="font-titulo font-bold hover:text-woho-purple transition-colors">
            Manifiesto
          </Link>
        </NavbarItem>

      </NavbarContent>

      {/* 3. Renderizado Condicional de los Botones Derechos (Escritorio) */}
      <NavbarContent justify="end">
        {isAuthenticated ? (
          // VISIÓN DE USUARIO LOGUEADO
          <>
            <NavbarItem className="hidden lg:flex">
              <Button 
                as={RouterLink} 
                to="/new-post" 
                variant="flat" 
                radius="md" 
                className="font-bold bg-gray-100 text-black shadow-sm h-10 px-6"
              >
                Crear Publicación
              </Button>
            </NavbarItem>
            <NavbarItem>
              {/* Al hacer click en el Avatar ahora nos lleva a la página de Mi Perfil en vez de desloguearnos */}
              <RouterLink to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Ir a Mi Perfil">
                <Avatar isBordered radius="full" size="lg" src={currentUser?.avatar} className="cursor-pointer" />
              </RouterLink>
            </NavbarItem>
          </>
        ) : (
          // VISIÓN DE USUARIO DESCONECTADO (PÚBLICA)
          <>
            <NavbarItem className="hidden lg:flex">
              <Button 
                as={RouterLink} 
                to="/register" 
                variant="flat" 
                radius="md" 
                className="font-bold bg-gray-100 text-black shadow-sm h-10 px-6"
              >
                Regístrate
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={RouterLink} 
                to="/login" 
                variant="solid" 
                radius="md" 
                className="font-bold bg-woho-purple text-white shadow-sm h-10 px-6"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* Menú Móvil */}
      <NavbarMenu className="bg-white/70 backdrop-blur-lg pt-8 mt-5  rounded-xl  border-[2px] border-black pb-8 flex flex-col items-center gap-6 !w-[95%] mx-auto left-0 right-0 h-max max-h-[80vh] shadow-sm">
        <NavbarMenuItem isActive={location.pathname === '/'} className="w-full flex justify-center">
          <Link as={RouterLink} to="/" className="w-full font-titulo font-extrabold text-2xl text-black justify-center" onPress={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
        </NavbarMenuItem>
        
        <div className="w-1/2 h-[2px] bg-black opacity-20 rounded-full" />

        {isAuthenticated && (
          <>
            <NavbarMenuItem isActive={location.pathname === '/feed'} className="w-full flex justify-center">
              <Link as={RouterLink} to="/feed" className="w-full font-titulo font-extrabold text-2xl text-black justify-center" onPress={() => setIsMenuOpen(false)}>
                Explorar
              </Link>
            </NavbarMenuItem>

            <div className="w-1/2 h-[2px] bg-black opacity-20 rounded-full" />
          </>
        )}

        <NavbarMenuItem isActive={location.pathname.startsWith('/destinos')} className="w-full flex justify-center">
          <Link as={RouterLink} to="/destinos" className="w-full font-titulo font-extrabold text-2xl text-black justify-center" onPress={() => setIsMenuOpen(false)}>
            Destinos
          </Link>
        </NavbarMenuItem>

        <div className="w-1/2 h-[2px] bg-black opacity-20 rounded-full" />

        <NavbarMenuItem isActive={location.pathname === '/manifiesto'} className="w-full flex justify-center">
          <Link as={RouterLink} to="/manifiesto" className="w-full font-titulo font-extrabold text-2xl text-black justify-center" onPress={() => setIsMenuOpen(false)}>
            Manifiesto
          </Link>
        </NavbarMenuItem>


        
        {/* 4. Renderizado Condicional del Menú Móvil */}
        <NavbarMenuItem className="w-full flex flex-col justify-center mt-4 px-6 gap-3">
          {isAuthenticated ? (
            // BOTONES MÓVIL LOGUEADO
            <>
              <Button 
                as={RouterLink} 
                to="/new-post" 
                variant="flat" 
                radius="md" 
                fullWidth
                className="font-bold bg-woho-orange text-white shadow-sm h-12 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                Crear Publicación
              </Button>
              <Button 
                as={RouterLink} 
                to="/profile" 
                variant="flat" 
                radius="md" 
                fullWidth
                className="font-bold bg-white text-black border-[2px] border-black shadow-sm h-12 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Button>
              <Button 
                variant="flat" 
                radius="md" 
                fullWidth
                className="font-bold bg-gray-100 text-red-600 shadow-sm h-12 text-lg"
                onPress={() => {
                  logout(); // Cierra sesión
                  setIsMenuOpen(false); // Cierra el cajón
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            // BOTONES MÓVIL DESCONECTADO (PÚBLICO)
            <>
              <Button 
                as={RouterLink} 
                to="/register" 
                variant="flat" 
                radius="md" 
                fullWidth
                className="font-bold bg-woho-orange text-white shadow-sm h-12 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                Regístrate
              </Button>
              <Button 
                as={RouterLink} 
                to="/login" 
                variant="solid" 
                radius="md" 
                fullWidth
                className="font-bold bg-woho-purple text-white shadow-sm h-12 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Button>
            </>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default TopNav;

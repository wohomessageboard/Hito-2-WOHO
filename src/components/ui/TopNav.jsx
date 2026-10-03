import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@heroui/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import { useUser } from '../../context/UserContext';

const TopNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const { isAuthenticated, currentUser, logout } = useUser();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      height="4.25rem"
      position="sticky"
      className={`top-0 z-50 bg-white/90 backdrop-blur-sm transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}
      classNames={{
        wrapper: "px-4 sm:px-6",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
        ]
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="min-w-11 min-h-11 flex items-center justify-center"
          icon={(isOpen) => (
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`h-[2px] w-full bg-woho-black transition-transform duration-300 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`h-[2px] w-full bg-woho-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`h-[2px] w-full bg-woho-black transition-transform duration-300 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </div>
          )}
        />
      </NavbarContent>

      <NavbarBrand className="mr-4">
        <RouterLink to="/" className="flex items-center gap-2">

          <img
            src="https://res.cloudinary.com/dpxpixlpl/image/upload/v1772886330/WOHO_logo_uxi9wo.png"
            alt="WOHO Logo"
            className="h-9 w-auto object-contain"
          />
        </RouterLink>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-7" justify="center">
        {!isAuthenticated && (
          <NavbarItem>
            <Link
              as={RouterLink}
              to="/"
              className={`font-titulo font-bold text-sm transition-colors ${location.pathname === '/' ? 'text-woho-purple' : 'text-woho-black hover:text-woho-purple'}`}
            >
              Inicio
            </Link>
          </NavbarItem>
        )}
        {isAuthenticated && (
          <NavbarItem>
            <Link
              as={RouterLink}
              to="/feed"
              className={`font-titulo font-bold text-sm transition-colors ${location.pathname === '/feed' ? 'text-woho-purple' : 'text-woho-black hover:text-woho-purple'}`}
            >
              Explorar
            </Link>
          </NavbarItem>
        )}
        <NavbarItem>
          <Link
            as={RouterLink}
            to="/destinos"
            className={`font-titulo font-bold text-sm transition-colors ${location.pathname.startsWith('/destinos') ? 'text-woho-purple' : 'text-woho-black hover:text-woho-purple'}`}
          >
            Destinos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            as={RouterLink}
            to="/manifiesto"
            className={`font-titulo font-bold text-sm transition-colors ${location.pathname === '/manifiesto' ? 'text-woho-purple' : 'text-woho-black hover:text-woho-purple'}`}
          >
            Manifiesto
          </Link>
        </NavbarItem>

      </NavbarContent>


      <NavbarContent justify="end" className="gap-2">
        {isAuthenticated ? (

          <>

            {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
              <NavbarItem className="hidden lg:flex">
                <Button
                  as={RouterLink}
                  to="/admin-dashboard"
                  variant="light"
                  radius="md"
                  className="font-bold text-woho-black h-10 px-4"
                >
                  Admin Panel
                </Button>
              </NavbarItem>
            )}

            <NavbarItem className="hidden lg:flex">
              <Button
                as={RouterLink}
                to="/new-post"
                variant="solid"
                radius="md"
                className="font-bold bg-woho-purple text-white h-10 px-5"
              >
                Crear Publicación
              </Button>
            </NavbarItem>
            <NavbarItem>

              <RouterLink to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Ir a Mi Perfil">
                <Avatar radius="full" size="sm" src={currentUser?.avatar} className="cursor-pointer" />
              </RouterLink>
            </NavbarItem>
          </>
        ) : (

          <>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={RouterLink}
                to="/register"
                variant="light"
                radius="md"
                className="font-bold text-woho-black h-10 px-4"
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
                className="font-bold bg-woho-purple text-white h-10 px-5"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>


      <NavbarMenu className="bg-white pt-6 pb-8 flex flex-col items-center gap-5">
        {!isAuthenticated && (
          <NavbarMenuItem className="w-full flex justify-center">
            <Link as={RouterLink} to="/" className={`w-full font-titulo font-extrabold text-2xl justify-center ${location.pathname === '/' ? 'text-woho-purple' : 'text-woho-black'}`} onPress={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
          </NavbarMenuItem>
        )}

        {isAuthenticated && (
          <NavbarMenuItem className="w-full flex justify-center">
            <Link as={RouterLink} to="/feed" className={`w-full font-titulo font-extrabold text-2xl justify-center ${location.pathname === '/feed' ? 'text-woho-purple' : 'text-woho-black'}`} onPress={() => setIsMenuOpen(false)}>
              Explorar
            </Link>
          </NavbarMenuItem>
        )}

        <NavbarMenuItem className="w-full flex justify-center">
          <Link as={RouterLink} to="/destinos" className={`w-full font-titulo font-extrabold text-2xl justify-center ${location.pathname.startsWith('/destinos') ? 'text-woho-purple' : 'text-woho-black'}`} onPress={() => setIsMenuOpen(false)}>
            Destinos
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem className="w-full flex justify-center">
          <Link as={RouterLink} to="/manifiesto" className={`w-full font-titulo font-extrabold text-2xl justify-center ${location.pathname === '/manifiesto' ? 'text-woho-purple' : 'text-woho-black'}`} onPress={() => setIsMenuOpen(false)}>
            Manifiesto
          </Link>
        </NavbarMenuItem>



        <NavbarMenuItem className="w-full flex flex-col justify-center mt-4 px-6 gap-3 border-t border-gray-100 pt-6">
          {isAuthenticated ? (

            <>

              {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                <Button
                  as={RouterLink}
                  to="/admin-dashboard"
                  variant="flat"
                  radius="md"
                  fullWidth
                  className="font-bold bg-gray-100 text-woho-black h-12 text-lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Button>
              )}

              <Button
                as={RouterLink}
                to="/new-post"
                variant="solid"
                radius="md"
                fullWidth
                className="font-bold bg-woho-purple text-white h-12 text-lg"
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
                className="font-bold bg-gray-100 text-woho-black h-12 text-lg"
                onPress={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Button>
              <Button
                variant="light"
                radius="md"
                fullWidth
                className="font-bold text-red-600 h-12 text-lg"
                onPress={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (

            <>
              <Button
                as={RouterLink}
                to="/register"
                variant="flat"
                radius="md"
                fullWidth
                className="font-bold bg-gray-100 text-woho-black h-12 text-lg"
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
                className="font-bold bg-woho-purple text-white h-12 text-lg"
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

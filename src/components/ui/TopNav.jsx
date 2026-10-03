import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@heroui/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import { Menu as MenuIcon, Close as CloseIcon } from './icons';

// Enlaces principales. El feed es público: "Explorar" se ve con o sin sesión.
const NAV_LINKS = [
  { to: '/feed', label: 'Explorar', match: (p) => p === '/feed' },
  { to: '/destinos', label: 'Destinos', match: (p) => p.startsWith('/destinos') },
  { to: '/manifiesto', label: 'Manifiesto', match: (p) => p === '/manifiesto' },
];

const TopNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { isAuthenticated, currentUser, logout } = useUser();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      height="4.25rem"
      position="sticky"
      className="top-0 z-50 bg-ws-paper-light border-b border-ws-line"
      classNames={{
        base: "bg-ws-paper-light",
        wrapper: "px-4 sm:px-6",
        item: ["flex", "relative", "h-full", "items-center"],
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="min-w-11 min-h-11 flex items-center justify-center"
          icon={(isOpen) => (isOpen
            ? <CloseIcon className="w-6 h-6" />
            : <MenuIcon className="w-6 h-6" />)}
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

      <NavbarContent className="hidden sm:flex gap-2" justify="center">
        {NAV_LINKS.map(({ to, label, match }) => {
          const active = match(location.pathname);
          return (
            <NavbarItem key={to}>
              <Link
                as={RouterLink}
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 text-sm font-bold text-ws-ink rounded-[6px] transition-colors ${active ? 'bg-ws-mustard' : 'hover:bg-ws-paper-deep'}`}
              >
                {label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <NavbarItem className="hidden lg:flex">
                <Button as={RouterLink} to="/admin-dashboard" radius="sm" className="ws-pill ws-pill-line h-10 px-4">
                  Panel de admin
                </Button>
              </NavbarItem>
            )}
            <NavbarItem className="hidden lg:flex">
              <Button as={RouterLink} to="/new-post" radius="sm" className="ws-btn ws-btn-tomato h-10 px-5">
                Crear publicación
              </Button>
            </NavbarItem>
            <NavbarItem>
              <RouterLink to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Ir a mi perfil">
                <Avatar radius="sm" size="sm" src={currentUser?.avatar} className="cursor-pointer" />
              </RouterLink>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button as={RouterLink} to="/register" radius="sm" className="ws-pill ws-pill-line h-10 px-4">
                Regístrate
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={RouterLink} to="/login" radius="sm" className="ws-btn ws-btn-tomato h-10 px-5">
                Iniciar sesión
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-ws-paper-light pt-6 pb-8 flex flex-col items-stretch gap-3">
        {NAV_LINKS.map(({ to, label, match }) => {
          const active = match(location.pathname);
          return (
            <NavbarMenuItem key={to} className="w-full">
              <Link
                as={RouterLink}
                to={to}
                aria-current={active ? 'page' : undefined}
                onPress={() => setIsMenuOpen(false)}
                className={`w-full font-display text-4xl text-ws-ink px-3 py-1 rounded-[6px] ${active ? 'bg-ws-mustard' : ''}`}
              >
                {label}
              </Link>
            </NavbarMenuItem>
          );
        })}

        <NavbarMenuItem className="w-full flex flex-col mt-4 gap-3 border-t border-ws-line pt-6">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button as={RouterLink} to="/admin-dashboard" radius="sm" fullWidth className="ws-pill ws-pill-line h-12 text-base" onPress={() => setIsMenuOpen(false)}>
                  Panel de admin
                </Button>
              )}
              <Button as={RouterLink} to="/new-post" radius="sm" fullWidth className="ws-btn ws-btn-tomato h-12 text-base" onPress={() => setIsMenuOpen(false)}>
                Crear publicación
              </Button>
              <Button as={RouterLink} to="/profile" radius="sm" fullWidth className="ws-pill ws-pill-line h-12 text-base" onPress={() => setIsMenuOpen(false)}>
                Mi perfil
              </Button>
              <Button radius="sm" fullWidth className="ws-pill h-12 text-base text-ws-tomato-deep bg-transparent" onPress={() => { logout(); setIsMenuOpen(false); }}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/register" radius="sm" fullWidth className="ws-pill ws-pill-line h-12 text-base" onPress={() => setIsMenuOpen(false)}>
                Regístrate
              </Button>
              <Button as={RouterLink} to="/login" radius="sm" fullWidth className="ws-btn ws-btn-tomato h-12 text-base" onPress={() => setIsMenuOpen(false)}>
                Iniciar sesión
              </Button>
            </>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default TopNav;

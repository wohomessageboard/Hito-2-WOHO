import { useLayoutEffect } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { themeForPath } from '../theme/pageThemes';
import { Link } from '@heroui/react';
import TopNav from '../components/ui/TopNav';
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs';
import Stamp, { InkFilter } from '../components/ui/Stamp';

const MainLayout = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const { paper, accent } = themeForPath(pathname);
    const root = document.documentElement;
    root.style.setProperty('--ws-paper', paper);
    root.style.setProperty('--ws-accent', accent);
  }, [pathname]);

  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col min-h-screen w-full">
      <InkFilter />

      {/* Cintillo de edición: dato editorial, no navegación. */}
      <div className="bg-ws-ink text-ws-paper-light ws-mono py-1.5 px-4 text-center tracking-[0.14em]" aria-hidden="true">
        WOHO · <span className="hidden sm:inline">Tablón de avisos </span>Working Holiday · Edición {year}
      </div>

      <TopNav />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6">
        <AppBreadcrumbs />
        <Outlet />
      </main>

      <footer className="ws-band ws-band-ink ws-bleed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto] items-center">
          <div className="space-y-4">
            <p className="font-display text-4xl sm:text-5xl max-w-xl">
              Viajar no es escapar, <em className="text-ws-mustard">es encontrarse.</em>
            </p>
            <p className="font-cuerpo text-sm text-ws-paper-light/80">
              © {year} WOHO. Hecho para viajeros, con ayuda de otros viajeros.
            </p>
          </div>
          <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-6 gap-y-2 font-cuerpo text-sm font-bold">
            <Link as={RouterLink} to="/como-funciona" className="text-ws-paper-light underline underline-offset-4 hover:text-ws-mustard">Cómo funciona</Link>
            <Link as={RouterLink} to="/manifiesto" className="text-ws-paper-light underline underline-offset-4 hover:text-ws-mustard">Manifiesto</Link>
            <a href="#" className="underline underline-offset-4 hover:text-ws-mustard">Términos</a>
            <a href="#" className="underline underline-offset-4 hover:text-ws-mustard">Privacidad</a>
            <a href="#" className="underline underline-offset-4 hover:text-ws-mustard">Contacto</a>
          </nav>
          <Stamp
            solid
            variant="round"
            center={['WOHO']}
            top="WORKING HOLIDAY"
            bottom={`EST. ${year}`}
            rotate={-10}
            className="hidden lg:block w-24 text-ws-mustard"
          />
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

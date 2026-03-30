import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Link } from '@heroui/react';
import TopNav from '../components/ui/TopNav';
import AppBreadcrumbs from '../components/ui/AppBreadcrumbs';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-woho-white w-full">
      <TopNav />
      
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <AppBreadcrumbs />
        <Outlet />
      </main>

      
      <footer className="border-t-[2px] border-black bg-woho-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-cuerpo font-bold text-sm text-black">
            © {new Date().getFullYear()} WOHO. Desarrollado con ❤️ para viajeros.
          </p>
          <div className="flex gap-4 font-cuerpo text-sm font-bold">
            <Link as={RouterLink} to="/manifiesto" className="hover:text-woho-purple underline underline-offset-2 text-black">Manifiesto</Link>
            <a href="#" className="hover:text-woho-purple underline underline-offset-2">Términos</a>
            <a href="#" className="hover:text-woho-purple underline underline-offset-2">Privacidad</a>
            <a href="#" className="hover:text-woho-purple underline underline-offset-2">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

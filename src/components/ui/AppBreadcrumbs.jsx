import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Si estamos en home, ocultamos los breadcrumbs
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 px-2">
      <Breadcrumbs 
        size="md" 
        radius="sm" 
        variant="solid"
        classNames={{
          list: "bg-white underline-[2px] border-black shadow-sm",
        }}
        itemClasses={{
          item: "font-titulo font-bold text-black",
          separator: "text-black"
        }}
      >
        <BreadcrumbItem>
          <RouterLink to="/" className="hover:text-woho-purple transition-colors">
            Inicio
          </RouterLink>
        </BreadcrumbItem>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Asignación manual del título según la ruta actual ("value")
          let title = "";

          switch (value) {
            case 'feed':
              title = "Explorar";
              break;
            case 'uikit':
              title = "UI Kit";
              break;
            case 'login':
              title = "Iniciar Sesión";
              break;
            case 'register':
              title = "Registrarse";
              break;
            case 'new-post':
              title = "Crear Publicación";
              break;
            case 'profile':
              title = "Mi Perfil";
              break;
            case 'destinos':
              title = "Destinos";
              break;
            case 'manifiesto':
              title = "Manifiesto";
              break;
            case 'edit-profile':
              title = "Editar Perfil";
              break;
            case 'edit-post':
              title = "Editar";
              break;
            case 'post':
              title = "Anuncio";
              break;
            default:
              // Si el anterior es edit-post o post, es un ID, así que intentamos que se vea mejor
              if (index > 0 && (pathnames[index-1] === 'edit-post' || pathnames[index-1] === 'post')) {
                // Intentamos recuperar un título guardado en sesión por la vista
                const savedTitle = window.sessionStorage.getItem('last_post_title');
                title = savedTitle ? `"${savedTitle}"` : "Detalle";
              } else {
                title = value.charAt(0).toUpperCase() + value.slice(1);
              }
              break;
          }

          return (
            <BreadcrumbItem key={to} isCurrent={last}>
              {last ? (
                <span className="text-woho-purple">{title}</span>
              ) : (
                <RouterLink to={to} className="hover:text-woho-purple transition-colors">
                  {title}
                </RouterLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default AppBreadcrumbs;

import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 pb-3 border-b border-ws-line">
      <Breadcrumbs
        size="sm"
        variant="light"
        classNames={{ list: "gap-0 p-0 bg-transparent shadow-none" }}
        itemClasses={{
          item: "ws-mono font-medium text-ws-ink",
          separator: "text-ws-ink px-2"
        }}
      >
        <BreadcrumbItem>
          <RouterLink to="/" className="hover:underline underline-offset-4">
            Inicio
          </RouterLink>
        </BreadcrumbItem>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          let title;

          switch (value) {
            case 'feed':
              title = "Explorar";
              break;
            case 'uikit':
              title = "UI Kit";
              break;
            case 'login':
              title = "Iniciar sesión";
              break;
            case 'register':
              title = "Registrarse";
              break;
            case 'new-post':
              title = "Crear publicación";
              break;
            case 'profile':
              title = "Mi perfil";
              break;
            case 'destinos':
              title = "Destinos";
              break;
            case 'manifiesto':
              title = "Manifiesto";
              break;
            case 'edit-profile':
              title = "Editar perfil";
              break;
            case 'edit-post':
              title = "Editar";
              break;
            case 'post':
              title = "Anuncio";
              break;
            default:

              if (index > 0 && (pathnames[index-1] === 'edit-post' || pathnames[index-1] === 'post')) {

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
                <span className="bg-ws-paper-light px-1.5">{title}</span>
              ) : (
                <RouterLink to={to} className="hover:underline underline-offset-4">
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

import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Chip, Divider } from '@heroui/react';
import { Pencil, Trash2, Star, Lock, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../config/api';

// Componente modular y reutilizable para pintar las Tarjetas de los Anuncios.
// Las variables (props) que recibe por los paréntesis determinan cómo se dibuja:
// 1. post: Los datos puros del anuncio (título, ciudad, etc)
// 2. owner: Los datos de quien creó el anuncio (foto, nombre)
// 3. variant: Puede ser "feed", "creator" o "favorite". Cambia qué botones se muestran abajo.
// 4. isMyPost: Avisa si el anuncio que estamos viendo es tuyo propio para darte un trato especial.
const PostCard = ({ post, owner, variant = "feed", isMyPost = false }) => {
  const { isAuthenticated, currentUser, savedPostIds, toggleSavedPostId } = useUser();
  
  // Obtenemos el ID independientemente de si viene como id (Posts) o post_id (Favorites view)
  const postIdToSave = post.post_id || post.id;
  // Derivamos si es favorito directamente del Árbol Global para que sobreviva a cambios de vista
  const isFav = savedPostIds ? savedPostIds.includes(postIdToSave) : false;
  
  // 1. Configuraciones de Color por Categoría
  let typeColor = "text-woho-purple";
  if (post.type === "Trabajo") typeColor = "text-woho-orange";
  if (post.type === "Social") typeColor = "text-green-600";

  // Lógica para añadir/remover favoritos (Simplemente hace el Fetch)
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Por si está dentro del Link
    try {
      if (isFav || variant === "favorite") {
        await api.delete(`/users/me/favorites/${postIdToSave}`);
        if(toggleSavedPostId) toggleSavedPostId(postIdToSave);
      } else {
        await api.post(`/users/me/favorites/${postIdToSave}`);
        if(toggleSavedPostId) toggleSavedPostId(postIdToSave);
      }
    } catch (err) {
      console.error(err);
      // Falla silenciosamente o maneja logs
    }
  };

  // 2. Renderizar Cabecera según Variante
  const renderHeader = () => {
    // Si estamos en "creator" (Mi Perfil -> Mis Avisos), no muestro mi propio Avatar, muestro los días restantes
    if (variant === "creator") {
      return (
        <CardHeader className="justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{post.flag}</span>
            <h5 className="text-sm font-titulo font-bold text-black">{post.country}, {post.city}</h5>
          </div>
          <Chip size="sm" variant="flat" color={post.expiresInDays <= 2 ? "danger" : post.expiresInDays <= 5 ? "warning" : "success"} className="font-bold text-xs">
            {post.expiresInDays === 0 ? '¡Expira hoy!' : `Expira en ${post.expiresInDays} días`}
          </Chip>
        </CardHeader>
      );
    }

    // Lógica de censura para el Feed público
    const isPublicFeed = variant === "feed" && !isAuthenticated;

    // Si estamos en "feed" o "favorite", sí mostramos la foto del autor original del post
    return (
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          {/* Si está oculto, mostramos un avatar por defecto. Si no, la foto del autor. */}
          {isPublicFeed ? (
            <Avatar size="sm" className="border-[1.5px] border-dashed border-gray-400 bg-gray-100" />
          ) : (
            <Avatar src={owner?.avatar} size="sm" className="border-[1.5px] border-black bg-white" />
          )}
          <div className="flex flex-col gap-1 items-start justify-center">
            {/* Título y censura de nombre */}
            <h4 className="text-sm font-titulo font-extrabold leading-none text-black flex items-center gap-1">
              {variant === "feed" && isMyPost 
                ? "Yo (Tu aviso)" 
                : (isPublicFeed ? <span className="text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3"/> Viajero Protegido</span> : (owner?.name || "Anónimo"))
              }
            </h4>
            <div className={`flex items-center gap-1 text-xs font-cuerpo text-default-500 ${variant === "feed" ? "font-bold" : ""}`}>
              <span>{post.flag}</span>
              {variant === "favorite" ? <span>{post.country}, {post.city}</span> : <span>{post.city}</span>}
            </div>
          </div>
        </div>
        
        {/* BOTÓN MOCK EXCLUSIVO PARA SUPERADMINS (FIJAR POST DESDE EL FEED) */}
        {currentUser?.role === 'superadmin' && (
          <Button 
            isIconOnly 
            size="sm" 
            color="warning" 
            variant="flat" 
            className="border-[1.5px] border-warning"
            title="Pinnear Aviso (Solo SuperAdmin)"
            onClick={(e) => {
              e.preventDefault(); // Por si el Card tiene Link Wrapper
              alert(`EJECUCIÓN SUPERADMIN: Simulando PUT /api/admin/posts/${post.id}/pin para destacar aviso en BD.`);
            }}
          >
            <Pin className="w-4 h-4 text-warning-700 font-black" />
          </Button>
        )}
      </CardHeader>
    );
  };

  // 3. Renderizar Cuerpo del Card
  const renderBody = () => (
    <CardBody className="px-4 py-4 flex-1">
      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 block ${variant === "feed" ? typeColor : (post.type === "Trabajo" ? "text-woho-orange" : "text-woho-purple")}`}>
        • {post.type}
      </span>
      <Link to={`/post/${post.id}`} className="hover:underline decoration-woho-orange decoration-4 underline-offset-4">
        <h3 className="font-titulo font-extrabold text-lg leading-tight text-woho-black mb-3 cursor-pointer">
          {post.title}
        </h3>
      </Link>
      {variant !== "favorite" && (
        <p className="text-sm font-cuerpo text-default-600 line-clamp-4">
          {post.description}
        </p>
      )}
    </CardBody>
  );

  // 4. Renderizar Imágenes (Solo el Feed muestra un thumbnail rápido si existen)
  const renderImages = () => {
    if (variant !== "feed" || !post.images || post.images.length === 0) return null;
    return (
      <div className="px-4 pb-4">
        <div className="w-full h-24 rounded-lg border-2 border-black overflow-hidden relative">
          <img 
            src={post.images[0]} 
            alt="Thumbnail" 
            className="w-full h-full object-cover"
          />
          {post.images.length > 1 && (
             <div className="absolute bottom-1 right-1 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm border border-white">
               +{post.images.length - 1} fotos
             </div>
          )}
        </div>
      </div>
    );
  };

  // 5. Renderizar Botonera Inferior según Variante
  const renderFooter = () => {
    if (variant === "creator") {
      return (
        <CardFooter className="flex justify-between gap-2">
          <Button as={Link} to={`/edit-post/${post.id}`} variant="flat" radius="md" size="sm" className="w-1/2 font-bold bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Pencil className="w-4 h-4 mr-1" /> Editar
          </Button>
          <Button variant="flat" radius="md" size="sm" className="w-1/2 font-bold bg-red-100 text-red-600 hover:bg-red-200">
            <Trash2 className="w-4 h-4 mr-1" /> Eliminar
          </Button>
        </CardFooter>
      );
    }

    if (variant === "favorite") {
      return (
        <CardFooter className="flex justify-between gap-2">
          <Button as={Link} to={`/post/${postIdToSave}`} variant="solid" radius="md" size="sm" className="font-bold bg-black text-white w-3/4">
            Ver más
          </Button>
          <Button onClick={handleToggleFavorite} variant="flat" radius="md" size="sm" className="w-1/4 px-0 flex justify-center items-center bg-red-100 hover:bg-red-200 text-red-600 transition-colors" title="Quitar de Favoritos">
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      );
    }

    // Por descarte, si estamos en el Feed
    return (
      <CardFooter className="flex justify-between gap-2 bg-gray-50/50 rounded-b-xl">
        {isMyPost ? (
           <Button as={Link} to="/profile" variant="flat" radius="sm" size="sm" className="w-full font-bold bg-gray-200 text-black border border-black border-dashed">
             Gestionar en Perfil
           </Button>
        ) : (
          <>
            {/* Contactar solo funciona si estás logueado */}
            {isAuthenticated ? (
              <Button as={Link} to={`/post/${postIdToSave}`} variant="solid" radius="sm" size="sm" className="font-bold bg-black text-white w-3/4">
                Ver más
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="flat" radius="sm" size="sm" className="font-bold bg-gray-200 text-gray-500 w-3/4 border border-dashed border-gray-400">
                Inicia sesión para ver
              </Button>
            )}
            
            {/* Favorito envía al login si no tienes sesión */}
            {isAuthenticated ? (
              <Button onClick={handleToggleFavorite} variant="flat" radius="sm" size="sm" isIconOnly className="w-1/4 bg-white border border-black hover:bg-yellow-50 text-black transition-colors" title={isFav ? "Quitar Favorito" : "Guardar Favorito"}>
                <Star className={`w-4 h-4 ${isFav ? "text-warning" : ""}`} fill={isFav ? "currentColor" : "none"} />
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="flat" radius="sm" size="sm" isIconOnly className="w-1/4 bg-gray-100 border border-gray-300 text-gray-400" title="Guardar Favorito">
                <Star className="w-4 h-4" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    );
  };

  // 6. Decidir Fondo de la Tarjeta base
  const cardBgClass = variant === "favorite" ? "bg-gray-50" : "bg-white";

  return (
    <Card 
      className={`w-full border-[2px] border-black rounded-xl ${cardBgClass} shadow-none flex flex-col transition-all`}
    >
      {renderHeader()}
      <Divider className="bg-black opacity-15" />
      
      {renderBody()}
      {renderImages()}
      
      {variant !== "creator" && <Divider className="bg-black opacity-15" />}
      
      {renderFooter()}
    </Card>
  );
};

export default PostCard;

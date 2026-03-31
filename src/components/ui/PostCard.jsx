import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Chip, Divider } from '@heroui/react';
import { Pencil, Trash2, Star, Lock, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../config/api';

const PostCard = ({ post, owner, variant = "feed", isMyPost = false }) => {
  const { isAuthenticated, currentUser, savedPostIds, toggleSavedPostId } = useUser();

  const postIdToSave = post.post_id || post.id;

  const isFav = savedPostIds ? savedPostIds.includes(postIdToSave) : false;

  let typeColor = "text-woho-purple";
  if (post.type === "Trabajo") typeColor = "text-woho-orange";
  if (post.type === "Social") typeColor = "text-green-600";

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); 
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

    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este aviso permanentemente?");
    if (!confirmed) return;

    try {
      await api.delete(`/posts/${postIdToSave}`);
      alert("Aviso eliminado correctamente.");
      window.location.reload(); 
    } catch (err) {
      console.error("Error al eliminar post:", err);
      alert("No se pudo eliminar el aviso.");
    }
  };

  const renderHeader = () => {

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

    const isPublicFeed = variant === "feed" && !isAuthenticated;

    return (
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          
          {isPublicFeed ? (
            <Avatar size="sm" className="border-[1.5px] border-dashed border-gray-400 bg-gray-100" />
          ) : (
            <Avatar src={owner?.avatar} size="sm" className="border-[1.5px] border-black bg-white" />
          )}
          <div className="flex flex-col gap-1 items-start justify-center">
            
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
        
        
        <div className="flex gap-2">
          {currentUser?.role === 'superadmin' && (
            <Button 
              isIconOnly 
              size="sm" 
              color={post.is_pinned ? "warning" : "default"}
              variant={post.is_pinned ? "solid" : "flat"} 
              className={`border-[1.5px] ${post.is_pinned ? 'border-black' : 'border-warning'}`}
              title={post.is_pinned ? "Quitar destacado" : "Destacar en portada"}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const res = await api.put(`/admin/posts/${post.id}/pin`);
                  alert(res.data.is_pinned ? "¡Post destacado con éxito!" : "Post quitado de destacados.");
                  window.location.reload();
                } catch (err) {
                  console.error("Error al pinear post:", err);
                  alert("No se pudo destacar el post. Verifica permisos.");
                }
              }}
            >
              <Pin className={`w-4 h-4 ${post.is_pinned ? 'text-black' : 'text-warning-700'} font-black`} />
            </Button>
          )}

          {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
            <Button 
              isIconOnly 
              size="sm" 
              color="danger"
              variant="flat" 
              className="border-[1.5px] border-red-600"
              title="Eliminar como Administrador"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      </CardHeader>
    );
  };

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

  const renderImages = () => {

    if (variant !== "feed" || !post.images) return null;

    let displayImages = [];
    try {
      displayImages = typeof post.images === "string" ? JSON.parse(post.images) : post.images;
    } catch (e) {
      console.warn("Fallo al parsear imágenes:", e);
      displayImages = [];
    }

    if (!Array.isArray(displayImages) || displayImages.length === 0) return null;

    return (
      <div className="px-4 pb-4">
        <div className="w-full h-24 rounded-lg border-2 border-black overflow-hidden relative">
          <img 
            src={displayImages[0]} 
            alt="Thumbnail" 
            className="w-full h-full object-cover"
          />
          {displayImages.length > 1 && (
             <div className="absolute bottom-1 right-1 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm border border-white">
               +{displayImages.length - 1} fotos
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    if (variant === "creator") {
      return (
        <CardFooter className="flex justify-between gap-2">
          <Button as={Link} to={`/edit-post/${post.id}`} variant="flat" radius="md" size="sm" className="w-1/2 font-bold bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Pencil className="w-4 h-4 mr-1" /> Editar
          </Button>
          <Button 
            variant="flat" 
            radius="md" 
            size="sm" 
            className="w-1/2 font-bold bg-red-100 text-red-600 hover:bg-red-200"
            onClick={handleDelete}
          >
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

    return (
      <CardFooter className="flex justify-between gap-2 bg-gray-50/50 rounded-b-xl">
        {isMyPost ? (
          <div className="flex gap-2 w-full">
            <Button as={Link} to="/profile" variant="flat" radius="sm" size="sm" className="flex-1 font-bold bg-gray-200 text-black border border-black border-dashed">
              Gestionar
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="flat" 
              radius="sm" 
              size="sm" 
              isIconOnly 
              className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
              title="Eliminar mi aviso"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            
            {isAuthenticated ? (
              <Button as={Link} to={`/post/${postIdToSave}`} variant="solid" radius="sm" size="sm" className="font-bold bg-black text-white w-3/4">
                Ver más
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="flat" radius="sm" size="sm" className="font-bold bg-gray-200 text-gray-500 w-3/4 border border-dashed border-gray-400">
                Inicia sesión para ver
              </Button>
            )}
            
            
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

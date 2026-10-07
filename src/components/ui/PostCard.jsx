import React from 'react';
import { Avatar, Button } from '@heroui/react';
import { Pencil, Trash2, Star, Lock, Pin } from './icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../config/api';
import { tagClassFor } from './categoryTone';

const PostCard = ({ post, owner, variant = "feed", isMyPost = false }) => {
  const { isAuthenticated, currentUser, savedPostIds, toggleSavedPostId } = useUser();

  const postIdToSave = post.post_id || post.id;

  const isFav = savedPostIds ? savedPostIds.includes(postIdToSave) : false;

  // Etiqueta de equipaje por categoría (relleno plano, texto con contraste AA).
  const typeTag = tagClassFor(post.type);

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
      const days = post.expiresInDays;
      const tone = days <= 2 ? 'bg-ws-tomato text-ws-ink' : days <= 5 ? 'bg-ws-mustard text-ws-ink' : 'bg-ws-citron text-ws-ink';
      return (
        <header className="flex items-center justify-between gap-2 px-4 pt-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl" aria-hidden="true">{post.flag}</span>
            <p className="ws-mono truncate">{post.country}, {post.city}</p>
          </div>
          <span className={`ws-mono px-2 py-1 rounded-[4px] ${tone}`}>
            {days == null ? 'Aviso permanente' : days === 0 ? '¡Expira hoy!' : `Expira en ${days} días`}
          </span>
        </header>
      );
    }

    const isPublicFeed = variant === "feed" && !isAuthenticated;

    return (
      <header className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="flex gap-3 min-w-0">
          {isPublicFeed ? (
            <Avatar size="sm" radius="sm" className="bg-ws-paper-deep" />
          ) : (
            <Avatar src={owner?.avatar} size="sm" radius="sm" className="bg-ws-paper-deep" />
          )}
          <div className="flex flex-col gap-1 items-start justify-center min-w-0">
            <p className="text-sm font-bold leading-none text-ws-ink flex items-center gap-1 truncate">
              {variant === "feed" && isMyPost
                ? "Yo (Tu aviso)"
                : (isPublicFeed ? <span className="text-ws-ink/70 flex items-center gap-1"><Lock className="w-4 h-4" aria-hidden="true"/> Viajero protegido</span> : (owner?.name || "Anónimo"))
              }
            </p>
            <div className="ws-mono text-ws-ink/75 flex items-center gap-1.5">
              <span aria-hidden="true">{post.flag}</span>
              {variant === "favorite" ? <span>{post.country}, {post.city}</span> : <span>{post.city}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`ws-tag ${typeTag}`}>{post.type}</span>
          {currentUser?.role === 'superadmin' && (
            <Button
              isIconOnly
              size="sm"
              radius="sm"
              className={`min-w-11 min-h-11 ${post.is_pinned ? 'bg-ws-mustard' : 'bg-ws-paper-deep'}`}
              title={post.is_pinned ? "Quitar destacado" : "Destacar en portada"}
              aria-label={post.is_pinned ? "Quitar destacado" : "Destacar en portada"}
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
              <Pin className="w-5 h-5 text-ws-ink" />
            </Button>
          )}

          {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
            <Button
              isIconOnly
              size="sm"
              radius="sm"
              className="min-w-11 min-h-11 bg-ws-tomato"
              title="Eliminar como administrador"
              aria-label="Eliminar como administrador"
              onClick={handleDelete}
            >
              <Trash2 className="w-5 h-5 text-ws-ink" />
            </Button>
          )}
        </div>
      </header>
    );
  };

  const renderBody = () => (
    <div className="px-4 pt-4 pb-5 flex-1">
      <Link to={`/post/${post.id}`} className="hover:underline decoration-ws-tomato decoration-2 underline-offset-4 inline-block py-2 -my-2">
        <h3 className="font-display text-3xl leading-[1.05] text-ws-ink">
          {post.title}
        </h3>
      </Link>
      {variant === "creator" && <span className={`ws-tag ${typeTag} mt-4 block w-fit`}>{post.type}</span>}
      {variant !== "favorite" && (
        <p className="mt-3 text-sm font-cuerpo text-ws-ink/80 line-clamp-4 leading-relaxed">
          {post.description}
        </p>
      )}
    </div>
  );

  const renderImages = () => {

    if (variant !== "feed" || !post.images) return null;

    let displayImages;
    try {
      displayImages = typeof post.images === "string" ? JSON.parse(post.images) : post.images;
    } catch (e) {
      console.warn("Fallo al parsear imágenes:", e);
      displayImages = [];
    }

    if (!Array.isArray(displayImages) || displayImages.length === 0) return null;

    return (
      <div className="px-4 pb-5">
        <div className="ws-photo w-full h-28">
          <img
            src={displayImages[0]}
            alt="Foto del anuncio"
            className="w-full h-full object-cover"
          />
          {displayImages.length > 1 && (
            <div className="ws-mono absolute bottom-1.5 right-1.5 z-10 bg-ws-ink text-ws-paper-light px-2 py-1 rounded-[4px]">
              +{displayImages.length - 1} fotos
            </div>
          )}
        </div>
      </div>
    );
  };

  // El talón del ticket mide lo mismo siempre (--ws-stub): las muescas de la
  // perforación caen justo sobre la línea punteada.
  const renderFooter = () => {
    const stub = "ws-ticket-stub h-[4.25rem] flex items-center gap-2 px-4";

    if (variant === "creator") {
      return (
        <footer className={stub}>
          <Button as={Link} to={`/edit-post/${post.id}`} radius="sm" size="sm" className="ws-pill ws-pill-line w-1/2 min-h-11">
            <Pencil className="w-5 h-5 mr-1" /> Editar
          </Button>
          <Button radius="sm" size="sm" className="ws-pill w-1/2 min-h-11 bg-ws-tomato text-ws-ink" onClick={handleDelete}>
            <Trash2 className="w-5 h-5 mr-1" /> Eliminar
          </Button>
        </footer>
      );
    }

    if (variant === "favorite") {
      return (
        <footer className={stub}>
          <Button as={Link} to={`/post/${postIdToSave}`} radius="sm" size="sm" className="ws-pill ws-pill-ink min-h-11 w-3/4">
            Ver más
          </Button>
          <Button onClick={handleToggleFavorite} radius="sm" size="sm" isIconOnly className="ws-pill ws-pill-line w-1/4 min-h-11" title="Quitar de favoritos" aria-label="Quitar de favoritos">
            <Trash2 className="w-5 h-5" />
          </Button>
        </footer>
      );
    }

    return (
      <footer className={stub}>
        {isMyPost ? (
          <>
            <Button as={Link} to="/profile" radius="sm" size="sm" className="ws-pill ws-pill-soft flex-1 min-h-11">
              Gestionar
            </Button>
            <Button
              onClick={handleDelete}
              radius="sm"
              size="sm"
              isIconOnly
              className="ws-pill min-h-11 min-w-11 bg-ws-tomato text-ws-ink"
              title="Eliminar mi aviso"
              aria-label="Eliminar mi aviso"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            {isAuthenticated ? (
              <Button as={Link} to={`/post/${postIdToSave}`} radius="sm" size="sm" className="ws-pill ws-pill-ink min-h-11 w-3/4">
                Ver más
              </Button>
            ) : (
              <Button as={Link} to="/login" radius="sm" size="sm" className="ws-pill ws-pill-soft min-h-11 w-3/4">
                Inicia sesión para ver
              </Button>
            )}

            {isAuthenticated ? (
              <Button onClick={handleToggleFavorite} radius="sm" size="sm" isIconOnly className="ws-pill ws-pill-line w-1/4 min-h-11" title={isFav ? "Quitar favorito" : "Guardar favorito"} aria-label={isFav ? "Quitar favorito" : "Guardar favorito"} aria-pressed={isFav}>
                <Star className={`w-5 h-5 ${isFav ? "text-ws-tomato-deep" : ""}`} />
              </Button>
            ) : (
              <Button as={Link} to="/login" radius="sm" size="sm" isIconOnly className="ws-pill ws-pill-line w-1/4 min-h-11 text-ws-ink/60" title="Guardar favorito" aria-label="Inicia sesión para guardar favoritos">
                <Star className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
      </footer>
    );
  };

  return (
    <article className="ws-ticket w-full flex flex-col">
      {renderHeader()}
      {renderBody()}
      {renderImages()}
      {renderFooter()}
    </article>
  );
};

export default PostCard;

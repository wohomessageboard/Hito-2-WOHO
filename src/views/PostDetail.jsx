import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Avatar } from '@heroui/react';
import { ArrowLeft, Lock, MapPin, Calendar, Share2, AlertCircle, Mail, Phone } from '../components/ui/icons';
import api from '../config/api';
import { useUser } from '../context/UserContext';
import EmptyState from '../components/ui/EmptyState';
import Stamp from '../components/ui/Stamp';

const TAG_BY_TYPE = { Alojamiento: 'ws-tag-blue', Trabajo: 'ws-tag-tomato', Social: 'ws-tag-olive' };

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useUser();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);

        window.sessionStorage.setItem('last_post_title', res.data.title);
      } catch (error) {
        console.error("Error al cargar el aviso", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Compartir: hoja nativa si existe; si no, copia el enlace y lo avisa.
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      /* el usuario cerró la hoja de compartir: no es un error */
    }
  };

  if (isLoading) {
    return <p role="status" className="ws-mono p-20 text-center">Abriendo anuncio…</p>;
  }

  if (!post) {
    return (
      <EmptyState
        stamp="EXTRAVIADO"
        title="Aviso extraviado"
        action={<Button onPress={() => navigate(-1)} radius="sm" className="ws-btn ws-btn-ink mt-2 h-11 px-6">Volver atrás</Button>}
      >
        El anuncio que buscas ya no existe o fue eliminado.
      </EmptyState>
    );
  }

  const owner = post.owner || { id: post.user_id, name: post.author_name || "Viajero oculto", avatar: post.author_avatar || null };
  const isMyPost = !!currentUser?.id && currentUser.id === post.user_id;
  const isPublicViewer = !isAuthenticated;

  const type = post.type || post.category_name;
  const country = post.country || post.country_name;
  const city = post.city || post.city_name;
  const expiresInDays = post.expires_at ? Math.max(0, Math.ceil((new Date(post.expires_at) - new Date()) / (1000*60*60*24))) : post.duration_days || null;
  const expiryTone = expiresInDays <= 2 ? 'bg-ws-tomato' : expiresInDays <= 5 ? 'bg-ws-mustard' : 'bg-ws-citron';

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">

      <div className="flex">
        <Button
          onPress={() => navigate(-1)}
          radius="sm"
          className="ws-pill ws-pill-line h-11 px-4"
          startContent={<ArrowLeft className="w-5 h-5" aria-hidden="true" />}
        >
          Volver
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        <div className="w-full lg:w-2/3 flex flex-col gap-8">

          <article className="ws-surface p-6 md:p-10 flex flex-col gap-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`ws-tag ${TAG_BY_TYPE[type] || 'ws-tag-ink'}`}>{type}</span>
              <span className="ws-mono flex items-center gap-1.5 border-[1.5px] border-ws-ink px-2 py-1 rounded-[2px] bg-ws-paper-light">
                <MapPin className="w-4 h-4" aria-hidden="true" /> {country}, {city} <span aria-hidden="true">{post.flag}</span>
              </span>
              {expiresInDays !== null && (
                <span className={`ws-mono flex items-center gap-1.5 border-[1.5px] border-ws-ink px-2 py-1 rounded-[2px] text-ws-ink ${expiryTone}`}>
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {expiresInDays === 0 ? '¡Expira hoy!' : `Expira en ${expiresInDays} días`}
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl md:text-7xl leading-[0.98]">
              {post.title}
            </h1>

            <hr className="border-0 border-t-2 border-dashed border-ws-ink" />

            <div className="font-cuerpo text-lg md:text-xl leading-relaxed whitespace-pre-wrap max-w-2xl">
              {post.description}
            </div>
          </article>

          {(() => {
            let displayImages;
            try {
              displayImages = typeof post.images === "string" ? JSON.parse(post.images) : post.images;
            } catch {
              displayImages = [];
            }

            if (!Array.isArray(displayImages) || displayImages.length === 0) return null;

            return (
              <section aria-labelledby="fotos" className="flex flex-col gap-4">
                <h2 id="fotos" className="font-display text-4xl">Fotos del anuncio</h2>

                <div className="ws-photo w-full aspect-video">
                  <img src={displayImages[0]} alt="Foto principal del anuncio" className="w-full h-full object-cover" />
                </div>

                {displayImages.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {displayImages.slice(1).map((imgUrl, idx) => (
                      <div key={idx} className="ws-photo aspect-square">
                        <img src={imgUrl} alt={`Foto ${idx + 2} del anuncio`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })()}

        </div>

        <aside className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-28">

          <div className="ws-band ws-band-ink rounded-[4px] border-[1.5px] border-ws-ink p-6 flex flex-col items-center text-center">
            <Stamp solid variant="round" center={['WOHO']} top="WORKING HOLIDAY" bottom="ANUNCIANTE" rotate={12} className="absolute -top-3 -right-3 w-20 text-ws-mustard" />

            {isPublicViewer ? (
              <Avatar radius="sm" className="w-24 h-24 text-large border-2 border-dashed border-ws-paper-light/70 bg-ws-ink mb-4" />
            ) : (
              <Avatar radius="sm" src={owner?.avatar} className="w-24 h-24 text-large border-2 border-ws-paper-light bg-ws-paper-light mb-4" />
            )}

            <h2 className="font-display text-4xl mb-1 flex items-center gap-2">
              {isPublicViewer && <Lock className="w-6 h-6" aria-hidden="true" />}
              {isMyPost ? "Es tu propio aviso" : (isPublicViewer ? "Viajero protegido" : (owner?.name || "Anónimo"))}
            </h2>

            <p className="text-sm font-cuerpo text-ws-paper-light/80 mb-6">
              {isPublicViewer ? "Identidad oculta por seguridad." : "Miembro de la comunidad WOHO."}
            </p>

            <div className="w-full flex flex-col gap-3">
              {isMyPost ? (
                <Button as={Link} to={`/edit-post/${post.id}`} radius="sm" className="ws-btn ws-btn-mustard w-full h-12">
                  Editar mi publicación
                </Button>
              ) : isAuthenticated ? (
                !showContact ? (
                  <Button onPress={() => setShowContact(true)} radius="sm" className="ws-btn ws-btn-tomato w-full h-14 text-lg">
                    Contactar
                  </Button>
                ) : (
                  <div className="w-full bg-ws-paper-light text-ws-ink p-4 rounded-[2px] flex flex-col items-stretch gap-3 text-left">
                    <p className="ws-mono">Detalles de contacto</p>
                    <a href={owner?.email ? `mailto:${owner.email}` : undefined} className="flex items-center gap-2 font-cuerpo font-bold break-all hover:underline underline-offset-4">
                      <Mail className="w-5 h-5 shrink-0" aria-hidden="true" /> {owner?.email || 'No especifica correo'}
                    </a>
                    <a href={owner?.phone ? `tel:${owner.phone}` : undefined} className="flex items-center gap-2 font-cuerpo font-bold break-all hover:underline underline-offset-4">
                      <Phone className="w-5 h-5 shrink-0" aria-hidden="true" /> {owner?.phone || 'No especifica teléfono'}
                    </a>
                  </div>
                )
              ) : (
                <Button as={Link} to="/login" radius="sm" className="ws-btn ws-btn-mustard w-full h-14 text-base">
                  Inicia sesión para escribirle
                </Button>
              )}
            </div>
          </div>

          <div className="ws-surface p-4 flex flex-col gap-3">
            <h3 className="ws-mono">Acciones adicionales</h3>
            <div className="flex gap-2">
              <Button onPress={handleShare} radius="sm" className="ws-pill ws-pill-line flex-1 min-h-11" startContent={<Share2 className="w-5 h-5" aria-hidden="true" />}>
                {shared ? '¡Enlace copiado!' : 'Compartir'}
              </Button>
              <Button radius="sm" className="ws-pill ws-pill-line flex-1 min-h-11" startContent={<AlertCircle className="w-5 h-5" aria-hidden="true" />}>
                Reportar
              </Button>
            </div>
            <p role="status" className="sr-only">{shared ? 'Enlace copiado al portapapeles' : ''}</p>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default PostDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Avatar, useDisclosure } from '@heroui/react';
import { ArrowLeft, Lock, MapPin, Calendar, AlertCircle, Whatsapp } from '../components/ui/icons';
import api from '../config/api';
import { useUser } from '../context/UserContext';
import EmptyState from '../components/ui/EmptyState';
import Stamp from '../components/ui/Stamp';
import ReportDialog from '../components/ui/ReportDialog';
import ShareLinks from '../components/ui/ShareLinks';
import { useSeo } from '../seo/useSeo';
import PhotoGallery from '../components/ui/PhotoGallery';

const TAG_BY_TYPE = { Alojamiento: 'ws-tag-blue', Trabajo: 'ws-tag-tomato', Social: 'ws-tag-olive' };

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useUser();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [contactError, setContactError] = useState('');
  const report = useDisclosure();
  const [reportNotice, setReportNotice] = useState('');

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

  // Contactar: pide el enlace de WhatsApp al servidor (que registra el contacto y arma el
  // mensaje con el aviso) y abre el chat. La pestaña se abre ANTES de la petición para que
  // el navegador no la bloquee como ventana emergente.
  const handleWhatsapp = async () => {
    setContactError('');
    setIsOpeningChat(true);
    const tab = window.open('', '_blank');
    try {
      const res = await api.post(`/posts/${post.id}/contact`);
      if (tab) {
        tab.opener = null;
        tab.location.href = res.data.url;
      } else {
        window.location.href = res.data.url;
      }
    } catch (err) {
      tab?.close();
      setContactError(err.response?.data?.error || 'No pudimos abrir WhatsApp. Intenta de nuevo.');
    } finally {
      setIsOpeningChat(false);
    }
  };

  // Enlace para compartir: usa el dominio del sitio (/p/:id). Vercel lo reenvía al servidor, que
  // devuelve la tarjeta con foto y título (Open Graph) y luego lleva a la persona al aviso.
  const shareUrl = post ? `${window.location.origin}/p/${post.id}` : '';

  // Título y descripción de la pestaña y de los buscadores, según el aviso.
  const firstImage = (() => {
    try {
      const imgs = typeof post?.images === 'string' ? JSON.parse(post.images) : post?.images;
      return Array.isArray(imgs) ? imgs[0] : undefined;
    } catch { return undefined; }
  })();
  useSeo(post ? {
    path: `/post/${id}`,
    title: `Driftler | ${post.title.length > 52 ? `${post.title.slice(0, 51)}…` : post.title}`,
    description: (post.description || '').replace(/\s+/g, ' ').trim().slice(0, 155) || 'Aviso de la comunidad Driftler.',
    image: firstImage,
    noindex: false,
  } : null);

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
  const expiryTone = expiresInDays <= 2 ? 'bg-ws-tomato text-ws-paper-light' : expiresInDays <= 5 ? 'bg-ws-mustard text-ws-ink' : 'bg-ws-citron text-ws-ink';

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
            <h1 className="font-display text-5xl md:text-7xl leading-[0.98]">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`ws-tag ${TAG_BY_TYPE[type] || 'ws-tag-ink'}`}>{type}</span>
              <span className="ws-mono flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-ws-paper-deep">
                <MapPin className="w-4 h-4" aria-hidden="true" /> {country}, {city} <span aria-hidden="true">{post.flag}</span>
              </span>
              {expiresInDays === null && (
                <span className="ws-mono flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-ws-paper-deep">
                  <Calendar className="w-4 h-4" aria-hidden="true" /> Aviso permanente
                </span>
              )}
              {expiresInDays !== null && (
                <span className={`ws-mono flex items-center gap-1.5 px-2 py-1 rounded-[4px] ${expiryTone}`}>
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {expiresInDays === 0 ? '¡Expira hoy!' : `Expira en ${expiresInDays} días`}
                </span>
              )}
            </div>

            <hr className="border-0 border-t-[1.5px] border-dashed border-ws-ink/30" />

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
                <PhotoGallery images={displayImages} title={post.title} />
              </section>
            );
          })()}

        </div>

        <aside className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-28">

          <div className="ws-band ws-band-ink rounded-[10px] p-6 flex flex-col items-center text-center">
            <Stamp solid variant="round" center={['DRIFTLER']} top="WORKING HOLIDAY" bottom="ANUNCIANTE" rotate={12} className="absolute -top-3 -right-3 w-20 text-ws-mustard" />

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
              {isPublicViewer ? "Identidad oculta por seguridad." : "Miembro de la comunidad Driftler."}
            </p>

            <div className="w-full flex flex-col gap-3">
              {isMyPost ? (
                <Button as={Link} to={`/edit-post/${post.id}`} radius="sm" className="ws-btn ws-btn-mustard w-full h-12">
                  Editar mi publicación
                </Button>
              ) : isAuthenticated ? (
                <>
                  <Button onPress={handleWhatsapp} isLoading={isOpeningChat} radius="sm" className="ws-btn ws-btn-tomato w-full h-14 text-lg" startContent={!isOpeningChat && <Whatsapp className="w-6 h-6" aria-hidden="true" />}>
                    Escribir por WhatsApp
                  </Button>
                  {contactError && <p role="alert" className="bg-ws-paper-light text-ws-ink rounded-[6px] p-3 text-sm font-bold text-left">{contactError}</p>}
                  <p className="text-xs font-cuerpo text-ws-paper-light/80">Se abre un chat con el aviso adjunto. Solo compartimos su WhatsApp.</p>
                </>
              ) : (
                <Button as={Link} to="/login" radius="sm" className="ws-btn ws-btn-mustard w-full h-14 text-base">
                  Inicia sesión para escribirle
                </Button>
              )}
            </div>
          </div>

          <div className="ws-surface p-4 flex flex-col gap-3">
            <h3 className="ws-mono">Acciones adicionales</h3>
            <ShareLinks url={shareUrl} title={post.title} text={`Mira este aviso en Driftler: ${post.title}`} />
            <div className="flex gap-2">
              {isMyPost ? null : isAuthenticated ? (
                <Button onPress={report.onOpen} radius="sm" className="ws-pill ws-pill-line flex-1 min-h-11" startContent={<AlertCircle className="w-5 h-5" aria-hidden="true" />}>
                  Reportar
                </Button>
              ) : (
                <Button as={Link} to="/login" radius="sm" className="ws-pill ws-pill-line flex-1 min-h-11" startContent={<AlertCircle className="w-5 h-5" aria-hidden="true" />}>
                  Inicia sesión para reportar
                </Button>
              )}
            </div>
            <p role="status" className={reportNotice ? 'font-cuerpo text-sm font-bold bg-ws-citron rounded-[6px] p-3' : 'sr-only'}>
              {reportNotice}
            </p>
          </div>

        </aside>

      </div>

      {!isMyPost && (
        <>
          <div className="h-24 md:hidden" aria-hidden="true" />
          <div className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-ws-paper-light border-t border-ws-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {isAuthenticated ? (
              <Button onPress={handleWhatsapp} isLoading={isOpeningChat} radius="sm" fullWidth className="ws-btn ws-btn-ink h-12 text-base" startContent={!isOpeningChat && <Whatsapp className="w-5 h-5" aria-hidden="true" />}>
                Escribir por WhatsApp
              </Button>
            ) : (
              <Button as={Link} to="/login" radius="sm" fullWidth className="ws-btn ws-btn-ink h-12 text-base">
                Inicia sesión para escribirle
              </Button>
            )}
          </div>
        </>
      )}

      <ReportDialog postId={post.id} isOpen={report.isOpen} onOpenChange={report.onOpenChange} onSent={setReportNotice} />
    </div>
  );
};

export default PostDetail;

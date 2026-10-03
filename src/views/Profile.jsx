import React, { useState, useEffect } from 'react';

import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useUser } from '../context/UserContext';

import { Avatar, Button, Tabs, Tab } from '@heroui/react';
import EmptyState from '../components/ui/EmptyState';
import Stamp from '../components/ui/Stamp';

import { Settings, LogOut, Pencil, Trash2, MapPin, Search, Grid, Heart, Map } from '../components/ui/icons';

import api from '../config/api';

import PostCard from '../components/ui/PostCard';

const Profile = () => {

  const { currentUser, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Confirmación (publicar/editar): llega por router state, se muestra unos
  // segundos y se limpia del historial para que un refresh no la repita.
  const location = useLocation();
  const [notice, setNotice] = useState(() => location.state?.notice || '');
  useEffect(() => {
    if (!location.state?.notice) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [followedPlaces, setFollowedPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    
    const fetchProfileData = async () => {
      try {
        const [postsRes, favRes, followRes] = await Promise.all([
          api.get('/users/me/posts').catch(() => ({ data: [] })),
          api.get('/users/me/favorites').catch(() => ({ data: [] })),
          api.get('/users/me/follows').catch(() => ({ data: [] }))
        ]);
        setMyPosts(postsRes.data);
        setSavedPosts(favRes.data);
        setFollowedPlaces(followRes.data);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [isAuthenticated, currentUser]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (

    <div className="flex flex-col gap-10">

      {notice && (
        <div role="status" className="ws-enter flex items-center gap-4 border-[1.5px] border-ws-ink rounded-[2px] bg-ws-mustard px-5 py-3">
          <Stamp variant="oval" center="LISTO" rotate={-5} animate className="w-24 shrink-0 text-ws-tomato-deep" />
          <p className="font-cuerpo font-bold text-lg text-ws-ink flex-1">{notice}</p>
          <button type="button" onClick={() => setNotice('')} aria-label="Cerrar aviso" className="ws-pill ws-pill-soft min-h-11 min-w-11 px-3">Cerrar</button>
        </div>
      )}

      
      <section className="ws-band ws-band-plum rounded-[4px] border-[1.5px] border-ws-ink p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
        <Avatar
          src={currentUser.avatar}
          radius="sm"
          className="w-32 h-32 md:w-44 md:h-44 shrink-0 border-2 border-ws-paper-light text-large bg-ws-paper-light"
        />

        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="font-display text-5xl md:text-7xl break-words">
            {currentUser.name}
          </h1>
          <p className="ws-mono text-ws-paper-light/90">
            {currentUser.country ? `${currentUser.flag} País de origen: ${currentUser.country} · ` : ''}
            Viajero apasionado
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-3">
            <Button
              as={Link}
              to="/edit-profile"
              radius="sm"
              className="ws-btn ws-btn-mustard h-11 px-5"
              startContent={<Settings className="w-5 h-5" aria-hidden="true" />}
            >
              Editar perfil
            </Button>
            <Button
              onPress={handleLogout}
              radius="sm"
              className="ws-btn ws-btn-quiet h-11 px-5"
              startContent={<LogOut className="w-5 h-5" aria-hidden="true" />}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Stamp solid variant="round" center={['WOHO']} top="WORKING HOLIDAY" bottom="PASAPORTE" rotate={12} className="hidden lg:block w-32 shrink-0 text-ws-mustard" />
      </section>

      
      <section className="space-y-6">
        
        <Tabs 
          aria-label="Contenido del perfil" 
          radius="sm"
          size="lg"
          classNames={{
            base: "w-full",
            tabList: "gap-2 p-0 pb-3 w-full rounded-none border-b-[1.5px] border-ws-ink bg-transparent",
            tab: "h-11 px-4",
            cursor: "bg-ws-mustard border-[1.5px] border-ws-ink rounded-[2px] shadow-none",
            tabContent: "font-bold text-ws-ink group-data-[selected=true]:text-ws-ink"
          }}
        >
          
          <Tab 
            key="mis-anuncios" 
            title={
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5" aria-hidden="true" />
                <span>Mis avisos</span>
              </div>
            }
          >
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-start w-full mt-4">
              {isLoading ? (
                <p role="status" className="ws-mono col-span-full">Cargando…</p>
              ) : myPosts.length === 0 ? (
                <div className="col-span-full"><EmptyState title="Sin anuncios todavía" action={<Button as={Link} to="/new-post" radius="sm" className="ws-btn ws-btn-tomato mt-2 h-11 px-6">Crear publicación</Button>}>No tienes anuncios publicados aún.</EmptyState></div>
              ) : (
                myPosts.map((post) => {
                  const isMyPost = !!currentUser?.id && currentUser.id === post.user_id;
                  const owner = { 
                    id: post.user_id, 
                    name: String(post.author_name || currentUser?.name || "Yo"), 
                    avatar: post.author_avatar ? String(post.author_avatar) : (currentUser?.avatar ? String(currentUser.avatar) : null)
                  };
                  const mappedPost = {
                    ...post,
                    country: post.country || post.country_name,
                    city: post.city || post.city_name,
                    type: post.type || post.category_name,
                    expiresInDays: post.expires_at ? Math.max(0, Math.ceil((new Date(post.expires_at) - new Date()) / (1000*60*60*24))) : post.duration_days || null,
                  };
                  return (
                    <PostCard key={post.id} post={mappedPost} owner={owner} variant="creator" isMyPost={isMyPost} />
                  );
                })
              )}
            </div>
          </Tab>

          
          <Tab 
            key="guardados" 
            title={
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" aria-hidden="true" />
                <span>Favoritos</span>
              </div>
            }
          >
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-start w-full mt-4">
              {isLoading ? (
                <p role="status" className="ws-mono col-span-full">Cargando…</p>
              ) : savedPosts.length === 0 ? (
                <div className="col-span-full"><EmptyState stamp="SIN GUARDADOS" title="Nada guardado">No tienes ningún aviso guardado.</EmptyState></div>
              ) : (
                savedPosts.map((post) => {
                  const owner = { id: post.user_id, name: post.author_name || "Anónimo", avatar: null };
                  const mappedPost = {
                    ...post,
                    country: post.country || post.country_name,
                    city: post.city || post.city_name,
                    type: post.type || post.category_name,
                    expiresInDays: post.expires_at ? Math.max(0, Math.ceil((new Date(post.expires_at) - new Date()) / (1000*60*60*24))) : post.duration_days || null,
                  };
                  return (
                    <PostCard key={post.post_id || post.id} post={mappedPost} owner={owner} variant="favorite" />
                  );
                })
              )}
            </div>
          </Tab>

          
          <Tab 
            key="seguidos" 
            title={
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5" aria-hidden="true" />
                <span>Seguidos</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {followedPlaces.length > 0 ? (
                followedPlaces.map((loc) => (
                  <Link
                    key={`${loc.country_id}-${loc.city_id || '0'}`}
                    to={`/destinos/${loc.name}`}
                    className="ws-surface ws-surface-hover p-4 flex items-center gap-4"
                  >
                    <span className="text-4xl w-12 h-12 grid place-items-center border-[1.5px] border-ws-ink rounded-[2px] bg-ws-paper pb-1 shrink-0" aria-hidden="true">
                      {loc.flag || '🗺️'}
                    </span>
                    <span className="flex-1 overflow-hidden">
                      <span className="block font-display text-3xl leading-tight truncate">{loc.name}</span>
                      <span className="ws-mono text-ws-ink/70">{loc.city_id ? 'Ciudad' : 'País'}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <div className="col-span-full"><EmptyState stamp="SIN RUTA" title="Aún no sigues destinos" action={<Button as={Link} to="/destinos" radius="sm" className="ws-btn ws-btn-ink mt-2 h-11 px-6">Ver destinos</Button>}>Ve a explorar la vista de destinos para añadir lugares a tu radar.</EmptyState></div>
              )}
            </div>
          </Tab>

        </Tabs>
      </section>

    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';

import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useUser } from '../context/UserContext';

import { CardBody, Avatar, Button, Tabs, Tab } from '@heroui/react';
import SurfaceCard from '../components/ui/SurfaceCard';

import { Settings, LogOut, Pencil, Trash2, MapPin, Search, Grid, Heart, Map } from 'lucide-react';

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
        <div role="status" className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-5 py-3">
          <p className="font-cuerpo font-bold text-green-800 flex-1">{notice}</p>
          <button type="button" onClick={() => setNotice('')} aria-label="Cerrar aviso" className="font-bold text-sm min-h-11 min-w-11 px-3 rounded-lg hover:bg-green-100">Cerrar</button>
        </div>
      )}

      
      <section className="bg-woho-purple text-white p-8 md:p-12 rounded-xl flex flex-col md:flex-row items-center gap-8 shadow-sm">


        <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0">
          <Avatar
            src={currentUser.avatar}
            className="w-full h-full border-[2px] border-white text-large bg-white"
            radius="full"
          />
        </div>


        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-4xl md:text-5xl font-titulo font-black uppercase tracking-tighter leading-none">
            {currentUser.name}
          </h1>
          <p className="font-cuerpo text-lg opacity-90">
            {currentUser.country ? `${currentUser.flag} País de Origen: ${currentUser.country} • ` : ''}
            Viajero apasionado
          </p>


          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <Button
              as={Link}
              to="/edit-profile"
              variant="flat"
              radius="md"
              className="font-bold bg-white text-black hover:bg-gray-200 transition-colors"
              startContent={<Settings className="w-4 h-4" />}
            >
              Editar Perfil
            </Button>
            <Button
              onPress={handleLogout}
              variant="flat"
              radius="md"
              className="font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              startContent={<LogOut className="w-4 h-4" />}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </section>

      
      <section className="space-y-6">
        
        <Tabs 
          aria-label="Contenido del perfil" 
          radius="md" 
          size="lg"
          classNames={{
            tabList: "border border-gray-200 bg-white shadow-sm p-1",
            cursor: "bg-woho-purple shadow-none",
            tabContent: "group-data-[selected=true]:text-white font-titulo font-bold text-black"
          }}
        >
          
          <Tab 
            key="mis-anuncios" 
            title={
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                <span>Mis Avisos</span>
              </div>
            }
          >
            <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4">
              {isLoading ? (
                <p className="font-cuerpo font-bold">Cargando...</p>
              ) : myPosts.length === 0 ? (
                <p className="font-cuerpo text-gray-500 italic">No tienes anuncios publicados aún.</p>
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
                <Heart className="w-5 h-5 fill-current" />
                <span>Favoritos</span>
              </div>
            }
          >
            <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4">
              {isLoading ? (
                <p className="font-cuerpo font-bold">Cargando...</p>
              ) : savedPosts.length === 0 ? (
                <p className="font-cuerpo text-gray-500 italic">No tienes ningún aviso guardado.</p>
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
                <Map className="w-5 h-5" />
                <span>Seguidos</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {followedPlaces.length > 0 ? (
                followedPlaces.map((loc) => (
                  <SurfaceCard key={`${loc.country_id}-${loc.city_id || '0'}`} hoverable className="cursor-pointer" isPressable onPress={() => navigate(`/destinos/${loc.name}`)}>
                    <CardBody className="p-4 flex flex-row items-center gap-4">
                      <div className="text-4xl bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center pb-1 shrink-0">
                        {loc.flag || '🗺️'}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-titulo font-extrabold text-black text-lg leading-tight truncate">{loc.name}</h4>
                        <span className="text-xs font-cuerpo text-default-500 uppercase font-bold tracking-wider">
                          {loc.city_id ? 'Ciudad' : 'País'}
                        </span>
                      </div>
                    </CardBody>
                  </SurfaceCard>
                ))
              ) : (
                <p className="font-cuerpo text-gray-500 italic col-span-full text-center py-10">No sigues ninguna ubicación todavía. Ve a explorar la vista de <strong>Destinos</strong> para añadir lugares a tu radar.</p>
              )}
            </div>
          </Tab>

        </Tabs>
      </section>

    </div>
  );
};

export default Profile;

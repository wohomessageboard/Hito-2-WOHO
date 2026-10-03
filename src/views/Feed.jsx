import React, { useState, useMemo, useEffect } from 'react';

import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

import { Button, Input } from '@heroui/react';

import { Search, Grid, Briefcase, Home, Users, Globe, Compass } from 'lucide-react';

import PostCard from '../components/ui/PostCard';
import FilterChip from '../components/ui/FilterChip';

import { useScrollRestore } from '../hooks/useScrollRestore';

const CATEGORY_ICONS = {
  'Todos': Grid,
  'Alojamiento': Home,
  'Trabajo': Briefcase,
  'Social': Users,
  'Otro': Globe,
};

const Feed = () => {
  const { currentUser, isAuthenticated } = useUser();

  const [posts, setPosts] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [categories, setCategories] = useState([
    { key: 'Alojamiento', label: 'Alojamiento' },
    { key: 'Trabajo', label: 'Trabajo' },
    { key: 'Social', label: 'Social' },
    { key: 'Otro', label: 'Otro' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const [searchQuery, setSearchQuery] = useState('');

  useScrollRestore('feed_scroll', posts.length > 0);

  useEffect(() => {
    // Visitante: lectura pública con lo más reciente de la comunidad. El feed
    // personalizado (/posts/feed) exige sesión.
    if (!isAuthenticated) {
      api.get('/posts')
        .then(res => { setPosts(res.data); setIsPersonalized(false); })
        .catch(err => { console.log('No se pudo cargar el feed público', err); setPosts([]); });
      return;
    }

    api.get('/posts/feed').then(async (res) => {
      if (res.data && res.data.length > 0) {
        setPosts(res.data);
        setIsPersonalized(true);
        return;
      }

      // Nadie a quien seguir todavía (o nada reciente de ellos): mostramos
      // lo más reciente de toda la comunidad en vez de un feed vacío.
      try {
        const fallback = await api.get('/posts');
        setPosts(fallback.data);
        setIsPersonalized(false);
      } catch (err) {
        console.log('No se pudo cargar el feed general de respaldo', err);
        setPosts([]);
        setIsPersonalized(false);
      }
    }).catch(err => {
      console.log('Esperando que el Endpoint Backend exista...', err);
      setPosts([]);
    });

    api.get('/categories').then(res => {
      if(res.data && res.data.length > 0) setCategories(res.data);
    }).catch(err => console.log(err));
  }, [isAuthenticated]);

  const filteredPosts = useMemo(() => {
    let results = posts;

    if (selectedCategory !== 'Todos') {
      results = results.filter(post => post.type === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.description.toLowerCase().includes(lowerQuery) ||
        post.city.toLowerCase().includes(lowerQuery)
      );
    }

    return results;
  }, [selectedCategory, searchQuery, posts]);

  return (
    <div className="flex flex-col gap-8 md:gap-12 w-full max-w-7xl mx-auto px-4 pb-12">
      
      
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-titulo font-black text-black tracking-tighter uppercase">
              {isAuthenticated ? 'Para Ti' : 'Anuncios recientes'}
            </h1>
            <p className="font-cuerpo text-default-600 text-lg max-w-xl">
              {isAuthenticated
                ? 'Lo último en oportunidades en los destinos que sigues.'
                : 'Lo último que publicó la comunidad. Explora sin cuenta; crea una para guardar y contactar.'}
            </p>
          </div>
          
          
          <div className="w-full md:w-96 flex-shrink-0">
            <Input
              classNames={{
                inputWrapper: "ws-input-border h-14 bg-white shadow-sm",
                input: "font-cuerpo text-lg"
              }}
              placeholder="Ej: Granja, Sydney, Auto..."
              radius="md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="text-default-400 w-5 h-5" />}
              isClearable
              onClear={() => setSearchQuery('')}
            />
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl">


          <div className="flex flex-wrap gap-2">

            <FilterChip
              label="Todos"
              icon={Grid}
              isSelected={selectedCategory === "Todos"}
              onClick={() => setSelectedCategory("Todos")}
            />

            {categories.map((cat) => (
              <FilterChip
                key={cat.key}
                label={cat.label}
                icon={CATEGORY_ICONS[cat.key] || Globe}
                isSelected={selectedCategory === cat.key}
                onClick={() => setSelectedCategory(cat.key)}
              />
            ))}
          </div>

        </div>
      </section>

      
      <section className="pb-16">
        
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
            <span className="text-4xl mb-4">🌪️</span>
            <h3 className="font-titulo font-black text-2xl mb-2">
              {posts.length === 0
                ? "Aún no sigues ningún destino"
                : "Pueblo Fantasma"}
            </h3>
            <p className="font-cuerpo text-default-500 max-w-md">
              {posts.length === 0
                ? "Explora nuestra lista de Destinos mundiales y síguelos para ver avisos aquí."
                : "No encontramos ningún anuncio que coincida con tus filtros. Intenta una búsqueda distinta."}
            </p>

            {posts.length === 0 ? (
              <Button
                as={Link}
                to="/destinos"
                variant="solid"
                className="mt-6 font-bold bg-woho-purple text-white rounded-md h-10 px-6"
              >
                Ver Destinos
              </Button>
            ) : (
              <Button
                onPress={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                variant="flat"
                className="mt-6 font-bold bg-black text-white rounded-md h-10 px-6"
              >
                Limpiar Búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">

            {isAuthenticated && !isPersonalized && (
              <div className="flex items-center gap-3 bg-woho-orange/10 rounded-xl p-4">
                <Compass className="w-6 h-6 shrink-0 text-woho-orange" />
                <p className="font-cuerpo text-sm font-bold text-woho-black">
                  Aún no sigues ningún destino, así que te mostramos lo más reciente de toda la comunidad.{' '}
                  <Link to="/destinos" className="underline underline-offset-2 text-woho-purple">
                    Sigue un destino
                  </Link>{' '}
                  para personalizar tu "Para Ti".
                </p>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-cuerpo text-sm font-bold text-black flex-1">
                  Estás explorando como visitante. Con una cuenta puedes guardar anuncios, contactar a quien publica y seguir destinos.
                </p>
                <Button as={Link} to="/register" className="bg-black text-white font-bold h-10 px-5 shrink-0">
                  Crear cuenta
                </Button>
              </div>
            )}

            {filteredPosts.map((post) => {
              const owner = post.owner || { 
                id: post.user_id, 
                name: String(post.author_name || "Viajero Anónimo"), 
                avatar: post.author_avatar ? String(post.author_avatar) : null 
              };
              const isMyPost = !!currentUser?.id && currentUser.id === post.user_id;

              const mappedPost = {
                ...post,
                country: post.country || post.country_name,
                city: post.city || post.city_name,
                type: post.type || post.category_name,
                expiresInDays: post.expires_at ? Math.max(0, Math.ceil((new Date(post.expires_at) - new Date()) / (1000*60*60*24))) : post.duration_days || null,
              };

              return (
                <PostCard 
                  key={post.id} 
                  post={mappedPost} 
                  owner={owner}
                  variant="feed"
                  isMyPost={isMyPost}
                />
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};

export default Feed;

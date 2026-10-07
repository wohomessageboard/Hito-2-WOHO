import React, { useState, useMemo, useEffect } from 'react';

import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

import { Button, Input } from '@heroui/react';

import { Search, Grid, Briefcase, Home, Users, Globe, Compass, Calendar } from '../components/ui/icons';

import PostCard from '../components/ui/PostCard';
import FilterChip from '../components/ui/FilterChip';
import { tagClassFor, sortCategories } from '../components/ui/categoryTone';
import EmptyState from '../components/ui/EmptyState';

import { useScrollRestore } from '../hooks/useScrollRestore';

const CATEGORY_ICONS = {
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

  // Primera vez con sesión: una guía breve que se descarta y no vuelve.
  const TIP_KEY = 'woho_tip_como_funciona';
  const [showTip, setShowTip] = useState(() => {
    try { return !window.localStorage.getItem(TIP_KEY); } catch { return false; }
  });
  const dismissTip = () => {
    try { window.localStorage.setItem(TIP_KEY, '1'); } catch { /* sin almacenamiento: se oculta solo esta vez */ }
    setShowTip(false);
  };

  // Categorías marcadas (varias a la vez); sin ninguna se ven todos los avisos.
  const [selectedCategories, setSelectedCategories] = useState([]);
  const toggleCategory = (key) => setSelectedCategories((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

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
      if(res.data && res.data.length > 0) setCategories(sortCategories(res.data));
    }).catch(err => console.log(err));
  }, [isAuthenticated]);

  const filteredPosts = useMemo(() => {
    let results = posts;

    if (selectedCategories.length) {
      results = results.filter(post => selectedCategories.includes(post.type));
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
  }, [selectedCategories, searchQuery, posts]);

  return (
    <div className="flex flex-col gap-8 md:gap-10 w-full">

      <section className="flex flex-col gap-6">
        <div className="grid md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7 space-y-3">
            <h1 className="font-display text-6xl md:text-8xl">
              {isAuthenticated ? <>Para <em className="text-ws-accent">ti</em></> : <>Anuncios <em className="text-ws-accent">recientes</em></>}
            </h1>
            <p className="font-cuerpo text-ws-ink/85 text-lg max-w-xl leading-relaxed">
              {isAuthenticated
                ? 'Lo último en oportunidades en los destinos que sigues.'
                : 'Lo último que publicó la comunidad. Explora sin cuenta; crea una para guardar y contactar.'}
            </p>
            <p className="ws-mono inline-flex items-center gap-2 bg-ws-paper-light rounded-[4px] px-2.5 py-1.5">
              <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" /> Solo avisos vigentes: caducan en 30 días o menos
            </p>
          </div>

          <div className="md:col-span-5">
            <Input
              aria-label="Buscar anuncios"
              classNames={{
                inputWrapper: "ws-input-border h-14",
                input: "font-cuerpo text-lg",
                clearButton: "!w-11 !h-11 !min-w-11 flex items-center justify-center"
              }}
              placeholder="Ej: granja, Sydney, auto…"
              radius="sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="text-ws-ink w-5 h-5" aria-hidden="true" />}
              isClearable
              onClear={() => setSearchQuery('')}
            />
          </div>
        </div>

        <div role="group" aria-label="Filtrar por categoría; puedes marcar varias" className="flex flex-nowrap max-[360px]:flex-wrap gap-1.5 sm:gap-2 py-4 border-y border-ws-line">
          {categories.map((cat) => (
            <FilterChip
              key={cat.key}
              label={cat.label}
              icon={CATEGORY_ICONS[cat.key] || Globe}
              tagClass={tagClassFor(cat.key)}
              hideIconOnNarrow
              isSelected={selectedCategories.includes(cat.key)}
              onClick={() => toggleCategory(cat.key)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="resultados">
        <h2 id="resultados" className="sr-only">Resultados</h2>
        {filteredPosts.length === 0 ? (
          <EmptyState
            stamp={posts.length === 0 ? 'SIN RUTA' : 'SIN AVISOS'}
            title={posts.length === 0
              ? (isAuthenticated ? "Aún no sigues ningún destino" : "Todavía no hay anuncios")
              : "Pueblo fantasma"}
            action={posts.length === 0 ? (
              <Button as={Link} to="/destinos" radius="sm" className="ws-btn ws-btn-tomato mt-2 h-11 px-6">
                Ver destinos
              </Button>
            ) : (
              <Button onPress={() => { setSearchQuery(''); setSelectedCategories([]); }} radius="sm" className="ws-btn ws-btn-ink mt-2 h-11 px-6">
                Limpiar búsqueda
              </Button>
            )}
          >
            {posts.length === 0
              ? "Explora nuestra lista de destinos y síguelos para ver avisos aquí."
              : "No encontramos ningún anuncio que coincida con tus filtros. Intenta una búsqueda distinta."}
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-6">

            {isAuthenticated && showTip && (
              <div role="region" aria-label="Primeros pasos" className="flex flex-col sm:flex-row sm:items-center gap-3 bg-ws-paper-light rounded-[8px] p-4">
                <p className="font-cuerpo text-sm font-bold text-ws-ink flex-1">
                  ¿Primera vez por aquí? Sigue un destino para personalizar tu «Para ti», guarda anuncios con la estrella y pulsa «Contactar» para escribirle a quien publica.
                </p>
                <div className="flex gap-2 shrink-0">
                  <Button as={Link} to="/como-funciona" radius="sm" className="ws-btn ws-btn-ink h-10 px-4" onPress={dismissTip}>
                    Ver cómo funciona
                  </Button>
                  <Button radius="sm" className="ws-pill ws-pill-line h-10 px-4" onPress={dismissTip}>
                    Entendido
                  </Button>
                </div>
              </div>
            )}

            {isAuthenticated && !isPersonalized && (
              <div className="flex items-center gap-3 bg-ws-paper-light rounded-[8px] p-4">
                <Compass className="w-6 h-6 shrink-0" aria-hidden="true" />
                <p className="font-cuerpo text-sm font-bold text-ws-ink">
                  Aún no sigues ningún destino, así que te mostramos lo más reciente de toda la comunidad.{' '}
                  <Link to="/destinos" className="underline underline-offset-2">
                    Sigue un destino
                  </Link>{' '}
                  para personalizar tu "Para ti".
                </p>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-ws-paper-light rounded-[8px] p-4">
                <p className="font-cuerpo text-sm font-bold text-ws-ink flex-1">
                  Estás explorando como visitante. Con una cuenta puedes guardar anuncios, contactar a quien publica y seguir destinos.
                </p>
                <Button as={Link} to="/register" radius="sm" className="ws-btn ws-btn-ink h-11 px-5 shrink-0">
                  Crear cuenta
                </Button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {filteredPosts.map((post) => {
                const owner = post.owner || {
                  id: post.user_id,
                  name: String(post.author_name || "Viajero anónimo"),
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
          </div>
        )}
      </section>

    </div>
  );
};

export default Feed;

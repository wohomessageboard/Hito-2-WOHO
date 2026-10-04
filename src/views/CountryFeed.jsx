import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Button, Input } from '@heroui/react';
import { Search, Grid, Briefcase, Home, Users, Globe, MapPin, ArrowLeft, Heart } from '../components/ui/icons';
import PostCard from '../components/ui/PostCard';
import FilterChip from '../components/ui/FilterChip';
import EmptyState from '../components/ui/EmptyState';
import Stamp from '../components/ui/Stamp';
import { useScrollRestore } from '../hooks/useScrollRestore';

const CATEGORY_ICONS = {
  'Todos': Grid,
  'Alojamiento': Home,
  'Trabajo': Briefcase,
  'Social': Users,
  'Otro': Globe,
};

const CountryFeed = () => {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, followedCountryIds, toggleFollowedCountryId } = useUser();

  const [countryInfo, setCountryInfo] = useState(null);
  const [countryPosts, setCountryPosts] = useState([]);
  const [categories, setCategories] = useState([
    { key: 'Alojamiento', label: 'Alojamiento' },
    { key: 'Trabajo', label: 'Trabajo' },
    { key: 'Social', label: 'Social' },
    { key: 'Otro', label: 'Otro' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerFailed, setBannerFailed] = useState(false);

  useScrollRestore(`country_scroll_${countryName}`, !isLoading);

  useEffect(() => {
    const fetchCountryData = async () => {
      setIsLoading(true);
      try {
        const [cRes, pRes, catRes] = await Promise.all([
          api.get(`/countries/${countryName}`).catch(() => ({ data: { name: countryName, flag: "🏳️", image: null, id: 999 } })),
          api.get(`/posts?country=${countryName}`).catch(() => ({ data: [] })),
          api.get(`/categories`).catch(() => ({ data: [] }))
        ]);
        setCountryInfo(cRes.data);
        setCountryPosts(pRes.data);
        if(catRes.data && catRes.data.length > 0) setCategories(catRes.data);
      } catch (error) {
        console.error("Error al cargar país", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountryData();
  }, [countryName]);

  const availableCities = useMemo(() => {
    const cities = new Set(countryPosts.map(p => p.city));
    return ['Todas', ...Array.from(cities)];
  }, [countryPosts]);

  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let results = countryPosts;

    if (selectedCity !== 'Todas') results = results.filter(p => p.city === selectedCity);
    if (selectedCategory !== 'Todos') results = results.filter(p => p.type === selectedCategory);
    
    if (searchQuery.trim() !== '') {
      const lowerQ = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(lowerQ) || 
        post.description.toLowerCase().includes(lowerQ)
      );
    }

    return results;
  }, [countryPosts, selectedCity, selectedCategory, searchQuery]);

  if (!isLoading && !countryInfo) {
    return (
      <EmptyState
        stamp="SIN SELLO"
        title="País no encontrado"
        action={<Button onPress={() => navigate('/destinos')} radius="sm" className="ws-btn ws-btn-ink mt-2 h-11 px-6">Volver a destinos</Button>}
      >
        No tenemos ese destino todavía.
      </EmptyState>
    );
  }

  if (isLoading) {
    return <p role="status" className="ws-mono p-20 text-center">Cargando destino…</p>;
  }

  const isFollowed = followedCountryIds?.includes(countryInfo?.id);

  return (
    <div className="flex flex-col gap-10 w-full">

      <header className="relative rounded-[10px] overflow-hidden min-h-[16rem] md:min-h-[22rem] flex items-end bg-ws-ocean text-ws-paper-light">
        {countryInfo.image_url && !bannerFailed && (
          <div className="ws-photo absolute inset-0 border-0 rounded-none">
            <img
              src={countryInfo.image_url}
              alt=""
              onError={() => setBannerFailed(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ws-ink/85 via-ws-ink/30 to-transparent" />

        <Button
          onPress={() => navigate('/destinos')}
          isIconOnly
          radius="sm"
          aria-label="Volver a destinos"
          className="ws-btn ws-btn-quiet absolute top-4 left-4 z-20 min-w-11 min-h-11"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        {isAuthenticated && countryInfo && (
          <Button
            onPress={async () => {
              toggleFollowedCountryId(countryInfo.id);
              try {
                if (isFollowed) {
                  await api.delete(`/users/me/follows/countries/${countryInfo.id}`);
                } else {
                  await api.post(`/users/me/follows/countries/${countryInfo.id}`);
                }
              } catch {
                toggleFollowedCountryId(countryInfo.id);
                console.error("Error toggling follow");
              }
            }}
            radius="sm"
            aria-pressed={!!isFollowed}
            className={`ws-btn absolute top-4 right-4 z-20 min-h-11 ${isFollowed ? 'ws-btn-mustard' : 'ws-btn-quiet'}`}
            startContent={<Heart className="w-5 h-5" aria-hidden="true" />}
          >
            {isFollowed ? "Siguiendo" : "Seguir destino"}
          </Button>
        )}

        <div className="relative z-10 w-full px-5 md:px-10 pb-6 md:pb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-5xl md:text-6xl block mb-2" aria-hidden="true">{countryInfo.flag}</span>
            <h1 className="font-display text-6xl md:text-8xl break-words">{countryInfo.name}</h1>
          </div>
          <Stamp solid variant="round" center={['WOHO']} top="WORKING HOLIDAY" bottom="DESTINO" rotate={-10} className="hidden md:block w-28 shrink-0 text-ws-mustard" />
        </div>
      </header>

      <section aria-label="Filtros" className="ws-surface p-4 md:p-6 flex flex-col gap-5">
        <Input
          aria-label={`Buscar en ${countryInfo.name}`}
          classNames={{ inputWrapper: "ws-input-border h-14", input: "font-cuerpo text-lg" }}
          placeholder={`Buscar en ${countryInfo.name}…`}
          radius="sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="text-ws-ink w-5 h-5" aria-hidden="true" />}
          isClearable
          onClear={() => setSearchQuery('')}
        />

        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 md:items-start">
          <div className="flex-1 space-y-2">
            <span className="ws-mono flex items-center gap-1.5"><MapPin className="w-4 h-4" aria-hidden="true" /> Ciudad / región</span>
            <div role="group" aria-label="Filtrar por ciudad" className="flex flex-wrap gap-2">
              {availableCities.map(city => (
                <FilterChip
                  key={city}
                  label={city}
                  size="sm"
                  isSelected={selectedCity === city}
                  onClick={() => setSelectedCity(city)}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <span className="ws-mono flex items-center gap-1.5"><Grid className="w-4 h-4" aria-hidden="true" /> ¿Qué buscas?</span>
            <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
              <FilterChip
                label="Todos"
                size="sm"
                isSelected={selectedCategory === "Todos"}
                onClick={() => setSelectedCategory("Todos")}
              />
              {categories.map(cat => (
                <FilterChip
                  key={cat.key}
                  label={cat.label}
                  icon={CATEGORY_ICONS[cat.key] || Globe}
                  size="sm"
                  isSelected={selectedCategory === cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredPosts.length === 0 ? (
          <EmptyState
            title={`Pueblo fantasma en ${selectedCity !== 'Todas' ? selectedCity : countryInfo.name}`}
            action={
              <Button
                onPress={() => { setSearchQuery(''); setSelectedCategory('Todos'); setSelectedCity('Todas'); }}
                radius="sm"
                className="ws-btn ws-btn-ink mt-2 h-11 px-6"
              >
                Restablecer filtros
              </Button>
            }
          >
            Nadie ha publicado anuncios que coincidan con estos filtros aquí. ¡Sé el primero en crear una publicación!
          </EmptyState>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {filteredPosts.map(post => {
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
        )}
      </section>

    </div>
  );
};

export default CountryFeed;

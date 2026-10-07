import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Button, Input } from '@heroui/react';
import { Search, Grid, Briefcase, Home, Users, Globe, MapPin, ArrowLeft, Heart } from '../components/ui/icons';
import PostCard from '../components/ui/PostCard';
import FilterChip from '../components/ui/FilterChip';
import { tagClassFor } from '../components/ui/categoryTone';
import EmptyState from '../components/ui/EmptyState';
import Stamp from '../components/ui/Stamp';
import { useScrollRestore } from '../hooks/useScrollRestore';
import ShareLinks from '../components/ui/ShareLinks';
import RelatedLinks from '../components/ui/RelatedLinks';
import CityMultiSelect from '../components/ui/CityMultiSelect';

const CATEGORY_ICONS = {
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

  // Ciudades con avisos, con cuántos tiene cada una (las más activas primero).
  const availableCities = useMemo(() => {
    const counts = new Map();
    countryPosts.forEach((p) => { if (p.city) counts.set(p.city, (counts.get(p.city) || 0) + 1); });
    return [...counts].map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, 'es'));
  }, [countryPosts]);

  const [selectedCities, setSelectedCities] = useState([]);
  // Categorías marcadas (varias a la vez); sin ninguna se ven todos los avisos.
  const [selectedCategories, setSelectedCategories] = useState([]);
  const toggleCategory = (key) => setSelectedCategories((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let results = countryPosts;

    if (selectedCities.length) results = results.filter(p => selectedCities.includes(p.city));
    if (selectedCategories.length) results = results.filter(p => selectedCategories.includes(p.type));
    
    if (searchQuery.trim() !== '') {
      const lowerQ = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(lowerQ) || 
        post.description.toLowerCase().includes(lowerQ)
      );
    }

    return results;
  }, [countryPosts, selectedCities, selectedCategories, searchQuery]);

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
          <Stamp solid variant="round" center={['DRIFTLER']} top="WORKING HOLIDAY" bottom="DESTINO" rotate={-10} className="hidden md:block w-28 shrink-0 text-ws-mustard" />
        </div>
      </header>

      <section aria-label="Filtros" className="ws-surface p-4 md:p-6 flex flex-col gap-5">
        <Input
          aria-label={`Buscar en ${countryInfo.name}`}
          classNames={{ inputWrapper: "ws-input-border h-14", input: "font-cuerpo text-lg", clearButton: "!w-11 !h-11 !min-w-11 flex items-center justify-center" }}
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
            <CityMultiSelect options={availableCities} value={selectedCities} onChange={setSelectedCities} />
          </div>

          <div className="flex-1 space-y-2">
            <span className="ws-mono flex items-center gap-1.5"><Grid className="w-4 h-4" aria-hidden="true" /> ¿Qué buscas?</span>
            <div role="group" aria-label="Filtrar por categoría; puedes marcar varias" className="flex flex-nowrap max-[360px]:flex-wrap gap-1.5 sm:gap-2">
              {categories.map(cat => (
                <FilterChip
                  key={cat.key}
                  label={cat.label}
                  icon={CATEGORY_ICONS[cat.key] || Globe}
                  size="sm"
                  tagClass={tagClassFor(cat.key)}
                  hideIconOnNarrow
                  isSelected={selectedCategories.includes(cat.key)}
                  onClick={() => toggleCategory(cat.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="resultados">
        <h2 id="resultados" className="sr-only">Anuncios en {countryInfo.name}</h2>
        {filteredPosts.length === 0 ? (
          <EmptyState
            title={`Pueblo fantasma en ${selectedCities.length === 1 ? selectedCities[0] : countryInfo.name}`}
            action={
              <Button
                onPress={() => { setSearchQuery(''); setSelectedCategories([]); setSelectedCities([]); }}
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

      <section aria-label="Compartir este destino" className="flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="font-bold">¿Alguien más viaja a {countryInfo.name}?</p>
        <ShareLinks url={window.location.href} title={`Working Holiday en ${countryInfo.name}`} text={`Avisos de trabajo y alojamiento en ${countryInfo.name}:`} />
      </section>

      <RelatedLinks links={[
        { to: '/destinos', label: 'Todos los destinos', hint: 'Elige otro país.' },
        { to: '/como-funciona', label: 'Cómo funciona', hint: 'Cuatro pasos, gratis.' },
        { to: '/feed', label: 'Explorar anuncios', hint: 'Sin filtrar por país.' },
      ]} />

    </div>
  );
};

export default CountryFeed;

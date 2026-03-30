import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Button, Chip, Input } from '@heroui/react';
import { Search, Grid, Briefcase, Home, Users, Globe, MapPin, ArrowLeft, Heart } from 'lucide-react';
import PostCard from '../components/ui/PostCard';
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

  // Redirigir si no hay sesión iniciada
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Si no está autenticado, no renderizamos nada para evitar parpadeos
  if (!isAuthenticated) return null;

  // 1. Estados Dinámicos cargados por API
  const [countryInfo, setCountryInfo] = useState(null);
  const [countryPosts, setCountryPosts] = useState([]);
  const [categories, setCategories] = useState([
    { key: 'Alojamiento', label: 'Alojamiento' },
    { key: 'Trabajo', label: 'Trabajo' },
    { key: 'Social', label: 'Social' },
    { key: 'Otro', label: 'Otro' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // (User status importado arriba)

  // Hook Scroll
  useScrollRestore(`country_scroll_${countryName}`, !isLoading);

  // Fetch de los datos del país específico
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchCountryData = async () => {
      setIsLoading(true);
      try {
        const [cRes, pRes, catRes] = await Promise.all([
          api.get(`/countries/${countryName}`).catch(() => ({ data: { name: countryName, flag: "🏳️", image: "https://placholder.co/600", id: 999 } })),
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
  }, [countryName, isAuthenticated]);

  // 3. Extraer DINÁMICAMENTE todas las ciudades únicas de los posts de este país
  const availableCities = useMemo(() => {
    const cities = new Set(countryPosts.map(p => p.city));
    return ['Todas', ...Array.from(cities)];
  }, [countryPosts]);

  // 4. Estados de los Filtros Locales (Ciudad, Categoría y Texto)
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // 5. Aplicar Filtros sobre los anuncios del país
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
    
    // ----------------------------------------------------------------------
    // EJEMPLO: CÓMO SE HARÍA POR QUERY SQL EN NODE.JS + POSTGRESQL (pg)
    //
    // const fetchCountryPosts = async () => {
    //   // 1. Array de valores iniciales (El país es fijo aquí)
    //   let queryParams = [countryName];
    //   let sqlQuery = `SELECT * FROM posts WHERE country ILIKE $1`;
    //   
    //   // 2. Filtro de ciudad exacta
    //   if (selectedCity !== 'Todas') {
    //     sqlQuery += ` AND city = $${queryParams.length + 1}`;
    //     queryParams.push(selectedCity);
    //   }
    //
    //   // 3. Filtro de categoría
    //   if (selectedCategory !== 'Todos') {
    //     sqlQuery += ` AND type = $${queryParams.length + 1}`;
    //     queryParams.push(selectedCategory);
    //   }
    //   
    //   // 4. Buscador textual libre
    //   if (searchQuery.trim() !== '') {
    //     const searchParam = `%${searchQuery}%`;
    //     const pId = `$${queryParams.length + 1}`;
    //     sqlQuery += ` AND (title ILIKE ${pId} OR description ILIKE ${pId})`;
    //     queryParams.push(searchParam);
    //   }
    //   
    //   // 5. Ejecución real contra la Base de Datos
    //   // const { rows } = await pool.query(sqlQuery, queryParams);
    //   // return rows; // <-- Estos serían tus filteredPosts desde backend
    // };
    // ----------------------------------------------------------------------

    return results;
  }, [countryPosts, selectedCity, selectedCategory, searchQuery]);

  // ¿No existe el país? Mostrar un error (404)
  if (!isLoading && !countryInfo) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-4xl font-black uppercase">País no encontrado</h1>
        <Button onPress={() => navigate('/destinos')} className="mt-4 bg-black text-white px-6">Volver al Mapa</Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-20 text-center font-bold text-xl">Cargando destino...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-12">
      
      {/* Banner Superior con la Foto del País */}
      <div className="relative w-full h-64 md:h-80 border-b-[4px] border-black bg-black flex items-center justify-center overflow-hidden">
        <img src={countryInfo.image_url} alt={countryInfo.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        
        {/* Botón Flotante para Retroceder arriba a la izq */}
        <Button 
          onPress={() => navigate('/destinos')}
          isIconOnly
          variant="flat"
          className="absolute top-4 left-4 z-20 bg-white border-[2px] border-black hover:-translate-y-1 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </Button>

        {/* Botón Flotante para Seguir el Destino */}
        {isAuthenticated && countryInfo && (
          <Button 
            onPress={async () => {
              const isFollowed = followedCountryIds?.includes(countryInfo.id);
              // Actualizamos visual optimista
              toggleFollowedCountryId(countryInfo.id);
              try {
                if (isFollowed) {
                  await api.delete(`/users/me/follows/countries/${countryInfo.id}`);
                } else {
                  await api.post(`/users/me/follows/countries/${countryInfo.id}`);
                }
              } catch (e) {
                // Revert
                toggleFollowedCountryId(countryInfo.id);
                console.error("Error toggling follow");
              }
            }}
            variant="solid"
            className={`absolute top-4 right-4 z-20 font-titulo font-bold border-[2px] border-black hover:-translate-y-1 transition-transform ${followedCountryIds?.includes(countryInfo?.id) ? 'bg-woho-black text-white hover:bg-gray-800' : 'bg-woho-orange text-black hover:bg-yellow-400'}`}
            startContent={<Heart className={`w-5 h-5 ${followedCountryIds?.includes(countryInfo?.id) ? 'fill-current' : ''}`} />}
          >
            {followedCountryIds?.includes(countryInfo?.id) ? "Siguiendo" : "Seguir Destino"}
          </Button>
        )}

        <div className="relative z-10 flex flex-col items-center px-4 text-center w-full">
          <span className="text-6xl md:text-8xl drop-shadow-md mb-2">{countryInfo.flag}</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-titulo font-black text-white uppercase tracking-widest drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] break-words">
            {countryInfo.name}
          </h1>
        </div>
      </div>

      {/* Caja de Filtros Intermedios Neo-Brutalista */}
      <div className="px-4 md:px-8 max-w-5xl w-full mx-auto -translate-y-8 md:-translate-y-10 relative z-20">
        <div className="p-4 bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 md:gap-6 w-full">
        
        {/* Buscador de Texto */}
        <Input 
          classNames={{ inputWrapper: "border-[2px] border-black h-14 bg-gray-50 focus-within:bg-white", input: "font-cuerpo text-lg" }}
          placeholder={`Buscar en ${countryInfo.name}...`}
          radius="md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="text-default-400 w-5 h-5" />}
          isClearable
          onClear={() => setSearchQuery('')}
        />

        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 md:items-start">
          
          {/* Fila A: Ciudades Dinámicas */}
          <div className="flex-1 space-y-2">
            <span className="text-sm font-titulo font-black uppercase text-woho-black flex items-center gap-1"><MapPin className="w-4 h-4"/> Ciudad / Región</span>
            <div className="flex flex-wrap gap-2">
              {availableCities.map(city => {
                const isSel = selectedCity === city;
                return (
                  <Chip
                    key={city}
                    variant={isSel ? "solid" : "bordered"}
                    color={isSel ? "secondary" : "default"}
                    radius="sm"
                    onClick={() => setSelectedCity(city)}
                    className={`cursor-pointer font-bold border-[2px] hover:-translate-y-0.5 ${isSel ? 'bg-woho-black text-white border-black' : 'border-black bg-white hover:bg-gray-100'}`}
                  >
                    {city}
                  </Chip>
                );
              })}
            </div>
          </div>

          {/* Fila B: Categorías Oficiales */}
          <div className="flex-1 space-y-2">
            <span className="text-sm font-titulo font-black uppercase text-woho-black flex items-center gap-1"><Grid className="w-4 h-4"/> ¿Qué buscas?</span>
            <div className="flex flex-wrap gap-2">
              {/* Chip "Todos" */}
              <Chip
                variant={selectedCategory === "Todos" ? "solid" : "bordered"}
                radius="sm"
                onClick={() => setSelectedCategory("Todos")}
                className={`cursor-pointer font-bold border-[2px] text-xs px-1 ${selectedCategory === "Todos" ? 'bg-woho-orange text-black border-black' : 'border-black bg-white hover:bg-gray-100'}`}
              >
                Todos
              </Chip>
              {categories.map(cat => {
                const Icon = CATEGORY_ICONS[cat.key] || Globe;
                const isSel = selectedCategory === cat.key;
                return (
                  <Chip
                    key={cat.key}
                    variant={isSel ? "solid" : "bordered"}
                    radius="sm"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`cursor-pointer font-bold border-[2px] transition-colors text-xs px-1 ${isSel ? 'bg-woho-purple text-white border-black' : 'border-black bg-white hover:bg-gray-100'}`}
                    startContent={<Icon className={`w-3 h-3 ml-1 ${isSel ? 'text-white' : 'text-default-500'}`} />}
                  >
                    {cat.label}
                  </Chip>
                );
              })}
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* Grilla de Resultados */}
      <div className="px-4 mt-4">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-black rounded-xl bg-gray-50/50 max-w-3xl mx-auto">
            <span className="text-4xl mb-4">🌪️</span>
            <h3 className="font-titulo font-black text-2xl mb-2">Pueblo Fantasma en {selectedCity !== 'Todas' ? selectedCity : countryInfo.name}</h3>
            <p className="font-cuerpo text-default-500 max-w-md">Nadie ha publicado anuncios que coincidan con estos filtros aquí. ¡Sé el primero en Crear Publicación!</p>
            <Button 
              onPress={() => { setSearchQuery(''); setSelectedCategory('Todos'); setSelectedCity('Todas'); }}
              variant="flat" 
              className="mt-6 font-bold bg-black text-white rounded-md h-10 px-6"
            >
              Restablecer Filtros
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            {filteredPosts.map(post => {
              const owner = post.owner || { id: post.userId, name: "Viajero Anónimo", avatar: null };
              const isMyPost = currentUser?.id === post.userId;
              
              return (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  owner={owner}
                  variant="feed"
                  isMyPost={isMyPost}
                />
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default CountryFeed;

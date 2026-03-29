import React, { useState, useMemo, useEffect } from 'react';
// Importamos la API y el contexto
import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
// Componentes de la UI
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Chip, Divider, Input } from '@heroui/react';
// Iconos
import { Search, Grid, Briefcase, Home, Users, Flame, Globe } from 'lucide-react';
// Componente UI Abstraído
import PostCard from '../components/ui/PostCard';
// Hook de Persistencia de Scroll
import { useScrollRestore } from '../hooks/useScrollRestore';

// Mapeador de Iconos por Categoría, ya que los iconos no se guardan en JSON sino en React
const CATEGORY_ICONS = {
  'Todos': Grid,
  'Alojamiento': Home,
  'Trabajo': Briefcase,
  'Social': Users,
  'Otro': Globe,
};

const Feed = () => {
  const { currentUser, isAuthenticated, followedCountryIds } = useUser();
  const navigate = useNavigate();

  // Redirigir si no hay sesión iniciada
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Si no está autenticado, no renderizamos nada para evitar parpadeos
  if (!isAuthenticated) return null;

  // 1. Estados Locales para almacenar datos del Backend
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([
    { key: 'Alojamiento', label: 'Alojamiento' },
    { key: 'Trabajo', label: 'Trabajo' },
    { key: 'Social', label: 'Social' },
    { key: 'Otro', label: 'Otro' }
  ]);
  
  // Qué categoría estamos viendo
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  // Qué texto escribió en el buscador
  const [searchQuery, setSearchQuery] = useState('');

  // 1.5. Aplicando hook de scroll (le pasamos una llave única y comprobamos si "posts" ya tiene datos)
  useScrollRestore('feed_scroll', posts.length > 0);

  // Fetch de Posts inicial
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // El Backend de PostgreSQL se encargará luego de enviarnos los posts
    api.get('/posts/feed').then(res => {
      setPosts(res.data);
    }).catch(err => {
      console.log('Esperando que el Endpoint Backend exista...', err);
      setPosts([]);
    });

    api.get('/categories').then(res => {
      if(res.data && res.data.length > 0) setCategories(res.data);
    }).catch(err => console.log(err));
  }, [isAuthenticated]);

  // 2. Lógica reactiva (Filtros Frontend)
  const filteredPosts = useMemo(() => {
    let results = posts;

    // La base de datos ya nos entregó en 'posts' únicamente los avisos de los lugares seguidos (GET /api/posts/feed)
    // Así que solo aplicaremos filtro por si nuestra lista de follows está vacía (para no renderizar nada).
    if (!followedCountryIds || followedCountryIds.length === 0) {
      results = [];
    }

    // Filtro A: Categoría (Si no es 'Todos')
    if (selectedCategory !== 'Todos') {
      results = results.filter(post => post.type === selectedCategory);
    }

    // Filtro B: Buscador de texto
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.description.toLowerCase().includes(lowerQuery) ||
        post.city.toLowerCase().includes(lowerQuery)
      );
    }

    // ----------------------------------------------------------------------
    // EJEMPLO DE CÓMO SE HARÍA ESTE FILTRADO POR QUERY SQL EN EL BACKEND
    // (Para cuando conectes tu base de datos PostgreSQL con Node.js)
    // 
    // const fetchFilteredPosts = async () => {
    //   // 1. Array de lugares que sigue el usuario
    //   const followedNames = currentUser.followedLocations.map(loc => loc.name);
    //   
    //   // 2. Query base
    //   let sqlQuery = `SELECT * FROM posts WHERE (country = ANY($1) OR city = ANY($1))`;
    //   let queryParams = [followedNames];  // $1
    //
    //   // 3. Añadir Categoría
    //   if (selectedCategory !== 'Todos') {
    //     sqlQuery += ` AND type = $${queryParams.length + 1}`;
    //     queryParams.push(selectedCategory);
    //   }
    //
    //   // 4. Añadir Buscador Textual (ILIKE ignora mayúsculas/minúsculas en postgres)
    //   if (searchQuery.trim() !== '') {
    //     const searchParam = `%${searchQuery}%`;
    //     const pId = `$${queryParams.length + 1}`;
    //     sqlQuery += ` AND (title ILIKE ${pId} OR description ILIKE ${pId} OR city ILIKE ${pId})`;
    //     queryParams.push(searchParam);
    //   }
    //   
    //   // 5. Ejecución real
    //   // const { rows } = await pool.query(sqlQuery, queryParams);
    //   // return rows; // <-- Estos serían tus filteredPosts
    // };
    // ----------------------------------------------------------------------

    return results;
  }, [selectedCategory, searchQuery, posts, followedCountryIds]);

  return (
    <div className="flex flex-col gap-8 md:gap-12 w-full max-w-7xl mx-auto px-4 pb-12">
      
      {/* 
        ========================================
        SECCIÓN 1: CABEZAL EXPLORADOR Y BUSCADOR
        ========================================
      */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-titulo font-black text-black tracking-tighter uppercase">
              Para Ti
            </h1>
            <p className="font-cuerpo text-default-600 text-lg max-w-xl">
              Lo último en oportunidades en los destinos que sigues.
            </p>
          </div>
          
          {/* Barra de Búsqueda Textual */}
          <div className="w-full md:w-96 flex-shrink-0">
            <Input 
              classNames={{
                inputWrapper: "border-[2px] border-black h-14 bg-white shadow-sm",
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

        {/* CONTROLES: Filtros y Pestañas Inteligente de Seguimiento */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50 border-[2px] border-black p-4 rounded-xl shadow-sm">
          
          {/* Chips Neobrutalistas para el filtrado rápido por categoría */}
          <div className="flex flex-wrap gap-2">
            {/* 1. Agregamos el Chip "Todos" manualmente */}
            <Chip
              key="Todos"
              variant={selectedCategory === "Todos" ? "solid" : "bordered"}
              color={selectedCategory === "Todos" ? "secondary" : "default"}
              radius="md"
              onClick={() => setSelectedCategory("Todos")}
              className={`
                cursor-pointer font-titulo font-bold border-[2px] transition-transform hover:-translate-y-0.5
                ${selectedCategory === "Todos" ? 'bg-woho-black text-white border-black' : 'border-black bg-white hover:bg-gray-100'}
              `}
              startContent={<Grid className={`w-4 h-4 ml-1 ${selectedCategory === "Todos" ? 'text-woho-orange' : 'text-default-500'}`} />}
            >
              <span className="px-1 text-sm">Todos</span>
            </Chip>

            {/* 2. Listamos el resto consultando la base de datos centralizada */}
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key] || Globe;
              const isSelected = selectedCategory === cat.key;
              
              return (
                <Chip
                  key={cat.key}
                  variant={isSelected ? "solid" : "bordered"}
                  color={isSelected ? "secondary" : "default"}
                  radius="md"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`
                    cursor-pointer font-titulo font-bold border-[2px] transition-transform hover:-translate-y-0.5
                    ${isSelected ? 'bg-woho-black text-white border-black' : 'border-black bg-white hover:bg-gray-100'}
                  `}
                  startContent={<Icon className={`w-4 h-4 ml-1 ${isSelected ? 'text-woho-orange' : 'text-default-500'}`} />}
                >
                  <span className="px-1 text-sm">{cat.label}</span>
                </Chip>
              );
            })}
          </div>



        </div>
      </section>

      {/* 
        ========================================
        SECCIÓN 2: LA GRILLA (LA PARED DE ANUNCIOS)
        ========================================
      */}
      <section className="pb-16">
        {/* Renderizamos mensajes de vacío condicionales si no hay match */}
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-black rounded-xl bg-gray-50/50">
            <span className="text-4xl mb-4">🌪️</span>
            <h3 className="font-titulo font-black text-2xl mb-2">
              {followedCountryIds?.length === 0 
                ? "Aún no sigues ningún destino" 
                : "Pueblo Fantasma"}
            </h3>
            <p className="font-cuerpo text-default-500 max-w-md">
              {followedCountryIds?.length === 0 
                ? "Explora nuestra lista de Destinos mundiales y síguelos para ver avisos aquí."
                : "No encontramos ningún anuncio que coincida con tus filtros. Intenta una búsqueda distinta."}
            </p>
            
            {followedCountryIds?.length === 0 ? (
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
            
            {/* Dibujamos el arreglo usando el componente abstraído modular */}
            {filteredPosts.map((post) => {
              // Asumimos que la nueva API nos devuelve el objeto owner insertado en el JSON: { ...post, owner: {id, name, avatar} }
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
      </section>

    </div>
  );
};

export default Feed;

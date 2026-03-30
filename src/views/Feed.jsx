import React, { useState, useMemo, useEffect } from 'react';

import api from '../config/api';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Chip, Divider, Input } from '@heroui/react';

import { Search, Grid, Briefcase, Home, Users, Flame, Globe } from 'lucide-react';

import PostCard from '../components/ui/PostCard';

import { useScrollRestore } from '../hooks/useScrollRestore';

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const [posts, setPosts] = useState([]);
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
    if (!isAuthenticated) return;

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

  const filteredPosts = useMemo(() => {
    let results = posts;

    if (!followedCountryIds || followedCountryIds.length === 0) {
      results = [];
    }

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
  }, [selectedCategory, searchQuery, posts, followedCountryIds]);

  return (
    <div className="flex flex-col gap-8 md:gap-12 w-full max-w-7xl mx-auto px-4 pb-12">
      
      
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

        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50 border-[2px] border-black p-4 rounded-xl shadow-sm">
          
          
          <div className="flex flex-wrap gap-2">
            
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

      
      <section className="pb-16">
        
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
            
            
            {filteredPosts.map((post) => {
              const owner = post.owner || { 
                id: post.user_id, 
                name: String(post.author_name || "Viajero Anónimo"), 
                avatar: post.author_avatar ? String(post.author_avatar) : null 
              };
              const isMyPost = currentUser?.id === post.user_id;

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

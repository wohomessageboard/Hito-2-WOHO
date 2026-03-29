import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Chip, Tabs, Tab } from '@heroui/react';
import { ShieldCheck, Users, Globe, MapPin, BarChart3, FileText } from 'lucide-react';
import api from '../config/api';

// --- COMPONENTES MODULARES DEL PANEL ---
import AdminMetricsTab from '../components/admin/AdminMetricsTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminCountriesTab from '../components/admin/AdminCountriesTab';
import AdminCitiesTab from '../components/admin/AdminCitiesTab';
import AdminPostsTab from '../components/admin/AdminPostsTab';
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab';

const AdminDashboard = () => {
  const { isAuthenticated, currentUser } = useUser();
  const navigate = useNavigate();

  // 1. Proteger la ruta: Si no está logueado o NO ES SUPERADMIN NI ADMIN, patada.
  useEffect(() => {
    if (!isAuthenticated || (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin')) {
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) return null;

  // 2. Estados locales en espera de la información del Backend
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [posts, setPosts] = useState([]);

  // 3. Fetcher Maestro: Llamamos a la API real de Node/Express
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) return;

    const fetchData = async () => {
      try {
        const [usersRes, countriesRes, citiesRes, postsRes] = await Promise.all([
          api.get('/admin/users').catch(() => ({ data: [] })),
          api.get('/countries').catch(() => ({ data: [] })),
          api.get('/cities').catch(() => ({ data: [] })),
          api.get('/admin/posts').catch(() => ({ data: [] }))
        ]);
        setUsers(usersRes.data);
        setCountries(countriesRes.data);
        setCities(citiesRes.data);
        setPosts(postsRes.data);
      } catch (error) {
        console.error("Error contactando al servidor backend:", error);
      }
    };
    
    fetchData();
  }, [currentUser]);

  // --- LÓGICA DE BOTÓN DE PÁNICO (SOFT DELETE) EN USUARIOS ---
  const handleToggleBan = async (userId) => {
    // Optimistic Update
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ));
    await api.put(`/admin/users/${userId}/ban`).catch(err => console.log(err));
  };

  // --- LÓGICA PARA CAMBIAR ROL (USER/ADMIN) ---
  const handleToggleRole = async (userId) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } : user
    ));
    await api.put(`/admin/users/${userId}/role`).catch(err => console.log(err));
  };

  // --- LÓGICA PARA ELIMINACIÓN DEFINITIVA (HARD DELETE) ---
  const handleDeleteUser = async (userId) => {
    if (userId.toString() === currentUser.id?.toString()) return alert("No puedes borrarte a ti mismo.");
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    await api.delete(`/admin/users/${userId}`).catch(err => console.log(err));
  };

  // --- LÓGICA PARA PINEAR POSTS ---
  const handleTogglePin = async (postId) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, is_pinned: !post.is_pinned } : post
    ));
    await api.put(`/admin/posts/${postId}/pin`).catch(err => console.log(err));
  };

  // --- LÓGICA PARA ELIMINAR POSTS (SPAM) ---
  const handleDeletePost = async (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    await api.delete(`/admin/posts/${postId}`).catch(err => console.log(err));
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-8 md:py-12 gap-8">
      
      {/* Cabecera del Panel */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-[3px] border-black pb-6">
        <div className="space-y-2">
          <Chip color="danger" variant="flat" startContent={<ShieldCheck className="w-4 h-4 ml-1" />} className="font-bold border-[2px] border-danger">
            Modo SuperAdmin
          </Chip>
          <h1 className="text-4xl md:text-5xl font-titulo font-black text-black tracking-tighter uppercase">
            Panel de Control Central
          </h1>
          <p className="font-cuerpo text-xl text-default-600">
            Administra usuarios, moderación de posts y destinos de la plataforma.
          </p>
        </div>
      </section>

      {/* HeroUI Tabs para navegar las distintas secciones de Admin */}
      <Tabs 
        aria-label="Panel Admin Navigation" 
        color="danger" 
        variant="solid" 
        radius="full"
        classNames={{
          tabList: "bg-gray-100 p-2 border-[2px] border-black w-full overflow-x-auto flex-nowrap",
          cursor: "bg-black shadow-none",
          tab: "h-12 px-4 md:px-6 flex-1",
          tabContent: "font-titulo font-bold text-lg group-data-[selected=true]:text-white flex items-center gap-2"
        }}
      >
        {/* PESTAÑA: MÉTRICAS GENERALES */}
        <Tab 
          key="stats" 
          title={<><BarChart3 className="w-5 h-5"/> <span className="hidden sm:inline">Métricas</span></>}
        >
          <AdminMetricsTab users={users} countries={countries} posts={posts} />
        </Tab>
        
        {/* PESTAÑA: USUARIOS */}
        <Tab 
          key="users" 
          title={<><Users className="w-5 h-5"/> <span className="hidden sm:inline">Usuarios</span></>}
        >
          <AdminUsersTab 
            users={users} 
            handleToggleBan={handleToggleBan} 
            handleToggleRole={handleToggleRole}
            handleDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        </Tab>
        
        {/* PESTAÑA: POSTS / AVISOS */}
        <Tab 
          key="posts" 
          title={<><FileText className="w-5 h-5"/> <span className="hidden sm:inline">Avisos</span></>}
        >
          <AdminPostsTab 
            posts={posts} 
            handleTogglePin={handleTogglePin} 
            handleDeletePost={handleDeletePost} 
            countries={countries} 
            currentUser={currentUser}
          />
        </Tab>
        
        {/* PESTAÑA: DESTINOS */}
        <Tab 
          key="countries" 
          title={<><Globe className="w-5 h-5"/> <span className="hidden sm:inline">Destinos</span></>}
        >
          <AdminCountriesTab countries={countries} setCountries={setCountries} />
        </Tab>
        
        {/* PESTAÑA: CIUDADES */}
        <Tab 
          key="cities" 
          title={<><MapPin className="w-5 h-5"/> <span className="hidden sm:inline">Ciudades</span></>}
        >
          <AdminCitiesTab cities={cities} setCities={setCities} countries={countries} />
        </Tab>
        
        {/* PESTAÑA: CATEGORÍAS */}
        <Tab 
          key="categories" 
          title={<><FileText className="w-5 h-5"/> <span className="hidden sm:inline">Categorías</span></>}
        >
          <AdminCategoriesTab />
        </Tab>
      </Tabs>

    </div>
  );
};

export default AdminDashboard;

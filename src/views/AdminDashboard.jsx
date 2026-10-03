import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Chip, Tabs, Tab } from '@heroui/react';
import { ShieldCheck, Users, Globe, MapPin, BarChart3, FileText, Mail } from '../components/ui/icons';
import api from '../config/api';

import AdminMetricsTab from '../components/admin/AdminMetricsTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminCountriesTab from '../components/admin/AdminCountriesTab';
import AdminCitiesTab from '../components/admin/AdminCitiesTab';
import AdminPostsTab from '../components/admin/AdminPostsTab';
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab';
import AdminInboxTab from '../components/admin/AdminInboxTab';

const AdminDashboard = () => {
  const { isAuthenticated, currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin')) {
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [inboxOpen, setInboxOpen] = useState(0);

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) return;

    const fetchData = async () => {
      try {
        const [usersRes, countriesRes, citiesRes, postsRes, inboxRes] = await Promise.all([
          api.get('/admin/users').catch(() => ({ data: [] })),
          api.get('/countries').catch(() => ({ data: [] })),
          api.get('/cities').catch(() => ({ data: [] })),
          api.get('/admin/posts').catch(() => ({ data: [] })),
          api.get('/admin/inbox').catch(() => ({ data: { open_count: 0 } }))
        ]);
        setInboxOpen(inboxRes.data.open_count || 0);
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

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) return null;

  const handleToggleBan = async (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const action = targetUser.is_active ? 'banear' : 'restaurar';
    if (!window.confirm(`¿Seguro que quieres ${action} a ${targetUser.name}?`)) return;

    setUsers(prevUsers => prevUsers.map(user =>
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ));
    try {
      await api.put(`/admin/users/${userId}/ban`);
    } catch (err) {
      console.error(err);
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, is_active: targetUser.is_active } : user
      ));
      alert(`No se pudo ${action === 'banear' ? 'banear' : 'restaurar'} a ${targetUser.name}. Intenta de nuevo.`);
    }
  };

  const handleToggleRole = async (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser || targetUser.role === 'superadmin') return;

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`¿Cambiar el rol de ${targetUser.name} de "${targetUser.role}" a "${newRole}"?`)) return;

    setUsers(prevUsers => prevUsers.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
    } catch (err) {
      console.error(err);
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, role: targetUser.role } : user
      ));
      alert(`No se pudo cambiar el rol de ${targetUser.name}. Intenta de nuevo.`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId.toString() === currentUser.id?.toString()) return alert("No puedes borrarte a ti mismo.");
    if (!window.confirm('¿Eliminar definitivamente esta cuenta, sus avisos y sus fotos? No se puede deshacer.')) return;
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    await api.delete(`/admin/users/${userId}`).catch(err => console.log(err));
  };

  const handleTogglePin = async (postId) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, is_pinned: !post.is_pinned } : post
    ));
    await api.put(`/admin/posts/${postId}/pin`).catch(err => console.log(err));
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Eliminar definitivamente este aviso y sus fotos? No se puede deshacer.')) return;
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    await api.delete(`/admin/posts/${postId}`).catch(err => console.log(err));
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-8 md:py-12 gap-8">
      
      
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div className="space-y-2">
          <Chip color="danger" variant="flat" startContent={<ShieldCheck className="w-4 h-4 ml-1" />} className="font-bold">
            {currentUser?.role === 'superadmin' ? 'Modo SuperAdmin' : 'Modo Admin'}
          </Chip>
          <h1 className="text-4xl md:text-5xl font-titulo font-black text-black tracking-tighter uppercase">
            Panel de Control Central
          </h1>
          <p className="font-cuerpo text-xl text-default-600">
            Administra usuarios, moderación de posts y destinos de la plataforma.
          </p>
        </div>
      </section>

      
      <Tabs 
        aria-label="Panel Admin Navigation" 
        color="danger" 
        variant="solid" 
        radius="full"
        classNames={{
          tabList: "bg-gray-100 p-2 w-full overflow-x-auto flex-nowrap",
          cursor: "bg-woho-purple shadow-none",
          tab: "h-12 px-4 md:px-6 flex-1",
          tabContent: "font-titulo font-bold text-lg group-data-[selected=true]:text-white flex items-center gap-2"
        }}
      >
        
 <Tab
          key="inbox"
          title={<><Mail className="w-5 h-5"/> <span className="hidden sm:inline">Bandeja</span>{inboxOpen > 0 && <span className="ws-mono bg-ws-tomato text-ws-ink rounded-[4px] px-1.5">{inboxOpen}</span>}</>}
        >
          <AdminInboxTab onOpenCountChange={setInboxOpen} />
        </Tab>

        <Tab 
          key="stats" 
          title={<><BarChart3 className="w-5 h-5"/> <span className="hidden sm:inline">Métricas</span></>}
        >
          <AdminMetricsTab users={users} countries={countries} posts={posts} />
        </Tab>
        
        
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
        
        
        <Tab 
          key="countries" 
          title={<><Globe className="w-5 h-5"/> <span className="hidden sm:inline">Destinos</span></>}
        >
          <AdminCountriesTab countries={countries} setCountries={setCountries} />
        </Tab>
        
        
        <Tab 
          key="cities" 
          title={<><MapPin className="w-5 h-5"/> <span className="hidden sm:inline">Ciudades</span></>}
        >
          <AdminCitiesTab cities={cities} setCities={setCities} countries={countries} />
        </Tab>
        
        
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

import React, { useMemo } from 'react';
import { Card, CardBody } from '@heroui/react';
import { Users, Globe, FileText, Star } from 'lucide-react';

const AdminMetricsTab = ({ users, countries, posts = [] }) => {
  // --- CÁLCULOS ESTADÍSTICOS BÁSICOS EN BASE A PROPS ---
  const totalUsers = users.length;
  const totalCountries = countries.length;
  const totalPosts = posts.length;
  // (MOCK SQL: SELECT country_id, COUNT(*) FROM posts GROUP BY country_id ORDER BY COUNT DESC LIMIT 1)
  const mostPopularCountry = useMemo(() => {
    if (posts.length === 0) return "N/A";
    const counts = {};
    posts.forEach(post => {
      counts[post.country_id] = (counts[post.country_id] || 0) + 1;
    });
    const popularId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const country = countries.find(c => c.id.toString() === popularId.toString());
    return country ? `${country.flag} ${country.name}` : "N/A";
  }, [countries, posts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      <Card className="border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-woho-purple">
        <CardBody className="p-8 flex flex-col items-center justify-center text-center">
          <Users className="w-12 h-12 text-white mb-2" />
          <h3 className="font-titulo font-black text-white text-5xl">{users.length}</h3>
          <p className="font-cuerpo text-white/80 font-bold uppercase tracking-widest mt-1">Usuarios Totales</p>
        </CardBody>
      </Card>
      <Card className="border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-woho-orange">
        <CardBody className="p-8 flex flex-col items-center justify-center text-center">
          <Globe className="w-12 h-12 text-white mb-2" />
          <h3 className="font-titulo font-black text-white text-5xl">{countries.length}</h3>
          <p className="font-cuerpo text-white/80 font-bold uppercase tracking-widest mt-1">Países Creados</p>
        </CardBody>
      </Card>
      <Card className="border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-woho-purple text-white">
        <CardBody className="p-8 flex flex-col items-center justify-center text-center">
          <Star className="w-12 h-12 mb-2" />
          <h3 className="font-titulo font-black text-3xl md:text-4xl min-h-[48px] flex items-center">{mostPopularCountry}</h3>
          <p className="font-cuerpo text-white/80 font-bold uppercase tracking-widest mt-1">País Destacado</p>
        </CardBody>
      </Card>
      
      <Card className="border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black text-white">
        <CardBody className="p-8 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 mb-2" />
          <h3 className="font-titulo font-black text-5xl min-h-[48px] flex items-center">{totalPosts}</h3>
          <p className="font-cuerpo text-white/80 font-bold uppercase tracking-widest mt-1">Avisos Activos</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminMetricsTab;

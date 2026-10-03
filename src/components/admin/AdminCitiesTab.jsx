import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react';
import SurfaceCard from '../ui/SurfaceCard';
import { Plus, Trash2 } from '../ui/icons';
import api from '../../config/api';

const AdminCitiesTab = ({ cities, setCities, countries }) => {
  const [newCity, setNewCity] = useState({ country_id: '', name: '' });

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.name || !newCity.country_id) return;
    
    try {
      const res = await api.post('/admin/cities', newCity);
      setCities([res.data, ...cities]);
      setNewCity({ country_id: '', name: '' });
    } catch (error) {
      console.error(error);
      alert('Error guardando la ciudad en BD.');
    }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm('¿Borrar definitivamente esta ciudad?')) return;
    try {
      await api.delete(`/admin/cities/${id}`);
      setCities(cities.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      alert('No se pudo borrar la ciudad.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:col-span-1">
        <Card className="rounded-xl shadow-sm bg-woho-purple">
          <CardHeader className="pt-6 px-6">
            <h3 className="font-titulo font-black text-white text-2xl">Vincular Ciudad</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <form onSubmit={handleAddCity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white font-bold text-sm">País Padre</label>
                <select
                  required
                  className="bg-white rounded-lg h-12 px-4 border border-gray-200 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-woho-purple focus:ring-offset-2"
                  value={newCity.country_id}
                  onChange={(e) => setNewCity({...newCity, country_id: e.target.value})}
                >
                  <option value="" disabled>Selecciona a qué país pertenece...</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white font-bold text-sm">Nombre de la Ciudad</label>
                <Input 
                  placeholder="Ej: Sydney"
                  className="bg-white rounded-lg"
                  variant="bordered"
                  value={newCity.name}
                  onChange={(e) => setNewCity({...newCity, name: e.target.value})}
                />
              </div>
              
              <Button type="submit" variant="solid" className="bg-white text-black font-black h-12 shadow-sm hover:bg-gray-100 transition-colors mt-2">
                <Plus className="w-5 h-5" /> Registrar Ciudad
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <SurfaceCard>
          <CardBody className="p-0 overflow-hidden">
            <Table aria-label="Lista de Ciudades" removeWrapper radius="none" className="min-w-full">
              <TableHeader className="bg-gray-100 border-b border-gray-200">
                <TableColumn className="font-titulo font-black text-black uppercase w-16">ID</TableColumn>
                <TableColumn className="font-titulo font-black text-black uppercase">Ciudad</TableColumn>
                <TableColumn className="font-titulo font-black text-black uppercase">País Base</TableColumn>
                <TableColumn className="font-titulo font-black text-black uppercase text-right">Moderar</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Aún no hay ciudades registradas. ¡Agrega una!">
                {cities.map((city, index) => {
                  const parentCountry = countries.find(c => c.id === city.country_id);
                  return (
                    <TableRow key={city.id || index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                      <TableCell className="font-bold text-gray-500">{city.id}</TableCell>
                      <TableCell className="font-bold text-lg">{city.name}</TableCell>
                      <TableCell>
                        {parentCountry ? (
                          <Chip variant="flat" size="sm" className="font-bold border border-gray-300">
                            {parentCountry.flag} {parentCountry.name}
                          </Chip>
                        ) : (
                          <span className="text-default-400 text-sm">Desconocido</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="light"
                          color="danger"
                          aria-label={`Borrar ciudad ${city.name}`}
                          onPress={() => handleDeleteCity(city.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </SurfaceCard>
      </div>
    </div>
  );
};

export default AdminCitiesTab;

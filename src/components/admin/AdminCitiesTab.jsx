import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react';
import { Plus, Trash2 } from 'lucide-react';

const AdminCitiesTab = ({ cities, setCities, countries }) => {
  const [newCity, setNewCity] = useState({ country_id: '', name: '' });

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCity.name || !newCity.country_id) return;
    
    // Simula POST /api/admin/cities
    setCities([{ id: Date.now().toString(), ...newCity }, ...cities]);
    setNewCity({ country_id: '', name: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:col-span-1">
        <Card className="border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-woho-purple">
          <CardHeader className="pt-6 px-6">
            <h3 className="font-titulo font-black text-white text-2xl">Vincular Ciudad</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <form onSubmit={handleAddCity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-white font-bold text-sm">País Padre</label>
                <select
                  required
                  className="bg-white rounded-lg h-12 px-4 border-[2px] border-black font-bold outline-none cursor-pointer"
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
              
              <Button type="submit" variant="solid" className="bg-white text-black font-black h-12 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors mt-2">
                <Plus className="w-5 h-5" /> Registrar Ciudad
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-[2px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CardBody className="p-0 overflow-hidden">
            <Table aria-label="Lista de Ciudades" removeWrapper radius="none" className="min-w-full">
              <TableHeader className="bg-gray-100 border-b-[2px] border-black">
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
                        <Button size="sm" isIconOnly variant="light" color="danger">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminCitiesTab;

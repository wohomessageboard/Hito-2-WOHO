import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../config/api';

const AdminCountriesTab = ({ countries, setCountries }) => {
  const [newCountry, setNewCountry] = useState({ name: '', flag: '', image: '' });

  const handleAddCountry = async (e) => {
    e.preventDefault();
    if (!newCountry.name) return;
    
    try {
      const res = await api.post('/admin/countries', newCountry);
      // El backend nos devuelve el país real con su ID oficial
      setCountries([res.data, ...countries]);
      setNewCountry({ name: '', flag: '', image: '' });
    } catch (error) {
      console.error(error);
      alert('Error al intentar guardar el país en la Base de Datos.');
    }
  };

  const handleDeleteCountry = async (id) => {
    if (!window.confirm('¿Alerta permanente: Seguro que deseas eliminar este país de la base de datos?')) return;
    
    try {
      await api.delete(`/admin/countries/${id}`);
      setCountries(countries.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      alert('Error al eliminar país. Asegúrate de borrar antes sus ciudades.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      <div className="lg:col-span-1">
        <Card className="border-[2px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-woho-orange">
          <CardHeader className="pt-6 px-6">
            <h3 className="font-titulo font-black text-white text-2xl">Añadir País Rápido</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <form onSubmit={handleAddCountry} className="flex flex-col gap-4">
              <Input 
                placeholder="Nombre (ej: Italia)"
                className="bg-white rounded-lg"
                variant="bordered"
                value={newCountry.name}
                onChange={(e) => setNewCountry({...newCountry, name: e.target.value})}
              />
              <Input 
                placeholder="Emoji (ej: 🇮🇹)"
                className="bg-white rounded-lg"
                variant="bordered"
                value={newCountry.flag}
                onChange={(e) => setNewCountry({...newCountry, flag: e.target.value})}
              />
              <Input 
                placeholder="URL Banner (Opcional)"
                className="bg-white rounded-lg"
                variant="bordered"
                value={newCountry.image}
                onChange={(e) => setNewCountry({...newCountry, image: e.target.value})}
              />
              <Button type="submit" variant="solid" className="bg-black text-white font-bold h-12 border border-white">
                <Plus className="w-5 h-5" /> Insertar en BD
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-[2px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CardBody className="p-0 overflow-hidden">
            <Table aria-label="Lista de Países" removeWrapper radius="none" className="min-w-full">
              <TableHeader className="bg-gray-100 border-b-[2px] border-black">
                <TableColumn className="font-titulo font-black text-black uppercase w-16">ID</TableColumn>
                <TableColumn className="font-titulo font-black text-black uppercase">País</TableColumn>
                <TableColumn className="font-titulo font-black text-black uppercase text-right">Moderar</TableColumn>
              </TableHeader>
              <TableBody>
                {countries.map((country, index) => (
                  <TableRow key={country.id || index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                    <TableCell className="font-bold text-gray-500">{country.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-bold text-lg">
                        <span>{country.flag}</span>
                        {country.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button size="sm" isIconOnly variant="flat" color="primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" isIconOnly variant="flat" color="danger" onPress={() => handleDeleteCountry(country.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminCountriesTab;

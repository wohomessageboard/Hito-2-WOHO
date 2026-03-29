import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Input } from '@heroui/react';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import api from '../../config/api';

const AdminCategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsSubmitting(true);
    
    try {
      // Intentamos crearlo en el backend real mediante el Endoint que debes programar
      const res = await api.post('/admin/categories', { name: newCatName });
      
      // Actualizamos estado local con la respuesta (o simplemente refetch)
      setCategories([...categories, res.data]);
      setNewCatName('');
    } catch (error) {
      console.error('Error creando categoría', error);
      alert('Error creando categoría. Probablemente el Backend aún no soporte POST /api/admin/categories. Revisa la guía.');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("¿Seguro que deseas ELIMINAR esta categoría? Esto podría afectar a los posts asociados.")) return;
    
    try {
      // Simular borrado en backend
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error borrando categoría', error);
      alert('Error eliminando categoría. Revisa si el Endpoint Backend existe y si hay conflicto de llaves foráneas en los Posts.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 border-[2px] border-black rounded-xl">
        <h2 className="text-xl font-titulo font-black text-black flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-woho-black" />
          Módulos y Categorías
        </h2>
        
        <form onSubmit={handleCreateCategory} className="flex gap-2 w-full md:w-1/2">
          <Input 
            placeholder="Nueva Categoría (ej: Voluntariados)" 
            size="sm" 
            variant="faded" 
            classNames={{ inputWrapper: "border-[1.5px] border-black" }}
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="bg-woho-orange text-white font-bold h-auto" 
            isLoading={isSubmitting}
          >
            <Plus className="w-4 h-4" /> Añadir
          </Button>
        </form>
      </div>

      <div className="border-[2px] border-black rounded-xl overflow-hidden shadow-sm">
        <Table aria-label="Tabla de Categorías WOHO" removeWrapper>
          <TableHeader>
            <TableColumn className="bg-black text-white font-titulo font-bold uppercase py-4">ID de BD</TableColumn>
            <TableColumn className="bg-black text-white font-titulo font-bold uppercase py-4">Nombre de Categoría</TableColumn>
            <TableColumn className="bg-black text-white font-titulo font-bold uppercase py-4 text-center">Acciones Críticas</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={isLoading ? "Cargando categorías..." : "No hay categorías registradas."}
            isLoading={isLoading}
          >
            {categories.map((cat) => (
              <TableRow key={cat.id} className="border-b-[1.5px] border-gray-200 hover:bg-gray-50 transition-colors">
                <TableCell className="font-cuerpo font-bold text-gray-500">#{cat.id}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" className="bg-woho-purple/10 text-woho-purple font-bold">
                    {cat.name || cat.label}
                  </Chip>
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    size="sm" 
                    isIconOnly 
                    variant="flat" 
                    className="bg-red-100 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="Borrar Categoría (CUIDADO)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCategoriesTab;

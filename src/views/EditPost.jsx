import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Card, CardHeader, CardBody, Input, Button, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import { MapPin, Target, Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import api from '../config/api';

const EditPost = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useUser();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    country_id: '',
    city_id: '',
    description: '',
    price: '',
    duration_days: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Cargar Metadatos y Datos del Post
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, countRes, cityRes, postRes] = await Promise.all([
          api.get('/categories'),
          api.get('/countries'),
          api.get('/cities'),
          api.get(`/posts/${id}`)
        ]);

        setCategories(catRes.data);
        setCountries(countRes.data);
        setCities(cityRes.data);

        const p = postRes.data;
        // Solo puede editar el dueño
        if (p.user_id !== currentUser?.id && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
          alert("No tienes permiso para editar este aviso.");
          navigate('/profile');
          return;
        }

        setFormData({
          title: p.title || '',
          category_id: String(p.category_id || ''),
          country_id: String(p.country_id || ''),
          city_id: String(p.city_id || ''),
          description: p.description || '',
          price: p.price || '',
          duration_days: String(p.duration_days || '')
        });

        // Previsualizar imágenes existentes si las hay
        if (p.images) {
          const existingImages = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
          setPreviews(existingImages);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error cargando el aviso para editar:", error);
        alert("No se pudo cargar el aviso.");
        navigate('/profile');
      }
    };

    if (isAuthenticated && currentUser) {
      fetchData();
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [id, isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Solo puedes subir un máximo de 5 imágenes.");
      return;
    }
    setSelectedFiles(files);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formToSend = new FormData();
      formToSend.append('title', formData.title);
      formToSend.append('description', formData.description);
      formToSend.append('duration_days', formData.duration_days);
      formToSend.append('category_id', formData.category_id);
      formToSend.append('country_id', formData.country_id);
      formToSend.append('city_id', formData.city_id);
      if (formData.price) formToSend.append('price', formData.price);

      // Si hay archivos nuevos seleccionados, se envían para reemplazar los anteriores
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formToSend.append('images', file);
        });
      }

      await api.put(`/posts/${id}`, formToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("¡Aviso actualizado correctamente!");
      navigate('/profile');
    } catch (error) {
      console.error('Error al actualizar el aviso:', error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-xl uppercase animate-pulse text-woho-purple">Abriendo maleta del aviso...</div>;

  return (
    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      <Card className="w-full max-w-2xl border-[2px] border-black rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="flex flex-col items-start px-6 pt-8 pb-4">
          <div className="flex justify-between w-full items-center mb-4">
            <Button variant="flat" size="sm" onPress={() => navigate(-1)} className="border-2 border-black font-bold">
               <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </Button>
            <span className="text-woho-purple font-black uppercase tracking-widest text-sm">
                Edición de Aviso
            </span>
          </div>
          <h1 className="text-4xl font-titulo font-black text-black uppercase tracking-tighter leading-none">
            Modificar Publicación
          </h1>
        </CardHeader>

        <Divider className="bg-black opacity-20" />

        <CardBody className="px-6 py-8">
          <form id="edit-post-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="space-y-4">
              <h3 className="font-titulo font-extrabold text-xl text-woho-black flex items-center gap-2">
                <Target className="w-5 h-5" /> ¿Qué quieres cambiar?
              </h3>
              
              <Input
                name="title"
                label="Título del aviso"
                placeholder="Ej: Busco compañero para alquilar en Sydney"
                variant="bordered"
                radius="md"
                size="lg"
                isRequired
                value={formData.title}
                onChange={handleChange}
                classNames={{ 
                  inputWrapper: "border-[2px] border-black bg-gray-50 focus-within:bg-white",
                  label: "font-bold text-black text-sm"
                }}
              />

              <Select
                name="category_id"
                label="Categoría"
                variant="bordered"
                radius="md"
                size="lg"
                isRequired
                selectedKeys={formData.category_id ? [formData.category_id] : []}
                onChange={handleSelectChange}
                classNames={{ 
                  trigger: "border-[2px] border-black bg-gray-50",
                  label: "font-bold text-black text-sm"
                }}
              >
                {categories.map((cat) => (
                  <SelectItem key={String(cat.id)} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-4 mt-4">
              <h3 className="font-titulo font-extrabold text-xl text-woho-orange flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Ubicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  name="country_id"
                  label="País de destino"
                  variant="bordered"                  
                  radius="md"
                  size="lg"
                  isRequired
                  selectedKeys={formData.country_id ? [formData.country_id] : []}
                  onChange={handleSelectChange}
                  classNames={{ 
                    trigger: "border-[2px] border-black bg-gray-50",
                    label: "font-bold text-black text-sm"
                  }}
                >
                  {countries.map(c => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  name="city_id"
                  label="Ciudad"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  isRequired
                  selectedKeys={formData.city_id ? [formData.city_id] : []}
                  onChange={handleSelectChange}
                  isDisabled={!formData.country_id}
                  classNames={{ 
                    trigger: "border-[2px] border-black bg-gray-50",
                    label: "font-bold text-black text-sm"
                  }}
                >
                  {cities
                    .filter(c => c.country_id === parseInt(formData.country_id))
                    .map(c => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <Textarea
                name="description"
                label="Descripción"
                variant="bordered"
                radius="md"
                size="lg"
                minRows={5}
                isRequired
                value={formData.description}
                onChange={handleChange}
                classNames={{ 
                  inputWrapper: "border-[2px] border-black bg-gray-50",
                  label: "font-bold text-black text-sm"
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input
                  name="price"
                  type="number"
                  label="Precio (Opcional)"
                  startContent={<span className="text-default-500 font-bold">$</span>}
                  variant="bordered"
                  radius="md"
                  size="lg"
                  value={formData.price}
                  onChange={handleChange}
                  classNames={{ 
                    inputWrapper: "border-[2px] border-black bg-gray-50",
                    label: "font-bold text-black text-sm"
                  }}
                />
                
                <Input
                  name="duration_days"
                  type="number"
                  label="Días de duración"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  isRequired
                  value={formData.duration_days}
                  onChange={handleChange}
                  classNames={{ 
                    inputWrapper: "border-[2px] border-black bg-gray-50",
                    label: "font-bold text-black text-sm"
                  }}
                />
              </div>

              <div className="space-y-3">
                <input type="file" id="images-upload" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                <label 
                  htmlFor="images-upload"
                  className="border-[2px] border-black border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-default-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50 text-black" />
                  <span className="font-bold font-cuerpo text-black">Cambiar Fotos (Máx 5)</span>
                  <span className="text-xs mt-1 text-center font-bold text-woho-orange">Aviso: Si subes fotos nuevas, se reemplazarán todas las anteriores.</span>
                </label>

                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {previews.map((src, i) => (
                      <div key={i} className="aspect-square border-[2px] border-black rounded-lg overflow-hidden relative">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <Button 
                type="submit" 
                isLoading={isSubmitting} 
                className="w-full h-16 bg-woho-purple text-white font-titulo font-black text-xl uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Guardando Cambios..." : "Actualizar Anuncio"}
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditPost;

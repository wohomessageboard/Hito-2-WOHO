import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CardHeader, CardBody, Input, Button, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import SurfaceCard from '../components/ui/SurfaceCard';
import { MapPin, Target, Save, Image as ImageIcon, ArrowLeft } from '../components/ui/icons';
import api from '../config/api';
import { compressImages } from '../utils/compressImage';
import DurationField from '../components/ui/DurationField';

const EditPost = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useUser();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const [originalDays, setOriginalDays] = useState(0);
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
    duration_days: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (p.user_id !== currentUser?.id && currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
          alert("No tienes permiso para editar este aviso.");
          navigate('/profile');
          return;
        }

        setOriginalDays(Number(p.duration_days) || 0);
        setFormData({
          title: p.title || '',
          category_id: String(p.category_id || ''),
          country_id: String(p.country_id || ''),
          city_id: String(p.city_id || ''),
          description: p.description || '',
          duration_days: String(p.duration_days || '')
        });

        window.sessionStorage.setItem('last_post_title', p.title);

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

  const MAX_PHOTOS = 5;
  const [photoNotice, setPhotoNotice] = useState('');

  const handleFileChange = async (e) => {
    const chosen = Array.from(e.target.files);
    // El selector del teléfono no permite limitar la cantidad: nos quedamos con las primeras 5.
    const picked = chosen.slice(0, MAX_PHOTOS);
    setPhotoNotice(chosen.length > MAX_PHOTOS ? `Elegiste ${chosen.length} fotos. El máximo es ${MAX_PHOTOS}: usaremos las primeras ${MAX_PHOTOS}.` : '');
    // Se reducen antes de subir: las fotos del celular pesan varios MB.
    const files = await compressImages(picked);
    setSelectedFiles(files);

    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(files.map(file => URL.createObjectURL(file)));
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

      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formToSend.append('images', file);
        });
      }

      await api.put(`/posts/${id}`, formToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/profile', { state: { notice: '¡Aviso actualizado correctamente!' } });
    } catch (error) {
      console.error('Error al actualizar el aviso:', error);
      alert(
        error?.response?.status === 413
          ? 'Las fotos pesan demasiado en conjunto. Prueba con menos fotos o con imágenes más livianas.'
          : error?.response?.data?.error || 'Hubo un error al guardar los cambios.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p role="status" className="ws-mono p-20 text-center">Abriendo maleta del aviso…</p>;

  return (
    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      <SurfaceCard elevated className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-start px-6 pt-8 pb-4">
          <div className="flex justify-between w-full items-center mb-4">
            <Button variant="flat" size="sm" onPress={() => navigate(-1)} radius="sm" className="ws-pill ws-pill-line h-11 px-4">
               <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </Button>
          </div>
          <h1 className="font-display text-5xl md:text-6xl">
            Modificar publicación
          </h1>
        </CardHeader>

        <Divider className="bg-ws-ink" />

        <CardBody className="px-6 py-8">
          <form id="edit-post-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="space-y-4">
              <h2 className="font-display text-3xl text-ws-ink flex items-center gap-2">
                <Target className="w-5 h-5" /> ¿Qué quieres cambiar?
              </h2>
              
              <Input
                name="title"
                label="Título del aviso"
                placeholder="Ej: Busco compañero para alquilar en Sydney"
                variant="bordered"
                radius="sm"
                size="lg"
                isRequired
                value={formData.title}
                onChange={handleChange}
                classNames={{ 
                  inputWrapper: "ws-input-border",
                  label: "font-bold text-ws-ink text-sm"
                }}
              />

              <Select
                name="category_id"
                label="Categoría"
                variant="bordered"
                radius="sm"
                size="lg"
                isRequired
                selectedKeys={formData.category_id ? new Set([formData.category_id]) : new Set([])}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys)[0];
                  setFormData(prev => ({ ...prev, category_id: String(selectedValue) }));
                }}
                classNames={{ 
                  trigger: "ws-input-border",
                  label: "font-bold text-ws-ink text-sm"
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
              <h2 className="font-display text-3xl text-ws-ink flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Ubicación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  name="country_id"
                  label="País de destino"
                  variant="bordered"                  
                  radius="sm"
                  size="lg"
                  isRequired
                  selectedKeys={formData.country_id ? new Set([formData.country_id]) : new Set([])}
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0];
                    setFormData(prev => ({ ...prev, country_id: String(selectedValue), city_id: '' }));
                  }}
                  classNames={{ 
                    trigger: "ws-input-border",
                    label: "font-bold text-ws-ink text-sm"
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
                  radius="sm"
                  size="lg"
                  isRequired
                  selectedKeys={formData.city_id ? new Set([formData.city_id]) : new Set([])}
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0];
                    setFormData(prev => ({ ...prev, city_id: String(selectedValue) }));
                  }}
                  isDisabled={!formData.country_id}
                  classNames={{ 
                    trigger: "ws-input-border",
                    label: "font-bold text-ws-ink text-sm"
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
                radius="sm"
                size="lg"
                minRows={5}
                isRequired
                value={formData.description}
                onChange={handleChange}
                classNames={{ 
                  inputWrapper: "ws-input-border",
                  label: "font-bold text-ws-ink text-sm"
                }}
              />

              <div className="grid grid-cols-1 gap-4 mt-2">
                
                <DurationField label="Días de duración" value={formData.duration_days} onChange={handleChange} isAdmin={isAdmin} currentDays={originalDays} />
              </div>

              <div className="space-y-3">
                <input type="file" id="images-upload" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                <label 
                  htmlFor="images-upload"
                  className="border-2 border-ws-ink/30 border-dashed rounded-[8px] p-8 flex flex-col items-center justify-center bg-ws-paper-light text-ws-ink hover:bg-ws-mustard/30 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50 text-black" />
                  <span className="font-bold font-cuerpo text-black">Cambiar fotos (máx. 5)</span>
                  <span className="text-xs mt-1 text-center font-bold text-ws-tomato-deep">Aviso: Si subes fotos nuevas, se reemplazarán todas las anteriores.</span>
                </label>

                {photoNotice && (
                  <p role="status" className="bg-ws-citron rounded-[6px] p-3 text-sm font-bold">{photoNotice}</p>
                )}

                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {previews.map((src, i) => (
                      <div key={i} className="aspect-square ws-photo">
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
                className="ws-btn ws-btn-tomato w-full h-14 text-lg"
              >
                {isSubmitting ? "Guardando cambios..." : "Actualizar anuncio"}
              </Button>
            </div>

          </form>
        </CardBody>
      </SurfaceCard>
    </div>
  );
};

export default EditPost;

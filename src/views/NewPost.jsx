import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CardHeader, CardBody, Input, Button, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import SurfaceCard from '../components/ui/SurfaceCard';
import { MapPin, Target, Send, Image as ImageIcon, Whatsapp } from '../components/ui/icons';

import api from '../config/api';
import { compressImages } from '../utils/compressImage';
import DurationField from '../components/ui/DurationField';

const NewPost = () => {
  const { isAuthenticated, currentUser, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [catRes, countRes, cityRes] = await Promise.all([
          api.get('/categories'),
          api.get('/countries'),
          api.get('/cities')
        ]);
        setCategories(catRes.data);
        setCountries(countRes.data);
        setCities(cityRes.data);
      } catch (error) {
        console.error("Error cargando metadatos del formulario:", error);
      }
    };
    if (isAuthenticated) fetchSelectData();
  }, [isAuthenticated]);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // WhatsApp = único dato de contacto. Si aún no lo dejó, se pide aquí y se guarda en su perfil.
  const hasPhone = !!currentUser?.phone_whatsapp;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const [phone, setPhone] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
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
    setErrorMsg('');

    try {
      if (!hasPhone) {
        if (!phone.trim()) {
          setErrorMsg('Agrega tu WhatsApp: es el medio por el que te contactarán.');
          setIsSubmitting(false);
          return;
        }
        const me = await api.put('/users/me', { name: currentUser.name, phone_whatsapp: phone });
        login({ ...currentUser, ...me.data });
      }

      const formToSend = new FormData();
      formToSend.append('title', formData.title);
      formToSend.append('description', formData.description);
      formToSend.append('duration_days', formData.duration_days);
      
      if (formData.category_id) formToSend.append('category_id', formData.category_id);
      if (formData.country_id) formToSend.append('country_id', formData.country_id);
      if (formData.city_id) formToSend.append('city_id', formData.city_id);

      selectedFiles.forEach(file => {
        formToSend.append('images', file);
      });

      await api.post('/posts', formToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsSubmitting(false);
      navigate('/profile', { state: { notice: '¡Aviso publicado!' } });
    } catch (error) {
      console.error('Error publicando el aviso:', error);
      setErrorMsg(
        error.response?.status === 413
          ? 'Las fotos pesan demasiado en conjunto. Prueba con menos fotos o con imágenes más livianas.'
          : error.response?.data?.error || 'No pudimos publicar tu aviso. Revisa los datos e intenta de nuevo.'
      );
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (

    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      
      
      <SurfaceCard elevated className="w-full max-w-2xl flex flex-col overflow-visible">
        
        
        <CardHeader className="flex flex-col items-start px-6 pt-8 pb-4">
          <h1 className="font-display text-5xl md:text-6xl">
            Crear publicación
          </h1>
          <p className="font-cuerpo text-ws-ink/75 mt-2">
            Llena los datos a continuación para que la comunidad Driftler pueda encontrarte.
          </p>
        </CardHeader>

        <Divider className="bg-ws-ink" />

        <CardBody className="px-6 py-8">
          
          <form id="new-post-form" onSubmit={handleSubmit} className="flex flex-col gap-6">

            
            <div className="space-y-4">
              <h2 className="font-display text-3xl text-ws-ink flex items-center gap-2">
                <Target className="w-5 h-5" /> 1. ¿De qué se trata?
              </h2>
              
              <Input
                name="title"
                label="Título del aviso"
                placeholder="Ej: Busco compañero para alquilar en Sydney"
                labelPlacement="inside"
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
                placeholder="Selecciona una categoría"
                labelPlacement="inside"
                variant="bordered"
                radius="sm"
                size="lg"
                isRequired
                selectedKeys={formData.category_id ? [formData.category_id] : []}
                onChange={handleSelectChange}
                classNames={{ 
                  trigger: "ws-input-border",
                  label: "font-bold text-ws-ink text-sm"
                }}
              >
                
                {categories.map((cat) => (
                  <SelectItem key={cat.id || cat.key} value={cat.id || cat.key}>
                    {cat.name || cat.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            
            <div className="space-y-4 mt-4">
              <h2 className="font-display text-3xl text-ws-ink flex items-center gap-2">
                <MapPin className="w-5 h-5" /> 2. ¿Dónde estás o a dónde vas?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                
                <Select
                  name="country_id"
                  label="País de destino"
                  placeholder="Elige un destino"
                  labelPlacement="inside"
                  variant="bordered"                  
                  radius="sm"
                  size="lg"
                  isRequired
                  selectedKeys={formData.country_id ? [formData.country_id] : []}
                  onChange={handleSelectChange}
                  classNames={{ 
                    trigger: "ws-input-border",
                    label: "font-bold text-ws-ink text-sm"
                  }}
                >
                  {countries.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  name="city_id"
                  label="Ciudad o Región"
                  placeholder="Elige una ciudad"
                  labelPlacement="inside"
                  variant="bordered"
                  radius="sm"
                  size="lg"
                  isRequired
                  selectedKeys={formData.city_id ? [formData.city_id] : []}
                  onChange={handleSelectChange}
                  isDisabled={!formData.country_id}
                  classNames={{ 
                    trigger: "ws-input-border",
                    label: "font-bold text-ws-ink text-sm"
                  }}
                >
                  {cities
                    .filter(c => c.country_id === parseInt(formData.country_id))
                    .map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            
            <div className="space-y-4 mt-4">
              <h2 className="font-display text-3xl text-ws-ink flex items-center gap-2">
                <Send className="w-5 h-5" /> 3. Cuéntanos más
              </h2>
              <Textarea
                name="description"
                label="Descripción detallada"
                placeholder="Da información clara: fechas, presupuestos o requisitos..."
                labelPlacement="inside"
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
                
                
                <DurationField value={formData.duration_days} onChange={handleChange} isAdmin={isAdmin} />
              </div>

              
              <div className="space-y-3">
                <input 
                  type="file" 
                  id="images-upload" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <label 
                  htmlFor="images-upload"
                  className="border-2 border-ws-ink/30 border-dashed rounded-[8px] p-8 flex flex-col items-center justify-center bg-ws-paper-light text-ws-ink hover:bg-ws-mustard/30 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50 text-black" />
                  <span className="font-bold font-cuerpo text-black">Añadir fotos (máx. 5)</span>
                  <span className="text-xs mt-1">Sube fotos de alta calidad para destacar</span>
                </label>

                
                {photoNotice && (
                  <p role="status" className="bg-ws-citron rounded-[6px] p-3 text-sm font-bold">{photoNotice}</p>
                )}

                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {previews.map((src, i) => (
                      <div key={i} className="aspect-square ws-photo">
                        <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            const newFiles = selectedFiles.filter((_, idx) => idx !== i);
                            const newPrevs = previews.filter((_, idx) => idx !== i);
                            setSelectedFiles(newFiles);
                            setPreviews(newPrevs);
                          }}
                          className="absolute top-0 right-0 bg-ws-tomato text-ws-paper-light w-6 h-6 z-10 flex items-center justify-center text-xs font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


            <div className="space-y-4">
              <h2 className="font-display text-3xl text-ws-ink flex items-center gap-2">
                <Whatsapp className="w-5 h-5" /> 4. ¿Cómo te contactan?
              </h2>
              {hasPhone ? (
                <p className="font-cuerpo text-ws-ink/90 leading-relaxed">
                  Te escribirán por WhatsApp al <strong>{currentUser.phone_whatsapp}</strong>.{' '}
                  <Link to="/edit-profile" className="font-bold underline underline-offset-4">Cambiar número</Link>
                </p>
              ) : (
                <Input
                  name="phone_whatsapp"
                  type="tel"
                  label="Tu WhatsApp"
                  placeholder="+56 9 1234 5678"
                  labelPlacement="inside"
                  variant="bordered"
                  radius="sm"
                  size="lg"
                  isRequired
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  description="Con código de país. Es el único dato de contacto que compartimos: quien se interese abrirá un chat contigo. Tu correo nunca se muestra."
                  classNames={{ inputWrapper: "ws-input-border", label: "font-bold text-ws-ink text-sm", description: "text-ws-ink/75" }}
                />
              )}
            </div>

            {errorMsg && (
              <div role="alert" className="bg-ws-tomato/15 text-ws-ink rounded-[6px] p-3 text-sm font-bold">
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="mt-8">
              <Button
                type="submit"
                form="new-post-form"
                isLoading={isSubmitting} 
                className="ws-btn ws-btn-tomato w-full h-14 text-lg"
                endContent={!isSubmitting && <Send className="w-5 h-5 ml-2" />}
              >
                {isSubmitting ? "Lanzando aviso a la nube..." : "Publicar anuncio"}
              </Button>
            </div>

          </form>
        </CardBody>
      </SurfaceCard>
    </div>
  );
};

export default NewPost;

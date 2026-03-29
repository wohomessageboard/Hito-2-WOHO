import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Card, CardHeader, CardBody, Input, Button, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import { MapPin, Target, Send, Image as ImageIcon } from 'lucide-react';

// Importamos nuestra API real para extraer las categorías y países oficiales
import api from '../config/api';

const NewPost = () => {
  const { isAuthenticated, currentUser } = useUser();
  const navigate = useNavigate();

  // 1. Proteger la ruta: Si no está logueado, patada al inicio.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch Incial de Metadatos
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

  // 2. Estados locales del formulario adaptados a la NUEVA BASE DE DATOS SQL
  // Nota: Deberíamos guardar IDs numéricos, pero por ahora en nuestro prototipo usamos "strings" o "keys"
  // que luego el Backend convertirá. Ya añadimos 'price' y 'duration_days' como espera PostgreSQL.
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    country_id: '',
    city_id: '',
    description: '',
    price: '',
    duration_days: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Manejador de cambios (Actualiza el estado cuando escriben en un input)
  // [name] es dinámico, permite usar una sola función para todos los inputs según su atributo "name"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador específico para los <Select> de HeroUI (Categoría y País)
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Submit: Real conectado al backend PostgreSQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formToSend = new FormData();
      formToSend.append('title', formData.title);
      formToSend.append('description', formData.description);
      formToSend.append('duration_days', formData.duration_days);
      
      if (formData.category_id) formToSend.append('category_id', formData.category_id);
      if (formData.country_id) formToSend.append('country_id', formData.country_id);
      if (formData.city_id) formToSend.append('city_id', formData.city_id);

      await api.post('/posts', formToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsSubmitting(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error publicando el aviso:', error);
      setIsSubmitting(false);
      // Aquí se podría mostrar el texto de error devuelto por la API
    }
  };

  if (!currentUser) return null;

  return (
    // Contenedor general que centra un formulario de ancho restringido (max-w-2xl)
    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      
      {/* Tarjeta Neo-brutalista de contenedor */}
      <Card className="w-full max-w-2xl border-[2px] border-black rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-visible">
        
        {/* Cabecera del Formulario */}
        <CardHeader className="flex flex-col items-start px-6 pt-8 pb-4">
          <span className="text-woho-orange font-black uppercase tracking-widest text-sm mb-1">
            Nuevo Aviso
          </span>
          <h1 className="text-4xl font-titulo font-black text-black uppercase tracking-tighter leading-none">
            Crear Publicación
          </h1>
          <p className="font-cuerpo text-default-600 mt-2">
            Llena los datos a continuación para que la comunidad WOHO pueda encontrarte.
          </p>
        </CardHeader>

        <Divider className="bg-black opacity-20" />

        <CardBody className="px-6 py-8">
          {/* El Formulario: Al hacer 'submit', captura todo y ejecuta handleSubmit */}
          <form id="new-post-form" onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* SECCIÓN 1: QUÉ */}
            <div className="space-y-4">
              <h3 className="font-titulo font-extrabold text-xl text-woho-purple flex items-center gap-2">
                <Target className="w-5 h-5" /> 1. ¿De qué se trata?
              </h3>
              
              <Input
                name="title"
                label="Título del aviso"
                placeholder="Ej: Busco compañero para alquilar en Sydney"
                labelPlacement="inside"
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

              {/* El select ahora manda un category_id (que es un entero en BD, aunque aquí lo emulemos) */}
              <Select
                name="category_id"
                label="Categoría"
                placeholder="Selecciona una categoría"
                labelPlacement="inside"
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
                {/* categories en tu BD real tendrá IDs (1, 2, 3). Los pintamos aquí */}
                {categories.map((cat) => (
                  <SelectItem key={cat.id || cat.key} value={cat.id || cat.key}>
                    {cat.name || cat.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* SECCIÓN 2: DÓNDE (Adaptado a country_id) */}
            <div className="space-y-4 mt-4">
              <h3 className="font-titulo font-extrabold text-xl text-woho-orange flex items-center gap-2">
                <MapPin className="w-5 h-5" /> 2. ¿Dónde estás o a dónde vas?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Cambiado de INPUT Múltiple a SELECT para asegurar que elijan un country_id válido */}
                <Select
                  name="country_id"
                  label="País de destino"
                  placeholder="Elige un destino"
                  labelPlacement="inside"
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
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* SECCIÓN 3: DETALLES */}
            <div className="space-y-4 mt-4">
              <h3 className="font-titulo font-extrabold text-xl text-black flex items-center gap-2">
                <Send className="w-5 h-5" /> 3. Cuéntanos más
              </h3>
              <Textarea
                name="description"
                label="Descripción detallada"
                placeholder="Da información clara: fechas, presupuestos o requisitos..."
                labelPlacement="inside"
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

              {/* SECCIÓN NUEVA POSTGRESQL: PRECIO Y DURACIÓN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Campo PRECIO (DECIMAL) */}
                <Input
                  name="price"
                  type="number"
                  label="Precio (Opcional)"
                  startContent={
                    <div className="pointer-events-none flex items-center font-bold">
                      <span className="text-default-500 text-sm">$</span>
                    </div>
                  }
                  placeholder="0.00"
                  labelPlacement="inside"
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
                
                {/* Campo DURACIÓN (INTEGER) */}
                <Input
                  name="duration_days"
                  type="number"
                  label="Días de duración del aviso"
                  placeholder="Ej: 15"
                  labelPlacement="inside"
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

              {/* Falso Botón de Subida de Fotos para el prototipo */}
              <div className="border-[2px] border-black border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-default-500 hover:bg-gray-100 transition-colors cursor-pointer">
                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                <span className="font-bold font-cuerpo text-black">Añadir Fotos (Opcional)</span>
                <span className="text-xs mt-1">Arrastra y suelta imágenes aquí</span>
              </div>
            </div>

            {/* BOTÓN FINAL DE SUBMIT */}
            <div className="mt-8">
              <Button 
                type="submit" 
                form="new-post-form"
                isLoading={isSubmitting} // Si isSubmitting es true, muestra un spinner automáticamente
                className="w-full h-16 bg-woho-black text-white font-titulo font-black text-xl uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
                endContent={!isSubmitting && <Send className="w-5 h-5 ml-2" />}
              >
                {isSubmitting ? "Publicando Aviso..." : "Lanzar Publicación"}
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewPost;

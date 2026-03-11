import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Card, CardHeader, CardBody, Input, Button, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import { MapPin, Target, Send, Image as ImageIcon } from 'lucide-react';

// Importamos la "BD" para extraer las categorías oficiales
import db from '../data/db.json';

const NewPost = () => {
  const { isAuthenticated, currentUser } = useUser();
  const navigate = useNavigate();

  // 1. Proteger la ruta: Si no está logueado, patada al inicio.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 2. Estados locales del formulario (estas cajas guardan lo que el usuario escribe)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    country: '',
    city: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Manejador de cambios (Actualiza el estado cuando escriben en un input)
  // [name] es dinámico, permite usar una sola función para todos los inputs según su atributo "name"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador específico para el Select de HeroUI (que devuelve un objeto distinto)
  const handleSelectChange = (e) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  // 4. Submit: Qué pasa cuando aprietan "Publicar"
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulamos un retraso de "guardado en servidor"
    setTimeout(() => {
      console.log('Nuevo post generado por:', currentUser.name);
      console.log('Datos:', formData);
      
      // Tras "guardar", redirigiremos al Perfil para que pueda ver su nuevo aviso
      setIsSubmitting(false);
      navigate('/profile');
    }, 1500); // 1.5 segundos simulando red
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

              {/* El <Select> es nativo de la capa de HeroUI, usamos SelectItem para las opciones */}
              <Select
                name="category"
                label="Categoría"
                placeholder="Selecciona una categoría"
                labelPlacement="inside"
                variant="bordered"
                radius="md"
                size="lg"
                isRequired
                selectedKeys={formData.category ? [formData.category] : []}
                onChange={handleSelectChange} // Ojo: Select emite eventos extraños a veces, lo atajamos aquí
                classNames={{ 
                  trigger: "border-[2px] border-black bg-gray-50",
                  label: "font-bold text-black text-sm"
                }}
              >
                {db.categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* SECCIÓN 2: DÓNDE */}
            <div className="space-y-4 mt-4">
              <h3 className="font-titulo font-extrabold text-xl text-woho-orange flex items-center gap-2">
                <MapPin className="w-5 h-5" /> 2. ¿Dónde estás o a dónde vas?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="country"
                  label="País (o destino)"
                  placeholder="Ej: Nueva Zelanda"
                  labelPlacement="inside"
                  variant="bordered"                  
                  radius="md"
                  size="lg"
                  isRequired
                  value={formData.country}
                  onChange={handleChange}
                  classNames={{ 
                    inputWrapper: "border-[2px] border-black bg-gray-50",
                    label: "font-bold text-black text-sm"
                  }}
                />
                <Input
                  name="city"
                  label="Ciudad o Región"
                  placeholder="Ej: Auckland"
                  labelPlacement="inside"
                  variant="bordered"
                  radius="md"
                  size="lg"
                  isRequired
                  value={formData.city}
                  onChange={handleChange}
                  classNames={{ 
                    inputWrapper: "border-[2px] border-black bg-gray-50",
                    label: "font-bold text-black text-sm"
                  }}
                />
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

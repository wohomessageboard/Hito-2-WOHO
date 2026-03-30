// ============================================================
// VISTA: EDITAR PERFIL DE USUARIO (EditProfile.jsx)
// ============================================================
// Esta vista permite al usuario modificar su información personal.
// Incluye: nombre, avatar (foto), bio, Instagram, WhatsApp y Facebook.
//
// FLUJO DE DATOS:
// 1. Al cargar, toma los datos actuales del usuario desde el Contexto Global (UserContext)
// 2. Los pinta en un formulario controlado (cada input tiene su "value" atado al estado)
// 3. Al enviar, manda los datos de TEXTO a PUT /api/users/me
// 4. Si hay foto nueva, la envía por separado a POST /api/users/me/avatar (Cloudinary)
// 5. Actualiza el Contexto Global para que el cambio se refleje en TODA la app sin recargar
// ============================================================

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Avatar, Textarea } from '@heroui/react';
import { Camera, Instagram, User as UserIcon, Phone, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';  // Hook del Contexto Global de usuario
import api from '../config/api';                   // Instancia de Axios con baseURL del backend

const EditProfile = () => {
  // ---- HOOKS DE CONTEXTO Y NAVEGACIÓN ----
  const { currentUser, login, isAuthenticated } = useUser();
  // currentUser: Datos del usuario logueado (nombre, avatar, etc.)
  // login: Función para ACTUALIZAR los datos del usuario en el Contexto Global
  // isAuthenticated: Boolean que dice si hay sesión activa
  const navigate = useNavigate();

  // ---- ESTADO DEL FORMULARIO ----
  // Cada campo corresponde a una columna en la tabla "users" de PostgreSQL
  const [formData, setFormData] = useState({
    name: '',                // VARCHAR(100) NOT NULL
    bio: '',                 // TEXT - Biografía personal
    instagram_handle: '',    // VARCHAR(50) - Sin el @, ej: "lucasviajero"
    phone_whatsapp: '',      // VARCHAR(20) - Con código de país, ej: "+56 9 1234 5678"
    facebook_url: ''         // TEXT - URL completa del perfil de Facebook
  });
  
  // ---- ESTADO DE LA FOTO ----
  const [avatarPreview, setAvatarPreview] = useState(null);   // URL temporal para la vista previa
  const [fileToUpload, setFileToUpload] = useState(null);     // El archivo real (File object del input)
  const [isLoading, setIsLoading] = useState(false);          // Spinner del botón "Guardar"

  // ---- EFECTO: PRE-CARGAR DATOS ACTUALES DEL USUARIO ----
  // Cuando la vista se monta, rellenamos el formulario con los datos existentes del usuario.
  // Así, si solo quieres cambiar tu bio, los demás campos ya están llenos.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');  // Protección de ruta: si no hay sesión, al login
    } else if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        instagram_handle: currentUser.instagram_handle || '',
        phone_whatsapp: currentUser.phone_whatsapp || '',
        facebook_url: currentUser.facebook_url || ''
      });
      // Mostramos la foto actual como preview inicial
      setAvatarPreview(currentUser.avatar || null);
    }
  }, [isAuthenticated, currentUser, navigate]);

  // ---- HANDLER GENÉRICO DE CAMBIO (para todos los inputs de texto) ----
  // [e.target.name] es un "computed property name" de JavaScript.
  // Si el input tiene name="bio", esto hace: setFormData({...prev, bio: "nuevo valor"})
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---- HANDLER DE CAMBIO DE IMAGEN ----
  // Cuando el usuario selecciona un archivo desde su computadora:
  // 1. Guardamos el archivo real para enviarlo después al backend
  // 2. Creamos una URL temporal (blob) para mostrar la vista previa SIN necesidad de servidor
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Solo tomamos el primer archivo seleccionado
    if (file) {
      setFileToUpload(file);                           // Guardamos el File para el submit
      setAvatarPreview(URL.createObjectURL(file));     // URL.createObjectURL = Vista previa local
    }
  };

  // ---- HANDLER DE ENVÍO DEL FORMULARIO ----
  const handleSubmit = async (e) => {
    e.preventDefault();    // Evitar que el form recargue la página (comportamiento por defecto de HTML)
    setIsLoading(true);    // Activar el spinner del botón
    
    try {
      // ---- PASO 1: Enviar datos de texto al Backend (PUT /api/users/me) ----
      const payload = {
        name: formData.name,
        bio: formData.bio,
        instagram_handle: formData.instagram_handle,
        phone_whatsapp: formData.phone_whatsapp,
        facebook_url: formData.facebook_url
      };
      
      const res = await api.put('/users/me', payload);
      // Combinamos los datos del usuario actual con la respuesta del servidor
      // El spread (...) copia todas las propiedades y las de res.data sobrescriben las que cambiaron
      let updatedUserData = { ...currentUser, ...res.data };
      
      // ---- PASO 2: Si hay foto nueva, enviarla como FormData (multipart) ----
      if (fileToUpload) {
        const imgData = new FormData();
        // "avatar" es el nombre del campo que espera multer en el backend:
        // uploadAvatar.single('avatar') <-- busca este nombre exacto
        imgData.append('avatar', fileToUpload);
        
        // Axios detecta automáticamente que es un FormData y pone el Content-Type correcto:
        // Content-Type: multipart/form-data; boundary=----WebKitForm...
        const avatarRes = await api.post('/users/me/avatar', imgData);
        
        // El servidor nos devuelve la URL segura de Cloudinary (ej: https://res.cloudinary.com/...)
        updatedUserData.avatar = avatarRes.data.avatar;
      }
      
      // ---- PASO 3: Actualizar el Contexto Global ----
      // Esto hace que TODAS las vistas de la app (TopNav, Profile, PostCards)
      // vean los nuevos datos del usuario sin necesidad de recargar la página.
      login(updatedUserData);
      
      alert("¡Perfil actualizado con éxito!");
      navigate('/profile');  // Redirigir al perfil para ver los cambios

    } catch (error) {
      console.error('Error editando perfil:', error);
      
      // ---- MANEJO DE ERRORES ESPECÍFICOS ----
      // Extraemos el código HTTP y el mensaje del servidor para dar feedback útil al usuario
      const status = error?.response?.status;              // Ej: 413, 400, 401, 500
      const serverMsg = error?.response?.data?.error;      // Ej: "Formato no permitido"
      
      if (status === 413 || (serverMsg && serverMsg.includes('large'))) {
        alert('La imagen es demasiado pesada. Intenta con una menor a 5 MB.');
      } else if (status === 400) {
        alert(serverMsg || 'No se pudo procesar la imagen. Asegúrate de que sea JPG, PNG o WEBP.');
      } else if (status === 401) {
        alert('Tu sesión expiró. Cierra sesión, vuelve a entrar e intenta de nuevo.');
      } else {
        alert(`Error al actualizar: ${serverMsg || 'Verifica tu conexión o intenta con otra imagen.'}`);
      }
    } finally {
      setIsLoading(false);  // Desactivar spinner pase lo que pase
    }
  };

  // Si no hay usuario logueado, no renderizamos nada (evita parpadeos)
  if (!currentUser) return null;

  // ============================================================
  // RENDERIZADO JSX
  // ============================================================
  return (
    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      <Card className="w-full max-w-lg border-[2px] border-black rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          <h1 className="text-3xl font-titulo font-black text-black uppercase tracking-tighter leading-none mb-2">
            Ajustes de Perfil
          </h1>
          <p className="font-cuerpo text-default-600 text-center">
            Personaliza cómo te ven los demás viajeros en WOHO.
          </p>
        </CardHeader>
        
        <CardBody className="px-8 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* ---- COMPONENTE DE CAMBIO DE AVATAR ---- */}
            {/* Técnica: Un label invisible sobre el Avatar que abre el input[type=file] al hacer click */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <Avatar 
                  src={avatarPreview} 
                  name={currentUser.name} 
                  className="w-24 h-24 border-2 border-black bg-gray-100 text-3xl font-bold" 
                />
                {/* Overlay que aparece al pasar el mouse (group-hover:opacity-100) */}
                <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Cambiar</span>
                  {/* Input oculto: el verdadero selector de archivos */}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            {/* ---- CAMPO: NOMBRE ---- */}
            <Input
              name="name"
              label="Nombre visible"
              placeholder="Ej. Lucas Viajero"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={formData.name}
              onChange={handleChange}
              startContent={<UserIcon className="text-xl text-default-400 font-bold mr-2" />}
              classNames={{ inputWrapper: "border-[2px] border-black", label: "font-bold text-black text-sm" }}
              isRequired
            />

            {/* ---- CAMPO: INSTAGRAM ---- */}
            <Input
              name="instagram_handle"
              label="Usuario de Instagram (Opcional)"
              placeholder="@tu_usuario"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={formData.instagram_handle}
              onChange={handleChange}
              startContent={<Instagram className="text-xl text-default-400 font-bold mr-2" />}
              classNames={{ inputWrapper: "border-[2px] border-black", label: "font-bold text-black text-sm" }}
            />

            {/* ---- CAMPO: WHATSAPP / TELÉFONO ---- */}
            <Input
              name="phone_whatsapp"
              label="WhatsApp / Teléfono (Opcional)"
              placeholder="+56 9 1234 5678"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={formData.phone_whatsapp}
              onChange={handleChange}
              startContent={<Phone className="text-xl text-default-400 font-bold mr-2" />}
              classNames={{ inputWrapper: "border-[2px] border-black", label: "font-bold text-black text-sm" }}
            />

            {/* ---- CAMPO: FACEBOOK ---- */}
            <Input
              name="facebook_url"
              label="Enlace de Facebook (Opcional)"
              placeholder="https://facebook.com/tu_perfil"
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              value={formData.facebook_url}
              onChange={handleChange}
              startContent={<Facebook className="text-xl text-default-400 font-bold mr-2" />}
              classNames={{ inputWrapper: "border-[2px] border-black", label: "font-bold text-black text-sm" }}
            />

            {/* ---- CAMPO: BIOGRAFÍA (Textarea para texto largo) ---- */}
            <Textarea
              name="bio"
              label="Biografía / Acerca de ti"
              placeholder="Cuéntale a la comunidad quién eres, de dónde vienes y qué buscas..."
              labelPlacement="inside"
              variant="bordered"
              radius="md"
              minRows={4}
              value={formData.bio}
              onChange={handleChange}
              classNames={{ inputWrapper: "border-[2px] border-black", label: "font-bold text-black text-sm" }}
            />

            {/* ---- BOTONES DE ACCIÓN ---- */}
            <div className="pt-4 flex gap-4">
              <Button as="button" type="button" onClick={() => navigate('/profile')} variant="flat" radius="md" className="w-1/3 border-2 border-black font-bold">
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading} variant="solid" radius="md" className="w-2/3 bg-woho-purple text-white font-bold tracking-wider">
                Guardar Cambios
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfile;

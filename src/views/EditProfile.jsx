import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Avatar, Textarea } from '@heroui/react';
import { Camera, Instagram, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../config/api';

const EditProfile = () => {
  const { currentUser, login, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Estados del formulario correspondientes al CRUD (bio e instagram deberán agregarse al backend)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    instagram_handle: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        instagram_handle: currentUser.instagram_handle || ''
      });
      setAvatarPreview(currentUser.avatar || null);
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Enviar datos de texto al Backend (PUT /api/users/me)
      const payload = {
        name: formData.name,
        bio: formData.bio,
        instagram_handle: formData.instagram_handle
      };
      
      const res = await api.put('/users/me', payload);
      let updatedUserData = { ...currentUser, ...res.data };
      
      // 2. Si hay foto, enviarla al endpoint de subida (POST /api/users/me/avatar) con FormData
      if (fileToUpload) {
        const imgData = new FormData();
        imgData.append('avatar', fileToUpload);
        
        // Axios es inteligente, al ver FormData cambia automáticamente el Content-Type multipart/form-data
        const avatarRes = await api.post('/users/me/avatar', imgData);
        
        // El servidor nos devuelve la URL oficial que Cloudinary nos regaló
        updatedUserData.avatar = avatarRes.data.avatar;
      }
      
      // Actualizar contexto global con la Data compilada y oficial
      login(updatedUserData);
      
      alert("¡Perfil actualizado con éxito!");
      navigate('/profile');
    } catch (error) {
      console.error('Error editando perfil:', error);
      alert("Hubo un error al actualizar tu perfil o foto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

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
            
            {/* Componente de Cambio de Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <Avatar 
                  src={avatarPreview} 
                  name={currentUser.name} 
                  className="w-24 h-24 border-2 border-black bg-gray-100 text-3xl font-bold" 
                />
                <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Cambiar</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

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

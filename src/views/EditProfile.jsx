

import React, { useState, useEffect } from 'react';
import { CardHeader, CardBody, Input, Button, Avatar, Textarea } from '@heroui/react';
import SurfaceCard from '../components/ui/SurfaceCard';
import { Camera, User as UserIcon, Whatsapp } from '../components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';  
import api from '../config/api';
import { compressImage } from '../utils/compressImage';
import DeleteAccount from '../components/ui/DeleteAccount';                   

const EditProfile = () => {

  const { currentUser, login, isAuthenticated } = useUser();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',                
    bio: '',                 
    phone_whatsapp: '',      
  });

  const [avatarPreview, setAvatarPreview] = useState(null);   
  const [fileToUpload, setFileToUpload] = useState(null);     
  const [isLoading, setIsLoading] = useState(false);          
  // Estado de la subida de la foto: la foto se sube al elegirla, sin esperar a «Guardar cambios».
  const [avatarStatus, setAvatarStatus] = useState({ kind: '', text: '' });


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');   
    } else if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        phone_whatsapp: currentUser.phone_whatsapp || ''
      });

      setAvatarPreview(currentUser.avatar || null);
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const picked = e.target.files[0];
    const file = picked ? await compressImage(picked) : null;
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setFileToUpload(file);
    setAvatarStatus({ kind: 'busy', text: 'Subiendo tu foto…' });
    try {
      const imgData = new FormData();
      imgData.append('avatar', file);
      const avatarRes = await api.post('/users/me/avatar', imgData);
      login({ ...currentUser, avatar: avatarRes.data.avatar });
      setFileToUpload(null);   // ya está subida: «Guardar cambios» no la vuelve a enviar
      setAvatarStatus({ kind: 'ok', text: 'Foto actualizada.' });
    } catch (err) {
      const status = err?.response?.status;
      const text = status === 413 ? 'La foto pesa demasiado. Prueba con otra más liviana.'
        : status === 401 ? 'Tu sesión expiró. Cierra sesión, vuelve a entrar e inténtalo de nuevo.'
        : err?.response?.data?.error || 'No pudimos subir la foto. Se intentará de nuevo al guardar.';
      setAvatarStatus({ kind: 'error', text });   // fileToUpload se conserva: «Guardar cambios» lo reintenta
    }
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    setIsLoading(true);    
    
    try {

      const payload = {
        name: formData.name,
        bio: formData.bio,
        phone_whatsapp: formData.phone_whatsapp
      };
      
      const res = await api.put('/users/me', payload);

      let updatedUserData = { ...currentUser, ...res.data };

      if (fileToUpload) {
        const imgData = new FormData();

        imgData.append('avatar', fileToUpload);

        const avatarRes = await api.post('/users/me/avatar', imgData);

        updatedUserData.avatar = avatarRes.data.avatar;
      }

      login(updatedUserData);
      
      navigate('/profile', { state: { notice: '¡Perfil actualizado con éxito!' } });   

    } catch (error) {
      console.error('Error editando perfil:', error);

      const status = error?.response?.status;              
      const serverMsg = error?.response?.data?.error;      
      
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
      setIsLoading(false);  
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex justify-center w-full px-4 py-8 md:py-12">
      <SurfaceCard elevated className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          <h1 className="font-display text-5xl md:text-6xl mb-2">
            Ajustes de Perfil
          </h1>
          <p className="font-cuerpo text-ws-ink/75 text-center">
            Personaliza cómo te ven los demás viajeros en Driftler.
          </p>
        </CardHeader>
        
        <CardBody className="px-8 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            
            
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <Avatar 
                  src={avatarPreview} 
                  name={currentUser.name} 
                  className="w-24 h-24 bg-ws-paper-deep text-3xl font-bold" 
                />
                
                <label className="absolute inset-0 bg-ws-ink/60 text-ws-paper-light rounded-[6px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Cambiar</span>
                  
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p
                role="status"
                className={`text-sm font-bold font-cuerpo min-h-5 ${avatarStatus.kind === 'error' ? 'text-ws-tomato-deep' : avatarStatus.kind === 'ok' ? 'text-ws-olive' : 'text-ws-ink/75'}`}
              >
                {avatarStatus.text}
              </p>
            </div>

            
            <Input
              name="name"
              label="Nombre visible"
              placeholder="Ej. Lucas Viajero"
              labelPlacement="inside"
              variant="bordered"
              radius="sm"
              value={formData.name}
              onChange={handleChange}
              startContent={<UserIcon className="text-xl text-ws-ink/60 font-bold mr-2" />}
              classNames={{ inputWrapper: "ws-input-border", label: "font-bold text-ws-ink text-sm" }}
              isRequired
            />

            
            <Input
              name="phone_whatsapp"
              label="WhatsApp de contacto"
              placeholder="+56 9 1234 5678"
              type="tel"
              description="Con código de país. Es el único dato de contacto que compartimos: se usa cuando alguien pulsa «Escribir por WhatsApp» en tus avisos. Tu correo nunca se muestra. Para publicar necesitas dejarlo."
              labelPlacement="inside"
              variant="bordered"
              radius="sm"
              value={formData.phone_whatsapp}
              onChange={handleChange}
              startContent={<Whatsapp className="text-xl text-ws-ink/60 font-bold mr-2" />}
              classNames={{ inputWrapper: "ws-input-border", label: "font-bold text-ws-ink text-sm" }}
            />

            
            <Textarea
              name="bio"
              label="Biografía / Acerca de ti"
              placeholder="Cuéntale a la comunidad quién eres, de dónde vienes y qué buscas..."
              labelPlacement="inside"
              variant="bordered"
              radius="sm"
              minRows={4}
              value={formData.bio}
              onChange={handleChange}
              classNames={{ inputWrapper: "ws-input-border", label: "font-bold text-ws-ink text-sm" }}
            />

            
            <div className="pt-4 flex gap-4">
              <Button as="button" type="button" onClick={() => navigate('/profile')} variant="flat" radius="sm" className="ws-pill ws-pill-line w-1/3 h-12">
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading} variant="solid" radius="sm" className="ws-btn ws-btn-tomato w-2/3">
                Guardar cambios
              </Button>
            </div>

          </form>

          <DeleteAccount />
        </CardBody>
      </SurfaceCard>
    </div>
  );
};

export default EditProfile;

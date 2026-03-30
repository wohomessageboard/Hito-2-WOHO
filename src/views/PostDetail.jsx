import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Avatar, Divider, Chip } from '@heroui/react';
import { ArrowLeft, Lock, MapPin, Calendar, Share2, AlertCircle } from 'lucide-react';
import api from '../config/api';
import { useUser } from '../context/UserContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useUser();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);

        window.sessionStorage.setItem('last_post_title', res.data.title);
      } catch (error) {
        console.error("Error al cargar el aviso", error);
        setPost(null); // Fuerzo la caída al 404
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return <div className="p-20 text-center font-bold text-xl">Abriendo anuncio...</div>;
  }
  
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-4xl font-black uppercase mb-4">Aviso extraviado</h1>
        <p className="font-cuerpo text-lg mb-8">El anuncio que buscas ya no existe o fue eliminado.</p>
        <Button onPress={() => navigate(-1)} className="bg-black text-white px-6">Volver atrás</Button>
      </div>
    );
  }

  const owner = post.owner || { id: post.user_id, name: post.author_name || "Viajero Oculto", avatar: post.author_avatar || null };
  const isMyPost = currentUser?.id === post.user_id;
  const isPublicViewer = !isAuthenticated;

  const type = post.type || post.category_name;
  const country = post.country || post.country_name;
  const city = post.city || post.city_name;
  const expiresInDays = post.expires_at ? Math.max(0, Math.ceil((new Date(post.expires_at) - new Date()) / (1000*60*60*24))) : post.duration_days || null;

  let typeColor = "text-woho-purple bg-purple-50 border-purple-200";
  if (type === "Trabajo") typeColor = "text-woho-orange bg-orange-50 border-orange-200";
  if (type === "Social") typeColor = "text-green-600 bg-green-50 border-green-200";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      
      
      <div className="flex">
        <Button 
          variant="flat" 
          onPress={() => navigate(-1)}
          className="font-titulo font-bold border-[2px] border-black bg-white hover:bg-gray-100 transition-transform hover:-translate-y-1"
          startContent={<ArrowLeft className="w-5 h-5" />}
        >
          Volver
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          
          <div className="bg-white border-[3px] border-black rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-titulo font-black text-black leading-none tracking-tighter">
                {post.title}
              </h1>

              <div className="flex items-center gap-2 flex-wrap">
                <Chip variant="flat" className={`font-bold border-[2px] ${typeColor} text-xs uppercase tracking-widest`}>
                  {type}
                </Chip>
                {post.expiresInDays <= 5 && post.expiresInDays > 0 && (
                  <Chip color="danger" variant="flat" size="sm" className="font-bold border-[2px] border-red-200 text-xs">
                    Expira pronto ({post.expiresInDays} días)
                  </Chip>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-default-600 font-cuerpo font-bold">
                <span className="flex items-center gap-1 text-black bg-gray-100 px-3 py-1 rounded-full border-[1.5px] border-black text-sm">
                  <MapPin className="w-4 h-4" /> {country}, {city} {post.flag}
                </span>
                {expiresInDays !== null && (
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full border-[1.5px] text-sm font-bold ${
                    expiresInDays <= 2 ? 'bg-red-50 border-red-300 text-red-600' : expiresInDays <= 5 ? 'bg-orange-50 border-orange-300 text-orange-600' : 'bg-green-50 border-green-300 text-green-600'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    {expiresInDays === 0 ? '¡Expira hoy!' : `Expira en ${expiresInDays} días`}
                  </span>
                )}
              </div>
            </div>

            <Divider className="bg-black opacity-20" />

            <div className="font-cuerpo text-lg text-default-800 leading-relaxed whitespace-pre-wrap">
              {post.description}
            </div>
            
          </div>

          
          {(() => {
            let displayImages = [];
            try {
              displayImages = typeof post.images === "string" ? JSON.parse(post.images) : post.images;
            } catch (e) {
              displayImages = [];
            }
            
            if (!Array.isArray(displayImages) || displayImages.length === 0) return null;

            return (
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-xl font-titulo font-black uppercase text-black">Material Audiovisual</h3>
                
                <div className="w-full aspect-video rounded-xl border-[4px] border-black overflow-hidden bg-gray-100">
                  <img src={displayImages[0]} alt="Principal" className="w-full h-full object-cover" />
                </div>
                
                {displayImages.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {displayImages.slice(1).map((imgUrl, idx) => (
                      <div key={idx} className="aspect-square rounded-lg border-[2px] border-black overflow-hidden bg-gray-50 hover:scale-[1.02] transition-transform cursor-pointer">
                        <img src={imgUrl} alt={`Detalle ${idx+1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        </div>

        
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-24">
          
          
          <div className="bg-woho-black text-white border-[3px] border-black rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">

            <div className="relative z-10 flex flex-col items-center">
              {isPublicViewer ? (
                <Avatar className="w-24 h-24 text-large border-[3px] border-dashed border-gray-500 bg-gray-800 mb-4" />
              ) : (
                <Avatar src={owner?.avatar} className="w-24 h-24 text-large border-[3px] border-white bg-white mb-4" />
              )}
              
              <h3 className="text-2xl font-titulo font-black tracking-tight mb-1">
                {isMyPost ? "Es tu propio aviso" : (isPublicViewer ? "Viajero Protegido" : (owner?.name || "Anónimo"))}
              </h3>
              
              <p className="text-sm font-cuerpo opacity-80 mb-6">
                {isPublicViewer ? "Identidad oculta por seguridad." : "Miembro de la comunidad WOHO."}
              </p>

              <div className="w-full flex flex-col gap-3">
                {isMyPost ? (

                  <Button as={Link} to={`/edit-post/${post.id}`} className="w-full h-12 font-bold bg-white text-black border-2 border-black hover:bg-gray-200">
                    Editar mi publicación
                  </Button>
                ) : (

                  <>
                    
                    {isAuthenticated ? (
                      !showContact ? (
                        <Button 
                          onPress={() => setShowContact(true)}
                          className="w-full h-14 font-titulo font-black uppercase tracking-widest text-lg bg-woho-orange text-black border-[3px] border-black hover:-translate-y-1 transition-transform"
                        >
                           Contactar
                        </Button>
                      ) : (
                        <div className="w-full bg-white border-[3px] border-black p-4 rounded-xl flex flex-col items-center gap-2">
                          <p className="text-black font-titulo font-black text-sm uppercase">Detalles de Contacto</p>
                          <Divider className="bg-black opacity-20 my-1" />
                          <p className="text-black font-cuerpo font-bold w-full text-center truncate">
                            📧 {owner?.email || 'No especifica Correo'}
                          </p>
                          <p className="text-black font-cuerpo font-bold w-full text-center truncate">
                            📞 {owner?.phone || 'No especifica Teléfono'}
                          </p>
                        </div>
                      )
                    ) : (
                      <Button as={Link} to="/login" variant="flat" className="w-full h-14 font-titulo font-bold text-md bg-gray-800 text-gray-400 border-[2px] border-dashed border-gray-500">
                         Inicia sesión para escribirle
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          
          <div className="bg-white border-[3px] border-black rounded-xl p-4 flex flex-col gap-2">
            <h4 className="font-titulo font-black text-black">Acciones Adicionales</h4>
            <div className="flex gap-2">
              <Button variant="flat" className="flex-1 font-bold border-[2px] border-black bg-gray-50 hover:bg-gray-100" startContent={<Share2 className="w-4 h-4" />}>
                Compartir
              </Button>
              <Button variant="flat" className="flex-1 font-bold border-[2px] border-black bg-red-50 text-red-600 hover:bg-red-100" startContent={<AlertCircle className="w-4 h-4" />}>
                Reportar
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PostDetail;

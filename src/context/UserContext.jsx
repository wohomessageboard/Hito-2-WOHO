import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // Bloqueo visual inicial para la Sesión

  const [savedPostIds, setSavedPostIds] = useState([]);
  const [followedCountryIds, setFollowedCountryIds] = useState([]);

  useEffect(() => {
    if (currentUser) {
      api.get('/users/me/favorites')
        .then(res => {
          setSavedPostIds(res.data.map(fav => fav.post_id || fav.id));
        })
        .catch(err => console.log('Error trayendo favs globales:', err));

        api.get('/users/me/follows')
        .then(res => {
          setFollowedCountryIds(res.data.map(f => f.country_id));
        })
        .catch(err => console.log('Error trayendo países seguidos:', err));
    } else {
      setSavedPostIds([]);
      setFollowedCountryIds([]);
    }
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(res => setCurrentUser(res.data))
        .catch(err => {
          console.error('La sesión expiró o el token es inválido.');
          localStorage.removeItem('token');
        })
        .finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, []);

  const toggleSavedPostId = (postId) => {
    if (savedPostIds.includes(postId)) {
      setSavedPostIds(prev => prev.filter(id => id !== postId));
    } else {
      setSavedPostIds(prev => [...prev, postId]);
    }
  };

  const toggleFollowedCountryId = (countryId) => {
    if (followedCountryIds.includes(countryId)) {
      setFollowedCountryIds(prev => prev.filter(id => id !== countryId));
    } else {
      setFollowedCountryIds(prev => [...prev, countryId]);
    }
  };

  const login = (user) => setCurrentUser(user);

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;

  const sanitizedUser = currentUser ? {
    ...currentUser,
    name: String(currentUser.name || ""),
    avatar: currentUser.avatar ? String(currentUser.avatar) : null,
    bio: currentUser.bio ? String(currentUser.bio) : "",
    instagram_handle: currentUser.instagram_handle ? String(currentUser.instagram_handle) : "",
    phone_whatsapp: currentUser.phone_whatsapp ? String(currentUser.phone_whatsapp) : "",
    facebook_url: currentUser.facebook_url ? String(currentUser.facebook_url) : ""
  } : null;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-woho-black flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl text-white font-titulo font-black uppercase mb-4 animate-pulse">Desempacando la mochila...</h1>
        <div className="w-16 h-16 border-4 border-white border-t-woho-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  return (

    <UserContext.Provider value={{ 
      currentUser: sanitizedUser, isAuthenticated, login, logout, 
      savedPostIds, toggleSavedPostId,
      followedCountryIds, toggleFollowedCountryId
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe utilizarse dentro de un UserProvider');
  }
  return context;
};

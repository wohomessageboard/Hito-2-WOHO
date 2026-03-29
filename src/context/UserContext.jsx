import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

// 1. Creamos el Contexto en sí. Es como una "caja fuerte" global que guardará 
// la información del usuario y todas las pantallas podrán abrirla para leer.
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 2. Estado local para saber quién es el usuario.
  // Inicializamos en 'null' para que la app arranque en "Modo Público" (nadie ha iniciado sesión).
  const [currentUser, setCurrentUser] = useState(null);
  
  // Arreglo global con IDs de posts favoritos y países seguidos
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [followedCountryIds, setFollowedCountryIds] = useState([]);

  // Si se detecta un usuario, ir a la Base de Datos y cargar sus favoritos y seguimientos
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

  // Método Optimista Favoritos
  const toggleSavedPostId = (postId) => {
    if (savedPostIds.includes(postId)) {
      setSavedPostIds(prev => prev.filter(id => id !== postId));
    } else {
      setSavedPostIds(prev => [...prev, postId]);
    }
  };

  // Método Optimista Follows
  const toggleFollowedCountryId = (countryId) => {
    if (followedCountryIds.includes(countryId)) {
      setFollowedCountryIds(prev => prev.filter(id => id !== countryId));
    } else {
      setFollowedCountryIds(prev => [...prev, countryId]);
    }
  };

  // 3. Funciones de ayuda
  // Simula el Iniciar Sesión: toma un usuario de mentira y lo guarda en el estado.
  const login = (user) => setCurrentUser(user);
  
  // Simula el Cerrar Sesión: borra al usuario devolviendo el estado a 'null'.
  const logout = () => setCurrentUser(null);

  // 4. Variable rápida booleana (true/false) para saber de un vistazo si hay sesión
  const isAuthenticated = !!currentUser;

  return (
    // 5. El Provider envuelve a {children} (toda nuestra app).
    // Exportamos en el 'value' todo lo que otras pantallas puedan necesitar.
    <UserContext.Provider value={{ 
      currentUser, isAuthenticated, login, logout, 
      savedPostIds, toggleSavedPostId,
      followedCountryIds, toggleFollowedCountryId
    }}>
      {children}
    </UserContext.Provider>
  );
};

// 6. Creamos un "Hook" personalizado súper fácil de usar.
// En vez de tener que importar useContext y UserContext en cada archivo, 
// simplemente importaremos 'useUser()' y nos dará toda la info.
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe utilizarse dentro de un UserProvider');
  }
  return context;
};

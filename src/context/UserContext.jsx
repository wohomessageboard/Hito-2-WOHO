import React, { createContext, useContext, useState } from 'react';

// 1. Creamos el Contexto en sí. Es como una "caja fuerte" global que guardará 
// la información del usuario y todas las pantallas podrán abrirla para leer.
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 2. Estado local para saber quién es el usuario.
  // Inicializamos en 'null' para que la app arranque en "Modo Público" (nadie ha iniciado sesión).
  const [currentUser, setCurrentUser] = useState(null);

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
    <UserContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
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

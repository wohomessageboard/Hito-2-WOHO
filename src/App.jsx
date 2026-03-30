import { HeroUIProvider } from '@heroui/react';
// Enrutamiento de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout principal que engloba a todas las rutas debajo (tiene Navbar y Footer)
import MainLayout from './layouts/MainLayout';
// Vistas de la aplicación
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import Feed from './views/Feed';
import Countries from './views/Countries';
import CountryFeed from './views/CountryFeed';
import NewPost from './views/NewPost';
import PostDetail from './views/PostDetail';
import EditPost from './views/EditPost';
import EditProfile from './views/EditProfile';
import UnderConstruction from './views/UnderConstruction';
import UIKit from './views/UIKit';
import Manifiesto from './views/Manifiesto';
import AdminDashboard from './views/AdminDashboard';
// Contexto para manejar el estado del usuario logueado en cualquier ruta
import { UserProvider } from './context/UserContext';

function App() {
  return (
    // 1. HeroUIProvider: Entrega la librería de estilos (Tailwind subyacente) a toda la App
    <HeroUIProvider>
      {/* 2. UserProvider: Nuestra "caja fuerte" de información global. */}
      {/* Cualquier pantalla dentro de aquí sabrá si hay alguien logueado. */}
      <UserProvider>
        {/* 3. BrowserRouter: Enciende la navegación en el navegador (las URL). */}
        <BrowserRouter>
          <Routes>
            {/* Ruta independiente para el UI Kit, desconectada del MainLayout */}
            <Route path="/uikit" element={<UIKit />} />

            {/* 4. Ruta Padre (Layout). Lo que pongas aquí envuelve a las Rutas Hijas */}
            {/* Es decir, MainLayout inyecta TopNav y Footer, y el resto entra "al medio" */}
            <Route element={<MainLayout />}>
              
              {/* Rutas Públicas */}
              {/* Si entras a "tusitio.com/", se dibuja Home */}
              <Route path="/" element={<Home />} />
              {/* El Explorador General y de Países son públicos */}
              <Route path="/feed" element={<Feed />} />
              <Route path="/destinos" element={<Countries />} />
              <Route path="/destinos/:countryName" element={<CountryFeed />} />
              <Route path="/manifiesto" element={<Manifiesto />} />
              {/* Vista de Detalle de Anuncio */}
              <Route path="/post/:id" element={<PostDetail />} />
              
              {/* Si entras a "tusitio.com/login", se dibuja Login */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Ruta Protegida: El Perfil */}
              {/* Profile tiene su propia seguridad interna que te patea si no estás logueado */}
              <Route path="/profile" element={<Profile />} />
              {/* Crear Post también patea a anónimos */}
              <Route path="/new-post" element={<NewPost />} />
              
              {/* Ruta SuperAdmin (Pantalla Administrativa general protegida por Contexto) */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* Rutas en construcción / Habilitadas */}
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </HeroUIProvider>
  )
}

export default App;

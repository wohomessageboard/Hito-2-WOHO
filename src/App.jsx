import { HeroUIProvider } from '@heroui/react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

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

import { UserProvider } from './context/UserContext';

function App() {
  return (

    <HeroUIProvider>
      
      
      <UserProvider>
        
        <BrowserRouter>
          <Routes>
            
            <Route path="/uikit" element={<UIKit />} />

            
            
            <Route element={<MainLayout />}>
              
              
              
              <Route path="/" element={<Home />} />
              
              <Route path="/feed" element={<Feed />} />
              <Route path="/destinos" element={<Countries />} />
              <Route path="/destinos/:countryName" element={<CountryFeed />} />
              <Route path="/manifiesto" element={<Manifiesto />} />
              
              <Route path="/post/:id" element={<PostDetail />} />
              
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              
              
              <Route path="/profile" element={<Profile />} />
              
              <Route path="/new-post" element={<NewPost />} />
              
              
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              
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

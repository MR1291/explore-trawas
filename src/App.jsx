import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import mainBg from './assets/main-bg.jpg';

// Pages
import Home from './pages/Home';
import VillageDetail from './pages/VillageDetail';
import DestinationDetail from './pages/DestinationDetail';
import AllDestinations from './pages/AllDestinations';
import InteractiveMap from './pages/InteractiveMap';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

import './App.css';

// Public layout wrapper with website navigation, footer, and 60% transparent pine forest background
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 font-sans relative overflow-x-hidden">
      {/* Fixed Fullscreen Background Image with 60% Opacity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={mainBg}
          alt="Forest Canopy Background"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1.5px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/desa/:slug" element={<VillageDetail />} />
            <Route path="/destinasi/:slug" element={<DestinationDetail />} />
            <Route path="/destinasi" element={<AllDestinations />} />
            <Route path="/peta" element={<InteractiveMap />} />
            <Route path="/favorit" element={<Favorites />} />
          </Route>

          {/* Dedicated Separate Admin Routes (No public navbar/footer) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

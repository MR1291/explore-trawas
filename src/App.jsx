import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

// Public layout wrapper with website navigation, footer, and elegant Ivory White (Putih Gading) background
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-slate-800 font-sans relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
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

          {/* Dedicated Separate Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

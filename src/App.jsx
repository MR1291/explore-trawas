import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import VillageDetail from './pages/VillageDetail';
import DestinationDetail from './pages/DestinationDetail';
import AllDestinations from './pages/AllDestinations';
import InteractiveMap from './pages/InteractiveMap';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
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
            <Route path="/favorit" element={<Navigate to="/profil" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profil" element={<UserProfile />} />
          </Route>

          {/* Dedicated Separate Admin Routes (Protected from public navigation) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

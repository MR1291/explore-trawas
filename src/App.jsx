import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/desa/:slug" element={<VillageDetail />} />
              <Route path="/destinasi/:slug" element={<DestinationDetail />} />
              <Route path="/destinasi" element={<AllDestinations />} />
              <Route path="/peta" element={<InteractiveMap />} />
              <Route path="/favorit" element={<Favorites />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

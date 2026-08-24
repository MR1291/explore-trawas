import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Compass, Coffee, Utensils, Sparkles, Navigation, Star } from 'lucide-react';
import L from 'leaflet';

const InteractiveMap = () => {
  const { destinations } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('semua');
  const navigate = useNavigate();

  // Trawas central coordinates
  const centralPosition = [-7.6749, 112.6318];

  const filteredDestinations = activeCategory === 'semua'
    ? destinations
    : destinations.filter(d => d.category === activeCategory);

  // Custom Tailwind CSS-based markers to avoid icon asset path issues
  const getCustomMarkerIcon = (category) => {
    let bgColor = 'bg-emerald-600';
    let iconSymbol = '🏞️';

    if (category === 'kafe') {
      bgColor = 'bg-amber-600';
      iconSymbol = '☕';
    } else if (category === 'kuliner') {
      bgColor = 'bg-rose-600';
      iconSymbol = '🍽️';
    } else if (category === 'hidden-gem') {
      bgColor = 'bg-indigo-600';
      iconSymbol = '💎';
    }

    return L.divIcon({
      className: 'custom-marker-div',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-lg text-sm text-white transform hover:scale-110 transition-transform">
          <span>${iconSymbol}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const categories = [
    { id: 'semua', label: 'Semua Kategori', icon: Compass, color: 'border-slate-200 text-slate-700 bg-slate-50' },
    { id: 'wisata', label: 'Wisata Alam', icon: Compass, color: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
    { id: 'kafe', label: 'Kafe Hits', icon: Coffee, color: 'border-amber-200 text-amber-700 bg-amber-50' },
    { id: 'kuliner', label: 'Kuliner Lokal', icon: Utensils, color: 'border-rose-200 text-rose-700 bg-rose-50' },
    { id: 'hidden-gem', label: 'Hidden Gem', icon: Sparkles, color: 'border-indigo-200 text-indigo-700 bg-indigo-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col h-[calc(100vh-64px)] min-h-[500px]">
      {/* Header info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Peta Wisata Trawas</h1>
          <p className="text-slate-500 text-sm">Visualisasikan posisi semua destinasi wisata, kafe, kuliner, dan hidden gem di Trawas.</p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white scale-105'
                    : cat.color + ' hover:opacity-85'
                }`}
              >
                <CatIcon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-grow border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative min-h-[350px]">
        <MapContainer
          center={centralPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredDestinations.map((dest) => (
            <Marker
              key={dest.id}
              position={[dest.latitude, dest.longitude]}
              icon={getCustomMarkerIcon(dest.category)}
            >
              <Popup className="custom-popup">
                <div className="w-52 space-y-2 text-slate-800">
                  <div className="h-24 w-full rounded-md overflow-hidden bg-slate-100">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">{dest.name}</h4>
                    </div>
                    <div className="flex items-center text-[10px] text-amber-500 font-bold mt-0.5">
                      <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                      <span>{dest.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal ml-2 capitalize">• {dest.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-normal">{dest.description}</p>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => navigate(`/destinasi/${dest.slug}`)}
                      className="flex-1 inline-flex items-center justify-center py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Detail
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ', ' + (dest.address || 'Trawas, Mojokerto'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                    >
                      Maps ↗
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;

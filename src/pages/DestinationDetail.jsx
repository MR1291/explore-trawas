import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { MapPin, Clock, DollarSign, Phone, Globe, Share2, Heart, Star, ArrowLeft, Check, Navigation, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet marker icon configuration fix for React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DestinationDetail = () => {
  const { slug } = useParams();
  const { destinations, villages, toggleFavorite, isFavorite } = useContext(AppContext);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  // Find destination
  const dest = destinations.find(d => d.slug === slug);

  if (!dest) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Destinasi tidak ditemukan</h2>
        <p className="text-slate-500">Destinasi yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/destinasi" className="inline-flex items-center text-emerald-600 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Semua Destinasi
        </Link>
      </div>
    );
  }

  const village = villages.find(v => v.id === dest.village_id);
  const favorited = isFavorite(dest.id);

  // Recommendations: same village or same category, excluding current
  const recommendations = destinations
    .filter(d => d.id !== dest.id && (d.village_id === dest.village_id || d.category === dest.category))
    .slice(0, 3);

  // Copy share link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Safe pricing helper
  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={village ? `/desa/${village.slug}` : '/destinasi'}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Kembali ke {village ? `Desa ${village.name}` : 'Semua Destinasi'}</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
              shareCopied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Bagikan URL Destinasi"
          >
            {shareCopied ? (
              <span className="text-xs font-semibold px-1">Tersalin!</span>
            ) : (
              <Share2 className="h-5 w-5" />
            )}
          </button>

          {/* Favorite Toggle Button */}
          <button
            onClick={() => toggleFavorite(dest.id)}
            className={`p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
              favorited
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
            }`}
            title={favorited ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
          >
            <Heart className={`h-5 w-5 ${favorited ? 'fill-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Quick Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery / Photos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-sm">
            <img
              src={dest.images && dest.images.length > 0 ? dest.images[activeImageIdx] : dest.image}
              alt={dest.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm capitalize">
              {dest.category}
            </div>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center text-amber-500 text-sm font-bold">
              <Star className="h-4 w-4 fill-amber-500 mr-1" />
              <span>{dest.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Thumbnails */}
          {dest.images && dest.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {dest.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-16 md:w-24 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-emerald-600 scale-95 shadow-sm' : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Info Box */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 self-start">
          <div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
              📍 {village ? `Desa ${village.name}` : 'Trawas'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2 leading-snug">{dest.name}</h1>
            <p className="text-xs text-slate-400 mt-1 capitalize">{dest.category} • {dest.subcategory}</p>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Alamat</div>
                <div className="text-sm text-slate-700 leading-relaxed font-medium">{dest.address}</div>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Jam Operasional</div>
                <div className="text-sm text-slate-700 font-medium">{dest.opening_hours}</div>
              </div>
            </div>

            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Estimasi Harga</div>
                <div className="text-sm text-emerald-700 font-bold">{formatPrice(dest.price)}</div>
              </div>
            </div>

            {dest.contact && dest.contact !== '-' && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Kontak</div>
                  <div className="text-sm text-slate-700 font-medium">{dest.contact}</div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${dest.latitude},${dest.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* About & Facilities grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail text */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2 flex items-center">
              <Info className="h-5 w-5 text-emerald-600 mr-2" />
              Tentang Destinasi
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">{dest.description}</p>
          </div>

          {/* Facilities list */}
          {dest.facilities && dest.facilities.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Fasilitas yang Tersedia</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dest.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Check className="h-4 w-4 text-emerald-600 mr-2 shrink-0" />
                    <span className="font-medium">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suitable for tags */}
          {dest.suitable_for && dest.suitable_for.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Cocok Untuk</h2>
              <div className="flex flex-wrap gap-2">
                {dest.suitable_for.map((item, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
                    👥 {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Map Embed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Lokasi Peta</h2>
          <div className="h-64 border border-slate-100 shadow-sm rounded-2xl overflow-hidden relative">
            <MapContainer
              center={[dest.latitude, dest.longitude]}
              zoom={14}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[dest.latitude, dest.longitude]}>
                <Popup>
                  <div className="font-semibold">{dest.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{dest.category}</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="space-y-8 pt-8 border-t">
          <div className="text-left space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Destinasi Lain di Sekitar</h2>
            <p className="text-slate-500 text-sm">Rekomendasi destinasi dengan kategori serupa atau berada di desa yang sama.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                to={`/destinasi/${rec.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center text-amber-500 text-xs font-bold shadow-sm">
                    <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                    <span>{rec.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-5 space-y-2 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 capitalize">{rec.category} • {rec.subcategory}</span>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mt-0.5">
                      {rec.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{rec.description}</p>
                  </div>
                  <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center">
                    Lihat Selengkapnya &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Heart, MapPin, Star, Compass, Trash2, Eye } from 'lucide-react';

const Favorites = () => {
  const { favorites, destinations, toggleFavorite } = useContext(AppContext);

  // Get all matching destinations
  const favoritedDestinations = destinations.filter(d => favorites.includes(d.id));

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
          <Heart className="h-8 w-8 text-rose-500 mr-3 fill-rose-500 animate-pulse" />
          Destinasi Favorit Saya
        </h1>
        <p className="text-slate-500 mt-2">Daftar objek wisata, kafe, dan kuliner di Trawas yang telah Anda simpan.</p>
      </div>

      {favoritedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoritedDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center text-amber-500 text-xs font-bold">
                  <Star className="h-3 w-3 fill-amber-500 mr-1" />
                  <span>{dest.rating.toFixed(1)}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                  {dest.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {dest.name}
                  </h3>
                  <div className="flex items-center text-xs text-slate-400 font-medium">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{dest.address}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Link
                    to={`/destinasi/${dest.slug}`}
                    className="flex-grow inline-flex items-center justify-center px-4 py-2 border border-slate-200 hover:border-emerald-600 rounded-full shadow-sm text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Lihat Detail
                  </Link>

                  <button
                    onClick={() => toggleFavorite(dest.id)}
                    className="p-2 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-6">
          <Heart className="h-16 w-16 text-slate-300 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-700">Belum ada destinasi favorit</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Simpan destinasi wisata, kafe, atau kuliner favorit Anda dengan mengklik ikon hati pada halaman detail destinasi.
            </p>
          </div>
          <Link
            to="/destinasi"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
          >
            <Compass className="h-4 w-4 mr-2" />
            Cari Tempat Menarik
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;

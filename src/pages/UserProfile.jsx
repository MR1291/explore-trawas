import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Heart, MapPin, Star, MessageSquare, LogOut, CheckCircle2,
  Compass, Eye, Trash2, Calendar, ShieldCheck, User
} from 'lucide-react';

const UserProfile = () => {
  const { currentUser, logoutUser, favorites, visitedDestinations, reviews, destinations, toggleFavorite, toggleVisited, deleteReview } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'visited' | 'reviews'
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Belum Masuk</h2>
          <p className="text-sm text-slate-500">
            Silakan masuk dengan akun Google Anda untuk melihat riwayat aktivitas, destinasi favorit, dan ulasan Anda.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
        >
          Masuk dengan Google
        </Link>
      </div>
    );
  }

  const favoritedDestinations = destinations.filter(d => favorites.includes(d.id));
  const visitedPlaces = destinations.filter(d => visitedDestinations.includes(d.id));
  const userReviews = reviews.filter(r => r.userId === currentUser.id || r.userEmail === currentUser.email);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white/20 shadow-2xl bg-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-slate-900 shadow-md" title="Akun Google Terverifikasi">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">{currentUser.name}</h1>
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Google Auth
                </span>
              </div>
              <p className="text-slate-300 text-sm">{currentUser.email}</p>
              <div className="flex items-center justify-center sm:justify-start text-xs text-slate-400 pt-1">
                <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span>Aktif sejak {new Date(currentUser.joinedAt || '2026-01-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-white/10 hover:bg-rose-600/80 border border-white/10 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Keluar Akun
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-white/10">
          <div
            onClick={() => setActiveTab('favorites')}
            className={`p-3 sm:p-4 rounded-2xl cursor-pointer transition-all ${
              activeTab === 'favorites' ? 'bg-white/20 shadow-md' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-xl sm:text-2xl font-black text-white">{favoritedDestinations.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium flex items-center mt-0.5">
              <Heart className="w-3 h-3 mr-1 text-rose-400 fill-rose-400" /> Favorit Tersimpan
            </div>
          </div>

          <div
            onClick={() => setActiveTab('visited')}
            className={`p-3 sm:p-4 rounded-2xl cursor-pointer transition-all ${
              activeTab === 'visited' ? 'bg-white/20 shadow-md' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-xl sm:text-2xl font-black text-white">{visitedPlaces.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium flex items-center mt-0.5">
              <MapPin className="w-3 h-3 mr-1 text-emerald-400" /> Tempat Dikunjungi
            </div>
          </div>

          <div
            onClick={() => setActiveTab('reviews')}
            className={`p-3 sm:p-4 rounded-2xl cursor-pointer transition-all ${
              activeTab === 'reviews' ? 'bg-white/20 shadow-md' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-xl sm:text-2xl font-black text-white">{userReviews.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium flex items-center mt-0.5">
              <MessageSquare className="w-3 h-3 mr-1 text-amber-400" /> Ulasan Diberikan
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'favorites'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Destinasi Favorit ({favoritedDestinations.length})
        </button>
        <button
          onClick={() => setActiveTab('visited')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'visited'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pernah Dikunjungi ({visitedPlaces.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'reviews'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Ulasan Saya ({userReviews.length})
        </button>
      </div>

      {/* Tab Contents */}
      {/* 1. Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoritedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm flex items-center text-amber-500 text-xs font-bold">
                      <Star className="h-3 w-3 fill-amber-500 mr-1" />
                      <span>{dest.rating.toFixed(1)}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {dest.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dest.address}</p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
                      <Link
                        to={`/destinasi/${dest.slug}`}
                        className="flex-grow inline-flex items-center justify-center py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                      </Link>
                      <button
                        onClick={() => toggleFavorite(dest.id)}
                        className="p-2 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Hapus dari Favorit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4">
              <Heart className="h-12 w-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-700">Belum ada destinasi favorit</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Jelajahi wisata alam, kafe estetik, dan kuliner di Trawas lalu klik tombol hati untuk menyimpannya di sini.
                </p>
              </div>
              <Link
                to="/destinasi"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5" /> Jelajahi Sekarang
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 2. Visited */}
      {activeTab === 'visited' && (
        <div>
          {visitedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visitedPlaces.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Pernah Dikunjungi
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{dest.name}</h3>
                      <p className="text-xs text-slate-400 capitalize">{dest.category} • {dest.subcategory}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
                    <Link
                      to={`/destinasi/${dest.slug}`}
                      className="flex-grow inline-flex items-center justify-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-colors"
                    >
                      Buka Halaman
                    </Link>
                    <button
                      onClick={() => toggleVisited(dest.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 p-2 cursor-pointer"
                      title="Batalkan tanda sudah dikunjungi"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4">
              <MapPin className="h-12 w-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-700">Belum ada riwayat kunjungan</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Tandai destinasi yang sudah pernah Anda datangi dengan menekan tombol "Sudah Pernah ke Sini" di halaman detail destinasi.
                </p>
              </div>
              <Link
                to="/destinasi"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5" /> Cari Tempat
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. Reviews */}
      {activeTab === 'reviews' && (
        <div>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((rev) => {
                const targetDest = destinations.find(d => d.id === rev.destinationId);
                return (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {targetDest && (
                          <Link
                            to={`/destinasi/${targetDest.slug}`}
                            className="text-sm font-bold text-emerald-700 hover:underline inline-flex items-center"
                          >
                            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            {targetDest.name}
                          </Link>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{rev.rating} / 5</span>
                          <span className="text-[10px] text-slate-400">
                            • {new Date(rev.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-700">Belum ada ulasan yang Anda buat</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Bagikan pengalaman dan ulasan Anda pada tempat wisata atau kafe yang pernah Anda kunjungi di Trawas.
                </p>
              </div>
              <Link
                to="/destinasi"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5" /> Temukan Destinasi
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;

import React, { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  MapPin, Clock, DollarSign, Phone, Share2, Heart, Star,
  ArrowLeft, Check, Navigation, Info, MessageSquare, CheckCircle2,
  Send, Sparkles, User, ExternalLink
} from 'lucide-react';
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
  const navigate = useNavigate();
  const {
    destinations,
    villages,
    toggleFavorite,
    isFavorite,
    currentUser,
    isVisited,
    toggleVisited,
    reviews,
    addReview
  } = useContext(AppContext);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
  const visited = isVisited(dest.id);

  // Filter reviews for this destination
  const destReviews = reviews.filter(r => r.destinationId === dest.id);

  // Recommendations: same village or same category, excluding current
  const recommendations = destinations
    .filter(d => d.id !== dest.id && (d.village_id === dest.village_id || d.category === dest.category))
    .slice(0, 3);

  // Accurate Google Maps Search & Direct Directions Query
  const mapsSearchQuery = encodeURIComponent(`${dest.name}, ${dest.address || 'Trawas, Mojokerto'}`);
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsSearchQuery}`;

  // Copy share link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Handle Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    addReview({
      destinationId: dest.id,
      rating: userRating,
      comment: userComment.trim()
    });

    setUserComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  // Safe pricing helper
  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
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
          {/* Visited Check-in Button */}
          <button
            onClick={() => {
              if (!currentUser) {
                navigate('/login', { state: { from: `/destinasi/${dest.slug}` } });
                return;
              }
              toggleVisited(dest.id);
            }}
            className={`px-3.5 py-2 rounded-full border text-xs font-bold transition-all flex items-center cursor-pointer shadow-sm ${
              visited
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600'
            }`}
            title={visited ? 'Anda sudah mengunjungi tempat ini' : 'Tandai sudah pernah ke sini'}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            <span>{visited ? 'Sudah Dikunjungi' : 'Pernah ke Sini?'}</span>
          </button>

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
            onClick={() => {
              if (!currentUser) {
                navigate('/login', { state: { from: `/destinasi/${dest.slug}` } });
                return;
              }
              toggleFavorite(dest.id);
            }}
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
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-6 self-start">
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

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Kontak / Layanan Informasi</div>
                <div className="text-sm text-slate-800 font-bold mt-0.5">
                  {dest.contact && dest.contact !== '-' ? (
                    <span>{dest.contact}</span>
                  ) : (
                    <span>Kantor Informasi / BUMDes Desa {village ? village.name : 'Trawas'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Google Maps Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-2xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Buka Langsung di Google Maps
            </a>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              Petunjuk Arah Rute Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* About & Facilities grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail text & Facilities */}
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

          {/* Interactive Reviews Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600 mr-2" />
                  Ulasan Pengunjung ({destReviews.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Pendapat dan pengalaman wisatawan di {dest.name}</p>
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400">Masuk sebagai Pengguna Google</div>
                      </div>
                    </div>

                    {/* Star selector */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= userRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1.5">{userRating}.0</span>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder={`Bagikan pengalaman Anda mengunjungi ${dest.name}...`}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-400"
                  />

                  {reviewSubmitted && (
                    <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 p-2.5 rounded-xl flex items-center">
                      <Check className="w-4 h-4 mr-1.5" /> Ulasan Anda berhasil disimpan dan ditambahkan ke profil Anda!
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Kirim Ulasan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 text-center sm:text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Ingin memberikan ulasan & rating?</h4>
                      <p className="text-xs text-slate-500">Masuk dengan akun Google Anda untuk menyimpan ulasan dan destinasi favorit.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/login', { state: { from: `/destinasi/${dest.slug}` } })}
                    className="inline-flex items-center px-4 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                    Masuk dengan Google
                  </button>
                </div>
              )}
            </div>

            {/* Review List */}
            {destReviews.length > 0 ? (
              <div className="space-y-3.5">
                {destReviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-100"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full text-amber-600 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span>{rev.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
                Belum ada ulasan untuk destinasi ini. Jadilah yang pertama memberikan ulasan!
              </div>
            )}
          </div>
        </div>

        {/* Interactive Map Embed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Lokasi Peta</h2>
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center"
            >
              Google Maps <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="h-72 border border-slate-100 shadow-sm rounded-3xl overflow-hidden relative">
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
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[11px] text-emerald-600 font-bold hover:underline"
                  >
                    Buka Google Maps &rarr;
                  </a>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-800 space-y-1">
            <div className="font-bold flex items-center">
              <Navigation className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Navigasi Presisi Tempat
            </div>
            <p className="text-[11px] text-emerald-700/90 leading-relaxed">
              Peta langsung tertaut ke profil resmi Google Maps destinasi untuk rute berkendara terdekat dan panduan navigasi real-time.
            </p>
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

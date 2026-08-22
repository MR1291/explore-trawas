import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { MapPin, Star, Compass, Coffee, Utensils, Sparkles, ArrowLeft, Eye, ShieldCheck } from 'lucide-react';
import TravelEstimatesCard from '../components/TravelEstimatesCard';
import PopIn from '../components/PopIn';

const VillageDetail = () => {
  const { slug } = useParams();
  const { villages, destinations } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('semua');

  // Find the current village
  const village = villages.find(v => v.slug === slug);

  if (!village) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Desa tidak ditemukan</h2>
        <p className="text-slate-500">Desa yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link to="/" className="inline-flex items-center text-emerald-600 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Filter destinations in this village
  const villageDestinations = destinations.filter(d => d.village_id === village.id);

  // Filter based on tab
  const filteredDestinations = activeTab === 'semua'
    ? villageDestinations
    : villageDestinations.filter(d => d.category === activeTab);

  const tabs = [
    { id: 'semua', label: 'Semua', icon: Compass },
    { id: 'wisata', label: 'Wisata Alam & Rekreasi', icon: Compass },
    { id: 'kafe', label: 'Kafe & Tempat Nongkrong', icon: Coffee },
    { id: 'kuliner', label: 'Kuliner & Resto', icon: Utensils },
    { id: 'hidden-gem', label: 'Hidden Gem', icon: Sparkles },
  ];

  return (
    <div className="pb-16 space-y-12">
      {/* Village Hero Header */}
      <div className="relative h-96 bg-slate-900 flex items-end">
        <img
          src={village.image}
          alt={village.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 space-y-3">
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors mb-2">
            <ArrowLeft className="h-3 w-3 mr-1" /> KECAMATAN TRAWAS
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Desa {village.name}
            </h1>
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              Desa Wisata Trawas
            </span>
          </div>
          <div className="flex items-center text-slate-300 text-sm">
            <MapPin className="h-4 w-4 mr-1 text-emerald-400" />
            <span>{village.location}</span>
          </div>
        </div>
      </div>

      {/* Description & Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Karakteristik & Potensi Desa</h2>
            <p className="text-slate-600 leading-relaxed text-base">{village.description}</p>
            
            {village.access_notes && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3 text-xs text-slate-700">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Kondisi Akses Jalan:</span>
                  <span>{village.access_notes}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-center space-y-4">
            <h3 className="text-lg font-bold text-slate-800 text-center">Statistik Destinasi Desa</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <div className="text-2xl font-extrabold text-emerald-600">{villageDestinations.length}</div>
                <div className="text-xs text-slate-500 font-medium">Total Destinasi</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <div className="text-2xl font-extrabold text-blue-600">
                  {villageDestinations.filter(d => d.category === 'wisata').length}
                </div>
                <div className="text-xs text-slate-500 font-medium">Wisata Alam</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <div className="text-2xl font-extrabold text-amber-600">
                  {villageDestinations.filter(d => d.category === 'kafe').length}
                </div>
                <div className="text-xs text-slate-500 font-medium">Kafe & Nongkrong</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <div className="text-2xl font-extrabold text-rose-600">
                  {villageDestinations.filter(d => d.category === 'kuliner').length}
                </div>
                <div className="text-xs text-slate-500 font-medium">Resto & Kuliner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Estimator for this village */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TravelEstimatesCard villageSlug={village.slug} villageName={village.name} />
      </div>

      {/* Categories Tabs Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-200">
          <div className="flex space-x-2 md:space-x-8 overflow-x-auto pb-px">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const count = tab.id === 'semua'
                ? villageDestinations.length
                : villageDestinations.filter(d => d.category === tab.id).length;

              if (count === 0 && tab.id !== 'semua') return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors outline-none cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, idx) => (
              <PopIn
                key={dest.id}
                delay={(idx % 6) * 90}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm fluid-card flex flex-col h-full"
                as="div"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md flex items-center text-amber-500 text-xs font-bold">
                    <Star className="h-3 w-3 fill-amber-500 mr-1" />
                    <span>{dest.rating.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize shadow-sm">
                    {dest.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      {dest.subcategory}
                    </span>
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
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {dest.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/destinasi/${dest.slug}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 hover:border-emerald-600 rounded-full shadow-sm text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all pt-2 fluid-btn cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Lihat Detail
                  </Link>
                </div>
              </PopIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Compass className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Tidak ada destinasi</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Belum ada rekomendasi tempat dalam kategori ini untuk Desa {village.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageDetail;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Search, MapPin, Compass, Utensils, Coffee, Leaf, ChevronRight, Activity, Navigation } from 'lucide-react';
import TravelEstimatesCard from '../components/TravelEstimatesCard';
import PopIn from '../components/PopIn';
import heroImg from '../assets/trawas-hero.jpg';

const Home = () => {
  const { villages, destinations } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') { setSearchResults([]); return; }

    const filteredDestinations = destinations.filter(dest =>
      dest.name.toLowerCase().includes(query.toLowerCase()) ||
      dest.category.toLowerCase().includes(query.toLowerCase()) ||
      dest.subcategory.toLowerCase().includes(query.toLowerCase()) ||
      dest.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).map(d => ({ ...d, type: 'destination' }));

    const filteredVillages = villages.filter(v =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.description.toLowerCase().includes(query.toLowerCase())
    ).map(v => ({ ...v, type: 'village' }));

    setSearchResults([...filteredVillages, ...filteredDestinations].slice(0, 6));
  };

  const totalVillages = villages.length;
  const totalWisata = destinations.filter(d => d.category === 'wisata').length;
  const totalKafe = destinations.filter(d => d.category === 'kafe').length;
  const totalKuliner = destinations.filter(d => d.category === 'kuliner').length;

  return (
    <div className="space-y-16 pb-16">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <div className="relative bg-slate-900 min-h-[620px] flex items-center justify-center text-white overflow-hidden py-16">
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 ease-out hover:scale-110">
          <img src={heroImg} alt="Panorama Trawas" className="w-full h-full object-cover scale-105" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8 animate-slideUp">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md animate-float">
            ⛰️ Portal Wisata Resmi 12 Desa Trawas, Mojokerto
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-lg">
            Jelajahi Pesona Keindahan Trawas
          </h1>
          <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            Temukan keajaiban alam pegunungan, jalur pendakian bersejarah Majapahit, pesona sawah terasering, spot camping pinus, serta deretan kafe estetik di 12 desa wisata Trawas.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-2xl p-1.5 border border-slate-200 focus-within:ring-4 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all duration-300 transform focus-within:-translate-y-0.5">
              <Search className="h-5 w-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Cari desa, air terjun, camping, kopi, kuliner..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-3 py-2 text-slate-800 focus:outline-none placeholder-slate-400 rounded-full text-sm bg-transparent"
              />
              <button
                onClick={() => navigate('/destinasi')}
                className="px-6 py-2.5 rounded-full text-white bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs transition-all duration-300 fluid-btn cursor-pointer shadow-md"
              >
                Cari
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-left z-50 text-slate-800 animate-slideDown">
                {searchResults.map((result) => (
                  <Link
                    key={result.id + '-' + result.type}
                    to={result.type === 'village' ? `/desa/${result.slug}` : `/destinasi/${result.slug}`}
                    className="flex items-center px-5 py-3.5 hover:bg-emerald-50/60 border-b border-slate-100 last:border-0 transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-emerald-600 mr-4 shrink-0">
                      {result.type === 'village' ? <MapPin className="h-5 w-5" /> : (
                        result.category === 'kafe' ? <Coffee className="h-5 w-5" /> :
                        result.category === 'kuliner' ? <Utensils className="h-5 w-5" /> :
                        <Compass className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm md:text-base">{result.name}</div>
                      <div className="text-xs text-slate-500 capitalize">
                        {result.type === 'village' ? 'Desa Wisata' : `${result.category} • ${result.subcategory}`}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a href="#desa-wisata" className="px-6 py-2.5 rounded-full text-sm font-bold bg-white text-emerald-800 hover:bg-slate-50 shadow-lg transition-all duration-300 fluid-btn">
              Jelajahi 12 Desa
            </a>
            <a href="#estimasi-rute" className="px-6 py-2.5 rounded-full text-sm font-semibold bg-emerald-600/40 hover:bg-emerald-600/60 text-white border border-emerald-400/30 backdrop-blur-sm transition-all duration-300 fluid-btn flex items-center">
              <Navigation className="h-4 w-4 mr-1.5" />
              Panduan Rute Perjalanan
            </a>
          </div>
        </div>
      </div>

      {/* ── About Section ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: text slides in from left */}
          <PopIn direction="left" className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Activity className="h-4 w-4" />
              <span>Tentang Kawasan Trawas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Surga Wisata Pegunungan di Lereng Penanggungan &amp; Welirang
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Kecamatan Trawas terletak di Kabupaten Mojokerto pada ketinggian rata-rata 700 mdpl di antara dua gunung agung Jawa Timur: Gunung Penanggungan (Pawitra) dan Gunung Welirang. Trawas menjadi magnet wisata favorit berkat hawanya yang sejuk, pemandangan sawah terasering berundak, air terjun alami, dan peninggalan situs sejarah era Kerajaan Majapahit.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Kini seluruh desa di Trawas telah berkembang dengan keunikan masing-masing — mulai dari desa wisata percontohan nasional (Ketapanrame), cagar budaya mata air Jolotundo (Seloliman), pesona kafe kincir angin &amp; roastery lokal (Tamiajeng), panorama sawah terasering (Selotapak), glamping pinus 10,4 Ha (Sukosari), kuliner hutan bambu (Belik), hingga sentra durian legit (Duyung).
            </p>
          </PopIn>

          {/* Right: stats slide from right */}
          <PopIn direction="right" className="grid grid-cols-2 gap-4">
            {[
              { label: 'Desa Wisata Lengkap', value: totalVillages, icon: MapPin, color: 'text-blue-600 bg-blue-50 border-blue-100' },
              { label: 'Wisata Alam & Rekreasi', value: totalWisata, icon: Compass, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { label: 'Kafe & Spot Nongkrong', value: totalKafe, icon: Coffee, color: 'text-amber-600 bg-amber-50 border-amber-100' },
              { label: 'Restoran & Kuliner Lokal', value: totalKuliner, icon: Utensils, color: 'text-rose-600 bg-rose-50 border-rose-100' }
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl border shadow-sm space-y-3 fluid-card ${stat.color.split(' ')[2]}`}>
                <div className={`p-3 rounded-xl w-fit ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </PopIn>
        </div>
      </div>

      {/* ── Villages Grid ─────────────────────────────────────────── */}
      <div id="desa-wisata" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Title — pop up from below */}
        <PopIn className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex justify-center items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Leaf className="h-4 w-4" />
            <span>Eksplorasi 12 Desa Wisata</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Daftar Desa di Kecamatan Trawas
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Pilih desa untuk menjelajahi potensi alam, objek wisata tersembunyi, tempat ngopi estetik, dan kuliner khas di masing-masing wilayah.
          </p>
        </PopIn>

        {/* Village Cards — each pops in with staggered delay */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {villages.map((village, i) => {
            const count = destinations.filter(d => d.village_id === village.id).length;
            return (
              <PopIn key={village.id} delay={(i % 6) * 90} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm fluid-card flex flex-col" as="div">
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={village.image}
                    alt={village.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    🏞️ {count} Destinasi
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow">
                    Desa {village.name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-400 font-medium">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      <span>{village.location}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {village.description}
                    </p>
                  </div>

                  <Link
                    to={`/desa/${village.slug}`}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 transition-all fluid-btn"
                  >
                    <span>Lihat Destinasi Desa</span>
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </PopIn>
            );
          })}
        </div>
      </div>

      {/* ── Travel Estimator ──────────────────────────────────────── */}
      <div id="estimasi-rute" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <PopIn>
          <TravelEstimatesCard />
        </PopIn>
      </div>
    </div>
  );
};

export default Home;

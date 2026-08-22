import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Search, MapPin, Star, Filter, Coffee, Utensils, Compass, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import PopIn from '../components/PopIn';

const AllDestinations = () => {
  const { destinations, villages } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('semua');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [priceFilter, setPriceFilter] = useState('semua');
  const [minRating, setMinRating] = useState('semua');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract all unique facilities from dataset to build filter list dynamically
  const allFacilities = Array.from(
    new Set(destinations.flatMap(d => d.facilities || []))
  ).filter(Boolean);

  const toggleFacility = (facility) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  // Filter Logic
  const filteredDestinations = destinations.filter(dest => {
    // Search query match
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Village filter
    const matchesVillage = selectedVillage === 'semua' || dest.village_id === parseInt(selectedVillage);

    // Category filter
    const matchesCategory = selectedCategory === 'semua' || dest.category === selectedCategory;

    // Price filter
    let matchesPrice = true;
    if (priceFilter === 'gratis') {
      matchesPrice = dest.price === 0;
    } else if (priceFilter === 'murah') {
      matchesPrice = dest.price > 0 && dest.price <= 15000;
    } else if (priceFilter === 'sedang') {
      matchesPrice = dest.price > 15000 && dest.price <= 25000;
    } else if (priceFilter === 'mahal') {
      matchesPrice = dest.price > 25000;
    }

    // Rating filter
    const matchesRating = minRating === 'semua' || dest.rating >= parseFloat(minRating);

    // Facilities filter
    const matchesFacilities = selectedFacilities.every(fac =>
      dest.facilities && dest.facilities.includes(fac)
    );

    return matchesSearch && matchesVillage && matchesCategory && matchesPrice && matchesRating && matchesFacilities;
  });

  const categories = [
    { id: 'semua', label: 'Semua', icon: Compass },
    { id: 'wisata', label: 'Wisata', icon: Compass },
    { id: 'kafe', label: 'Kafe', icon: Coffee },
    { id: 'kuliner', label: 'Kuliner', icon: Utensils },
    { id: 'hidden-gem', label: 'Hidden Gem', icon: Sparkles }
  ];

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Search */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900">Semua Destinasi Trawas</h1>
        <p className="text-slate-500 max-w-xl">Jelajahi seluruh objek wisata, tempat nongkrong, warung kuliner, dan destinasi tersembunyi yang ada di Trawas.</p>
        
        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tempat wisata, kafe, atau kuliner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center justify-center px-6 py-3 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop) */}
        <div className={`space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:block ${
          showMobileFilters ? 'block' : 'hidden'
        }`}>
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-emerald-600" />
              Filter Destinasi
            </h3>
            <button
              onClick={() => {
                setSelectedVillage('semua');
                setSelectedCategory('semua');
                setPriceFilter('semua');
                setMinRating('semua');
                setSelectedFacilities([]);
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Village Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Desa Wisata</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700"
            >
              <option value="semua">Semua Desa</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700"
            >
              <option value="semua">Semua Kategori</option>
              <option value="wisata">🏞️ Wisata</option>
              <option value="kafe">☕ Kafe</option>
              <option value="kuliner">🍽️ Kuliner</option>
              <option value="hidden-gem">🌿 Hidden Gem</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Tiket / Kisaran</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700"
            >
              <option value="semua">Semua Harga</option>
              <option value="gratis">Gratis / Masuk Bebas</option>
              <option value="murah">Murah (s/d Rp 15rb)</option>
              <option value="sedang">Sedang (Rp 15rb - 25rb)</option>
              <option value="mahal">Premium (Lebih dari Rp 25rb)</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating Minimum</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700"
            >
              <option value="semua">Semua Rating</option>
              <option value="4.7">⭐ 4.7 ke atas</option>
              <option value="4.5">⭐ 4.5 ke atas</option>
              <option value="4.0">⭐ 4.0 ke atas</option>
            </select>
          </div>

          {/* Facilities Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fasilitas</label>
            <div className="space-y-2">
              {allFacilities.map((fac) => {
                const checked = selectedFacilities.includes(fac);
                return (
                  <button
                    key={fac}
                    onClick={() => toggleFacility(fac)}
                    className="flex items-center text-left text-sm text-slate-600 hover:text-slate-900 cursor-pointer w-full py-1"
                  >
                    <div className={`h-4 w-4 rounded border mr-2 flex items-center justify-center transition-colors ${
                      checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {checked && <Check className="h-3 w-3" />}
                    </div>
                    <span>{fac}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-sm text-slate-500 font-medium px-1">
            <div>Ditemukan <span className="font-bold text-emerald-600">{filteredDestinations.length}</span> tempat menarik</div>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest, idx) => {
                const destVillage = villages.find(v => v.id === dest.village_id);
                return (
                  <PopIn
                    key={dest.id}
                    delay={(idx % 6) * 90}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm fluid-card flex flex-col h-full"
                    as="div"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center text-amber-500 text-xs font-bold shadow-sm">
                        <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                        <span>{dest.rating.toFixed(1)}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        {dest.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 leading-snug">
                          {dest.name}
                        </h3>
                        <div className="flex items-center text-[10px] text-slate-400 font-medium">
                          <MapPin className="h-3 w-3 mr-1 text-emerald-600" />
                          <span className="line-clamp-1">Desa {destVillage ? destVillage.name : 'Trawas'}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-1">
                          {dest.description}
                        </p>
                      </div>

                      <Link
                        to={`/destinasi/${dest.slug}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 hover:border-emerald-600 rounded-full shadow-sm text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all pt-2 mt-auto fluid-btn cursor-pointer"
                      >
                        Detail Destinasi &rarr;
                      </Link>
                    </div>
                  </PopIn>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <SlidersHorizontal className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Tidak ada kecocokan</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Silakan ubah filter pencarian Anda atau reset filter untuk menampilkan kembali semua destinasi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDestinations;

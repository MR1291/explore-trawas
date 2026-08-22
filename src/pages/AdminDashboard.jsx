import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Plus, Edit2, Trash2, MapPin, Search, LogOut,
  Mountain, Home, Compass, Building2, RefreshCw, X, Save,
  ExternalLink, Eye, CheckCircle, ShieldCheck
} from 'lucide-react';
import AdminLogin from './AdminLogin';

const AdminDashboard = () => {
  const {
    villages, addVillage, updateVillage, deleteVillage,
    destinations, addDestination, updateDestination, deleteDestination,
    resetToDefaultData
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('explore_trawas_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('destinasi'); // 'destinasi' | 'desa' | 'overview'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('semua');
  const [toastMessage, setToastMessage] = useState('');

  // Village Form State
  const [showVillageForm, setShowVillageForm] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [villageName, setVillageName] = useState('');
  const [villageLocation, setVillageLocation] = useState('');
  const [villageDescription, setVillageDescription] = useState('');
  const [villageImage, setVillageImage] = useState('');
  const [villageAccess, setVillageAccess] = useState('');

  // Destination Form State
  const [showDestForm, setShowDestForm] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destName, setDestName] = useState('');
  const [destVillageId, setDestVillageId] = useState('');
  const [destCategory, setDestCategory] = useState('wisata');
  const [destSubcategory, setDestSubcategory] = useState('');
  const [destDescription, setDestDescription] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const [destLatitude, setDestLatitude] = useState('');
  const [destLongitude, setDestLongitude] = useState('');
  const [destOpeningHours, setDestOpeningHours] = useState('');
  const [destPrice, setDestPrice] = useState('');
  const [destContact, setDestContact] = useState('');
  const [destImage, setDestImage] = useState('');
  const [destFacilities, setDestFacilities] = useState('');
  const [destTags, setDestTags] = useState('');
  const [destSuitable, setDestSuitable] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('explore_trawas_admin_auth');
    localStorage.removeItem('explore_trawas_admin_user');
    setIsAuthenticated(false);
    showToast('Berhasil keluar dari sesi admin.');
  };

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // CRUD Village Handlers
  const handleOpenVillageForm = (v = null) => {
    if (v) {
      setEditingVillage(v);
      setVillageName(v.name);
      setVillageLocation(v.location);
      setVillageDescription(v.description);
      setVillageImage(v.image);
      setVillageAccess(v.access_notes || '');
    } else {
      setEditingVillage(null);
      setVillageName('');
      setVillageLocation('Kecamatan Trawas, Kabupaten Mojokerto');
      setVillageDescription('');
      setVillageImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80');
      setVillageAccess('Jalan beraspal mulus, dapat dijangkau sepeda motor dan mobil pribadi.');
    }
    setShowVillageForm(true);
  };

  const handleSaveVillage = (e) => {
    e.preventDefault();
    if (!villageName.trim() || !villageDescription.trim()) return;

    const data = {
      name: villageName,
      location: villageLocation,
      description: villageDescription,
      image: villageImage,
      access_notes: villageAccess
    };

    if (editingVillage) {
      updateVillage({ ...editingVillage, ...data });
      showToast(`Desa ${villageName} berhasil diperbarui!`);
    } else {
      addVillage(data);
      showToast(`Desa ${villageName} berhasil ditambahkan!`);
    }

    setShowVillageForm(false);
    setEditingVillage(null);
  };

  // CRUD Destination Handlers
  const handleOpenDestForm = (d = null) => {
    if (d) {
      setEditingDest(d);
      setDestName(d.name);
      setDestVillageId(d.village_id.toString());
      setDestCategory(d.category);
      setDestSubcategory(d.subcategory);
      setDestDescription(d.description);
      setDestAddress(d.address);
      setDestLatitude(d.latitude.toString());
      setDestLongitude(d.longitude.toString());
      setDestOpeningHours(d.opening_hours);
      setDestPrice(d.price.toString());
      setDestContact(d.contact || '-');
      setDestImage(d.image);
      setDestFacilities(d.facilities ? d.facilities.join(', ') : '');
      setDestTags(d.tags ? d.tags.join(', ') : '');
      setDestSuitable(d.suitable_for ? d.suitable_for.join(', ') : '');
    } else {
      setEditingDest(null);
      setDestName('');
      setDestVillageId(villages[0]?.id.toString() || '1');
      setDestCategory('wisata');
      setDestSubcategory('Wisata Alam');
      setDestDescription('');
      setDestAddress('Kecamatan Trawas, Kabupaten Mojokerto');
      setDestLatitude('-7.6749');
      setDestLongitude('112.6318');
      setDestOpeningHours('08:00 - 17:00 WIB');
      setDestPrice('10000');
      setDestContact('-');
      setDestImage('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80');
      setDestFacilities('Area Parkir, Toilet, Mushola');
      setDestTags('Wisata Alam, Instagramable');
      setDestSuitable('Keluarga, Teman');
    }
    setShowDestForm(true);
  };

  const handleSaveDest = (e) => {
    e.preventDefault();
    if (!destName.trim() || !destVillageId || !destDescription.trim()) return;

    const parseCommaString = (str) => str.split(',').map(s => s.trim()).filter(Boolean);

    const data = {
      village_id: parseInt(destVillageId),
      name: destName,
      category: destCategory,
      subcategory: destSubcategory,
      description: destDescription,
      address: destAddress,
      latitude: parseFloat(destLatitude) || -7.6749,
      longitude: parseFloat(destLongitude) || 112.6318,
      opening_hours: destOpeningHours,
      price: parseFloat(destPrice) || 0,
      contact: destContact,
      image: destImage,
      images: [destImage],
      facilities: parseCommaString(destFacilities),
      tags: parseCommaString(destTags),
      suitable_for: parseCommaString(destSuitable)
    };

    if (editingDest) {
      updateDestination({ ...editingDest, ...data });
      showToast(`Destinasi ${destName} berhasil diperbarui!`);
    } else {
      addDestination(data);
      showToast(`Destinasi ${destName} berhasil ditambahkan!`);
    }

    setShowDestForm(false);
    setEditingDest(null);
  };

  // Filtered Destinations
  const filteredDestinations = destinations.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVillage = selectedVillageFilter === 'semua' || d.village_id === parseInt(selectedVillageFilter);
    return matchesSearch && matchesVillage;
  });

  // Filtered Villages
  const filteredVillages = villages.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm font-bold animate-slideUp">
          <CheckCircle className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Portal title */}
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg">
              <Mountain className="h-6 w-6" />
            </div>
            <div>
              <div className="font-extrabold text-base text-white leading-tight">Admin Trawas</div>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1" /> Panel Pengelola
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => { setActiveTab('overview'); setShowVillageForm(false); setShowDestForm(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Ringkasan / Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('destinasi'); setShowVillageForm(false); setShowDestForm(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'destinasi' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Compass className="h-4 w-4" />
                <span>Destinasi Wisata</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                {destinations.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('desa'); setShowVillageForm(false); setShowDestForm(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'desa' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4" />
                <span>Desa Wisata</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                {villages.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Action: Website Link & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-2 mt-6">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:text-emerald-400 border border-slate-700/60 transition-all"
          >
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Web Publik
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-grow p-4 md:p-8 space-y-8 overflow-y-auto bg-slate-950">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {activeTab === 'overview' && 'Overview Statistik Pariwisata Trawas'}
              {activeTab === 'destinasi' && 'Manajemen Destinasi Pariwisata'}
              {activeTab === 'desa' && 'Manajemen 12 Desa Wisata'}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Kelola, edit, tambah, dan pantau seluruh data informasi pariwisata Kecamatan Trawas.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data desa dan destinasi ke data default terlengkap (12 desa & 40+ destinasi)?')) {
                  resetToDefaultData();
                  showToast('Data berhasil direset ke default!');
                }
              }}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
              title="Reset ke data awal"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Reset Data Default
            </button>

            {activeTab === 'destinasi' && (
              <button
                onClick={() => handleOpenDestForm()}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Destinasi
              </button>
            )}

            {activeTab === 'desa' && (
              <button
                onClick={() => handleOpenVillageForm()}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Desa
              </button>
            )}
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Desa Wisata</div>
                <div className="text-3xl font-black text-white">{villages.length} <span className="text-xs text-emerald-400 font-semibold">Desa</span></div>
                <div className="text-[11px] text-slate-500">Mencakup seluruh area Trawas</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Objek Destinasi</div>
                <div className="text-3xl font-black text-emerald-400">{destinations.length} <span className="text-xs text-slate-400 font-semibold">Lokasi</span></div>
                <div className="text-[11px] text-slate-500">Wisata alam, kafe, & kuliner</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Kafe & Kedai Kopi</div>
                <div className="text-3xl font-black text-amber-400">
                  {destinations.filter(d => d.category === 'kafe').length}
                </div>
                <div className="text-[11px] text-slate-500">Spot nongkrong & roastery</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Resto & Kuliner Khas</div>
                <div className="text-3xl font-black text-rose-400">
                  {destinations.filter(d => d.category === 'kuliner').length}
                </div>
                <div className="text-[11px] text-slate-500">Ikan bakar, sate, & lesehan</div>
              </div>
            </div>

            {/* Quick Links Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Sebaran Destinasi per Desa</h3>
                <button onClick={() => setActiveTab('destinasi')} className="text-xs text-emerald-400 hover:underline font-bold">
                  Lihat Semua Destinasi &rarr;
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {villages.map(v => {
                  const count = destinations.filter(d => d.village_id === v.id).length;
                  return (
                    <div key={v.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300">Desa {v.name}</span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Destination & Village Tables */}
        {activeTab !== 'overview' && !showVillageForm && !showDestForm && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 animate-fadeIn">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-3">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={activeTab === 'destinasi' ? "Cari nama destinasi, subkategori..." : "Cari nama desa..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {activeTab === 'destinasi' && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-semibold">Filter Desa:</span>
                  <select
                    value={selectedVillageFilter}
                    onChange={(e) => setSelectedVillageFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="semua">Semua Desa ({destinations.length})</option>
                    {villages.map(v => (
                      <option key={v.id} value={v.id}>Desa {v.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Table Rendering */}
            <div className="overflow-x-auto">
              {activeTab === 'destinasi' ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Nama Destinasi</th>
                      <th className="px-6 py-3.5">Desa</th>
                      <th className="px-6 py-3.5">Kategori</th>
                      <th className="px-6 py-3.5">Subkategori</th>
                      <th className="px-6 py-3.5">Harga</th>
                      <th className="px-6 py-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredDestinations.map((d) => {
                      const v = villages.find(vil => vil.id === d.village_id);
                      return (
                        <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{d.name}</td>
                          <td className="px-6 py-4 text-slate-400">Desa {v ? v.name : '-'}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 capitalize">
                              {d.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">{d.subcategory}</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">
                            {d.price === 0 ? 'Gratis' : `Rp ${d.price.toLocaleString('id-ID')}`}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Link
                                to={`/destinasi/${d.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Lihat Halaman Publik"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenDestForm(d)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus destinasi "${d.name}"?`)) {
                                    deleteDestination(d.id);
                                    showToast(`Destinasi ${d.name} dihapus.`);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Nama Desa</th>
                      <th className="px-6 py-3.5">Lokasi</th>
                      <th className="px-6 py-3.5">Jumlah Destinasi</th>
                      <th className="px-6 py-3.5">Deskripsi</th>
                      <th className="px-6 py-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredVillages.map((v) => {
                      const count = destinations.filter(d => d.village_id === v.id).length;
                      return (
                        <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">Desa {v.name}</td>
                          <td className="px-6 py-4 text-slate-400">{v.location}</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{count} Destinasi</td>
                          <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{v.description}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Link
                                to={`/desa/${v.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Lihat Halaman Publik"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenVillageForm(v)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus Desa "${v.name}" beserta seluruh destinasi di dalamnya?`)) {
                                    deleteVillage(v.id);
                                    showToast(`Desa ${v.name} dihapus.`);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Modal / Form Village */}
        {showVillageForm && (
          <form onSubmit={handleSaveVillage} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 animate-slideUp text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingVillage ? `Edit Desa ${editingVillage.name}` : 'Tambah Desa Wisata Baru'}
              </h2>
              <button type="button" onClick={() => setShowVillageForm(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Nama Desa</label>
                <input
                  type="text"
                  required
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="e.g. Ketapanrame"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Wilayah / Lokasi</label>
                <input
                  type="text"
                  required
                  value={villageLocation}
                  onChange={(e) => setVillageLocation(e.target.value)}
                  placeholder="Kecamatan Trawas, Kabupaten Mojokerto"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Deskripsi Desa</label>
                <textarea
                  required
                  rows={4}
                  value={villageDescription}
                  onChange={(e) => setVillageDescription(e.target.value)}
                  placeholder="Jelaskan karakteristik, keunikan, dan potensi desa..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">URL Gambar / Foto</label>
                <input
                  type="url"
                  required
                  value={villageImage}
                  onChange={(e) => setVillageImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Catatan Akses Jalan</label>
                <input
                  type="text"
                  value={villageAccess}
                  onChange={(e) => setVillageAccess(e.target.value)}
                  placeholder="Akses motor & mobil pribadi lancar..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowVillageForm(false)}
                className="px-4 py-2 border border-slate-700 rounded-xl text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 font-bold"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Simpan Desa
              </button>
            </div>
          </form>
        )}

        {/* Modal / Form Destination */}
        {showDestForm && (
          <form onSubmit={handleSaveDest} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 animate-slideUp text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingDest ? `Edit Destinasi ${editingDest.name}` : 'Tambah Destinasi Baru'}
              </h2>
              <button type="button" onClick={() => setShowDestForm(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Nama Destinasi</label>
                <input
                  type="text"
                  required
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder="e.g. Air Terjun Dlundung"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Desa Asal</label>
                <select
                  value={destVillageId}
                  onChange={(e) => setDestVillageId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {villages.map(v => (
                    <option key={v.id} value={v.id}>Desa {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Kategori</label>
                <select
                  value={destCategory}
                  onChange={(e) => setDestCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="wisata">Wisata Alam & Rekreasi</option>
                  <option value="kafe">Kafe & Nongkrong</option>
                  <option value="kuliner">Resto & Kuliner</option>
                  <option value="hidden-gem">Hidden Gem</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Subkategori</label>
                <input
                  type="text"
                  required
                  value={destSubcategory}
                  onChange={(e) => setDestSubcategory(e.target.value)}
                  placeholder="Air Terjun, Coffee Shop, Outbound..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Jam Buka</label>
                <input
                  type="text"
                  required
                  value={destOpeningHours}
                  onChange={(e) => setDestOpeningHours(e.target.value)}
                  placeholder="08:00 - 17:00 WIB"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Harga Tiket / Kisaran (Rp)</label>
                <input
                  type="number"
                  required
                  value={destPrice}
                  onChange={(e) => setDestPrice(e.target.value)}
                  placeholder="15000 (0 jika gratis)"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  placeholder="Dusun..., Desa..., Kec. Trawas, Kabupaten Mojokerto"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Latitude</label>
                <input
                  type="text"
                  required
                  value={destLatitude}
                  onChange={(e) => setDestLatitude(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Longitude</label>
                <input
                  type="text"
                  required
                  value={destLongitude}
                  onChange={(e) => setDestLongitude(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">No. Kontak / WA</label>
                <input
                  type="text"
                  value={destContact}
                  onChange={(e) => setDestContact(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Deskripsi Destinasi</label>
                <textarea
                  required
                  rows={4}
                  value={destDescription}
                  onChange={(e) => setDestDescription(e.target.value)}
                  placeholder="Jelaskan fasilitas, daya tarik, keunikan tempat ini..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">URL Foto Utama</label>
                <input
                  type="url"
                  required
                  value={destImage}
                  onChange={(e) => setDestImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Fasilitas (pisahkan koma)</label>
                <input
                  type="text"
                  value={destFacilities}
                  onChange={(e) => setDestFacilities(e.target.value)}
                  placeholder="Toilet, Mushola, Parkir, WiFi"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Tags (pisahkan koma)</label>
                <input
                  type="text"
                  value={destTags}
                  onChange={(e) => setDestTags(e.target.value)}
                  placeholder="Wisata Alam, Hiking, Kopi"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Cocok Untuk (pisahkan koma)</label>
                <input
                  type="text"
                  value={destSuitable}
                  onChange={(e) => setDestSuitable(e.target.value)}
                  placeholder="Keluarga, Teman, Pasangan"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDestForm(false)}
                className="px-4 py-2 border border-slate-700 rounded-xl text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 font-bold"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Simpan Destinasi
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

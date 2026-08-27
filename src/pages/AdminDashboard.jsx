import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Plus, Edit2, Trash2, Search, LogOut,
  Mountain, Home, Compass, Building2, RefreshCw, X,
  ExternalLink, Eye, CheckCircle, ShieldCheck, Users,
  History, ShieldAlert, AlertTriangle, Smartphone, Monitor,
  Clock, MapPin, Download, Copy, Check
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import trawasHeroBg from '../assets/trawas-hero.jpg';

const AdminDashboard = () => {
  const {
    villages, addVillage, updateVillage, deleteVillage,
    destinations, addDestination, updateDestination, deleteDestination,
    registeredUsers, loginLogs, clearLoginHistory, deleteLoginLog,
    resetToDefaultData
  } = useContext(AppContext);

  // Admin authentication is strictly session-based and resets to logged out on page reload/reset
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear any persistent storage on mount
  React.useEffect(() => {
    localStorage.removeItem('explore_trawas_admin_auth');
  }, []);

  // Tab State: 'overview' | 'destinasi' | 'desa' | 'pengguna' | 'riwayat'
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('semua');
  const [logFilter, setLogFilter] = useState('semua'); // 'semua' | 'admin' | 'user' | 'success' | 'failed'
  const [toastMessage, setToastMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

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

  // If not authenticated, render Protected Admin Login Page
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Format Date & Time in Indonesian
  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch (e) {
      return isoString;
    }
  };

  // Relative Time helper
  const getRelativeTime = (isoString) => {
    if (!isoString) return '';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} hari lalu`;
    } catch (e) {
      return '';
    }
  };

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

  // Filtered Users (who accessed/logged in)
  const filteredUsers = (registeredUsers || []).filter(u =>
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtered Login Logs
  const filteredLogs = (loginLogs || []).filter(log => {
    const matchesSearch =
      (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.ip && log.ip.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.device && log.device.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (logFilter === 'admin') return log.type === 'admin_portal';
    if (logFilter === 'user') return log.type === 'user_web';
    if (logFilter === 'success') return log.status === 'success';
    if (logFilter === 'failed') return log.status === 'failed';
    return true;
  });

  // Security Statistics
  const totalFailedAttempts = (loginLogs || []).filter(l => l.status === 'failed').length;
  const totalAdminLogins = (loginLogs || []).filter(l => l.type === 'admin_portal' && l.status === 'success').length;
  const totalUserLogins = (loginLogs || []).filter(l => l.type === 'user_web' && l.status === 'success').length;

  // Export Log to JSON
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(loginLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-log-trawas-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File log audit berhasil diunduh!');
  };

  // Copy Logs to Clipboard
  const handleCopyLogs = () => {
    const text = loginLogs.map(l => `[${formatDateTime(l.timestamp)}] [${l.status.toUpperCase()}] ${l.role} - ${l.userName} (${l.userEmail}) | IP: ${l.ip} | Device: ${l.device} | Ket: ${l.reason}`).join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('Seluruh riwayat log disalin ke clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans relative overflow-hidden">
      {/* Background Panorama Image with 50% Opacity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={trawasHeroBg}
          alt="Panorama Trawas Background"
          className="w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm font-bold animate-slideUp">
          <CheckCircle className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 relative z-10">
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
              onClick={() => { setActiveTab('overview'); setShowVillageForm(false); setShowDestForm(false); setSearchQuery(''); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Ringkasan / Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('destinasi'); setShowVillageForm(false); setShowDestForm(false); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'destinasi' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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
              onClick={() => { setActiveTab('desa'); setShowVillageForm(false); setShowDestForm(false); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'desa' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
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

            {/* TAB: Pengguna & Pengunjung Web */}
            <button
              onClick={() => { setActiveTab('pengguna'); setShowVillageForm(false); setShowDestForm(false); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pengguna' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4" />
                <span>Pengguna Web</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 font-bold border border-slate-700">
                {registeredUsers?.length || 0}
              </span>
            </button>

            {/* TAB: Riwayat Login & Keamanan */}
            <button
              onClick={() => { setActiveTab('riwayat'); setShowVillageForm(false); setShowDestForm(false); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'riwayat' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <History className="h-4 w-4" />
                <span>Riwayat & Audit Log</span>
              </div>
              {totalFailedAttempts > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-800 animate-pulse">
                  {totalFailedAttempts} Gagal
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                  {loginLogs?.length || 0}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Action: Website Link & Logout */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2 mt-6">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-emerald-400 border border-slate-700/60 transition-all"
          >
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Web Publik
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-grow p-4 md:p-8 space-y-8 overflow-y-auto relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6 bg-slate-900/40 p-4 rounded-2xl backdrop-blur-md">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow">
              {activeTab === 'overview' && 'Overview Statistik & Keamanan Trawas'}
              {activeTab === 'destinasi' && 'Manajemen Destinasi Pariwisata'}
              {activeTab === 'desa' && 'Manajemen 12 Desa Wisata'}
              {activeTab === 'pengguna' && 'Pengguna & Pengunjung yang Mengakses Web'}
              {activeTab === 'riwayat' && 'Histori Login & Audit Keamanan Akses'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              {activeTab === 'pengguna' && 'Pantau siapa saja pengguna yang login, akun Google terdaftar, favorit, dan aktivitasnya.'}
              {activeTab === 'riwayat' && 'Catatan jejak login admin & pengguna publik lengkap untuk mencegah sembarangan orang masuk.'}
              {activeTab !== 'pengguna' && activeTab !== 'riwayat' && 'Kelola, edit, tambah, dan pantau seluruh data informasi pariwisata Kecamatan Trawas.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data desa, destinasi, dan riwayat login ke data default?')) {
                  resetToDefaultData();
                  setIsAuthenticated(false);
                  showToast('Data berhasil direset dan sesi admin ditutup.');
                }
              }}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
              title="Reset ke data awal"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Reset Default
            </button>

            {activeTab === 'destinasi' && (
              <button
                onClick={() => handleOpenDestForm()}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Destinasi
              </button>
            )}

            {activeTab === 'desa' && (
              <button
                onClick={() => handleOpenVillageForm()}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Desa
              </button>
            )}

            {activeTab === 'riwayat' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyLogs}
                  className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
                  title="Salin Log Teks"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1.5 text-slate-400" />}
                  {isCopied ? 'Tersalin' : 'Salin Log'}
                </button>
                <button
                  onClick={handleExportLogs}
                  className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Ekspor Log
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* OVERVIEW TAB CONTENT */}
        {/* --------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Security Alert Banner if there are failed attempts */}
            {totalFailedAttempts > 0 && (
              <div className="bg-rose-950/70 border border-rose-600/50 rounded-2xl p-4 md:p-5 flex items-start space-x-4 shadow-xl backdrop-blur-md">
                <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-grow">
                  <div className="font-bold text-sm text-rose-200 flex items-center space-x-2">
                    <span>Peringatan Keamanan: Terdeteksi {totalFailedAttempts} Percobaan Akses Gagal pada Portal Admin</span>
                  </div>
                  <p className="text-xs text-rose-300/80">
                    Sistem mendeteksi adanya percobaan login dengan password/username salah. Seluruh alamat IP, perangkat, dan waktunya tercatat di tab <strong>Riwayat & Audit Log</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('riwayat')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Periksa Log
                </button>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Desa Wisata</div>
                <div className="text-3xl font-black text-white">{villages.length} <span className="text-xs text-emerald-400 font-semibold">Desa</span></div>
                <div className="text-[11px] text-slate-400">Mencakup 12 desa Trawas</div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Objek Destinasi</div>
                <div className="text-3xl font-black text-emerald-400">{destinations.length} <span className="text-xs text-slate-400 font-semibold">Lokasi</span></div>
                <div className="text-[11px] text-slate-400">Wisata alam, kafe, & kuliner</div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Pengguna yang Mengakses</div>
                <div className="text-3xl font-black text-teal-400">
                  {registeredUsers?.length || 0} <span className="text-xs text-slate-400 font-semibold">Akun</span>
                </div>
                <div className="text-[11px] text-slate-400">Pengguna login & aktif di web</div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl space-y-2 shadow-xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Audit Log Keamanan</div>
                <div className="text-3xl font-black text-cyan-400">
                  {loginLogs?.length || 0} <span className="text-xs text-slate-400 font-semibold">Catatan</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {totalFailedAttempts > 0 ? `${totalFailedAttempts} percobaan gagal` : 'Sistem beroperasi aman'}
                </div>
              </div>
            </div>

            {/* Quick Two-Column Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Logins Widget */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <History className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">Aktivitas Login Terbaru</h3>
                  </div>
                  <button onClick={() => setActiveTab('riwayat')} className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer">
                    Lihat Semua Log &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(loginLogs || []).length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      <History className="h-7 w-7 mx-auto text-slate-600 mb-2" />
                      <div className="text-slate-400 font-semibold">Belum Ada Aktivitas Login</div>
                      <p className="text-[11px] text-slate-600 mt-0.5">Riwayat login akan tercatat otomatis saat ada pengguna atau admin yang masuk.</p>
                    </div>
                  ) : (
                    (loginLogs || []).slice(0, 4).map((log) => (
                      <div key={log.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${log.status === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                            {log.device?.includes('Mobile') || log.device?.includes('iPhone') || log.device?.includes('Android') ? (
                              <Smartphone className="h-4 w-4" />
                            ) : (
                              <Monitor className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white">{log.userName}</div>
                            <div className="text-[11px] text-slate-400">{log.userEmail} • {log.ip}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'success' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50' : 'bg-rose-900/40 text-rose-300 border border-rose-700/50'
                          }`}>
                            {log.status === 'success' ? 'Berhasil' : 'Gagal'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{getRelativeTime(log.timestamp)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sebaran Destinasi Widget */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">Sebaran Destinasi per Desa</h3>
                  </div>
                  <button onClick={() => setActiveTab('destinasi')} className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer">
                    Kelola Destinasi &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {villages.map(v => {
                    const count = destinations.filter(d => d.village_id === v.id).length;
                    return (
                      <div key={v.id} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300 truncate mr-1">Desa {v.name}</span>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------- */}
        {/* PENGGUNA & PENGUNJUNG WEB TAB */}
        {/* --------------------------------------------- */}
        {activeTab === 'pengguna' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header / Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Total Pengguna Masuk</div>
                  <div className="text-2xl font-black text-white">{registeredUsers?.length || 0} Akun</div>
                </div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Metode Google OAuth</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {(registeredUsers || []).filter(u => u.provider === 'google').length} Akun
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 shadow-lg">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Aktivitas Terbaru</div>
                  <div className="text-sm font-black text-slate-200">
                    {registeredUsers && registeredUsers[0]?.lastActiveAt ? getRelativeTime(registeredUsers[0].lastActiveAt) : 'Hari ini'}
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-4">
              {/* Search Bar */}
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama pengguna atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                  />
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Menampilkan {filteredUsers.length} pengguna
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Profil Pengguna</th>
                      <th className="px-6 py-3.5">Email</th>
                      <th className="px-6 py-3.5">Metode Login</th>
                      <th className="px-6 py-3.5">Terakhir Aktif</th>
                      <th className="px-6 py-3.5 text-center">Favorit</th>
                      <th className="px-6 py-3.5 text-center">Ulasan</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          <Users className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                          <div className="font-bold text-white text-sm">Belum Ada Pengguna yang Login</div>
                          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Saat pengunjung login ke web dengan akun Google atau email, profil mereka akan otomatis terdaftar dan dipantau di sini.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-800"
                              />
                              <div>
                                <div className="font-bold text-white text-sm">{u.name}</div>
                                <div className="text-[10px] text-slate-400">ID: {u.id.slice(0, 14)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-medium">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-teal-300 border border-teal-500/30 uppercase">
                              {u.provider === 'google' ? 'Google OAuth' : 'Email Manual'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-200">{formatDateTime(u.lastActiveAt || u.joinedAt)}</div>
                            <div className="text-[10px] text-emerald-400 font-medium">{getRelativeTime(u.lastActiveAt || u.joinedAt)}</div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-rose-400">
                            {u.totalFavorites || 0} tempat
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-amber-400">
                            {u.totalReviews || 0} review
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                              Terdaftar & Aktif
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------- */}
        {/* RIWAYAT & AUDIT LOG KEAMANAN TAB */}
        {/* --------------------------------------------- */}
        {activeTab === 'riwayat' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Security Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-lg">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Percobaan Login</div>
                <div className="text-2xl font-black text-white mt-1">{loginLogs?.length || 0}</div>
                <div className="text-[11px] text-slate-400">Seluruh jejak autentikasi</div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-lg">
                <div className="text-xs text-slate-400 font-bold uppercase">Login Admin Berhasil</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{totalAdminLogins} Sesi</div>
                <div className="text-[11px] text-slate-400">Sesi pengelola resmi</div>
              </div>

              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-lg">
                <div className="text-xs text-slate-400 font-bold uppercase">Login Pengguna Web</div>
                <div className="text-2xl font-black text-teal-400 mt-1">{totalUserLogins} Sesi</div>
                <div className="text-[11px] text-slate-400">Pengunjung dengan akun Google/Email</div>
              </div>

              <div className={`p-4 rounded-2xl shadow-lg border backdrop-blur-md ${
                totalFailedAttempts > 0 ? 'bg-rose-950/70 border-rose-700/60' : 'bg-slate-900/85 border-slate-800'
              }`}>
                <div className="text-xs text-slate-400 font-bold uppercase">Percobaan Akses Gagal</div>
                <div className={`text-2xl font-black mt-1 ${totalFailedAttempts > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                  {totalFailedAttempts} Kali
                </div>
                <div className="text-[11px] text-slate-400">
                  {totalFailedAttempts > 0 ? 'Potensi akses tidak sah diaudit' : 'Tidak ada ancaman keamanan'}
                </div>
              </div>
            </div>

            {/* Filter and Table Container */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-4">
              {/* Filter Chips & Search */}
              <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
                  <button
                    onClick={() => setLogFilter('semua')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      logFilter === 'semua' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua Log ({loginLogs?.length || 0})
                  </button>
                  <button
                    onClick={() => setLogFilter('admin')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      logFilter === 'admin' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Portal Admin ({totalAdminLogins + (loginLogs?.filter(l => l.type === 'admin_portal' && l.status === 'failed').length || 0)})
                  </button>
                  <button
                    onClick={() => setLogFilter('user')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      logFilter === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Pengguna Web ({totalUserLogins})
                  </button>
                  <button
                    onClick={() => setLogFilter('failed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      logFilter === 'failed' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-rose-400 hover:text-white'
                    }`}
                  >
                    Gagal / Ancaman ({totalFailedAttempts})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari user, email, IP, perangkat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Audit Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Waktu Login</th>
                      <th className="px-5 py-3.5">Akun / Identitas</th>
                      <th className="px-5 py-3.5">Akses Portal</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Perangkat & Browser</th>
                      <th className="px-5 py-3.5">Alamat IP & Lokasi</th>
                      <th className="px-5 py-3.5">Keterangan</th>
                      <th className="px-5 py-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                          Tidak ada catatan log audit yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className={`transition-colors ${
                            log.status === 'failed' ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-semibold text-white">{formatDateTime(log.timestamp)}</div>
                            <div className="text-[10px] text-slate-400">{getRelativeTime(log.timestamp)}</div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-bold text-white">{log.userName}</div>
                            <div className="text-[11px] text-slate-400">{log.userEmail}</div>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold ${
                              log.type === 'admin_portal'
                                ? (log.status === 'success' ? 'bg-amber-950 text-amber-300 border border-amber-700/50' : 'bg-rose-950 text-rose-300 border border-rose-700/50')
                                : 'bg-teal-950 text-teal-300 border border-teal-700/50'
                            }`}>
                              {log.role}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            {log.type === 'admin_portal' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-600/40">
                                🛡️ Portal Admin
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-600/40">
                                🌐 Website Publik
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            {log.status === 'success' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-900/50 text-emerald-300 border border-emerald-500/50">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Berhasil
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-900/60 text-rose-300 border border-rose-500/60">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                GAGAL
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            <div className="flex items-center space-x-1.5">
                              {log.device?.includes('Mobile') || log.device?.includes('iPhone') || log.device?.includes('Android') ? (
                                <Smartphone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              ) : (
                                <Monitor className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="truncate max-w-xs">{log.device || '-'}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                              <span className="font-mono text-[11px] text-slate-300">{log.ip || '-'}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-slate-300 max-w-xs truncate">
                            <span className={log.status === 'failed' ? 'text-rose-300 font-semibold' : 'text-slate-300'}>
                              {log.reason || '-'}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => {
                                deleteLoginLog(log.id);
                                showToast('Catatan log dihapus.');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-400 hover:text-white cursor-pointer transition-colors"
                              title="Hapus baris log ini"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <div>
                  Total {filteredLogs.length} dari {loginLogs?.length || 0} catatan riwayat log tersimpan.
                </div>
                <button
                  onClick={() => {
                    if (confirm('Yakin ingin mengosongkan seluruh riwayat login dan audit keamanan?')) {
                      clearLoginHistory();
                      showToast('Seluruh riwayat log berhasil dibersihkan.');
                    }
                  }}
                  className="text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer"
                >
                  Bersihkan Seluruh Riwayat Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------- */}
        {/* DESTINASI & DESA TABLES (Tab 'destinasi' & 'desa') */}
        {/* --------------------------------------------- */}
        {(activeTab === 'destinasi' || activeTab === 'desa') && !showVillageForm && !showDestForm && (
          <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 animate-fadeIn">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-3">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'destinasi' ? "Cari nama destinasi, subkategori..." : "Cari nama desa..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                />
              </div>

              {activeTab === 'destinasi' && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-300 font-semibold">Filter Desa:</span>
                  <select
                    value={selectedVillageFilter}
                    onChange={(e) => setSelectedVillageFilter(e.target.value)}
                    className="bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
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
                        <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{d.name}</td>
                          <td className="px-6 py-4 text-slate-300">Desa {v ? v.name : '-'}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 capitalize">
                              {d.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{d.subcategory}</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">
                            {d.price === 0 ? 'Gratis' : `Rp ${d.price.toLocaleString('id-ID')}`}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Link
                                to={`/destinasi/${d.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Lihat Halaman Publik"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenDestForm(d)}
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600 text-slate-300 hover:text-white cursor-pointer"
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
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer"
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
                  <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
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
                        <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">Desa {v.name}</td>
                          <td className="px-6 py-4 text-slate-300">{v.location}</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{count} Destinasi</td>
                          <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{v.description}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Link
                                to={`/desa/${v.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Lihat Halaman Publik"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenVillageForm(v)}
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600 text-slate-300 hover:text-white cursor-pointer"
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
                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer"
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
          <form onSubmit={handleSaveVillage} className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 animate-slideUp text-xs">
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
                  placeholder="Contoh: Ketapanrame"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Lokasi / Wilayah</label>
                <input
                  type="text"
                  required
                  value={villageLocation}
                  onChange={(e) => setVillageLocation(e.target.value)}
                  placeholder="Kecamatan Trawas, Kabupaten Mojokerto"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-300 uppercase">Deskripsi Desa</label>
                <textarea
                  rows={3}
                  required
                  value={villageDescription}
                  onChange={(e) => setVillageDescription(e.target.value)}
                  placeholder="Deskripsi keunggulan, pesona alam, dan keunikan desa wisata..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">URL Gambar / Foto Desa</label>
                <input
                  type="url"
                  required
                  value={villageImage}
                  onChange={(e) => setVillageImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Catatan Aksesibilitas</label>
                <input
                  type="text"
                  value={villageAccess}
                  onChange={(e) => setVillageAccess(e.target.value)}
                  placeholder="Akses jalan aspal, motor dan mobil..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowVillageForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                {editingVillage ? 'Simpan Perubahan' : 'Tambah Desa'}
              </button>
            </div>
          </form>
        )}

        {/* Modal / Form Destination */}
        {showDestForm && (
          <form onSubmit={handleSaveDest} className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 animate-slideUp text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingDest ? `Edit Destinasi ${editingDest.name}` : 'Tambah Destinasi Wisata Baru'}
              </h2>
              <button type="button" onClick={() => setShowDestForm(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-300 uppercase">Nama Destinasi</label>
                <input
                  type="text"
                  required
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder="Contoh: Air Terjun Dlundung"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Desa Lokasi</label>
                <select
                  value={destVillageId}
                  onChange={(e) => setDestVillageId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {villages.map(v => (
                    <option key={v.id} value={v.id}>Desa {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Kategori Utama</label>
                <select
                  value={destCategory}
                  onChange={(e) => setDestCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="wisata">Wisata Alam & Budaya</option>
                  <option value="kafe">Kafe & Spot Ngopi</option>
                  <option value="kuliner">Kuliner & Resto</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Subkategori</label>
                <input
                  type="text"
                  required
                  value={destSubcategory}
                  onChange={(e) => setDestSubcategory(e.target.value)}
                  placeholder="Contoh: Air Terjun & Camping"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Harga Tiket Masuk / Kisaran (Rp)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={destPrice}
                  onChange={(e) => setDestPrice(e.target.value)}
                  placeholder="0 untuk gratis"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="font-bold text-slate-300 uppercase">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  required
                  value={destDescription}
                  onChange={(e) => setDestDescription(e.target.value)}
                  placeholder="Penjelasan daya tarik destinasi, fasilitas, dan keunikan..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="font-bold text-slate-300 uppercase">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  placeholder="Nama dusun, Desa..., Kec. Trawas"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Jam Operasional</label>
                <input
                  type="text"
                  required
                  value={destOpeningHours}
                  onChange={(e) => setDestOpeningHours(e.target.value)}
                  placeholder="08:00 - 17:00 WIB"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="font-bold text-slate-300 uppercase">URL Gambar / Foto</label>
                <input
                  type="url"
                  required
                  value={destImage}
                  onChange={(e) => setDestImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Fasilitas (Pisahkan Koma)</label>
                <input
                  type="text"
                  value={destFacilities}
                  onChange={(e) => setDestFacilities(e.target.value)}
                  placeholder="Area Parkir, Mushola, Toilet"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Tags (Pisahkan Koma)</label>
                <input
                  type="text"
                  value={destTags}
                  onChange={(e) => setDestTags(e.target.value)}
                  placeholder="Alam, Instagramable, Keluarga"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Cocok Untuk</label>
                <input
                  type="text"
                  value={destSuitable}
                  onChange={(e) => setDestSuitable(e.target.value)}
                  placeholder="Keluarga, Pasangan, Teman"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDestForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                {editingDest ? 'Simpan Perubahan' : 'Tambah Destinasi'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, MapPin, Tag, Landmark, Sparkles, X, Check, Save } from 'lucide-react';

const AdminDashboard = () => {
  const {
    villages, addVillage, updateVillage, deleteVillage,
    destinations, addDestination, updateDestination, deleteDestination,
    resetToDefaultData
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('destinasi'); // 'destinasi' or 'desa'

  // Village Form State
  const [showVillageForm, setShowVillageForm] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [villageName, setVillageName] = useState('');
  const [villageLocation, setVillageLocation] = useState('');
  const [villageDescription, setVillageDescription] = useState('');
  const [villageImage, setVillageImage] = useState('');

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

  // CRUD Village Handlers
  const handleOpenVillageForm = (v = null) => {
    if (v) {
      setEditingVillage(v);
      setVillageName(v.name);
      setVillageLocation(v.location);
      setVillageDescription(v.description);
      setVillageImage(v.image);
    } else {
      setEditingVillage(null);
      setVillageName('');
      setVillageLocation('Trawas, Mojokerto');
      setVillageDescription('');
      setVillageImage('/trawas-hero.jpg');
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
      image: villageImage
    };

    if (editingVillage) {
      updateVillage({ ...editingVillage, ...data });
    } else {
      addVillage(data);
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
      setDestVillageId(villages[0]?.id.toString() || '');
      setDestCategory('wisata');
      setDestSubcategory('');
      setDestDescription('');
      setDestAddress('');
      setDestLatitude('-7.6749');
      setDestLongitude('112.6318');
      setDestOpeningHours('08:00 - 17:00 WIB');
      setDestPrice('10000');
      setDestContact('-');
      setDestImage('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80');
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
    } else {
      addDestination(data);
    }

    setShowDestForm(false);
    setEditingDest(null);
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Administrator</h1>
          <p className="text-slate-500 text-sm">Kelola data desa wisata dan destinasi pariwisata Kecamatan Trawas.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('destinasi'); setShowVillageForm(false); setShowDestForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'destinasi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Destinasi ({destinations.length})
          </button>
          <button
            onClick={() => { setActiveTab('desa'); setShowVillageForm(false); setShowDestForm(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'desa' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Desa ({villages.length})
          </button>
        </div>
      </div>

      {/* Main Grid CRUD List */}
      {!showVillageForm && !showDestForm ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
          {/* Action Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-wrap gap-2">
            <h3 className="font-bold text-slate-900 capitalize">
              Daftar {activeTab === 'destinasi' ? 'Destinasi Wisata' : 'Desa Trawas'}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan semua data desa dan destinasi ke data default terbaru?')) {
                    resetToDefaultData();
                  }
                }}
                className="inline-flex items-center justify-center px-3.5 py-2 border border-slate-200 hover:border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer"
              >
                🔄 Reset Data Default
              </button>
              <button
                onClick={() => activeTab === 'destinasi' ? handleOpenDestForm() : handleOpenVillageForm()}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Baru
              </button>
            </div>
          </div>

          {/* List Rendering */}
          <div className="overflow-x-auto">
            {activeTab === 'destinasi' ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Nama</th>
                    <th className="px-6 py-3.5">Desa</th>
                    <th className="px-6 py-3.5">Kategori</th>
                    <th className="px-6 py-3.5">Subkategori</th>
                    <th className="px-6 py-3.5">Harga Tiket</th>
                    <th className="px-6 py-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {destinations.map((d) => {
                    const destVillage = villages.find(v => v.id === d.village_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-950">{d.name}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center text-xs text-slate-500 font-medium">
                            <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                            {destVillage ? destVillage.name : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 capitalize">
                            {d.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{d.subcategory}</td>
                        <td className="px-6 py-4 font-bold text-emerald-700 text-xs">
                          {d.price === 0 ? 'Gratis' : `Rp ${d.price.toLocaleString('id-ID')}`}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleOpenDestForm(d)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { if (confirm('Hapus destinasi ini?')) deleteDestination(d.id); }}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Nama Desa</th>
                    <th className="px-6 py-3.5">Lokasi</th>
                    <th className="px-6 py-3.5">Deskripsi Singkat</th>
                    <th className="px-6 py-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {villages.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-950">{v.name}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{v.location}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{v.description}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenVillageForm(v)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { if (confirm('Menghapus desa juga akan menghapus destinasi di dalamnya. Lanjutkan?')) deleteVillage(v.id); }}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : null}

      {/* CRUD Forms Area */}
      {/* Village Form */}
      {showVillageForm && (
        <form onSubmit={handleSaveVillage} className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6 animate-slideUp">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {editingVillage ? `Edit Desa ${editingVillage.name}` : 'Tambah Desa Wisata Baru'}
            </h2>
            <button type="button" onClick={() => setShowVillageForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Nama Desa</label>
              <input
                type="text"
                required
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="e.g. Ketapanrame"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Lokasi / Wilayah</label>
              <input
                type="text"
                required
                value={villageLocation}
                onChange={(e) => setVillageLocation(e.target.value)}
                placeholder="e.g. Trawas, Mojokerto"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Deskripsi Desa</label>
              <textarea
                required
                rows={4}
                value={villageDescription}
                onChange={(e) => setVillageDescription(e.target.value)}
                placeholder="Jelaskan karakteristik, prestasi, dan potensi alam desa..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              ></textarea>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">URL Gambar / Foto</label>
              <input
                type="url"
                required
                value={villageImage}
                onChange={(e) => setVillageImage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowVillageForm(false)}
              className="px-5 py-2 border rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-full shadow-sm text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Simpan Desa
            </button>
          </div>
        </form>
      )}

      {/* Destination Form */}
      {showDestForm && (
        <form onSubmit={handleSaveDest} className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6 animate-slideUp">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {editingDest ? `Edit Destinasi ${editingDest.name}` : 'Tambah Destinasi Baru'}
            </h2>
            <button type="button" onClick={() => setShowDestForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Nama Destinasi</label>
              <input
                type="text"
                required
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                placeholder="e.g. Air Terjun Dlundung"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Desa Asal</label>
              <select
                value={destVillageId}
                onChange={(e) => setDestVillageId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700"
              >
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Kategori</label>
              <select
                value={destCategory}
                onChange={(e) => setDestCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700"
              >
                <option value="wisata">Wisata Alam / Keluarga</option>
                <option value="kafe">Kafe / Kopi</option>
                <option value="kuliner">Kuliner Tradisional</option>
                <option value="hidden-gem">Hidden Gem</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Subkategori</label>
              <input
                type="text"
                required
                value={destSubcategory}
                onChange={(e) => setDestSubcategory(e.target.value)}
                placeholder="e.g. Air Terjun, Coffee Shop, etc."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Jam Operasional</label>
              <input
                type="text"
                required
                value={destOpeningHours}
                onChange={(e) => setDestOpeningHours(e.target.value)}
                placeholder="e.g. 08:00 - 17:00 WIB"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Harga Tiket Masuk / Kisaran (Rupiah)</label>
              <input
                type="number"
                required
                value={destPrice}
                onChange={(e) => setDestPrice(e.target.value)}
                placeholder="e.g. 15000 (0 jika gratis)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Latitude Koordinat</label>
              <input
                type="text"
                required
                value={destLatitude}
                onChange={(e) => setDestLatitude(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Longitude Koordinat</label>
              <input
                type="text"
                required
                value={destLongitude}
                onChange={(e) => setDestLongitude(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Nomor Kontak / WhatsApp</label>
              <input
                type="text"
                value={destContact}
                onChange={(e) => setDestContact(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Deskripsi Destinasi</label>
              <textarea
                required
                rows={4}
                value={destDescription}
                onChange={(e) => setDestDescription(e.target.value)}
                placeholder="Tulis informasi detail mengenai tempat ini..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              ></textarea>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">URL Gambar / Foto Utama</label>
              <input
                type="url"
                required
                value={destImage}
                onChange={(e) => setDestImage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Fasilitas (pisahkan dengan koma)</label>
              <input
                type="text"
                value={destFacilities}
                onChange={(e) => setDestFacilities(e.target.value)}
                placeholder="Toilet, Mushola, Parkir, WiFi"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Tags / Label (pisahkan dengan koma)</label>
              <input
                type="text"
                value={destTags}
                onChange={(e) => setDestTags(e.target.value)}
                placeholder="Wisata Alam, Hiking, Kopi Susu"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">Cocok Untuk (pisahkan dengan koma)</label>
              <input
                type="text"
                value={destSuitable}
                onChange={(e) => setDestSuitable(e.target.value)}
                placeholder="Keluarga, Teman, Pasangan, Petualang"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowDestForm(false)}
              className="px-5 py-2 border rounded-full text-slate-500 hover:bg-slate-50 text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-full shadow-sm text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Simpan Destinasi
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;

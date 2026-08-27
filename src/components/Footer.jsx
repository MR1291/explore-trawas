import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">
                Explore Trawas
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform pusat informasi pariwisata Kecamatan Trawas, Kabupaten Mojokerto, Jawa Timur. Jelajahi pesona alam pegunungan, desa wisata berprestasi, kuliner lokal, dan spot menarik.
            </p>
            <div className="flex items-center text-xs text-slate-400">
              <MapPin className="h-4 w-4 mr-1.5 text-emerald-400 shrink-0" />
              <span>Kecamatan Trawas, Mojokerto, Jawa Timur</span>
            </div>
          </div>

          {/* Navigasi Utama */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigasi Utama</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/destinasi" className="hover:text-emerald-400 transition-colors">Jelajahi Semua Destinasi</Link>
              </li>
              <li>
                <Link to="/peta" className="hover:text-emerald-400 transition-colors">Peta Interaktif Trawas</Link>
              </li>
              <li>
                <Link to="/favorit" className="hover:text-emerald-400 transition-colors">Tempat Favorit Saya</Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-emerald-400 transition-colors">Profil & Aktivitas Saya</Link>
              </li>
            </ul>
          </div>

          {/* Kawasan 12 Desa */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Desa Wisata Trawas</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <Link to="/desa/ketapanrame" className="hover:text-emerald-400 transition-colors">Desa Ketapanrame</Link>
              <Link to="/desa/tamiajeng" className="hover:text-emerald-400 transition-colors">Desa Tamiajeng</Link>
              <Link to="/desa/kedungudi" className="hover:text-emerald-400 transition-colors">Desa Kedungudi</Link>
              <Link to="/desa/jatijejer" className="hover:text-emerald-400 transition-colors">Desa Jatijejer</Link>
              <Link to="/desa/seloliman" className="hover:text-emerald-400 transition-colors">Desa Seloliman</Link>
              <Link to="/desa/sukosari" className="hover:text-emerald-400 transition-colors">Desa Sukosari</Link>
              <Link to="/desa/trawas" className="hover:text-emerald-400 transition-colors">Desa Trawas</Link>
              <Link to="/desa/selotapak" className="hover:text-emerald-400 transition-colors">Desa Selotapak</Link>
              <Link to="/desa/kesiman" className="hover:text-emerald-400 transition-colors">Desa Kesiman</Link>
              <Link to="/desa/belik" className="hover:text-emerald-400 transition-colors">Desa Belik</Link>
              <Link to="/desa/duyung" className="hover:text-emerald-400 transition-colors">Desa Duyung</Link>
              <Link to="/desa/sugeng" className="hover:text-emerald-400 transition-colors">Desa Sugeng</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 Explore Trawas. Platform Informasi Pariwisata Trawas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

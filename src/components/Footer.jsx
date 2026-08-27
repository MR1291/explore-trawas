import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
          {/* Logo & Description */}
          <div className="space-y-3 max-w-md">
            <Link to="/" className="inline-flex items-center space-x-2">
              <Mountain className="h-7 w-7 text-emerald-400" />
              <span className="text-xl font-black text-white">
                Explore Trawas
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform pusat informasi pariwisata Kecamatan Trawas, Kabupaten Mojokerto, Jawa Timur. Jelajahi pesona alam pegunungan, desa wisata berprestasi, kuliner lokal, dan spot menarik.
            </p>
            <div className="inline-flex items-center text-xs text-slate-400 pt-1">
              <MapPin className="h-4 w-4 mr-1.5 text-emerald-400 shrink-0" />
              <span>Kecamatan Trawas, Mojokerto, Jawa Timur</span>
            </div>
          </div>

          {/* Navigasi Utama */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Navigasi Utama</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
              <Link to="/" className="hover:text-emerald-400 transition-colors">Beranda</Link>
              <Link to="/destinasi" className="hover:text-emerald-400 transition-colors">Semua Destinasi</Link>
              <Link to="/peta" className="hover:text-emerald-400 transition-colors">Peta Interaktif</Link>
              <Link to="/favorit" className="hover:text-emerald-400 transition-colors">Favorit Saya</Link>
              <Link to="/profil" className="hover:text-emerald-400 transition-colors">Profil Saya</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 Explore Trawas. Platform Informasi Pariwisata Trawas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

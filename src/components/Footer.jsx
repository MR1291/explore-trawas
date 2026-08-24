import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">
                Explore Trawas
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Platform pusat informasi pariwisata Kecamatan Trawas, Kabupaten Mojokerto, Jawa Timur. Jelajahi pesona alam pegunungan, desa wisata berprestasi, kuliner lokal, dan hidden gem menarik.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-600 rounded-full hover:text-white transition-colors flex items-center justify-center w-9 h-9" title="Instagram">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-600 rounded-full hover:text-white transition-colors flex items-center justify-center w-9 h-9" title="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.42 0-4 1.35-4 4v2z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-600 rounded-full hover:text-white transition-colors flex items-center justify-center w-9 h-9" title="Youtube">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.516 3.5 12 3.5 12 3.5s-7.516 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.037 0 12 0 12s0 3.963.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.484 20.5 12 20.5 12 20.5s7.516 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.963 24 12 24 12s0-3.963-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/destinasi" className="hover:text-emerald-400 transition-colors">Semua Destinasi</Link>
              </li>
              <li>
                <Link to="/peta" className="hover:text-emerald-400 transition-colors">Peta Interaktif</Link>
              </li>
              <li>
                <Link to="/favorit" className="hover:text-emerald-400 transition-colors">Favorit Saya</Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-emerald-400 transition-colors">Profil & Aktivitas Saya</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-emerald-400 shrink-0" />
                <span>Kecamatan Trawas, Mojokerto, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-emerald-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-400 shrink-0" />
                <span>info@exploretrawas.id</span>
              </li>
            </ul>
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

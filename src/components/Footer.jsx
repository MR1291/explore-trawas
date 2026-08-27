import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 max-w-xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Mountain className="h-7 w-7 text-emerald-400" />
            <span className="text-xl font-black text-white">
              Explore Trawas
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Platform pusat informasi pariwisata Kecamatan Trawas, Kabupaten Mojokerto, Jawa Timur. Jelajahi pesona alam pegunungan, desa wisata berprestasi, kuliner lokal, dan spot menarik.
          </p>
          <div className="inline-flex items-center text-xs text-slate-400">
            <MapPin className="h-4 w-4 mr-1.5 text-emerald-400 shrink-0" />
            <span>Kecamatan Trawas, Mojokerto, Jawa Timur</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          <p>© 2026 Explore Trawas. Platform Informasi Pariwisata Trawas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

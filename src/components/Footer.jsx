import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Mountain className="h-7 w-7 text-emerald-400" />
            <span className="text-2xl font-black text-white">
              Explore Trawas
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Platform pusat informasi pariwisata terpadu Kecamatan Trawas, Kabupaten Mojokerto, Jawa Timur. Jelajahi pesona alam pegunungan, desa wisata, kuliner lokal, dan spot menarik.
          </p>
          <div className="inline-flex items-center text-xs text-slate-400">
            <MapPin className="h-4 w-4 mr-1.5 text-emerald-400 shrink-0" />
            <span>Kecamatan Trawas, Mojokerto, Jawa Timur</span>
          </div>
        </div>

        {/* Partners & Competition Showcase Strip */}
        <div className="mt-10 pt-8 border-t border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Award className="w-4 h-4 text-orange-400" />
              <span>Jagoan Hosting Innovation Competition 2026</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-xs text-slate-400">Mitra Penyelenggara &amp; Pendukung Resmi</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {/* 1. Innovation Competition 2026 Badge */}
            <div className="bg-white/95 hover:bg-white rounded-xl p-2.5 px-4 h-14 flex items-center justify-center shadow-md transition-all hover:scale-105" title="Jagoan Hosting Innovation Competition 2026">
              <img
                src="/partners/innovation-competition-2026.png"
                alt="Jagoan Hosting Innovation Competition 2026"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* 2. Jagoan Hosting */}
            <a
              href="https://www.jagoanhosting.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 hover:bg-white rounded-xl p-2.5 px-4 h-14 flex items-center justify-center shadow-md transition-all hover:scale-105"
              title="Jagoan Hosting"
            >
              <img
                src="/partners/jagoan-hosting.png"
                alt="Jagoan Hosting"
                className="h-7 w-auto object-contain"
              />
            </a>

            {/* 3. KOMDIGI */}
            <a
              href="https://www.komdigi.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 hover:bg-white rounded-xl p-2.5 px-4 h-14 flex items-center justify-center shadow-md transition-all hover:scale-105"
              title="Kementerian Komunikasi dan Digital RI"
            >
              <img
                src="/partners/komdigi.png"
                alt="KOMDIGI"
                className="h-8 w-auto object-contain"
              />
            </a>

            {/* 4. Garuda Spark */}
            <div className="bg-white/95 hover:bg-white rounded-xl p-2.5 px-4 h-14 flex items-center justify-center shadow-md transition-all hover:scale-105" title="Garuda Spark Innovation Hub by KOMDIGI">
              <img
                src="/partners/garuda-spark.png"
                alt="Garuda Spark Innovation Hub"
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* 5. Ngalup.co */}
            <a
              href="https://ngalup.co"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 hover:bg-white rounded-xl p-2.5 px-4 h-14 flex items-center justify-center shadow-md transition-all hover:scale-105"
              title="NGALUP.CO"
            >
              <img
                src="/partners/ngalup-co.png"
                alt="NGALUP.CO"
                className="h-6 w-auto object-contain"
              />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>© 2026 Explore Trawas. Platform Informasi Pariwisata Trawas. Dikembangkan untuk Jagoan Hosting Innovation Competition 2026.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


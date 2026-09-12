import React from 'react';
import { Award, Sparkles, ExternalLink } from 'lucide-react';

const partnersData = [
  {
    name: 'Jagoan Hosting',
    role: 'Penyelenggara & Cloud Partner',
    description: 'Penyedia layanan cloud hosting, VPS, dan infrastruktur digital terpercaya di Indonesia.',
    logo: '/partners/jagoan-hosting.png',
    url: 'https://www.jagoanhosting.com',
    badge: 'Main Organizer',
    badgeColor: 'bg-orange-500/10 text-orange-600 border-orange-200',
  },
  {
    name: 'KOMDIGI',
    role: 'Kementerian Komunikasi dan Digital RI',
    description: 'Mendukung percepatan transformasi digital, talenta teknologi, dan pariwisata cerdas nasional.',
    logo: '/partners/komdigi.png',
    url: 'https://www.komdigi.go.id',
    badge: 'Pemerintah RI',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
  },
  {
    name: 'Garuda Spark Innovation Hub',
    role: 'Ecosystem Partner by KOMDIGI',
    description: 'Pusat akselerasi inovasi digital dan inkubasi talenta kreatif masa depan Indonesia.',
    logo: '/partners/garuda-spark.png',
    badge: 'Innovation Hub',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  },
  {
    name: 'NGALUP.CO',
    role: 'Collaborative Community Partner',
    description: 'Platform kolaboratif penggerak ekosistem startup, komunitas kreatif, dan talenta digital.',
    logo: '/partners/ngalup-co.png',
    url: 'https://ngalup.co',
    badge: 'Co-Host / Partner',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  },
];

const PartnersSection = () => {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/70 font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 shadow-xs">
            <Award className="w-4 h-4 text-orange-600" />
            <span>Karya Resmi Jagoan Hosting Innovation Competition 2026</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Didukung & Diselenggarakan Oleh
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Platform <strong>Explore Trawas</strong> dikembangkan sebagai solusi digital terintegrasi untuk pariwisata lokal, berpartisipasi aktif dalam ajang inovasi teknologi nasional bersama para mitra kolaborator terkemuka.
          </p>
        </div>

        {/* Featured Centerpiece Banner: Innovation Competition 2026 */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 text-white p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden border border-slate-700/60">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Innovation Competition 2026 Edition</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                Mendorong Kemajuan Pariwisata Trawas Melalui Transformasi Digital
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Proyek ini menghadirkan sistem direktori 12 desa, verifikasi kontak resmi pengelola Google Maps, peta interaktif terpadu, serta estimasi rute perjalanan untuk memajukan pariwisata berkelanjutan di lereng Penanggungan & Welirang.
              </p>
            </div>

            {/* Emblem / Badge Showcase */}
            <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 shadow-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
              <img
                src="/partners/innovation-competition-2026.png"
                alt="Jagoan Hosting Innovation Competition 2026"
                className="h-28 sm:h-36 w-auto object-contain drop-shadow-md"
              />
              <span className="text-[11px] font-bold text-orange-300 mt-2 uppercase tracking-wider">
                Official Competition Badge
              </span>
            </div>
          </div>
        </div>

        {/* 4 Partner Logo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnersData.map((partner, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Badge */}
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${partner.badgeColor}`}>
                    {partner.badge}
                  </span>
                  {partner.url && (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title={`Kunjungi situs resmi ${partner.name}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Logo Container */}
                <div className="h-20 flex items-center justify-center p-2 bg-slate-50/70 rounded-xl group-hover:bg-slate-50 transition-colors">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-14 max-w-[85%] object-contain filter group-hover:brightness-105 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info Text */}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{partner.name}</h4>
                  <p className="text-[11px] font-semibold text-emerald-700">{partner.role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {partner.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

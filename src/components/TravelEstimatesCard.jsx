import React, { useState } from 'react';
import { Clock, Navigation, Car, AlertTriangle, Bus, Bike } from 'lucide-react';
import { travelEstimatesData } from '../data/mockData';

const TravelEstimatesCard = ({ villageSlug = null, villageName = null }) => {
  const [selectedCityId, setSelectedCityId] = useState('surabaya');

  const selectedCity = travelEstimatesData.cities.find(c => c.id === selectedCityId) || travelEstimatesData.cities[0];
  const villageSpecific = villageSlug && travelEstimatesData.villageSpecificEstimates[villageSlug]
    ? travelEstimatesData.villageSpecificEstimates[villageSlug]
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <Navigation className="h-4 w-4" />
            <span>Panduan Akses & Estimasi Waktu Tempuh</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">
            {villageName ? `Rute Menuju Desa ${villageName}` : 'Estimasi Perjalanan ke Kawasan Trawas'}
          </h3>
          <p className="text-slate-500 text-xs md:text-sm">
            Pilih kota asal Anda untuk melihat perkiraan durasi perjalanan dan panduan rute terbaik.
          </p>
        </div>

        {/* City Selector Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          {travelEstimatesData.cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCityId === city.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Duration Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-xl border border-emerald-100/80 flex items-start space-x-4">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Estimasi Durasi</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {villageSpecific && villageSpecific[selectedCity.name]
                ? villageSpecific[selectedCity.name].split('(')[0].trim()
                : selectedCity.baseDuration}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Dari {selectedCity.name}
            </div>
          </div>
        </div>

        {/* Route Details Card */}
        <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-2">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
              <Car className="h-3.5 w-3.5 mr-1 text-slate-500" />
              Rute Jalur Rekomendasi
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1 leading-snug">
              {selectedCity.route}
            </div>
          </div>
          <p className="text-xs text-slate-500 italic">
            💡 {selectedCity.recommendation}
          </p>
        </div>
      </div>

      {/* Vehicle Compatibility & Specific Village Road Note */}
      {villageSpecific ? (
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Aksesibilitas Kendaraan ke Desa {villageName}:</span>
            <p className="leading-relaxed">{villageSpecific.accessType}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <Bike className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-slate-800">Sepeda Motor</div>
              <div className="text-slate-500 text-[11px]">Sangat lancar di seluruh rute</div>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <Car className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-slate-800">Mobil Pribadi / SUV</div>
              <div className="text-slate-500 text-[11px]">Aman di jalan utama & desa</div>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <Bus className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-slate-800">Bus Besar (Big Bus)</div>
              <div className="text-slate-500 text-[11px]">Jalur utama (UTC/SKJJ/Ghanjaran)</div>
            </div>
          </div>
        </div>
      )}

      {/* Note footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
        <span>* Estimasi waktu tempuh normal dan dapat berubah tergantung cuaca & kepadatan lalu lintas akhir pekan.</span>
      </div>
    </div>
  );
};

export default TravelEstimatesCard;

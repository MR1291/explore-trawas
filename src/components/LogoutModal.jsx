import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6 animate-scaleUp relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <LogOut className="w-8 h-8" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">
            Konfirmasi Keluar Akun
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin keluar dari akun <strong className="text-slate-800">{userName || 'Anda'}</strong>? Tempat wisata favorit dan ulasan Anda tetap tersimpan aman.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-sm transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

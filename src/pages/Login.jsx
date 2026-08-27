import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { AppContext } from '../context/AppContext';
import { Mountain, CheckCircle2, Heart, Star, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';
import trawasHeroBg from '../assets/trawas-hero.jpg';

const Login = () => {
  const { loginWithGoogle, currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const redirectPath = location.state?.from || '/';

  // Handle real Google OAuth response
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      loginWithGoogle({
        id: `google-${decoded.sub}`,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(decoded.name)}`
      });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login gagal, gunakan form manual');
    setShowManualForm(true);
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle({
        id: `custom-${Date.now()}`,
        name: customName.trim(),
        email: customEmail.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName.trim())}`,
        provider: 'email'
      });
      setIsLoading(false);
      navigate(redirectPath, { replace: true });
    }, 600);
  };

  // If already logged in
  if (currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center space-y-6">
        <div className="w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-md">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full rounded-full object-cover bg-white"
          />
        </div>
        <div className="space-y-1">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Sudah Masuk
          </span>
          <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
          <p className="text-xs text-slate-500">{currentUser.email}</p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => navigate('/profil')}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Lihat Profil & Aktivitas Saya
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative font-sans">
      {/* Decorative backdrop */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <img src={trawasHeroBg} alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-xl w-full relative z-10 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Kembali ke Jelajah Trawas
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100/80 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
              <Mountain className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Masuk ke Explore Trawas
            </h1>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Simpan tempat favorit, bagikan ulasan wisata, dan catat perjalanan liburan Anda di 12 desa Trawas.
            </p>
          </div>

          {/* Benefits Feature Pills */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center space-y-1">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-100" />
              <span className="text-[11px] font-semibold text-slate-700">Simpan Favorit</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center space-y-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-100" />
              <span className="text-[11px] font-semibold text-slate-700">Beri Ulasan</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center space-y-1">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span className="text-[11px] font-semibold text-slate-700">Check-in Wisata</span>
            </div>
          </div>

          {/* Google Sign-in Section */}
          <div className="space-y-5 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
              Masuk dengan Akun Google
            </div>

            {/* Real Google Sign-In Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                width="360"
                text="signin_with"
                shape="pill"
                locale="id_ID"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 font-medium">atau</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Manual Form Toggle */}
            {!showManualForm ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowManualForm(true)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer transition-colors"
                >
                  Masuk dengan email secara manual →
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomLogin} className="space-y-4 animate-in">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Ardiansyah"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Alamat Email Google</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-emerald-600 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Menghubungkan ke Akun Google...</span>
                  ) : (
                    <>
                      {/* Google G Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Masuk dengan Email</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    ← Sembunyikan form manual
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Privacy Note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-slate-400 text-xs text-center">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Data interaksi Anda tersimpan aman dan terintegrasi otomatis.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

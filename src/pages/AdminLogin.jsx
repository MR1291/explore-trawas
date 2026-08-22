import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Demo authentication logic (can be admin / admin123 or custom)
      if ((username.trim() === 'admin' || username.trim() === 'admin@exploretrawas.id') && password === 'admin123') {
        localStorage.setItem('explore_trawas_admin_auth', 'true');
        localStorage.setItem('explore_trawas_admin_user', username.trim());
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/admin');
        }
      } else {
        setIsLoading(false);
        setError('Username atau kata sandi yang Anda masukkan salah!');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decor Elements */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Home Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/80 px-3.5 py-2 rounded-full border border-slate-800 backdrop-blur-md"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Kembali ke Website Utama
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/10">
            <Mountain className="h-9 w-9" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Portal Administrator
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xs mx-auto">
            Masuk untuk mengelola data desa wisata, destinasi, dan informasi pariwisata Trawas.
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800/80 space-y-6">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center space-x-3 text-rose-400 text-xs animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Username / Email
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin atau email"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center text-xs">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Masuk ke Dashboard
                  </span>
                )}
              </button>
            </form>

            {/* Quick Demo Info Box */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span className="flex items-center text-emerald-400 font-bold">
                  <KeyRound className="h-3.5 w-3.5 mr-1" />
                  Kredensial Demo:
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  Gunakan Akun Demo
                </button>
              </div>
              <div className="text-slate-400 font-mono text-[11px] bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                <div>User: <span className="text-white font-bold">admin</span></div>
                <div>Pass: <span className="text-white font-bold">admin123</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

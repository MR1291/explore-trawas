import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Mountain, Menu, X, Heart, Compass, User, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { favorites, currentUser, logoutUser } = useContext(AppContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Destinasi', path: '/destinasi' },
    { name: 'Peta Wisata', path: '/peta' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
                <Mountain className="h-6 w-6" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Explore Trawas
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  isActive(link.path) ? 'text-emerald-600 font-bold' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Google User Authentication Dropdown or Login Button */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-full border border-slate-200 hover:border-emerald-500 transition-all bg-slate-50 cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-white shrink-0"
                  />
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate hidden lg:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="flex items-center text-[10px] text-emerald-600 font-semibold mt-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Terhubung Google
                      </div>
                    </div>

                    <Link
                      to="/profil"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                      Profil & Aktivitas Saya
                    </Link>

                    <Link
                      to="/profil"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 mr-2 text-rose-500" />
                      Favorit Tersimpan ({favorites.length})
                    </Link>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logoutUser();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full border border-slate-200 hover:border-emerald-500 bg-white hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 shadow-sm"
              >
                {/* Google G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk Google</span>
              </Link>
            )}

            {/* Explore CTA */}
            <Link
              to="/destinasi"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105"
            >
              <Compass className="h-4 w-4 mr-1.5" />
              Jelajahi
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {currentUser ? (
              <Link to="/profil" className="p-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Masuk
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-fadeIn">
          <div className="px-3 pt-2 pb-4 space-y-1">
            {currentUser && (
              <div className="p-3 bg-emerald-50/50 rounded-2xl mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{currentUser.email}</div>
                  </div>
                </div>
                <Link
                  to="/profil"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  Profil
                </Link>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/favorit"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                isActive('/favorit')
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-rose-600'
              }`}
            >
              Favorit Saya ({favorites.length})
            </Link>

            {currentUser ? (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logoutUser();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Keluar Akun Google
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200"
                >
                  <span>Masuk dengan Akun Google</span>
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/destinasi"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl shadow-sm text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Compass className="h-4 w-4 mr-1.5" />
                Jelajahi Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

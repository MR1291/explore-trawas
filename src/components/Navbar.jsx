import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Mountain, Menu, X, Heart, Settings, Compass } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites } = useContext(AppContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Destinasi', path: '/destinasi' },
    { name: 'Peta Wisata', path: '/peta' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Explore Trawas
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  isActive(link.path) ? 'text-emerald-600 font-semibold' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/favorit"
              className={`relative p-2 rounded-full transition-colors hover:bg-slate-100 hover:text-rose-600 ${
                isActive('/favorit') ? 'text-rose-600 bg-rose-50' : 'text-slate-600'
              }`}
              title="Favorit Saya"
            >
              <Heart className={`h-5 w-5 ${isActive('/favorit') ? 'fill-rose-600' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className={`p-2 rounded-full transition-colors hover:bg-slate-100 hover:text-emerald-600 ${
                isActive('/admin') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'
              }`}
              title="Dashboard Admin"
            >
              <Settings className="h-5 w-5" />
            </Link>

            <Link
              to="/destinasi"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105"
            >
              <Compass className="h-4 w-4 mr-2" />
              Jelajahi Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              to="/favorit"
              className="relative p-2 text-slate-600 hover:text-rose-600 rounded-full"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/favorit"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/favorit')
                  ? 'bg-rose-50 text-rose-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-rose-600'
              }`}
            >
              Favorit Saya ({favorites.length})
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin')
                  ? 'bg-emerald-50 text-emerald-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
              }`}
            >
              Dashboard Admin
            </Link>
            <div className="pt-2 px-3">
              <Link
                to="/destinasi"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Compass className="h-4 w-4 mr-2" />
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

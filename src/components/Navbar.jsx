// src/components/Navbar.jsx
  import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Car, Package, Warehouse, FileText, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);




// Navbar ichida
const menuRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMobileMenuOpen(false);
    }
  };
  if (mobileMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/", label: "Dashboard", icon: <Car className="w-5 h-5" /> },
    { to: "/orders", label: "Buyurtmalar", icon: <Package className="w-5 h-5" /> },
    { to: "/warehouse", label: "Ombor", icon: <Warehouse className="w-5 h-5" /> },
    { to: "/reports", label: "Hisobotlar", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Car className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold">AFOOMS</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 transition-all ${
                    isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Desktop: User + Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">Salom, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm hover:text-red-300 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>

          {/* Mobil: Gamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobil Menyu (animatsiya bilan) */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="py-4 space-y-3 border-t border-blue-700 mt-4">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                    isActive ? "bg-blue-800 text-yellow-400" : "hover:bg-blue-800"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}

            <div className="border-t border-blue-700 mt-3 pt-3 px-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Salom, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-red-300 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Chiqish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
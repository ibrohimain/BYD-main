// src/components/Navbar.jsx (v4 mos – dark mode bilan)
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useThemeStore } from '../stores/themeStore';
import { Car, Package, Warehouse, FileText, Users, User, LogOut, Menu, X, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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

  const getNavLinks = () => {
  const baseLinks = [
    { to: "/", label: "Dashboard", icon: <Car className="w-5 h-5" /> }, // Faqat bu
    { to: "/orders", label: "Buyurtmalar", icon: <Package className="w-5 h-5" /> },
    { to: "/warehouse", label: "Ombor", icon: <Warehouse className="w-5 h-5" /> },
  ];
  if (hasRole('manager') || hasRole('admin')) {
    baseLinks.push({ to: "/reports", label: "Hisobotlar", icon: <FileText className="w-5 h-5" /> });
  }
  if (hasRole('admin')) {
    baseLinks.push({ to: "/users", label: "Foydalanuvchilar", icon: <Users className="w-5 h-5" /> });
  }
  return baseLinks;
};

  const navLinks = getNavLinks();

  const navClass = isDark ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-700 to-blue-900 text-white';

  return (
    <nav className={`shadow-lg ${navClass}`} ref={menuRef}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold">AFOOMS</h1>
          </div>

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

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">Salom, {user?.name} ({user?.role})</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm hover:text-red-300 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="py-4 space-y-3 border-t dark:border-gray-600 mt-4">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                    isActive ? "bg-blue-800 text-yellow-400" : "hover:bg-gray-700"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}

            <div className="border-t dark:border-gray-600 mt-3 pt-3 px-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Salom, {user?.name} ({user?.role})</span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 w-full justify-start p-2 rounded-lg hover:bg-gray-700 transition"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 w-full justify-start p-2 text-sm text-red-300 hover:text-red-400 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
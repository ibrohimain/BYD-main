// src/components/Sidebar.jsx - Optimallashtirilgan va Responsive (Profile menyusi qo'shildi – mobil uchun gamburger menyuga o'tkazildi)
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useThemeStore } from '../stores/themeStore';
import { useTranslation } from 'react-i18next';
import { 
  Car, Package, Warehouse, FileText, Users, 
  Moon, Sun, LogOut, ChevronRight, Cpu, 
  BarChart3, DollarSign, User as UserIcon
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user, logout, hasRole } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();

  const navLinks = [
    { to: "/", label: t('dashboard'), icon: <Car className="w-5 h-5" /> },
    // { to: "/orders", label: t('orders'), icon: <Package className="w-5 h-5" /> },
    { to: "/warehouse", label: t('Ombor boshqaruvi'), icon: <Warehouse className="w-5 h-5" /> },
    // { to: "/digital", label: t('digitalTransformation'), icon: <Cpu className="w-5 h-5" /> },
    { to: "/orders", label: t('Buyurtmalar'), icon: <Package className="w-5 h-5" /> }, 
    { to: "/reports", label: t('Monitoring'), icon: <BarChart3 className="w-5 h-5" /> },
    { to: "/production-delivery", label: t('Ishlab chiqarish'), icon: <Package className="w-5 h-5" /> },
    { to: "/finance", label: t('Moliya'), icon: <DollarSign className="w-5 h-5" /> },
    { to: "/profile", label: t('Profile'), icon: <UserIcon className="w-5 h-5" /> }
  ];

  if (hasRole('manager') || hasRole('admin')) {
    navLinks.push({ to: "/reports", label: t('reports'), icon: <FileText className="w-5 h-5" /> });
  }
  if (hasRole('admin')) {
    navLinks.push({ to: "/users", label: t('users'), icon: <Users className="w-5 h-5" /> });
  }

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl p-6 flex flex-col h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Car className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AFOOMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose} // Mobil uchun yopilish
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t dark:border-slate-700 pt-4 space-y-3">
        <button
  onClick={toggleTheme}
  className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
>
  <div className="flex items-center space-x-3">
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    <span className="text-sm font-medium">{isDark ? t('lightMode') : t('darkMode')}</span>
  </div>
</button>

        <button
          onClick={logout}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all"
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">{t('logout')}</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
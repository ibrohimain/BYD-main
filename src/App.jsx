// src/App.jsx - To'liq: Sidebar responsive + Tepa panel (qo'ng'iroq, akaunt, input) desktop va mobil uchun doimiy + Hamburger mobil uchun
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Warehouse from './pages/Warehouse';
import Reports from './pages/Reports';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import useAuth from './hooks/useAuth';
import { useEffect, useState } from 'react';
import './i18n';
// import ProductionDelivery from './pages/ProductionDelivery';
import Finance from './pages/Finance';
import { initializePrices } from './utils/initPrices';
import { Menu, Search, Bell, User as UserIcon } from 'lucide-react'; // Kerakli iconlar
import { useThemeStore } from './stores/themeStore';

function AppContent() {
  const { init, user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobil sidebar holati
  const [searchQuery, setSearchQuery] = useState(''); // Search input holati

  useEffect(() => {
  const { isDark } = useThemeStore.getState();
  document.documentElement.classList.toggle('dark', isDark);
}, []);

  useEffect(() => {
    initializePrices();
    const unsubscribe = init();
    return () => unsubscribe && unsubscribe();
  }, [init]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar — mobil uchun ochiladigan, desktop doimiy */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main — Tepa panel (desktop va mobil uchun) + Scrollable Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tepa panel — Qo'ng'iroq, akaunt, input doimiy */}
        <header className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between border-b dark:border-slate-700 shadow-sm">
          {/* Hamburger — faqat mobil uchun */}
          <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 mr-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>

          {/* Search Input — desktop va mobil uchun (mobil uchun kichikroq) */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Qo'ng'iroq va Akaunt — desktop va mobil uchun */}
          <div className="flex items-center gap-3 ml-4">
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer">
              <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </header>

        {/* Scrollable Content — faqat bu joy scroll bo'ladi */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={
              <ProtectedRoute roles={['admin', 'manager', 'operator']}>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/warehouse" element={
              <ProtectedRoute roles={['admin', 'manager', 'operator']}>
                <Warehouse />
              </ProtectedRoute>
            } />
            <Route path="/finance" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Finance />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
// src/pages/Dashboard.jsx (Kartalar ixcham qilingan – padding va o'lchamlar kamaytirilgan)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick'; // Faqat reklama uchun
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useAuth from '../hooks/useAuth';
import StatsCard from '../components/StatsCard';
import { Package, Car, Warehouse, Truck, RefreshCw, User, Settings, LogOut, Shield, Edit, Save, Mail, Upload, CheckCircle } from 'lucide-react';
import { stats as initialStats } from '../data/mockData';

// Rasimlar import (src/img papkasida 1.jfif, 2.jfif, 3.jfif bo'lsa)
import byd1 from '../img/1.jfif';
import byd2 from '../img/2.jfif';
import byd3 from '../img/3.jfif';

export default function Dashboard() {
  const { user, logout, hasRole, updateUser } = useAuth();
  const [currentStats, setCurrentStats] = useState(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('monitoring');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', oldPassword: '', newPassword: '', confirmPassword: '' });
  const [editingProfile, setEditingProfile] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setCurrentStats(prev => ({
          totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
          inProduction: Math.max(0, prev.inProduction + Math.floor(Math.random() * 5) - 2),
          inWarehouse: Math.max(0, prev.inWarehouse + Math.floor(Math.random() * 4) - 1),
          delivered: prev.delivered + Math.floor(Math.random() * 2),
        }));
        setIsRefreshing(false);
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '', oldPassword: '', newPassword: '', confirmPassword: '' });
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSave = async () => {
    if (profileForm.newPassword && (profileForm.newPassword !== profileForm.confirmPassword)) {
      showMessage('error', 'Yangi parollar mos kelmaydi!');
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      showMessage('error', 'Parol kamida 6 ta belgi bo\'lishi kerak!');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const updatedData = { name: profileForm.name, email: profileForm.email };
    if (profileForm.newPassword) {
      updatedData.password = profileForm.newPassword;
    }
    updateUser(updatedData);
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));

    showMessage('success', 'Ma\'lumotlar saqlandi! ✓');
    setEditingProfile(false);
    setIsSaving(false);
    setProfileForm({ ...profileForm, oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      showMessage('info', 'Avatar yuklandi!');
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return "To'liq ruxsat: Users boshqarish, hisobotlar, barcha modul";
      case 'manager': return "O'rta ruxsat: Buyurtma, ombor, hisobot boshqarish";
      case 'operator': return "Asosiy ruxsat: Buyurtma va ombor ko'rish/boshqarish";
      default: return 'Oddiy foydalanuvchi';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // BYD Grid data (jonli rasimlar bilan – carousel o'rniga grid)
  const bydCars = [
    { id: 1, model: 'BYD Atto 3', image: byd1, description: 'Elektr mashina, 420km masofa' },
    { id: 2, model: 'BYD Han', image: byd2, description: 'Sedan, 605hp kuch' },
    { id: 3, model: 'BYD Dolphin', image: byd3, description: 'Kompakt EV, 427km masofa' },
  ];

  // Reklama data (mock – slider saqlanadi)
  const ads = [
    { id: 1, title: 'BYD Yangi Model', image: 'https://via.placeholder.com/800x200?text=BYD+Yangi+Model', link: '#' },
    { id: 2, title: 'Aksiya: 10% Chegirma', image: 'https://via.placeholder.com/800x200?text=Aksiya+10%25+Chegirma', link: '#' },
  ];

  // Mock hisobotlar (yangilangan – ko'proq data)
  const monthlyProduced = [
    { oy: 'Yanvar 2025', ishlabchiqarish: 45 },
    { oy: 'Fevral 2025', ishlabchiqarish: 52 },
    { oy: 'Mart 2025', ishlabchiqarish: 61 },
    { oy: 'Aprel 2025', ishlabchiqarish: 58 },
    { oy: 'May 2025', ishlabchiqarish: 72 },
    { oy: 'Iyun 2025', ishlabchiqarish: 68 },
    { oy: 'Iyul 2025', ishlabchiqarish: 75 },
    { oy: 'Avgust 2025', ishlabchiqarish: 80 },
    { oy: 'Sentyabr 2025', ishlabchiqarish: 65 },
    { oy: 'Oktyabr 2025', ishlabchiqarish: 70 },
    { oy: 'Noyabr 2025', ishlabchiqarish: 85 },
  ];

  const modelSales = [
    { model: 'Chevrolet Spark', sotuv: 142, foiz: 45 },
    { model: 'Chevrolet Onix', sotuv: 118, foiz: 37 },
    { model: 'Chevrolet Malibu', sotuv: 89, foiz: 18 },
  ];

  const yearlyProduced = 800; // Mock

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 p-3 sm:p-4 lg:p-6">
      {/* Tab navigatsiya – responsive flex va grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-3 lg:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center lg:justify-end">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-all duration-300 text-xs sm:text-sm ${
              activeTab === 'monitoring' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-gray-400 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Monitoring
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-all duration-300 text-xs sm:text-sm ${
              activeTab === 'profile' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Akaunt Sozlamalari
          </button>
        </div>
      </div>

      {/* Xabarlar */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-2 sm:p-3 rounded-md text-center border ${
            message.type === 'success' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800' :
            'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Monitoring tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'monitoring' && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Real-Vaqt Monitoring</h3>
              <button
                onClick={() => setIsRefreshing(true)}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-3 py-1.5 rounded-md hover:shadow-md transition-all duration-300 disabled:opacity-50 w-full sm:w-auto text-xs sm:text-sm"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Yangilash</span>
              </button>
            </div>

            {/* Stats Cards – ixcham grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatsCard title="Jami Buyurtma" value={currentStats.totalOrders} icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />} color="blue" />
              <StatsCard title="Ishlab chiqarishda" value={currentStats.inProduction} icon={<Car className="w-5 h-5 sm:w-6 sm:h-6" />} color="yellow" />
              <StatsCard title="Omborda" value={currentStats.inWarehouse} icon={<Warehouse className="w-5 h-5 sm:w-6 sm:h-6" />} color="green" />
              <StatsCard title="Yetkazib berilgan" value={currentStats.delivered} icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6" />} color="red" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800 dark:text-white">Reklama</h3>
              <Slider 
                dots={true} 
                infinite={true} 
                speed={500} 
                slidesToShow={1} 
                slidesToScroll={1} 
                autoplay={true}
                autoplaySpeed={4000}
                pauseOnHover={true}
                responsive={[
                  { breakpoint: 768, settings: { dots: false, autoplay: false } },
                ]}
                className="slick-carousel-ads"
              >
                {ads.map(ad => (
                  <motion.div 
                    key={ad.id} 
                    whileHover={{ scale: 1.02 }} 
                    className="relative overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 group cursor-pointer"
                  >
                    <img 
                      src={byd1} 
                      alt={ad.title} 
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-110" // Rasim sifati uchun object-cover, responsive va kattaroq height
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div className="text-white w-full">
                        <h4 className="font-bold text-sm sm:text-base mb-1">{ad.title}</h4>
                        <a href={ad.link} className="text-blue-200 hover:text-white text-xs underline">Batafsil &rarr;</a>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="font-bold text-white text-xs sm:text-sm">{ad.title}</h4>
                      <a href={ad.link} className="text-blue-200 hover:text-white text-xs underline">Batafsil</a>
                    </div>
                  </motion.div>
                ))}
              </Slider>
            </div>

            {/* BYD Grid – ixcham kartalar */}
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800 dark:text-white">BYD Modellar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bydCars.map(car => (
                  <motion.div
                    key={car.id}
                    variants={itemVariants}
                    className="bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <img src={car.image} alt={car.model} className="w-full h-24 sm:h-32 object-cover" />
                    <div className="p-1.5 sm:p-2">
                      <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm">{car.model}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">{car.description}</p>
                      <button className="mt-1.5 bg-blue-600 text-white px-1.5 sm:px-3 py-0.5 rounded hover:bg-blue-700 transition-colors text-xs w-full">
                        Batafsil
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Jarayon Holati – ixcham */}
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800 dark:text-white">Jarayon Holati</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Yig'ish liniyasi</span>
                  <span className="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm">Ishlayapti (92%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 sm:h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* Mock hisobotlar – ixcham grid */}
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800 dark:text-white">Mock Hisobotlar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {monthlyProduced.map((m, i) => (
                  <div key={i} className="p-2 sm:p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                    <h4 className="font-medium text-gray-800 dark:text-white text-xs sm:text-sm">{m.oy}</h4>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">{m.ishlabchiqarish} ta</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Profil tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Profil karta – ixcham */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-3 sm:gap-4 mb-3">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  )}
                  {editingProfile && (
                    <input type="file" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{profileForm.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{profileForm.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 flex-shrink-0" />
                <span className="font-semibold text-gray-800 dark:text-white">Rol: {user.role.toUpperCase()}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-1.5">{getRoleDescription(user.role)}</p>
            </div>

            {/* Admin stats – ixcham grid */}
            {hasRole('admin') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-md shadow-sm text-center border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800 dark:text-white">Jami Users</h3>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">4</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-md shadow-sm text-center border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800 dark:text-white">Adminlar</h3>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">2</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-md shadow-sm text-center border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800 dark:text-white">Faol Sessions</h3>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">1</p>
                </div>
              </div>
            )}

            {/* Sozlamalar form – ixcham */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">Akaunt Sozlamalari</h3>
                {!editingProfile && (
                  <button onClick={() => setEditingProfile(true)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-xs">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Tahrirlash</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-white">Ism</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      disabled={!editingProfile}
                      className={`w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white ${
                        editingProfile ? 'border-blue-500 focus:ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-white">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled={!editingProfile}
                      className={`w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 transition-all text-gray-900 dark:text-white ${
                        editingProfile ? 'border-blue-500 focus:ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {editingProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-3 md:space-y-0">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-white">Eski Parol</label>
                      <input
                        type="password"
                        value={profileForm.oldPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, oldPassword: e.target.value })}
                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Eski parolni kiriting"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-white">Yangi Parol</label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Yangi parolni kiriting"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-white">Parol Tasdiqlash</label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                        className="w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Parolni tasdiqlang"
                      />
                    </div>
                  </div>
                )}

                {editingProfile && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <motion.button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 text-white py-1.5 rounded-md hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-1.5 relative text-xs sm:text-sm"
                      initial={false}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <RefreshCw className="w-3 h-3 text-white" />
                          </motion.div>
                          <span className="opacity-0">Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          <span>Saqlash</span>
                        </>
                      )}
                    </motion.button>
                    <button
                      onClick={() => { 
                        setEditingProfile(false); 
                        setProfileForm({ ...profileForm, oldPassword: '', newPassword: '', confirmPassword: '' }); 
                      }}
                      className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-1.5 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-xs sm:text-sm"
                    >
                      Bekor qilish
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button onClick={logout} className="w-full bg-red-600 text-white py-1.5 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-1.5 text-xs sm:text-sm">
                  <LogOut className="w-3 h-3" />
                  <span>Chiqish</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}




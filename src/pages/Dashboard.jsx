// src/pages/Dashboard.jsx (carousel'lar to'liq ishlaydi – jonli rasimlar bilan)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick'; // Carousel uchun
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

  // BYD Carousel data (jonli rasimlar bilan)
  const bydCars = [
    { id: 1, model: 'BYD Atto 3', image: byd1, description: 'Elektr mashina, 420km masofa' },
    { id: 2, model: 'BYD Han', image: byd2, description: 'Sedan, 605hp kuch' },
    { id: 3, model: 'BYD Dolphin', image: byd3, description: 'Kompakt EV, 427km masofa' },
  ];

  // Reklama data (mock)
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Tab navigatsiya */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'monitoring' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-gray-400 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Monitoring
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'profile' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
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
          className={`p-4 rounded-lg text-center border ${
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
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Real-Vaqt Monitoring</h3>
              <button
                onClick={() => setIsRefreshing(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Yangilash</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Jami Buyurtma" value={currentStats.totalOrders} icon={<Package className="w-8 h-8" />} color="blue" />
              <StatsCard title="Ishlab chiqarishda" value={currentStats.inProduction} icon={<Car className="w-8 h-8" />} color="yellow" />
              <StatsCard title="Omborda" value={currentStats.inWarehouse} icon={<Warehouse className="w-8 h-8" />} color="green" />
              <StatsCard title="Yetkazib berilgan" value={currentStats.delivered} icon={<Truck className="w-8 h-8" />} color="red" />
            </div>

            {/* Reklama bo'limi */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reklama</h3>
              <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                {ads.map(ad => (
                  <div key={ad.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img src={ad.image} alt={ad.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 dark:text-white">{ad.title}</h4>
                      <a href={ad.link} className="text-blue-600 hover:underline">Batafsil</a>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* BYD Carousel */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">BYD Modellar Carousel</h3>
              <Slider dots={true} infinite={true} speed={500} slidesToShow={3} slidesToScroll={1} responsive={[
                { breakpoint: 768, settings: { slidesToShow: 1 } },
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
              ]}>
                {bydCars.map(car => (
                  <div key={car.id} className="px-2">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                      <img src={car.image} alt={car.model} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 dark:text-white">{car.model}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{car.description}</p>
                        <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors">
                          Batafsil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Jarayon Holati</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Yig'ish liniyasi</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Ishlayapti (92%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* Mock hisobotlar */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Mock Hisobotlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monthlyProduced.map((m, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <h4 className="font-medium text-gray-800 dark:text-white">{m.oy}</h4>
                    <p className="text-2xl font-bold text-blue-600">{m.ishlabchiqarish} ta</p>
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
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                  {editingProfile && (
                    <input type="file" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{profileForm.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{profileForm.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-gray-800 dark:text-white">Rol: {user.role.toUpperCase()}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{getRoleDescription(user.role)}</p>
            </div>

            {hasRole('admin') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Jami Users</h3>
                  <p className="text-3xl font-bold text-blue-600">4</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Adminlar</h3>
                  <p className="text-3xl font-bold text-red-600">2</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Faol Sessions</h3>
                  <p className="text-3xl font-bold text-green-600">1</p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Akaunt Sozlamalari</h3>
                {!editingProfile && (
                  <button onClick={() => setEditingProfile(true)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Tahrirlash</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Ism</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      disabled={!editingProfile}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                        editingProfile ? 'border-blue-500 focus:ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled={!editingProfile}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                        editingProfile ? 'border-blue-500 focus:ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {editingProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Eski Parol</label>
                      <input
                        type="password"
                        value={profileForm.oldPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, oldPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Eski parolni kiriting"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Yangi Parol</label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Yangi parolni kiriting"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Parol Tasdiqlash</label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        placeholder="Parolni tasdiqlang"
                      />
                    </div>
                  </div>
                )}

                {editingProfile && (
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 relative"
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
                            <RefreshCw className="w-4 h-4 text-white" />
                          </motion.div>
                          <span className="opacity-0">Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Saqlash</span>
                        </>
                      )}
                    </motion.button>
                    <button
                      onClick={() => { 
                        setEditingProfile(false); 
                        setProfileForm({ ...profileForm, oldPassword: '', newPassword: '', confirmPassword: '' }); 
                      }}
                      className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button onClick={logout} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                  <LogOut className="w-4 h-4" />
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
// src/pages/UserProfile.jsx (shakllangan va kuchaytirilgan)
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion'; // Animation uchun
import { User, Mail, Shield, Settings, LogOut, Edit, Save } from 'lucide-react';

export default function UserProfile() {
  const { user, logout, hasRole } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', oldPassword: '', newPassword: '' });

  if (!user) {
    return <div className="text-center py-12 text-gray-500">Profil yuklanmoqda...</div>;
  }

  const handleSave = () => {
    console.log('Profil yangilandi:', form);
    setEditing(false);
  };

  const handlePasswordChange = () => {
    console.log(`'Parol o'zgartirildi:'`, form.newPassword);
    setForm({ ...form, oldPassword: '', newPassword: '' });
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return "To'liq ruxsat: Users boshqarish, hisobotlar, barcha modul";
      case 'manager': return `'O'rta ruxsat: Buyurtma, ombor, hisobot boshqarish'`;
      case 'operator': return `'Asosiy ruxsat: Buyurtma va ombor ko'rish/qo'shish'`;
      default: return 'Oddiy foydalanuvchi';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Profil kartasi */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="w-4 h-4 text-yellow-600" />
            <span className="font-semibold">Rol: {user.role.toUpperCase()}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{getRoleDescription(user.role)}</p>
        </div>
      </motion.div>

      {/* Admin uchun stats */}
      {hasRole('admin') && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Jami Users</h3>
            <p className="text-3xl font-bold text-blue-600">4</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Adminlar</h3>
            <p className="text-3xl font-bold text-red-600">2</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Faol Sessions</h3>
            <p className="text-3xl font-bold text-green-600">1</p>
          </div>
        </motion.div>
      )}

      {/* Sozlamalar */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Profil Sozlamalari</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
              <Edit className="w-4 h-4" />
              <span>Tahrirlash</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ism</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!editing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                editing ? 'border-blue-500 focus:ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
              }`}
            />
          </div>

          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Eski Parol</label>
                <input
                  type="password"
                  value={form.oldPassword}
                  onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Eski parolni kiriting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Yangi Parol</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yangi parolni kiriting"
                />
              </div>
            </div>
          )}

          {editing && (
            <div className="flex space-x-3">
              <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                <Save className="w-4 h-4 inline mr-2" />
                Saqlash
              </button>
              <button onClick={() => { setEditing(false); setForm({ ...form, oldPassword: '', newPassword: '' }); }} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                Bekor
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button onClick={logout} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
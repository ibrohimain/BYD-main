// src/pages/UserProfile.jsx - To'liq Responsive + Optimal + Professional (Rasim yuklash + Firebase aloqa)
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { User, Mail, Shield, Settings, LogOut, Edit, Save, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

export default function UserProfile() {
  const { user, logout, hasRole } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.displayName || '', email: user?.email || '', oldPassword: '', newPassword: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || '');
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      let photoURL = user.photoURL;
      if (photoFile) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, photoFile);
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
          });
        });
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser, { displayName: form.name, photoURL });

      if (form.email !== user.email) {
        await updateEmail(auth.currentUser, form.email);
      }

      if (form.newPassword) {
        const credential = EmailAuthProvider.credential(user.email, form.oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, form.newPassword);
      }

      await updateDoc(doc(db, 'users', user.uid), { name: form.name, email: form.email, photoURL });

      setSaveStatus('saved');
      setEditing(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError('Xato: ' + (err.message || 'Profil yangilanmadi'));
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return "To'liq ruxsat: Users boshqarish, hisobotlar, barcha modul";
      case 'manager': return "O'rta ruxsat: Buyurtma, ombor, hisobot boshqarish";
      case 'operator': return "Asosiy ruxsat: Buyurtma va ombor ko'rish/qo'shish";
      default: return 'Oddiy foydalanuvchi';
    }
  };

  if (!user) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Profil yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profil kartasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-2 rounded-full shadow cursor-pointer">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName || user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">Rol: {user.role.toUpperCase()}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getRoleDescription(user.role)}</p>
          </div>
        </motion.div>

        {/* Admin uchun stats - Responsive Grid */}
        {hasRole('admin') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Jami Users</h3>
              <p className="text-3xl font-bold text-blue-600">4</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Adminlar</h3>
              <p className="text-3xl font-bold text-red-600">2</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Faol Sessions</h3>
              <p className="text-3xl font-bold text-green-600">1</p>
            </div>
          </motion.div>
        )}

        {/* Sozlamalar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profil Sozlamalari</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <Edit className="w-5 h-5" />
                <span>Tahrirlash</span>
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ism</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing || loading}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  editing ? '' : 'bg-gray-100 dark:bg-slate-700 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing || loading}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  editing ? '' : 'bg-gray-100 dark:bg-slate-700 cursor-not-allowed'
                }`}
              />
            </div>

            {editing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Eski Parol</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Eski parolni kiriting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Yangi Parol</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Yangi parolni kiriting"
                  />
                </div>
              </div>
            )}

            {editing && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:shadow-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  Saqlash
                </button>
                <button 
                  onClick={() => { setEditing(false); setForm({ ...form, oldPassword: '', newPassword: '' }); }} 
                  disabled={loading}
                  className="flex-1 py-3 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center justify-center gap-2 font-medium"
                >
                  Bekor
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button 
              onClick={logout} 
              className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Chiqish
            </button>
          </div>
        </motion.div>
      </div>

      {/* Save Status */}
      <AnimatePresence>
        {saveStatus === 'saved' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl flex items-center gap-3 shadow-lg"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Profil muvaffaqiyatli yangilandi!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 shadow-lg"
          >
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
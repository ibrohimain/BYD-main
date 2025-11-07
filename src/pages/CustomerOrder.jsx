// src/pages/CustomerOrder.jsx - Mijoz uchun buyurtma sahifasi (Haridor buyurtma bersa, dashboard'ga kelib tushadi)
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Car, Package, DollarSign, Save, AlertCircle, CheckCircle } from 'lucide-react';

const carModels = ['Chevrolet Spark', 'Chevrolet Onix', 'Chevrolet Malibu'];
const colors = ['Oq', 'Qora', 'Kulrang', 'Qizil'];

export default function CustomerOrder() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    model: '', rang: '', miqdor: 1, ism: '', telefon: '', sana: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'orders'), {
        ...form,
        miqdor: parseInt(form.miqdor),
        holat: 'Yangi', // Admin ko'radi va tasdiqlaydi
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setForm({ model: '', rang: '', miqdor: 1, ism: '', telefon: '', sana: new Date().toISOString().split('T')[0] });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Xato: ' + err.message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Buyurtma Berish
        </h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 mb-4"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center gap-3 mb-4"
            >
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>Buyurtma muvaffaqiyatli yuborildi!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            name="model"
            value={form.model}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Model tanlang</option>
            {carModels.map(m => <option key={m}>{m}</option>)}
          </select>

          <select
            name="rang"
            value={form.rang}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Rang tanlang</option>
            {colors.map(c => <option key={c}>{c}</option>)}
          </select>

          <input
            type="number"
            name="miqdor"
            value={form.miqdor}
            onChange={handleChange}
            min="1"
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Miqdor"
          />

          <input
            type="text"
            name="ism"
            value={form.ism}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Ismingiz"
          />

          <input
            type="tel"
            name="telefon"
            value={form.telefon}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Telefon raqamingiz"
          />

          <input
            type="date"
            name="sana"
            value={form.sana}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Buyurtma Berish
          </button>
        </form>
      </motion.div>
    </div>
  );
}
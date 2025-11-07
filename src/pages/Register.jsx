// src/pages/Register.jsx - To'liq Responsive + Optimal + Professional
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import BYD from '../img/bydlogin.png'

const BYD_IMAGE = '/img/bydlogin.png';

export default function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError(t('passwordMismatch'));
    if (formData.password.length < 6) return setError(t('weakPassword'));

    setLoading(true);
    setError('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'operator',
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? t('emailInUse')
        : err.code === 'auth/weak-password' ? t('weakPassword')
        : t('registerError');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Image Section - Mobil uchun tepada */}
      <div className="md:w-1/2 relative min-h-[40vh] md:min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BYD_IMAGE})` }}>
        <img src={BYD} alt="login img" className='w-full h-full'/>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-lg font-medium opacity-90">BYD Ostara</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            {t('register')}
          </h2>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('namePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="6+ belgi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('loading')}</span>
                </>
              ) : (
                <span>{t('register')}</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('haveAccount')} <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{t('login')}</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
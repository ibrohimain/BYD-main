// src/pages/Warehouse.jsx - To'liq Responsive + Optimal + Professional (Animatsiya olib tashlandi)
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  collection, onSnapshot, addDoc, writeBatch, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Warehouse, Plus, Search, Filter, Package, CheckCircle,
  AlertTriangle, Truck, MapPin, Calendar, ArrowUp, Save,
  DollarSign, X, AlertCircle
} from 'lucide-react';

import Malibu from '../img/malibu.png';
import Onix from '../img/onix.png';
import Spark from '../img/spark.png';

const carModels = ['Chevrolet Spark', 'Chevrolet Onix', 'Chevrolet Malibu'];
const colors = ['Oq', 'Qora', 'Kulrang', 'Qizil'];
const locations = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function WarehousePage() {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [showProductionForm, setShowProductionForm] = useState(false);

  const [addForm, setAddForm] = useState({
    model: '', rang: '', vin: '', location: 'A1', status: 'Tayyor'
  });

  const [productionForm, setProductionForm] = useState({
    model: '', rang: '', miqdor: 1
  });

  const getCarImage = (model) => {
    const map = {
      'Chevrolet Malibu': Malibu,
      'Chevrolet Onix': Onix,
      'Chevrolet Spark': Spark
    };
    return map[model] || null;
  };

  useEffect(() => {
    const unsubWarehouse = onSnapshot(collection(db, 'warehouse'), (snap) => {
      setCars(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPrices = onSnapshot(collection(db, 'prices'), (snap) => {
      const priceMap = {};
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.model && d.price) priceMap[d.model] = d.price;
      });
      setPrices(priceMap);
      setLoading(false);
    });

    return () => { unsubWarehouse(); unsubPrices(); };
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setError('');
    try {
      await addDoc(collection(db, 'warehouse'), {
        ...addForm,
        sana: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });
      setSaveStatus('saved');
      setAddForm({ model: '', rang: '', vin: '', location: 'A1', status: 'Tayyor' });
      setShowAddForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError('Xato: ' + err.message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleProduction = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setError('');
    try {
      const batch = writeBatch(db);
      for (let i = 0; i < productionForm.miqdor; i++) {
        const vin = `KL1T${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
        const location = locations[Math.floor(Math.random() * locations.length)];
        const ref = doc(collection(db, 'warehouse'));
        batch.set(ref, {
          model: productionForm.model,
          rang: productionForm.rang,
          vin,
          location,
          status: 'Tayyor',
          sana: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
        });
      }
      await batch.commit();
      setSaveStatus('saved');
      setProductionForm({ model: '', rang: '', miqdor: 1 });
      setShowProductionForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError('Xato: ' + err.message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredCars = cars.filter(car => {
    if (filter !== 'all' && car.status !== filter) return false;
    const query = search.toLowerCase();
    return !search || car.vin.toLowerCase().includes(query) || car.model.toLowerCase().includes(query);
  });

  const stats = {
    total: cars.length,
    ready: cars.filter(c => c.status === 'Tayyor').length,
    repair: cars.filter(c => c.status === 'Ta\'mirda').length,
    delivered: cars.filter(c => c.status === 'Chiqarildi').length
  };

  const statusStyles = {
    'Tayyor': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    'Ta\'mirda': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    'Chiqarildi': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {t('warehouseManagement')}
              </h1>
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-2 text-blue-600 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Saqlanmoqda...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-2 text-emerald-600 text-sm">
                  <CheckCircle className="w-5 h-5" />
                  Muvaffaqiyatli saqlandi
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowProductionForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="hidden sm:inline">Ishlab chiqarish</span>
                <span className="sm:hidden">Ishlab chiqarish</span>
              </button>

              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">{t('addCar')}</span>
                <span className="sm:hidden">Qo'shish</span>
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t('total'), value: stats.total, color: 'from-blue-500 to-cyan-500' },
              { label: t('ready'), value: stats.ready, color: 'from-emerald-500 to-green-500' },
              { label: t('repair'), value: stats.repair, color: 'from-amber-500 to-orange-500' },
              { label: t('delivered'), value: stats.delivered, color: 'from-purple-500 to-pink-500' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg`}
              >
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchVIN') + " yoki model"}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('all')}</option>
                <option value="Tayyor">{t('ready')}</option>
                <option value="Ta'mirda">{t('repair')}</option>
                <option value="Chiqarildi">{t('delivered')}</option>
              </select>
            </div>
          </div>

          {/* Cars Grid - Ultra Responsive (Rasim animatsiyasi olib tashlandi) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredCars.map((car) => {
                const img = getCarImage(car.model);
                const price = prices[car.model] || 0;

                return (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedCar(car)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-slate-700"
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                            {car.model}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{car.rang}</p>
                          {price > 0 && (
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                              <DollarSign className="w-4 h-4" />
                              {price.toLocaleString()} UZS
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex  items-center gap-1.5 ${statusStyles[car.status] || 'bg-gray-900 text-gray-700'}`}>
                          {car.status === 'Tayyor' && <CheckCircle className="w-4 h-4" />}
                          {car.status === 'Ta\'mirda' && <AlertTriangle className="w-4 h-4" />}
                          {car.status === 'Chiqarildi' && <Truck className="w-4 h-4" />}
                          {car.status}
                        </span>
                      </div>

                      {img && (
                        <div className="flex justify-center -my-2">
                          <img
                            src={img}
                            alt={car.model}
                            loading="lazy"
                            className="w-32 h-24 object-contain rounded-lg bg-gray-50 dark:bg-slate-800 p-3 shadow-sm"
                          />
                        </div>
                      )}

                      <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2"><Package className="w-4 h-4" /> {car.vin}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {car.location}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {car.sana}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Car Modal - Mobile Bottom Sheet */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yangi mashina qo'shish</h2>
                  <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddCar} className="space-y-5">
                  <select required value={addForm.model} onChange={(e) => setAddForm({ ...addForm, model: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <option value="">Model tanlang</option>
                    {carModels.map(m => <option key={m}>{m}</option>)}
                  </select>

                  <select required value={addForm.rang} onChange={(e) => setAddForm({ ...addForm, rang: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl">
                    <option value="">Rang tanlang</option>
                    {colors.map(c => <option key={c}>{c}</option>)}
                  </select>

                  <input required type="text" placeholder="VIN raqami" value={addForm.vin} onChange={(e) => setAddForm({ ...addForm, vin: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500" />

                  <select value={addForm.location} onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl">
                    {locations.map(l => <option key={l}>{l}</option>)}
                  </select>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowAddForm(false)}
                      className="flex-1 py-4 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      Bekor qilish
                    </button>
                    <button type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> Qo'shish
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Production Modal */}
      <AnimatePresence>
        {showProductionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowProductionForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ishlab chiqarish</h2>
                  <button onClick={() => setShowProductionForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleProduction} className="space-y-5">
                  <select required value={productionForm.model} onChange={(e) => setProductionForm({ ...productionForm, model: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl">
                    <option value="">Model tanlang</option>
                    {carModels.map(m => <option key={m}>{m}</option>)}
                  </select>

                  <select required value={productionForm.rang} onChange={(e) => setProductionForm({ ...productionForm, rang: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl">
                    <option value="">Rang tanlang</option>
                    {colors.map(c => <option key={c}>{c}</option>)}
                  </select>

                  <input required type="number" min="1" max="500" placeholder="Miqdor (1-500)"
                    value={productionForm.miqdor} onChange={(e) => setProductionForm({ ...productionForm, miqdor: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl" />

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowProductionForm(false)}
                      className="flex-1 py-4 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      Bekor qilish
                    </button>
                    <button type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center justify-center gap-2">
                      <ArrowUp className="w-5 h-5" /> Ishlab chiqarish
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
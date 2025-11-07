// src/pages/Sales.jsx - Mashina Sotuvlari Sahifasi (Firebase Jonli + Chartlar + Hisoblar + Yangi Sotuv Qo'shish)
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Truck, DollarSign, TrendingUp, TrendingDown, Calendar, Package, CheckCircle,
  AlertTriangle, MapPin, Save, X, Plus, AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const carModels = ['Chevrolet Spark', 'Chevrolet Onix', 'Chevrolet Malibu']; // Model tanlash uchun

export default function SalesPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState({});
  const [warehouse, setWarehouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSale, setShowAddSale] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  const [addForm, setAddForm] = useState({
    model: '', miqdor: 1, holat: 'Yetkazildi', sana: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Jonli sotuvlar (faqat Yetkazildi)
    const q = query(collection(db, 'orders'), where('holat', '==', 'Yetkazildi'));
    const unsubOrders = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPrices = onSnapshot(collection(db, 'prices'), (snap) => {
      const priceMap = {};
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.model && d.price) priceMap[d.model] = d.price;
      });
      setPrices(priceMap);
    });

    const unsubWarehouse = onSnapshot(collection(db, 'warehouse'), (snap) => {
      setWarehouse(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => { unsubOrders(); unsubPrices(); unsubWarehouse(); };
  }, []);

  // Yangi sotuv qo'shish
  const handleAddSale = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setError('');
    try {
      await addDoc(collection(db, 'orders'), {
        ...addForm,
        createdAt: serverTimestamp()
      });
      setSaveStatus('saved');
      setAddForm({ model: '', miqdor: 1, holat: 'Yetkazildi', sana: new Date().toISOString().split('T')[0] });
      setShowAddSale(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError('Xato: ' + err.message);
      setTimeout(() => setError(''), 4000);
    }
  };

  // Oyma-oy sotuv hisoboti (daromad, o'sish foizlari)
  const monthlySalesReport = useMemo(() => {
    const monthly = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = {
        month: key,
        sold: 0,
        revenue: 0,
        growthPercent: 0
      };
    }

    orders.forEach(order => {
      if (order.sana) {
        const key = order.sana.slice(0, 7);
        if (monthly[key]) {
          const qty = parseInt(order.miqdor) || 0;
          const price = prices[order.model] || 0;
          monthly[key].sold += qty;
          monthly[key].revenue += qty * price;
        }
      }
    });

    const sorted = Object.entries(monthly)
      .map(([key, val]) => ({ ...val }))
      .sort((a, b) => a.month.localeCompare(b.month));

    sorted.forEach((item, i) => {
      if (i > 0) {
        const prev = sorted[i - 1];
        if (prev.revenue > 0) {
          item.growthPercent = ((item.revenue - prev.revenue) / prev.revenue) * 100;
        }
      }
    });

    return sorted;
  }, [orders, prices]);

  const totalSold = orders.reduce((sum, o) => sum + (parseInt(o.miqdor) || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + ((parseInt(o.miqdor) || 0) * (prices[o.model] || 0)), 0);
  const avgPrice = totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Mashina Sotuvlari
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sotilgan mashinalar, daromad va o'sish hisoblari (Firebase jonli)
            </p>
          </div>
          <button
            onClick={() => setShowAddSale(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Yangi Sotuv Qo'shish
          </button>
        </div>

        {/* Xato */}
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

        {/* Statistika */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Jami Sotilgan', value: totalSold, color: 'from-emerald-500 to-green-500', icon: Truck },
            { label: 'Umumiy Daromad', value: `${totalRevenue.toLocaleString()} UZS`, color: 'from-purple-500 to-pink-500', icon: DollarSign },
            { label: 'O‘rtacha Narx', value: `${avgPrice.toLocaleString()} UZS`, color: 'from-amber-500 to-orange-500', icon: TrendingUp }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg flex items-center justify-between`}
            >
              <div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className="w-10 h-10 opacity-80" />
            </motion.div>
          ))}
        </div>

        {/* Chart - O'sish va Daromad */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Oyma-oy Sotuv va Daromad O'sishi
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlySalesReport}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280 dark:fill-gray-400' }} />
              <YAxis tick={{ fill: '#6b7280 dark:fill-gray-400' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb dark:bg-slate-800', border: '1px solid #e5e7eb dark:border-slate-700', borderRadius: '8px', color: '#374151 dark:color-gray-300' }}
              />
              <Legend wrapperStyle={{ color: '#6b7280 dark:color-gray-400' }} />
              <Line type="monotone" dataKey="sold" stroke="#10b981" name="Sotilgan" strokeWidth={3} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Daromad (UZS)" strokeWidth={3} yAxisId="right" />
              <Line type="monotone" dataKey="growthPercent" stroke="#ef4444" name="O'sish Foizi (%)" strokeWidth={3} yAxisId="right" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Sotuvlar Ro'yxati */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-5 flex items-center gap-2 border-b border-gray-200 dark:border-slate-700">
            <Truck className="w-5 h-5 text-blue-600" />
            Sotilgan Mashinalar Ro'yxati
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Model</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Miqdor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Narx (UZS)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Daromad (UZS)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {orders.map((order, i) => {
                  const price = prices[order.model] || 0;
                  const revenue = parseInt(order.miqdor) * price;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{order.model}</td>
                      <td className="px-6 py-4 text-sm text-right text-emerald-600 font-medium">{order.miqdor}</td>
                      <td className="px-6 py-4 text-sm text-right text-blue-600 font-medium">{price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right text-purple-600 font-medium">{revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.sana}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Yangi Sotuv Qo'shish Modal */}
      <AnimatePresence>
        {showAddSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddSale(false)}
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yangi Sotuv Qo'shish</h2>
                  <button onClick={() => setShowAddSale(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddSale} className="space-y-5">
                  <select
                    required
                    value={addForm.model}
                    onChange={(e) => setAddForm({ ...addForm, model: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Model tanlang</option>
                    {carModels.map(m => <option key={m}>{m}</option>)}
                  </select>

                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="Miqdor"
                    value={addForm.miqdor}
                    onChange={(e) => setAddForm({ ...addForm, miqdor: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl"
                  />

                  <input
                    type="date"
                    value={addForm.sana}
                    onChange={(e) => setAddForm({ ...addForm, sana: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl"
                  />

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowAddSale(false)}
                      className="flex-1 py-4 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      Bekor qilish
                    </button>
                    <button type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// src/pages/Reports.jsx - To'liq Responsive + Optimal + Jonli Hisoblar (Firebase + Narxlar)
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  TrendingUp, TrendingDown, Package, DollarSign, Calendar,
  Truck, Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const { t } = useTranslation();
  const [warehouse, setWarehouse] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubWarehouse = onSnapshot(collection(db, 'warehouse'), (snap) => {
      setWarehouse(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

    return () => { unsubWarehouse(); unsubOrders(); unsubPrices(); };
  }, []);

  const monthlyReport = useMemo(() => {
    const monthly = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = {
        month: key,
        produced: 0,
        sold: 0,
        revenue: 0,
        priceChange: 0
      };
    }

    warehouse.forEach(car => {
      if (car.sana) {
        const key = car.sana.slice(0, 7);
        if (monthly[key]) monthly[key].produced++;
      }
    });

    orders
      .filter(o => o.holat === 'Yetkazildi' && o.sana)
      .forEach(order => {
        const key = order.sana.slice(0, 7);
        if (monthly[key]) {
          const qty = parseInt(order.miqdor) || 0;
          const price = prices[order.model] || 0;
          monthly[key].sold += qty;
          monthly[key].revenue += qty * price;
        }
      });

    const sorted = Object.entries(monthly)
      .map(([key, val]) => ({ ...val }))
      .sort((a, b) => a.month.localeCompare(b.month));

    sorted.forEach((item, i) => {
      if (i > 0) {
        const prev = sorted[i - 1];
        if (prev.revenue > 0) {
          item.priceChange = ((item.revenue - prev.revenue) / prev.revenue) * 100;
        }
      }
    });

    return sorted;
  }, [warehouse, orders, prices]);

  const totalProduced = warehouse.length;
  const totalSold = monthlyReport.reduce((sum, m) => sum + m.sold, 0);
  const totalRevenue = monthlyReport.reduce((sum, m) => sum + m.revenue, 0);
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Hisobot va Analitika
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Oyma-oy ishlab chiqarish, narx o‘sishi va daromad (Firebase'dan jonli)
            </p>
          </div>
        </div>

        {/* Umumiy statistika - Jonli hisoblanadi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Jami ishlab chiqarilgan', value: totalProduced, color: 'from-blue-500 to-cyan-500', icon: Package },
            { label: 'Sotilgan', value: totalSold, color: 'from-emerald-500 to-green-500', icon: Truck },
            { label: 'Umumiy daromad', value: `${totalRevenue.toLocaleString()} UZS`, color: 'from-purple-500 to-pink-500', icon: DollarSign },
            { label: 'O‘rtacha narx', value: `${avgPrice.toLocaleString()} UZS`, color: 'from-amber-500 to-orange-500', icon: Activity }
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

        {/* Grafik - Narxlar bilan jonli */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Oyma-oy daromad va narx o‘sishi
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyReport}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280 dark:fill-gray-400' }} />
              <YAxis tick={{ fill: '#6b7280 dark:fill-gray-400' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb dark:bg-slate-800', border: '1px solid #e5e7eb dark:border-slate-700', borderRadius: '8px', color: '#374151 dark:color-gray-300' }}
              />
              <Legend wrapperStyle={{ color: '#6b7280 dark:color-gray-400' }} />
              <Line type="monotone" dataKey="produced" stroke="#8b5cf6" name="Ishlab chiqarilgan" strokeWidth={3} />
              <Line type="monotone" dataKey="sold" stroke="#10b981" name="Sotilgan" strokeWidth={3} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Daromad (UZS)" strokeWidth={3} yAxisId="right" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Jadval - Responsive */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-5 flex items-center gap-2 border-b border-gray-200 dark:border-slate-700">
            <Calendar className="w-5 h-5 text-blue-600" />
            Oylik batafsil hisobot
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Oy</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ishlab chiqarilgan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sotilgan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Daromad (UZS)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Narx o‘sishi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {monthlyReport.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600 dark:text-purple-400 font-medium">{row.produced}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 dark:text-emerald-400 font-medium">{row.sold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 dark:text-blue-400 font-medium">{row.revenue.toLocaleString()} UZS</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {row.priceChange !== 0 ? (
                        <span className={row.priceChange > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                          {row.priceChange > 0 ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                          {Math.abs(row.priceChange).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
// src/pages/Dashboard.jsx - To'liq Responsive + Optimal + Professional (Circular + LineChart + Recommended Cars, real-time, tab o'zgarishi)
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Malibu from '../img/malibu.png';
import Onix from '../img/onix.png';
import Spark from '../img/spark.png';

const CircularProgress = ({ percentage, color, label }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500'
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-200 dark:text-slate-700" />
          <circle
            cx="64" cy="64" r={radius} stroke="url(#gradient)" strokeWidth="12" fill="none"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000" strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`stop-color ${colorClasses[color].split(' ')[1]}`} />
              <stop offset="100%" className={`stop-color ${colorClasses[color].split(' ')[3]}`} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{percentage}%</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ energy: 45, range: 157, brakeFluid: 9, tireWear: 25 });
  const [tab, setTab] = useState('day');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time: Vehicle status
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'vehicles'), (snap) => {
      const data = snap.docs.map(doc => doc.data());
      if (data.length > 0) {
        const vehicle = data[0];
        setStats({
          energy: vehicle.energy || 45,
          range: vehicle.range || 157,
          brakeFluid: vehicle.brakeFluid || 9,
          tireWear: vehicle.tireWear || 25
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Chart + Stats o'zgarishi
  const generateData = useMemo(() => (tab) => {
    let baseEnergy = 45, baseRange = 157, baseBrake = 9, baseTire = 25;
    let data = [];

    if (tab === 'day') {
      data = Array.from({ length: 7 }, (_, i) => {
        const hour = 13 + i;
        const energy = Math.max(0, baseEnergy - i * 2 + Math.random() * 5);
        const range = Math.max(0, baseRange - i * 3 + Math.random() * 10);
        const brake = Math.max(0, baseBrake + i * 0.1 + Math.random() * 0.5);
        const tire = Math.max(0, baseTire + i * 0.3 + Math.random() * 1);
        return {
          time: `${hour} PM`,
          energy: Math.round(energy),
          range: Math.round(range),
          brakeFluid: Math.round(brake * 10) / 10,
          tireWear: Math.round(tire * 10) / 10
        };
      });
    } else if (tab === 'week') {
      const days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
      data = days.map((day, i) => ({
        time: day,
        energy: Math.round(baseEnergy - i * 5 + Math.random() * 10),
        range: Math.round(baseRange - i * 15 + Math.random() * 30),
        brakeFluid: Math.round((baseBrake + i * 0.5 + Math.random()) * 10) / 10,
        tireWear: Math.round((baseTire + i * 1.5 + Math.random() * 3) * 10) / 10
      }));
    } else if (tab === 'month') {
      const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
      data = months.map((month, i) => ({
        time: month,
        energy: Math.round(baseEnergy - i * 8 + Math.random() * 20),
        range: Math.round(baseRange - i * 40 + Math.random() * 80),
        brakeFluid: Math.round((baseBrake + i * 2 + Math.random() * 2) * 10) / 10,
        tireWear: Math.round((baseTire + i * 5 + Math.random() * 8) * 10) / 10
      }));
    } else if (tab === 'year') {
      data = Array.from({ length: 4 }, (_, i) => {
        const year = 2022 + i;
        return {
          time: `${year}`,
          energy: Math.round(baseEnergy - i * 30 + Math.random() * 50),
          range: Math.round(baseRange - i * 150 + Math.random() * 300),
          brakeFluid: Math.round((baseBrake + i * 8 + Math.random() * 5) * 10) / 10,
          tireWear: Math.round((baseTire + i * 20 + Math.random() * 15) * 10) / 10
        };
      });
    }

    // Stats yangilash
    if (data.length > 0) {
      const last = data[data.length - 1];
      setStats({
        energy: Math.max(0, last.energy),
        range: Math.max(0, last.range),
        brakeFluid: Math.max(0, last.brakeFluid),
        tireWear: Math.max(0, last.tireWear)
      });
    }

    return data;
  }, []);

  useEffect(() => {
    setChartData(generateData(tab));
  }, [tab, generateData]);

  const recommendedCars = useMemo(() => [
    { id: 1, name: 'Chevrolet Malibu', price: '$32/h', recommend: '64%', image: Malibu },
    { id: 2, name: 'Chevrolet Onix', price: '$28/h', recommend: '74%', image: Onix },
    { id: 3, name: 'Chevrolet Spark', price: '$29/h', recommend: '74%', image: Spark },
  ], []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Circular Stats - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <CircularProgress percentage={stats.energy} color="purple" label="Energy" />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <CircularProgress percentage={Math.min(100, Math.round((stats.range / 500) * 100))} color="red" label="Range" />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <CircularProgress percentage={stats.brakeFluid} color="blue" label="Break fluid" />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <CircularProgress percentage={stats.tireWear} color="yellow" label="Tire Wear" />
          </motion.div>
        </div>

        {/* Chart + Tab */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Vehicle Statistics</h3>
            <div className="flex flex-wrap gap-2">
              {['day', 'week', 'month', 'year'].map((tTab) => (
                <button
                  key={tTab}
                  onClick={() => setTab(tTab)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-all ${
                    tab === tTab 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {t(tTab)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="energy" stroke="#8b5cf6" strokeWidth={3} name="Energy %" />
                <Line type="monotone" dataKey="range" stroke="#ef4444" strokeWidth={3} name="Range km" />
                <Line type="monotone" dataKey="brakeFluid" stroke="#3b82f6" strokeWidth={3} name="Brake Fluid %" />
                <Line type="monotone" dataKey="tireWear" stroke="#f59e0b" strokeWidth={3} name="Tire Wear %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recommended Cars - Responsive Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCars.map((car) => (
              <motion.div
                key={car.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={car.image} alt={car.name} className="w-full h-32 object-cover" loading="lazy" />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800 dark:text-white">{car.name}</h4>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{car.recommend} Recommend</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{car.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
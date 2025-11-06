// src/hooks/useReports.js
import { useState, useEffect } from 'react';
import { monthlyData, modelSales } from '../data/mockData';

export const useReports = () => {
  const [stats, setStats] = useState({
    totalOrders: 356,
    inProduction: 65,
    inWarehouse: 68,
    delivered: 223,
  });
  const [monthly, setMonthly] = useState(monthlyData);
  const [models, setModels] = useState(modelSales);

  // Real-time yangilanish
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
        inProduction: Math.max(0, prev.inProduction + Math.floor(Math.random() * 5) - 2),
        inWarehouse: Math.max(0, prev.inWarehouse + Math.floor(Math.random() * 4) - 1),
        delivered: prev.delivered + Math.floor(Math.random() * 2),
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return { stats, monthly, models };
};
// src/hooks/useReports.js (yangilangan – ko'proq mock hisobotlar)
import { useMemo } from 'react';
import { useOrders } from './useOrders';
import { useWarehouse } from './useWarehouse';

export const useReports = () => {
  const { orders } = useOrders();
  const { cars } = useWarehouse();

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    inProduction: orders.filter(o => o.holat === 'Jarayonda').length,
    inWarehouse: cars.filter(c => c.status === 'Tayyor').length,
    delivered: orders.filter(o => o.holat === 'Yetkazildi').length,
  }), [orders, cars]);

  const monthlyProduced = useMemo(() => {
    const monthNamesUz = {
      0: 'Yanvar', 1: 'Fevral', 2: 'Mart', 3: 'Aprel', 4: 'May', 5: 'Iyun',
      6: 'Iyul', 7: 'Avgust', 8: 'Sentyabr', 9: 'Oktyabr', 10: 'Noyabr', 11: 'Dekabr'
    };
    const monthly = {};
    cars.forEach(car => {
      const date = new Date(car.sana);
      const oyIndex = date.getMonth();
      const oy = `${monthNamesUz[oyIndex]} ${date.getFullYear()}`;
      monthly[oy] = (monthly[oy] || 0) + 1;
    });
    return Object.entries(monthly)
      .map(([oy, son]) => ({ oy, ishlabchiqarish: son }))
      .sort((a, b) => {
        const aYear = parseInt(a.oy.split(' ')[1]);
        const bYear = parseInt(b.oy.split(' ')[1]);
        const aMonthIndex = Object.values(monthNamesUz).indexOf(a.oy.split(' ')[0]);
        const bMonthIndex = Object.values(monthNamesUz).indexOf(b.oy.split(' ')[0]);
        if (aYear !== bYear) return bYear - aYear;
        return bMonthIndex - aMonthIndex;
      });
  }, [cars]);

  const yearlyProduced = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return cars.filter(car => new Date(car.sana).getFullYear() === currentYear).length;
  }, [cars]);

  const modelSales = useMemo(() => {
    const sales = {};
    orders.filter(o => o.holat === 'Yetkazildi').forEach(order => {
      const miqdor = parseInt(order.miqdor) || 1;
      sales[order.model] = (sales[order.model] || 0) + miqdor;
    });
    const totalSotuv = Object.values(sales).reduce((a, b) => a + b, 0);
    return Object.entries(sales).map(([model, sotuv]) => ({
      model,
      sotuv,
      foiz: totalSotuv > 0 ? Math.round((sotuv / totalSotuv) * 100) : 0
    })).sort((a, b) => b.sotuv - a.sotuv);
  }, [orders]);

  // Yangi: Ko'proq mock hisobotlar (jami hisobotlar soni)
  const reportStats = useMemo(() => ({
    totalReports: 45, // Mock
    monthlyReports: 12, // Oylik
    yearlyReports: 120, // Yillik
  }), []);

  return { stats, monthlyProduced, yearlyProduced, modelSales, reportStats };
};
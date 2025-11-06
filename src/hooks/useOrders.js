// src/hooks/useOrders.js (tuzatilgan – removeCar muammosi hal qilindi)
import { useState, useEffect } from 'react';
import { orders as initialOrders } from '../data/mockData';

export const useOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Har 15 soniyada yangi buyurtma (mock)
  useEffect(() => {
    const interval = setInterval(() => {
      const models = ["Chevrolet Spark", "Chevrolet Onix", "Chevrolet Malibu"];
      const colors = ["Oq", "Qora", "Kulrang", "Qizil"];
      const randomOrder = {
        id: Date.now(),
        mijoz: ["Toshkent Diler", "Andijon Auto", "Namangan Motors"][Math.floor(Math.random() * 3)],
        model: models[Math.floor(Math.random() * 3)],
        rang: colors[Math.floor(Math.random() * 4)],
        miqdor: Math.floor(Math.random() * 10) + 1,
        muddat: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        holat: "Yangi",
        sana: new Date().toISOString().split('T')[0],
      };
      setOrders(prev => [randomOrder, ...prev]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const addOrder = (newOrder) => {
    const order = {
      ...newOrder,
      id: Date.now(),
      holat: "Yangi",
      sana: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [order, ...prev]);
  };

  const updateStatus = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === id) {
          const updatedOrder = { ...order, holat: newStatus };
          
          // TODO: Keyinchalik, "Yetkazildi" bo'lganda ombor bilan integratsiya (Zustand store orqali)
          // Hozircha faqat buyurtma holatini o'zgartirish
          if (newStatus === "Yetkazildi") {
            console.log(`Buyurtma ${id} yetkazildi – ombor yangilanishi kerak (model: ${order.model}, rang: ${order.rang}, miqdor: ${order.miqdor})`);
            // Bu yerda keyinroq removeCar chaqiriladi (shared store bilan)
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const filteredOrders = orders
    .filter(order => {
      if (filter !== 'all' && order.holat !== filter) return false;
      if (modelFilter !== 'all' && order.model !== modelFilter) return false;
      const orderDate = new Date(order.muddat);
      if (dateFrom && orderDate < new Date(dateFrom)) return false;
      if (dateTo && orderDate > new Date(dateTo)) return false;
      if (search && !order.mijoz.toLowerCase().includes(search.toLowerCase()) && !order.model.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.sana) - new Date(a.sana));

  return { 
    orders: filteredOrders, 
    addOrder, 
    updateStatus, 
    search, setSearch, 
    filter, setFilter,
    modelFilter, setModelFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
  };
};
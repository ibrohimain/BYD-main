// src/hooks/useOrders.js (yangilangan)
import { useState, useEffect } from 'react';
import { orders as initialOrders } from '../data/mockData';
import { useWarehouse } from './useWarehouse';

export const useOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // status filter
  const [modelFilter, setModelFilter] = useState('all'); // yangi: model filter
  const [dateFrom, setDateFrom] = useState(''); // yangi: muddat boshlanishi
  const [dateTo, setDateTo] = useState(''); // yangi: muddat tugashi

  // Har 15 soniyada yangi buyurtma (mock, yangi maydonlar bilan)
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
        muddat: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 kun ichida
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
          
          // Agar "Yetkazildi" ga o'tsa, ombordan mos mashinalarni o'chirish
          if (newStatus === "Yetkazildi" && order.miqdor) {
            removeCar(order.model, order.rang, parseInt(order.miqdor)); // miqdor bo'yicha o'chirish
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const filteredOrders = orders
    .filter(order => {
      // Status filter
      if (filter !== 'all' && order.holat !== filter) return false;
      
      // Model filter
      if (modelFilter !== 'all' && order.model !== modelFilter) return false;
      
      // Muddat filter (range)
      const orderDate = new Date(order.muddat);
      if (dateFrom && orderDate < new Date(dateFrom)) return false;
      if (dateTo && orderDate > new Date(dateTo)) return false;
      
      // Qidiruv (mijoz yoki model)
      if (search && !order.mijoz.toLowerCase().includes(search.toLowerCase()) && !order.model.toLowerCase().includes(search.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => new Date(b.sana) - new Date(a.sana)); // Sana bo'yicha tartiblash

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
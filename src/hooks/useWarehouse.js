// src/hooks/useWarehouse.js (yangilangan)
import { useState, useEffect } from 'react';
import { warehouse as initialWarehouse } from '../data/mockData';

export const useWarehouse = () => {
  const [cars, setCars] = useState(initialWarehouse);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // status filter
  const [modelFilter, setModelFilter] = useState('all'); // yangi: model
  const [rangFilter, setRangFilter] = useState('all'); // yangi: rang
  const [kategoriyaFilter, setKategoriyaFilter] = useState('all'); // yangi: kategoriya

  // Har 20 soniyada yangi mashina (mock, yangi maydonlar bilan)
  useEffect(() => {
    const interval = setInterval(() => {
      const models = ["Chevrolet Spark", "Chevrolet Onix", "Chevrolet Malibu"];
      const colors = ["Oq", "Qora", "Kulrang", "Qizil"];
      const categories = ["Hatchback", "Sedan"];
      const newCar = {
        id: `SPK-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        model: models[Math.floor(Math.random() * 3)],
        rang: colors[Math.floor(Math.random() * 4)],
        kategoriya: categories[Math.floor(Math.random() * 2)],
        status: "Tayyor",
        location: `${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
        vin: `KL1T${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
        sana: new Date().toISOString().split('T')[0]
      };
      setCars(prev => [newCar, ...prev]);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id, newStatus) => {
    setCars(prev =>
      prev.map(car =>
        car.id === id ? { ...car, status: newStatus } : car
      )
    );
  };

  // Yangi: Mashina o'chirish funksiyasi (buyurtma tasdiqlanganda chaqiriladi)
  const removeCar = (model, rang, miqdor) => {
    // Miqdor bo'yicha bir necha mashina o'chirish (oddiy: birinchi topilganlarni o'chirish)
    setCars(prev => {
      let updated = [...prev];
      for (let i = 0; i < miqdor && updated.length > 0; i++) {
        const index = updated.findIndex(car => car.model === model && car.rang === rang && car.status === "Tayyor");
        if (index !== -1) {
          updated.splice(index, 1);
        } else {
          break; // Topilmasa to'xtatish
        }
      }
      return updated;
    });
  };

  const filteredCars = cars.filter(car => {
    // Status filter
    if (filter !== 'all' && car.status !== filter) return false;
    
    // Model filter
    if (modelFilter !== 'all' && car.model !== modelFilter) return false;
    
    // Rang filter
    if (rangFilter !== 'all' && car.rang !== rangFilter) return false;
    
    // Kategoriya filter
    if (kategoriyaFilter !== 'all' && car.kategoriya !== kategoriyaFilter) return false;
    
    // Qidiruv (ID, model, rang)
    if (search && !car.id.toLowerCase().includes(search.toLowerCase()) && 
        !car.model.toLowerCase().includes(search.toLowerCase()) && 
        !car.rang.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });

  const stats = {
    total: cars.length,
    ready: cars.filter(c => c.status === "Tayyor").length,
    repair: cars.filter(c => c.status === "Ta'mirda").length,
    delivered: cars.filter(c => c.status === "Chiqarildi").length,
  };

  return { 
    cars: filteredCars, 
    updateStatus, 
    removeCar, // yangi: eksport qilish
    search, setSearch, 
    filter, setFilter,
    modelFilter, setModelFilter,
    rangFilter, setRangFilter,
    kategoriyaFilter, setKategoriyaFilter,
    stats 
  };
};
// src/pages/Orders.jsx (yangilangan)
import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { Plus, Search, Filter, Calendar, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function Orders() {
  const { 
    orders, addOrder, updateStatus, search, setSearch, filter, setFilter,
    modelFilter, setModelFilter, dateFrom, setDateFrom, dateTo, setDateTo
  } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mijoz: "", model: "", rang: "", miqdor: "", muddat: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder(form);
    setForm({ mijoz: "", model: "", rang: "", miqdor: "", muddat: "" });
    setShowForm(false);
  };

  const getStatusIcon = (holat) => {
    switch (holat) {
      case "Yangi": return <Clock className="w-5 h-5 text-blue-600" />;
      case "Jarayonda": return <Truck className="w-5 h-5 text-yellow-600" />;
      case "Yetkazildi": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Bekor qilindi": return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (holat) => {
    switch (holat) {
      case "Yangi": return "bg-blue-100 text-blue-700";
      case "Jarayonda": return "bg-yellow-100 text-yellow-700";
      case "Yetkazildi": return "bg-green-100 text-green-700";
      case "Bekor qilindi": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Buyurtmalar</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi Buyurtma</span>
        </button>
      </div>

      {/* Filterlar paneli (kengaytirilgan) */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Qidiruv */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Mijoz yoki model bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">Barcha holatlar</option>
              <option value="Yangi">Yangi</option>
              <option value="Jarayonda">Jarayonda</option>
              <option value="Yetkazildi">Yetkazildi</option>
              <option value="Bekor qilindi">Bekor qilindi</option>
            </select>
          </div>

          {/* Model filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">Barcha modellar</option>
              <option value="Chevrolet Spark">Chevrolet Spark</option>
              <option value="Chevrolet Onix">Chevrolet Onix</option>
              <option value="Chevrolet Malibu">Chevrolet Malibu</option>
            </select>
          </div>

          {/* Muddat filter (date range) */}
          <div className="relative flex space-x-2">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Boshlanish"
              />
            </div>
            <span className="self-center text-gray-500">-</span>
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Tugash"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buyurtmalar ro'yxati */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Buyurtma topilmadi
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-xl">{order.model} ({order.rang}) × {order.miqdor}</h3>
                    {getStatusIcon(order.holat)}
                  </div>
                  <p className="text-gray-600">{order.mijoz}</p>
                  <p className="text-sm text-gray-500">Muddat: {order.muddat} | Sana: {order.sana}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.holat)}`}>
                    {order.holat}
                  </span>

                  <select
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    value={order.holat}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Yangi">Yangi</option>
                    <option value="Jarayonda">Jarayonda</option>
                    <option value="Yetkazildi">Yetkazildi</option>
                    <option value="Bekor qilindi">Bekor qilindi</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Yangi buyurtma formasi (kengaytirilgan) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Yangi Buyurtma</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Mijoz nomi"
                value={form.mijoz}
                onChange={(e) => setForm({ ...form, mijoz: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Model tanlang</option>
                <option>Chevrolet Spark</option>
                <option>Chevrolet Onix</option>
                <option>Chevrolet Malibu</option>
              </select>
              <select
                value={form.rang}
                onChange={(e) => setForm({ ...form, rang: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Rang tanlang</option>
                <option>Oq</option>
                <option>Qora</option>
                <option>Kulrang</option>
                <option>Qizil</option>
              </select>
              <input
                type="number"
                placeholder="Miqdor"
                value={form.miqdor}
                onChange={(e) => setForm({ ...form, miqdor: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                min="1"
                required
              />
              <input
                type="date"
                placeholder="Yetkazib berish muddati"
                value={form.muddat}
                onChange={(e) => setForm({ ...form, muddat: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
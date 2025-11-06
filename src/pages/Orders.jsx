// src/pages/Orders.jsx
// Fixed responsiveness for date inputs: Adjusted modal width, improved flex handling for filters,
// reduced padding on small screens, ensured date inputs don't overflow by using consistent sizing.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useOrders } from '../hooks/useOrders';
import { Plus, Search, Filter, Calendar, Clock, Truck, CheckCircle, XCircle, MapPin } from 'lucide-react';

const deliveryPoints = [
  { id: 1, name: 'Toshkent', lat: 41.2995, lng: 69.2401, address: 'Chilonzor, Toshkent' },
  { id: 2, name: 'Samarqand', lat: 39.6545, lng: 66.9703, address: 'Registon, Samarqand' },
  { id: 3, name: 'Buxoro', lat: 39.7684, lng: 64.4234, address: 'Markaziy, Buxoro' },
];

const operators = [
  { id: 1, name: 'Ali Karim', phone: '+998 90 123 45 67', email: 'ali@afoms.uz' },
  { id: 2, name: 'Mahmuda Sodiq', phone: '+998 91 234 56 78', email: 'mahmuda@afoms.uz' },
  { id: 3, name: 'Javohir Rustam', phone: '+998 93 345 67 89', email: 'javohir@afoms.uz' },
];

const orderChartData = [
  { name: 'Yangi', value: 20 },
  { name: 'Jarayonda', value: 15 },
  { name: 'Yetkazildi', value: 10 },
  { name: 'Bekor', value: 5 },
];

export default function Orders() {
  const { t, i18n } = useTranslation();
  const { 
    orders, 
    addOrder, 
    updateStatus, 
    search, 
    setSearch, 
    filter, 
    setFilter, 
    modelFilter, 
    setModelFilter, 
    dateFrom, 
    setDateFrom, 
    dateTo, 
    setDateTo 
  } = useOrders();
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    mijoz: '', 
    model: '', 
    rang: '', 
    miqdor: '', 
    muddat: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.mijoz || !form.model || !form.rang || !form.miqdor || !form.muddat) {
      alert(t('allFieldsRequired') || 'Barcha maydonlar to\'ldirilishi kerak!');
      return;
    }
    addOrder(form);
    setForm({ mijoz: '', model: '', rang: '', miqdor: '', muddat: '' });
    setShowForm(false);
  };

  const getStatusIcon = (holat) => {
    switch (holat) {
      case 'Yangi': return <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />;
      case 'Jarayonda': return <Truck className="w-4 h-4 text-yellow-600 flex-shrink-0" />;
      case 'Yetkazildi': return <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />;
      case 'Bekor qilindi': return <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />;
      default: return null;
    }
  };

  const getStatusColor = (holat) => {
    switch (holat) {
      case 'Yangi': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Jarayonda': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Yetkazildi': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Bekor qilindi': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Default to 1 for better mobile
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('orders')}
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('newOrder')}</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
              {t('filter')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat bg-right pr-8"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="Yangi">{t('new')}</option>
                <option value="Jarayonda">{t('inProgress')}</option>
                <option value="Yetkazildi">{t('delivered')}</option>
                <option value="Bekor qilindi">{t('canceled')}</option>
              </select>
            </div>

            {/* Model Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat bg-right pr-8"
              >
                <option value="all">{t('allModels')}</option>
                <option value="Chevrolet Spark">Chevrolet Spark</option>
                <option value="Chevrolet Onix">Chevrolet Onix</option>
                <option value="Chevrolet Malibu">Chevrolet Malibu</option>
              </select>
            </div>

            {/* Date Filters - Improved flex for small screens */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>
              <span className="self-center text-gray-400 hidden sm:inline-flex sm:items-center"> - </span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t('noOrdersFound')}
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-none transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start sm:items-center space-x-3 mb-2 sm:mb-0">
                      <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white flex-1">
                        {order.model} ({order.rang}) × {order.miqdor}
                      </h3>
                      {getStatusIcon(order.holat)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{order.mijoz}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Muddat: {order.muddat} | Sana: {order.sana}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-normal">
                    <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.holat)}`}>
                      {order.holat}
                    </span>
                    <select
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      value={order.holat}
                      className="px-3 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Jarayonda">Jarayonda</option>
                      <option value="Yetkazildi">Yetkazildi</option>
                      <option value="Bekor qilindi">Bekor qilindi</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* New Order Modal - Increased max-w for better date input fit */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  {t('newOrder')}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder={t('customer')}
                    value={form.mijoz}
                    onChange={(e) => setForm({ ...form, mijoz: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                    required
                  />
                  <select
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat bg-right pr-8"
                    required
                  >
                    <option value="">{t('model')}</option>
                    <option>Chevrolet Spark</option>
                    <option>Chevrolet Onix</option>
                    <option>Chevrolet Malibu</option>
                  </select>
                  <select
                    value={form.rang}
                    onChange={(e) => setForm({ ...form, rang: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat bg-right pr-8"
                    required
                  >
                    <option value="">{t('color')}</option>
                    <option>Oq</option>
                    <option>Qora</option>
                    <option>Kulrang</option>
                    <option>Qizil</option>
                  </select>
                  <input
                    type="number"
                    placeholder={t('quantity')}
                    value={form.miqdor}
                    onChange={(e) => setForm({ ...form, miqdor: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                    min="1"
                    required
                  />
                  <input
                    type="date"
                    placeholder={t('deadline')}
                    value={form.muddat}
                    onChange={(e) => setForm({ ...form, muddat: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                    required
                  />
                  <div className="flex space-x-3 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      {t('save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-700 dark:text-white py-2.5 sm:py-3 rounded-lg transition-colors text-sm"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivery Points */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Yetkazib Berish Punktlari
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {deliveryPoints.map((point) => (
              <div 
                key={point.id} 
                className="p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {point.name}
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  {point.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Operators Carousel */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Aloqa Operatorlari
          </h3>
          <Slider {...sliderSettings}>
            {operators.map((operator) => (
              <div key={operator.id} className="px-2">
                <div className="p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {operator.name}
                  </h4>
                  <p className="text-blue-600 text-xs sm:text-sm mt-1">{operator.phone}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    {operator.email}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Map */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Yetkazib Berish Xaritasi
          </h3>
          <div className="h-64 sm:h-80 rounded-lg overflow-hidden">
            <MapContainer 
              center={[41.2995, 69.2401]} 
              zoom={6} 
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {deliveryPoints.map((point) => (
                <Marker key={point.id} position={[point.lat, point.lng]}>
                  <Popup>{point.name}: {point.address}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Buyurtma Holati Chart
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="name" stroke="gray" />
              <YAxis stroke="gray" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
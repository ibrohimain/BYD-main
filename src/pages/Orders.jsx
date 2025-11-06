// src/pages/Orders.jsx (border'lar olib tashlandi, shadow bilan chiroyli qilindi)
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
import { Plus, Search, Filter, Calendar, Clock, Truck, CheckCircle, XCircle, MapPin, Phone, Mail } from 'lucide-react';

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
  const { orders, addOrder, updateStatus, search, setSearch, filter, setFilter, modelFilter, setModelFilter, dateFrom, setDateFrom, dateTo, setDateTo } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mijoz: '', model: '', rang: '', miqdor: '', muddat: '' });
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);

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
      case 'Yangi': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Jarayonda': return <Truck className="w-5 h-5 text-yellow-600" />;
      case 'Yetkazildi': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Bekor qilindi': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (holat) => {
    switch (holat) {
      case 'Yangi': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Jarayonda': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Yetkazildi': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Bekor qilindi': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log('Xabar yuborildi:', chatMessage, 'Operatorga:', selectedOperator);
      setChatMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-white dark:to-white"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Sarlavha */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-black">{t('orders')}</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>{t('newOrder')}</span>
          </button>
        </div>

        {/* Filterlar paneli */}
        <div className="bg-white dark:bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-800 dark:text-black">{t('filter')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Qidiruv */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black appearance-none"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="Yangi">{t('new')}</option>
                <option value="Jarayonda">{t('inProgress')}</option>
                <option value="Yetkazildi">{t('delivered')}</option>
                <option value="Bekor qilindi">{t('canceled')}</option>
              </select>
            </div>

            {/* Model filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black appearance-none"
              >
                <option value="all">{t('allModels')}</option>
                <option value="Chevrolet Spark">Chevrolet Spark</option>
                <option value="Chevrolet Onix">Chevrolet Onix</option>
                <option value="Chevrolet Malibu">Chevrolet Malibu</option>
              </select>
            </div>

            {/* Sana filtrlari */}
            <div className="relative flex space-x-2">
              <div className="flex-1">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
                />
              </div>
              <span className="self-center text-gray-400"> - </span>
              <div className="flex-1">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buyurtmalar ro'yxati */}
        <div className="grid grid-cols-1 gap-4">
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
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-xl text-gray-800 dark:text-black">{order.model} ({order.rang}) × {order.miqdor}</h3>
                      {getStatusIcon(order.holat)}
                    </div>
                    <p className="text-gray-600 dark:text-black">{order.mijoz}</p>
                    <p className="text-sm text-gray-500 dark:text-black">Muddat: {order.muddat} | Sana: {order.sana}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.holat)}`}>
                      {order.holat}
                    </span>
                    <select
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      value={order.holat}
                      className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
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

        {/* Yangi buyurtma formasi */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white dark:bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-black">{t('newOrder')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder={t('customer')}
                    value={form.mijoz}
                    onChange={(e) => setForm({ ...form, mijoz: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
                    required
                  />
                  <select
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
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
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
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
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
                    min="1"
                    required
                  />
                  <input
                    type="date"
                    placeholder={t('deadline')}
                    value={form.muddat}
                    onChange={(e) => setForm({ ...form, muddat: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:border-gray-600 dark:text-black"
                    required
                  />
                  <div className="flex space-x-3">
                    <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                      {t('save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 dark:bg-white text-gray-700 dark:text-black py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-300 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Yetkazib berish punktlari */}
        <div className="bg-white dark:bg-white p-6 rounded-xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-black">Yetkazib Berish Punktlari</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryPoints.map((point) => (
              <div key={point.id} className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-800 dark:text-black">{point.name}</h4>
                </div>
                <p className="text-gray-600 dark:text-black text-sm">{point.address}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Aloqa operatorlari carousel */}
        <div className="bg-white dark:bg-white p-6 rounded-xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-black">Aloqa Operatorlari</h3>
          <Slider {...sliderSettings}>
            {operators.map((operator) => (
              <div key={operator.id} className="px-2">
                <div className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors">
                  <h4 className="font-bold text-gray-800 dark:text-black">{operator.name}</h4>
                  <p className="text-blue-600 text-sm">{operator.phone}</p>
                  <p className="text-gray-600 dark:text-black text-sm">{operator.email}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Xarita */}
        <div className="bg-white dark:bg-white p-6 rounded-xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-black">Yetkazib Berish Xaritasi</h3>
          <MapContainer center={[41.2995, 69.2401]} zoom={6} style={{ height: '300px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {deliveryPoints.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]}>
                <Popup>
                  {point.name}: {point.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Chartlar */}
        <div className="bg-white dark:bg-white p-6 rounded-xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-black">Buyurtma Holati Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="gray" />
              <YAxis stroke="gray" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
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
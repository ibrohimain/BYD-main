// src/pages/Orders.jsx (Rasm kattaroq + to'liq UI)
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp,
  query, where, getDocs, writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Package, Truck, CheckCircle, XCircle, Clock, Plus, Search, Filter, 
  Edit, Trash2, Eye, MapPin, Phone, Mail, Calendar, AlertCircle
} from 'lucide-react';

// Rasm importlari
import Malibu from '../img/malibu.png';
import Onix from '../img/onix.png';
import Spark from '../img/spark.png';

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    mijoz: '', phone: '', email: '', model: '', rang: '', miqdor: 1, muddat: '', manzil: '', izoh: ''
  });

  // Modelga mos rasm
  const getCarImage = (model) => {
    switch (model) {
      case 'Chevrolet Malibu': return Malibu;
      case 'Chevrolet Onix': return Onix;
      case 'Chevrolet Spark': return Spark;
      default: return null;
    }
  };

  // Real-time orders
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    }, (err) => {
      console.error("Buyurtmalarni yuklashda xato:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Ombordan olib tashlash
  const removeFromWarehouse = async (model, rang, miqdor) => {
    const q = query(
      collection(db, 'warehouse'),
      where('model', '==', model),
      where('rang', '==', rang),
      where('status', '==', 'Tayyor')
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length < miqdor) {
      throw new Error(t('notEnoughStock'));
    }

    const batch = writeBatch(db);
    snapshot.docs.slice(0, miqdor).forEach((doc) => {
      batch.update(doc.ref, { status: 'Chiqarildi' });
    });
    await batch.commit();
  };

  // Buyurtma saqlash
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setError('');

    try {
      const orderData = {
        ...form,
        holat: editingOrder ? form.holat || 'Yangi' : 'Yangi',
        sana: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      };

      if (editingOrder) {
        await updateDoc(doc(db, 'orders', editingOrder.id), orderData);
      } else {
        await addDoc(collection(db, 'orders'), orderData);
      }
      setSaveStatus('saved');
      resetForm();
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError(err.message);
      setSaveStatus('error');
      setTimeout(() => { setSaveStatus(''); setError(''); }, 3000);
    }
  };

  const resetForm = () => {
    setForm({ mijoz: '', phone: '', email: '', model: '', rang: '', miqdor: 1, muddat: '', manzil: '', izoh: '' });
    setEditingOrder(null);
    setShowForm(false);
  };

  const handleEdit = (order) => {
    setForm({ ...order });
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'orders', id));
      } catch (err) {
        setError(t('deleteError'));
      }
    }
  };

  // Holatni o'zgartirish – Yetkazildi bo'lganda ombordan olib tashlash
  const updateStatus = async (id, newStatus) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (newStatus === 'Yetkazildi') {
      try {
        await removeFromWarehouse(order.model, order.rang, order.miqdor);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    try {
      await updateDoc(doc(db, 'orders', id), { holat: newStatus });
    } catch (err) {
      setError(t('statusError'));
    }
  };

  // Filtrlash
  const filteredOrders = orders
    .filter(order => {
      if (filter !== 'all' && order.holat !== filter) return false;
      const searchLower = search.toLowerCase();
      if (search && !order.mijoz.toLowerCase().includes(searchLower) && 
          !order.model.toLowerCase().includes(searchLower) &&
          !order.phone.includes(search)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.sana) - new Date(a.sana));

  const statusColor = (holat) => {
    const colors = {
      'Yangi': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Jarayonda': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Yetkazildi': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Bekor qilindi': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[holat] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const statusIcon = (holat) => {
    const icons = {
      'Yangi': <Clock className="w-4 h-4" />,
      'Jarayonda': <Package className="w-4 h-4" />,
      'Yetkazildi': <CheckCircle className="w-4 h-4" />,
      'Bekor qilindi': <XCircle className="w-4 h-4" />
    };
    return icons[holat] || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {t('ordersManagement')}
          </h1>
          {saveStatus === 'saving' && (
            <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              {t('saving')}
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t('saved')}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{t('newOrder')}</span>
        </button>
      </div>

      {/* Xato xabari */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">{t('all')}</option>
            <option value="Yangi">{t('new')}</option>
            <option value="Jarayonda">{t('inProgress')}</option>
            <option value="Yetkazildi">{t('delivered')}</option>
            <option value="Bekor qilindi">{t('canceled')}</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => {
          const carImage = getCarImage(order.model);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {carImage && (
                    <img 
                      src={carImage} 
                      alt={order.model}
                      className="w-24 h-24 object-cover rounded-xl shadow-md" // KATTAROQ: w-24 h-24
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                      {order.model} × {order.miqdor}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.mijoz}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColor(order.holat)}`}>
                  {statusIcon(order.holat)}
                  {order.holat}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{order.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{order.manzil}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{order.muddat}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title={t('view')}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(order)}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title={t('edit')}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title={t('delete')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Status Change */}
              <div className="mt-3 flex gap-2">
                {['Yangi', 'Jarayonda', 'Yetkazildi', 'Bekor qilindi'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order.id, status)}
                    disabled={saveStatus === 'saving'}
                    className={`flex-1 py-1 text-xs rounded-lg transition-colors ${
                      order.holat === status 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* New/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingOrder ? t('editOrder') : t('newOrder')}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('customerName')}
                    value={form.mijoz}
                    onChange={(e) => setForm({ ...form, mijoz: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={t('phone')}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                  <input
                    type="email"
                    placeholder={t('email')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                  />
                  <div className="relative">
                    <select
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 appearance-none"
                      required
                    >
                      <option value="">{t('selectModel')}</option>
                      <option>Chevrolet Spark</option>
                      <option>Chevrolet Onix</option>
                      <option>Chevrolet Malibu</option>
                    </select>
                    {form.model && (
                      <img 
                        src={getCarImage(form.model)} 
                        alt={form.model}
                        className="absolute right-10 top-1/2 -translate-y-1/2 w-10 h-10 object-cover rounded pointer-events-none" // FORMADA KATTAROQ
                      />
                    )}
                  </div>
                  <select
                    value={form.rang}
                    onChange={(e) => setForm({ ...form, rang: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    required
                  >
                    <option value="">{t('selectColor')}</option>
                    <option>Oq</option>
                    <option>Qora</option>
                    <option>Kulrang</option>
                    <option>Qizil</option>
                  </select>
                  <input
                    type="number"
                    placeholder={t('quantity')}
                    value={form.miqdor}
                    onChange={(e) => setForm({ ...form, miqdor: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                  <input
                    type="date"
                    value={form.muddat}
                    onChange={(e) => setForm({ ...form, muddat: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder={t('address')}
                    value={form.manzil}
                    onChange={(e) => setForm({ ...form, manzil: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 md:col-span-2"
                    required
                  />
                  <textarea
                    placeholder={t('notes')}
                    value={form.izoh}
                    onChange={(e) => setForm({ ...form, izoh: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 md:col-span-2 h-24"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={saveStatus === 'saving'}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {saveStatus === 'saving' ? t('saving') : (editingOrder ? t('save') : t('create'))}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {t('order')} #{selectedOrder.id.slice(-6)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={getCarImage(selectedOrder.model)} 
                      alt={selectedOrder.model}
                      className="w-32 h-32 object-cover rounded-xl shadow-md" // KATTAROQ: w-32 h-32
                    />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('model')}</p>
                      <p className="font-bold text-xl">{selectedOrder.model} × {selectedOrder.miqdor}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedOrder.rang}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('customer')}</p>
                    <p className="font-medium">{selectedOrder.mijoz}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Phone className="w-4 h-4" /> {selectedOrder.phone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Mail className="w-4 h-4" /> {selectedOrder.email}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {t('address')}
                    </p>
                    <p className="font-medium">{selectedOrder.manzil}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {t('deadline')}
                    </p>
                    <p className="font-medium">{selectedOrder.muddat}</p>
                  </div>
                  {selectedOrder.izoh && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('notes')}</p>
                      <p className="font-medium">{selectedOrder.izoh}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-6">
                  <span className={`px-6 py-2 rounded-full text-lg font-medium flex items-center gap-2 ${statusColor(selectedOrder.holat)}`}>
                    {statusIcon(selectedOrder.holat)}
                    {selectedOrder.holat}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
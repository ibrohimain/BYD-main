// src/pages/Finance.jsx - To'liq Responsive + Optimal + Professional (Integratsiya: Orders + Warehouse + Finance + Real-time)
import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  DollarSign, TrendingUp, TrendingDown, Package, Truck, Wrench, FileText,
  Plus, Edit, Trash2, Download, Calendar, AlertCircle, Calculator, Save, X
} from 'lucide-react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const expenseTypes = {
  repair: 'Ta\'mir',
  salary: 'Ish haqi',
  rent: 'Ijaraga',
  utilities: 'Kommunal',
  other: 'Boshqa'
};

export default function Finance() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [prices, setPrices] = useState({ 'Chevrolet Spark': 15000, 'Chevrolet Onix': 22000, 'Chevrolet Malibu': 35000 });
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  const [expenseForm, setExpenseForm] = useState({
    type: 'repair', amount: '', description: '', date: new Date().toISOString().split('T')[0]
  });

  const [priceForm, setPriceForm] = useState({ model: '', price: '' });

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubWarehouse = onSnapshot(collection(db, 'warehouse'), (snap) => {
      setWarehouse(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubExpenses = onSnapshot(collection(db, 'expenses'), (snap) => {
      setExpenses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPrices = onSnapshot(collection(db, 'prices'), (snap) => {
      const priceMap = {};
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.model && d.price) priceMap[d.model] = d.price;
      });
      setPrices(prev => ({ ...prev, ...priceMap }));
      setLoading(false);
    });

    return () => { unsubOrders(); unsubWarehouse(); unsubExpenses(); unsubPrices(); };
  }, []);

  // Daromad hisobi
  const revenue = useMemo(() => 
    orders
      .filter(o => o.holat === 'Yetkazildi')
      .reduce((sum, o) => sum + (parseInt(o.miqdor) || 0) * (prices[o.model] || 0), 0)
  , [orders, prices]);

  // Chiqimlar
  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  , [expenses]);

  // Foyda / Zarar
  const profit = useMemo(() => revenue - totalExpenses, [revenue, totalExpenses]);

  // Model bo'yicha daromad
  const modelRevenue = useMemo(() => 
    Object.entries(prices).map(([model, price]) => {
      const sold = orders
        .filter(o => o.holat === 'Yetkazildi' && o.model === model)
        .reduce((sum, o) => sum + (parseInt(o.miqdor) || 0), 0);
      return { model, sold, revenue: sold * price, price };
    }).filter(m => m.sold > 0)
  , [orders, prices]);

  // Chiqim turlari
  const expenseBreakdown = useMemo(() => 
    Object.entries(expenseTypes).map(([key, label]) => {
      const amount = expenses
        .filter(e => e.type === key)
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      return { type: label, amount };
    }).filter(e => e.amount > 0)
  , [expenses]);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setError('');
    try {
      const expenseData = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        createdAt: serverTimestamp()
      };

      if (editingExpense) {
        await updateDoc(doc(db, 'expenses', editingExpense.id), expenseData);
      } else {
        await addDoc(collection(db, 'expenses'), expenseData);
      }
      setSaveStatus('saved');
      resetExpenseForm();
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError(t('saveError'));
      setTimeout(() => setError(''), 4000);
    }
  };

  const resetExpenseForm = () => {
    setExpenseForm({ type: 'repair', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const handleEditExpense = (exp) => {
    setExpenseForm({
      type: exp.type,
      amount: exp.amount.toString(),
      description: exp.description || '',
      date: exp.date
    });
    setEditingExpense(exp);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'expenses', id));
      } catch (err) {
        setError(t('deleteError'));
      }
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setError('');
    try {
      const priceData = {
        model: priceForm.model,
        price: parseFloat(priceForm.price),
        updatedAt: serverTimestamp()
      };

      if (editingPrice) {
        await updateDoc(doc(db, 'prices', editingPrice.id), priceData);
      } else {
        await addDoc(collection(db, 'prices'), priceData);
      }
      setSaveStatus('saved');
      setPriceForm({ model: '', price: '' });
      setEditingPrice(null);
      setShowPriceForm(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError(t('saveError'));
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleEditPrice = (price, id) => {
    setPriceForm({ model: price.model, price: price.price.toString() });
    setEditingPrice({ ...price, id });
    setShowPriceForm(true);
  };

  const handleDeletePrice = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'prices', id));
      } catch (err) {
        setError(t('deleteError'));
      }
    }
  };

  // Eksport CSV
  const csvData = useMemo(() => [
    ['Umumiy Hisobot'],
    ['Jami Daromad', `${revenue.toLocaleString()}`],
    ['Jami Chiqim', `${totalExpenses.toLocaleString()}`],
    ['Foyda/Zarar', `${profit.toLocaleString()}`],
    [],
    ['Model Kesimida'],
    ['Model', 'Sotilgan', 'Narx', 'Daromad'],
    ...modelRevenue.map(m => [m.model, m.sold, m.price.toLocaleString(), m.revenue.toLocaleString()]),
    [],
    ['Chiqim Turlari'],
    ['Turi', 'Miqdor'],
    ...expenseBreakdown.map(e => [e.type, e.amount.toLocaleString()])
  ], [revenue, totalExpenses, profit, modelRevenue, expenseBreakdown]);

  // Eksport PDF
  const exportPDF = () => {
    const pdf = new jsPDF('landscape');
    pdf.setFontSize(20);
    pdf.text('Moliyaviy Hisobot', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Daromad: ${revenue.toLocaleString()}`, 20, 35);
    pdf.text(`Chiqim: ${totalExpenses.toLocaleString()}`, 20, 45);
    pdf.text(`Foyda/Zarar: ${profit.toLocaleString()}`, 20, 55);

    pdf.autoTable({
      head: [['Model', 'Sotilgan', 'Narx', 'Daromad']],
      body: modelRevenue.map(m => [m.model, m.sold.toString(), m.price.toLocaleString(), m.revenue.toLocaleString()]),
      startY: 70
    });

    pdf.autoTable({
      head: [['Chiqim turi', 'Miqdor']],
      body: expenseBreakdown.map(e => [e.type, e.amount.toLocaleString()]),
      startY: pdf.lastAutoTable.finalY + 10
    });

    pdf.save('moliya_hisobot.pdf');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Moliya Paneli
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Buyurtmalar, ombor va chiqimlar bilan to'liq integratsiya
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CSVLink
              data={csvData}
              filename="moliya.csv"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">CSV</span>
            </CSVLink>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => setShowPriceForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <DollarSign className="w-5 h-5" />
              <span className="hidden sm:inline">Narxlar</span>
            </button>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Chiqim</span>
            </button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Umumiy moliyaviy holat - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Jami Daromad', value: revenue.toLocaleString(), color: 'from-emerald-500 to-green-500', icon: TrendingUp },
            { label: 'Jami Chiqim', value: totalExpenses.toLocaleString(), color: 'from-red-500 to-pink-500', icon: TrendingDown },
            { label: 'Foyda / Zarar', value: profit.toLocaleString(), color: profit >= 0 ? 'from-blue-500 to-cyan-500' : 'from-orange-500 to-red-500', icon: Calculator },
            { label: 'Foyda foizi', value: revenue > 0 ? Math.round((profit / revenue) * 100) : 0, suffix: '%', color: 'from-purple-500 to-pink-500', icon: DollarSign }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg flex items-center justify-between`}
            >
              <div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}{stat.suffix || ''}</p>
              </div>
              <stat.icon className="w-10 h-10 opacity-80" />
            </motion.div>
          ))}
        </div>

        {/* Model bo'yicha daromad */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Model Kesimida Daromad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelRevenue.map((m, i) => (
              <motion.div
                key={m.model}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-slate-700 p-5 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{m.model}</h3>
                  <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{m.revenue.toLocaleString()} UZS</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {m.sold} ta × {m.price.toLocaleString()} UZS
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Chiqim turlari - Responsive Table */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chiqim Turlari</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Turi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Izoh</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sana</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Miqdor (UZS)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {expenses.map((exp, i) => (
                  <motion.tr
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {expenseTypes[exp.type] || exp.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {exp.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {exp.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400 font-medium">
                      {parseFloat(exp.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button onClick={() => handleEditExpense(exp)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Narxlar - Responsive Table */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mashina Narxlari</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Narx (UZS)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {Object.entries(prices).map(([model, price], i) => (
                  <motion.tr
                    key={model}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 dark:text-emerald-400 font-medium">
                      {parseFloat(price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button onClick={() => handleEditPrice({ model, price }, model)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeletePrice(model)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Chiqim Formasi Modal - Mobile Bottom Sheet */}
      <AnimatePresence>
        {showExpenseForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={resetExpenseForm}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingExpense ? 'Chiqimni tahrirlash' : 'Yangi chiqim'}
                  </h2>
                  <button onClick={resetExpenseForm} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleExpenseSubmit} className="space-y-5">
                  <select
                    value={expenseForm.type}
                    onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.entries(expenseTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Miqdor (UZS)"
                  />

                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl"
                    placeholder="Izoh (ixtiyoriy)"
                  />

                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl"
                    required
                  />

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={resetExpenseForm}
                      className="flex-1 py-4 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      Bekor qilish
                    </button>
                    <button type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narx Formasi Modal */}
      <AnimatePresence>
        {showPriceForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowPriceForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingPrice ? 'Narxni tahrirlash' : 'Yangi narx'}
                  </h2>
                  <button onClick={() => setShowPriceForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handlePriceSubmit} className="space-y-5">
                  <select
                    value={priceForm.model}
                    onChange={(e) => setPriceForm({ ...priceForm, model: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Tanlang</option>
                    <option>Chevrolet Spark</option>
                    <option>Chevrolet Onix</option>
                    <option>Chevrolet Malibu</option>
                  </select>

                  <input
                    type="number"
                    value={priceForm.price}
                    onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl"
                    required
                    min="0"
                    step="100"
                    placeholder="Narx (UZS)"
                  />

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowPriceForm(false)}
                      className="flex-1 py-4 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      Bekor qilish
                    </button>
                    <button type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// src/pages/Reports.jsx (yangilangan – ko'proq mock hisobotlar)
import { useRef, useState } from 'react';
import { useReports } from '../hooks/useReports';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Reports() {
  const { stats, monthlyProduced, yearlyProduced, modelSales, reportStats } = useReports();
  const printRef = useRef();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const csvData = [
    ...monthlyProduced.map(m => ({ 'Oy': m.oy, 'Ishlab chiqarish': m.ishlabchiqarish })),
    { 'Oy': `Yillik (${new Date().getFullYear()})`, 'Ishlab chiqarish': yearlyProduced },
    ...modelSales.map(ms => ({ 'Model': ms.model, 'Sotuv': ms.sotuv, 'Foiz': `${ms.foiz}%` })),
  ];

  return (
    <div ref={printRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Hisobot va Analitika</h2>
        <div className="flex gap-3">
          <button
            onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); handlePrint(); }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FileText className="w-5 h-5" />
            <span>PDF</span>
          </button>
          <CSVLink
            data={csvData}
            filename="afooms_hisobot.csv"
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-5 h-5" />
            <span>Excel</span>
          </CSVLink>
        </div>
      </div>

      {/* Yangi: Hisobotlar stats kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Jami Hisobotlar</p>
          <p className="text-3xl font-bold text-blue-600">{reportStats.totalReports}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Oylik Hisobotlar</p>
          <p className="text-3xl font-bold text-green-600">{reportStats.monthlyReports}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Yillik Hisobotlar</p>
          <p className="text-3xl font-bold text-yellow-600">{reportStats.yearlyReports}</p>
        </div>
      </div>

      {/* Stats kartalari (o'zgarishsiz) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Jami Buyurtma</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Ishlab chiqarishda</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.inProduction}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Omborda</p>
          <p className="text-3xl font-bold text-green-600">{stats.inWarehouse}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">Yetkazib berilgan</p>
          <p className="text-3xl font-bold text-red-600">{stats.delivered}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Yillik Ishlab Chiqarish (2025)</h3>
        <p className="text-4xl font-bold text-green-600">{yearlyProduced} ta mashina</p>
      </div>

      {/* Grafiklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Oylik Ishlab Chiqarish</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyProduced}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="oy" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="ishlabchiqarish" fill="#3B82F6" name="Ishlab chiqarish" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Model Kesimida Sotuv</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modelSales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="sotuv"
              >
                {modelSales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jadval (oylik) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Oylik Hisobot</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 text-gray-800 dark:text-white">Oy</th>
                <th className="py-2 text-center text-gray-800 dark:text-white">Ishlab Chiqarish</th>
              </tr>
            </thead>
            <tbody>
              {monthlyProduced.map((m, i) => (
                <tr key={i} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 text-gray-800 dark:text-white font-medium">{m.oy}</td>
                  <td className="py-3 text-center text-gray-800 dark:text-white">{m.ishlabchiqarish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Model Kesimida Sotuv</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2 text-gray-800 dark:text-white">Model</th>
                <th className="py-2 text-center text-gray-800 dark:text-white">Sotuv</th>
                <th className="py-2 text-center text-gray-800 dark:text-white">Foiz</th>
              </tr>
            </thead>
            <tbody>
              {modelSales.map((ms, i) => (
                <tr key={i} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 text-gray-800 dark:text-white font-medium">{ms.model}</td>
                  <td className="py-3 text-center text-gray-800 dark:text-white">{ms.sotuv}</td>
                  <td className="py-3 text-center text-gray-800 dark:text-white">{ms.foiz}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
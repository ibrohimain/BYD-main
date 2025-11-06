// src/pages/Reports.jsx (ranglar yaxshilangan – har model uchun alohida)
import { useRef, useState } from 'react';
import { useReports } from '../hooks/useReports';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { FileText, Download, RefreshCw, Filter, Calendar } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';

// Yangi: Har model uchun fixed ranglar (kengaytirilgan array)
const MODEL_COLORS = {
  'Chevrolet Spark': '#3B82F6',    // Ko'k
  'Chevrolet Onix': '#10B981',     // Yashil
  'Chevrolet Malibu': '#F59E0B',   // Sariq
  // Qo'shimcha modellar uchun default
  default: '#EF4444'               // Qizil
};

const getModelColor = (model) => MODEL_COLORS[model] || MODEL_COLORS.default;

// Umumiy ranglar cycle uchun (agar ko'p model bo'lsa)
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Reports() {
  const { stats, monthlyProduced, yearlyProduced, modelSales } = useReports();
  const printRef = useRef();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('oy');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Filtrlangan va sorted ma'lumotlar (oldingi kod o'zgarishsiz)
  const filteredMonthly = monthlyProduced.filter(m => {
    const mDate = new Date(m.oy.split(' ')[1] + '-' + (['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'].indexOf(m.oy.split(' ')[0]) + 1) + '-01');
    if (dateFrom && mDate < new Date(dateFrom)) return false;
    if (dateTo && mDate > new Date(dateTo)) return false;
    return true;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedMonthly = [...filteredMonthly].sort((a, b) => {
    let aVal = a[sortBy] || 0;
    let bVal = b[sortBy] || 0;
    if (sortBy === 'oy') {
      const aIndex = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'].indexOf(a.oy.split(' ')[0]);
      const bIndex = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'].indexOf(b.oy.split(' ')[0]);
      aVal = aIndex; bVal = bIndex;
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const sortedModelSales = [...modelSales].sort((a, b) => {
    let aVal = a[sortBy] || 0;
    let bVal = b[sortBy] || 0;
    if (sortBy === 'model') {
      aVal = a.model.localeCompare(b.model);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const csvData = [
    ...sortedMonthly.map(m => ({ 'Oy': m.oy, 'Ishlab chiqarish': m.ishlabchiqarish })),
    { 'Oy': `Yillik (${new Date().getFullYear()})`, 'Ishlab chiqarish': yearlyProduced },
    ...sortedModelSales.map(ms => ({ 'Model': ms.model, 'Sotuv': ms.sotuv, 'Foiz': `${ms.foiz}%` })),
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div ref={printRef}>
      {/* Sarlavha va filtrlar (oldingi kod o'zgarishsiz) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold">Hisobot va Analitika</h2>
        <div className="flex gap-3">
          <button
            onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 1000); handlePrint(); }}
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

      {/* Filtrlar paneli (o'zgarishsiz) */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="font-medium">Filtrlar:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => { setDateFrom(''); setDateTo(''); }}
            className="bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Tozalash
          </button>
        </div>
      </div>

      {/* Stats va yillik (o'zgarishsiz) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Jami Buyurtma</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Jarayonda</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.inProduction}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Omborda</p>
          <p className="text-3xl font-bold text-green-600">{stats.inWarehouse}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Yetkazildi</p>
          <p className="text-3xl font-bold text-red-600">{stats.delivered}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Yillik Ishlab Chiqarish (2025)</h3>
        <p className="text-4xl font-bold text-green-600">{yearlyProduced} ta mashina</p>
      </div>

      {/* Grafiklar (ranglar yaxshilangan) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Oylik Ishlab Chiqarish (Bar Chart)</h3>
          {sortedMonthly.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ma'lumot topilmadi</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="oy" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ishlabchiqarish" fill="#3B82F6" name="Ishlab chiqarish" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Oylik Trend (Line Chart)</h3>
          {sortedMonthly.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ma'lumot topilmadi</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sortedMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="oy" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ishlabchiqarish" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Model Kesimida Sotuv (Har model uchun alohida rang)</h3>
          {sortedModelSales.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ma'lumot topilmadi</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sortedModelSales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="sotuv"
                >
                  {sortedModelSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getModelColor(entry.model)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, `Model: ${name}`]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Jadval (o'zgarishsiz) */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Oylik Hisobot</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('oy')}>
                  Oy {sortBy === 'oy' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2 text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ishlabchiqarish')}>
                  Ishlab Chiqarish {sortBy === 'ishlabchiqarish' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMonthly.map((m, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{m.oy}</td>
                  <td className="py-3 text-center">{m.ishlabchiqarish}</td>
                </tr>
              ))}
              {sortedMonthly.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-500">Ma'lumot topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Model Kesimida Sotuv</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('model')}>
                  Model {sortBy === 'model' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2 text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('sotuv')}>
                  Sotuv {sortBy === 'sotuv' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2 text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('foiz')}>
                  Foiz {sortBy === 'foiz' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedModelSales.map((ms, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">
                    <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getModelColor(ms.model) }}></span>
                    {ms.model}
                  </td>
                  <td className="py-3 text-center">{ms.sotuv}</td>
                  <td className="py-3 text-center">{ms.foiz}%</td>
                </tr>
              ))}
              {sortedModelSales.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">Ma'lumot topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
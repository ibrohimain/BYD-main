// src/pages/Reports.jsx
import { useRef } from 'react';
import { useReports } from '../hooks/useReports';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from 'react-csv';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export default function Reports() {
  const { stats, monthly, models } = useReports();
  const printRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const csvData = monthly.map(m => ({
    Oy: m.oy,
    Buyurtma: m.buyurtma,
    Ishlabchiqarish: m.ishlabchiqarish,
    Ombor: m.ombor,
    Yetkazib_berilgan: m.yetkazib,
  }));

  return (
    <div ref={printRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold">Statistik Hisobotlar</h2>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
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

      {/* Real-time monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Jami Buyurtma</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Ishlab chiqarishda</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.inProduction}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Omborda</p>
          <p className="text-3xl font-bold text-green-600">{stats.inWarehouse}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600">Yetkazib berilgan</p>
          <p className="text-3xl font-bold text-red-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Grafiklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Oylik grafik */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Oylik Jarayonlar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="oy" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="buyurtma" fill="#3B82F6" />
              <Bar dataKey="ishlabchiqarish" fill="#10B981" />
              <Bar dataKey="yetkazib" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Model bo'yicha sotuvlar */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Model bo'yicha sotuvlar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={models}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ model, foiz }) => `${model}: ${foiz}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sotuv"
              >
                {models.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jadval */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Oylik Ma'lumotlar</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Oy</th>
              <th className="py-2 text-center">Buyurtma</th>
              <th className="py-2 text-center">Ishlab chiqarish</th>
              <th className="py-2 text-center">Ombor</th>
              <th className="py-2 text-center">Yetkazib berilgan</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((m, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{m.oy}</td>
                <td className="py-3 text-center">{m.buyurtma}</td>
                <td className="py-3 text-center">{m.ishlabchiqarish}</td>
                <td className="py-3 text-center">{m.ombor}</td>
                <td className="py-3 text-center">{m.yetkazib}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
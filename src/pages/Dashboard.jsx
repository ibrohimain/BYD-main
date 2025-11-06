import { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { Package, Car, Warehouse, Truck, RefreshCw } from 'lucide-react';
import { stats } from '../data/mockData'; // To'g'ri import

export default function Dashboard() {
  const [currentStats, setCurrentStats] = useState(stats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setCurrentStats(prev => ({
          totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
          inProduction: Math.max(0, prev.inProduction + Math.floor(Math.random() * 5) - 2),
          inWarehouse: Math.max(0, prev.inWarehouse + Math.floor(Math.random() * 4) - 1),
          delivered: prev.delivered + Math.floor(Math.random() * 2),
        }));
        setIsRefreshing(false);
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Real-Vaqt Monitoring</h2>
        <button
          onClick={() => setIsRefreshing(true)}
          className="flex items-center space-x-2 btn-primary"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Jami Buyurtma" value={currentStats.totalOrders} icon={<Package className="w-8 h-8" />} color="blue" />
        <StatsCard title="Ishlab chiqarishda" value={currentStats.inProduction} icon={<Car className="w-8 h-8" />} color="yellow" />
        <StatsCard title="Omborda" value={currentStats.inWarehouse} icon={<Warehouse className="w-8 h-8" />} color="green" />
        <StatsCard title="Yetkazib berilgan" value={currentStats.delivered} icon={<Truck className="w-8 h-8" />} color="red" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Jarayon Holati</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Yig'ish liniyasi</span>
            <span className="text-green-600 font-medium">Ishlayapti (92%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-600 h-3 rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
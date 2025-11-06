// src/pages/Warehouse.jsx (yangilangan)
import { useState } from 'react';
import { useWarehouse } from '../hooks/useWarehouse';
import { Search, Filter, Package, Wrench, Truck, QrCode, RefreshCw, X } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';

export default function Warehouse() {
  const { 
    cars, updateStatus, search, setSearch, filter, setFilter,
    modelFilter, setModelFilter, rangFilter, setRangFilter, kategoriyaFilter, setKategoriyaFilter,
    stats 
  } = useWarehouse();
  const [selectedCar, setSelectedCar] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Tayyor": return "bg-green-100 text-green-700";
      case "Ta'mirda": return "bg-orange-100 text-orange-700";
      case "Chiqarildi": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Tayyor": return <Package className="w-5 h-5" />;
      case "Ta'mirda": return <Wrench className="w-5 h-5" />;
      case "Chiqarildi": return <Truck className="w-5 h-5" />;
      default: return null;
    }
  };

  const handleQRClose = () => {
    setShowQR(false);
    setSelectedCar(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Ombor Holati</h2>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Statistika kartalari (o'zgarishsiz) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Oldingi stats kartalari... */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Jami Mashina</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tayyor</p>
              <p className="text-3xl font-bold text-green-600">{stats.ready}</p>
            </div>
            <Package className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Ta'mirda</p>
              <p className="text-3xl font-bold text-orange-600">{stats.repair}</p>
            </div>
            <Wrench className="w-10 h-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Chiqarildi</p>
              <p className="text-3xl font-bold text-red-600">{stats.delivered}</p>
            </div>
            <Truck className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filterlar paneli (kengaytirilgan) */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Qidiruv */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ID, model yoki rang bo'yicha qidirish..."
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
              <option value="Tayyor">Tayyor</option>
              <option value="Ta'mirda">Ta'mirda</option>
              <option value="Chiqarildi">Chiqarildi</option>
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

          {/* Rang filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={rangFilter}
              onChange={(e) => setRangFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">Barcha ranglar</option>
              <option value="Oq">Oq</option>
              <option value="Qora">Qora</option>
              <option value="Kulrang">Kulrang</option>
              <option value="Qizil">Qizil</option>
            </select>
          </div>

          {/* Kategoriya filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={kategoriyaFilter}
              onChange={(e) => setKategoriyaFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">Barcha kategoriyalar</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Sedan">Sedan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mashinalar ro'yxati (kategoriya qo'shilgan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Mashina topilmadi
          </div>
        ) : (
          cars.map(car => (
            <div key={car.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl">{car.model}</h3>
                  <p className="text-sm text-gray-600">ID: {car.id} | Kategoriya: {car.kategoriya}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(car.status)}`}>
                  {getStatusIcon(car.status)}
                  <span>{car.status}</span>
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Rang:</strong> {car.rang}</p>
                <p><strong>VIN:</strong> {car.vin}</p>
                <p><strong>Joylashuv:</strong> {car.location}</p>
                <p><strong>Sana:</strong> {car.sana}</p>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setShowQR(true);
                  }}
                  className="text-blue-600 hover:underline text-sm font-medium flex items-center space-x-1"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Kod</span>
                </button>

                {car.status !== "Chiqarildi" && (
                  <select
                    onChange={(e) => updateStatus(car.id, e.target.value)}
                    value={car.status}
                    className="text-sm px-3 py-1 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Tayyor">Tayyor</option>
                    <option value="Ta'mirda">Ta'mirda</option>
                    <option value="Chiqarildi">Chiqarildi</option>
                  </select>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Kod Modal (o'zgarishsiz) */}
      {showQR && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedCar.model} - {selectedCar.id}</h3>
              <button onClick={handleQRClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
              <QRCodeGenerator value={JSON.stringify(selectedCar)} size={200} />
            </div>
            <p className="text-sm text-gray-600 mb-2"><strong>VIN:</strong> {selectedCar.vin}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Kategoriya:</strong> {selectedCar.kategoriya}</p>
            <p className="text-sm text-gray-600 mb-4"><strong>Joylashuv:</strong> {selectedCar.location}</p>
            <button
              onClick={handleQRClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
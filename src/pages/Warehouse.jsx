// src/pages/Warehouse.jsx (responsive va ranglar yangilangan: dark mode qo'shildi, gradient background, tayyor ranglar)
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
      case "Tayyor": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "Ta'mirda": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "Chiqarildi": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Tayyor": return <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-600 dark:text-green-400" />;
      case "Ta'mirda": return <Wrench className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />;
      case "Chiqarildi": return <Truck className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  const handleQRClose = () => {
    setShowQR(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Ombor Holati</h2>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Yangilash</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-none transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Jami Mashina</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-none transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Tayyor</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.ready}</p>
              </div>
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-none transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Ta'mirda</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.repair}</p>
              </div>
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-none transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Chiqarildi</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">{stats.delivered}</p>
              </div>
              <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="ID, model yoki rang bo'yicha qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk4OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-right bg-no-repeat"
              >
                <option value="all">Barcha holatlar</option>
                <option value="Tayyor">Tayyor</option>
                <option value="Ta'mirda">Ta'mirda</option>
                <option value="Chiqarildi">Chiqarildi</option>
              </select>
            </div>

            {/* Model Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk4OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-right bg-no-repeat"
              >
                <option value="all">Barcha modellar</option>
                <option value="Chevrolet Spark">Chevrolet Spark</option>
                <option value="Chevrolet Onix">Chevrolet Onix</option>
                <option value="Chevrolet Malibu">Chevrolet Malibu</option>
              </select>
            </div>

            {/* Rang Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={rangFilter}
                onChange={(e) => setRangFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk4OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-right bg-no-repeat"
              >
                <option value="all">Barcha ranglar</option>
                <option value="Oq">Oq</option>
                <option value="Qora">Qora</option>
                <option value="Kulrang">Kulrang</option>
                <option value="Qizil">Qizil</option>
              </select>
            </div>

            {/* Kategoriya Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={kategoriyaFilter}
                onChange={(e) => setKategoriyaFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm appearance-none bg-no-repeat pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk4OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-right bg-no-repeat"
              >
                <option value="all">Barcha kategoriyalar</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cars.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Mashina topilmadi
            </div>
          ) : (
            cars.map(car => (
              <div key={car.id} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-none transition-all duration-300">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">{car.model}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">ID: {car.id} | Kategoriya: {car.kategoriya}</p>
                  </div>
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(car.status)} ml-2`}>
                    {getStatusIcon(car.status)}
                    <span>{car.status}</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Rang:</strong> {car.rang}</p>
                  <p><strong>VIN:</strong> {car.vin}</p>
                  <p><strong>Joylashuv:</strong> {car.location}</p>
                  <p><strong>Sana:</strong> {car.sana}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setShowQR(true);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs sm:text-sm font-medium flex items-center space-x-1 w-full sm:w-auto justify-start sm:justify-normal"
                  >
                    <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>QR Kod</span>
                  </button>

                  {car.status !== "Chiqarildi" && (
                    <select
                      onChange={(e) => updateStatus(car.id, e.target.value)}
                      value={car.status}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white w-full sm:w-auto appearance-none bg-no-repeat pr-6 sm:pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk4OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-right bg-no-repeat"
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

        {/* QR Modal */}
        {showQR && selectedCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-xl shadow-2xl text-center max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{selectedCar.model} - {selectedCar.id}</h3>
                <button onClick={handleQRClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="bg-gray-100 dark:bg-slate-700 p-2 sm:p-4 rounded-lg inline-block mb-4">
                <QRCodeGenerator value={JSON.stringify(selectedCar)} size={180} className="sm:size-200" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>VIN:</strong> {selectedCar.vin}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Kategoriya:</strong> {selectedCar.kategoriya}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4"><strong>Joylashuv:</strong> {selectedCar.location}</p>
              <button
                onClick={handleQRClose}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
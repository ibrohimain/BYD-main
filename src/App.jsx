// src/App.jsx (Footer qo'shildi – authenticated foydalanuvchilar uchun)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Yangi import
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Warehouse from './pages/Warehouse';
import Reports from './pages/Reports';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import useAuth from './hooks/useAuth';
import { useEffect } from 'react';

function AppContent() {
  const { loadUser, user, hasRole } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={
              <ProtectedRoute roles={['admin', 'manager', 'operator']}>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/warehouse" element={
              <ProtectedRoute roles={['admin', 'manager', 'operator']}>
                <Warehouse />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer /> {/* Footer qo'shildi */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer /> {/* Login sahifasida ham footer ko'rsatiladi */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
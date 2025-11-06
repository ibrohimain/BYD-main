// src/App.jsx (yangilangan – rol bo'yicha routes)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Warehouse from './pages/Warehouse';
import Reports from './pages/Reports';
import Users from './pages/Users'; // Yangi import
import useAuth from './hooks/useAuth';
import { useEffect } from 'react';

function AppContent() {
  const { loadUser, user, hasRole } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
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
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loadUser } = useAuth();

  // Sahifa yuklanganda userni tekshirish
  if (!user) {
    loadUser();
    if (!user) return <Navigate to="/login" />;
  }

  return children;
}
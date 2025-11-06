// src/components/ProtectedRoute.jsx (yangilangan – rol bilan)
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children, roles }) {
  const { user, loadUser, hasRole } = useAuth();

  if (!user) {
    loadUser();
    return <Navigate to="/login" />;
  }

  // Agar roles berilgan bo'lsa, tekshirish
  if (roles && !hasRole(roles[0])) { // Birinchi rolni tekshirish (hierarchy bo'yicha)
    return <Navigate to="/" />;
  }

  return children;
}
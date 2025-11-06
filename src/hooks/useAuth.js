// src/hooks/useAuth.js (tuzatilgan – kutubxonasiz mock JWT)
import { create } from 'zustand';
import { users } from '../data/users';

const useAuth = create((set, get) => ({
  user: null,
  token: null,
  login: (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      // Mock token: base64 encoded payload (header.payload.signature)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })); // Header
      const payload = btoa(JSON.stringify({ ...userWithoutPassword, iat: Date.now() })); // Payload
      const signature = btoa('mock-sig-' + Date.now()); // Mock signature
      const token = `${header}.${payload}.${signature}`;
      localStorage.setItem('token', token);
      set({ user: userWithoutPassword, token });
      return { success: true };
    }
    return { success: false, error: "Noto'g'ri email yoki parol" };
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  loadUser: () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const parts = savedToken.split('.');
        if (parts.length === 3) {
          // Payload ni decode (base64)
          const payload = JSON.parse(atob(parts[1]));
          // Token muddati tekshirish (mock: 24 soat)
          if (Date.now() - payload.iat < 24 * 60 * 60 * 1000) {
            set({ user: payload, token: savedToken });
            return;
          }
        }
      } catch (error) {
        console.warn('Token xato:', error);
      }
      localStorage.removeItem('token');
    }
  },
  // Rol tekshiruvi (o'zgarishsiz)
  hasRole: (requiredRole) => {
    const { user } = get();
    if (!user) return false;
    const roleHierarchy = { admin: 3, manager: 2, operator: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },
}));

export default useAuth;
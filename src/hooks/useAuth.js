// src/hooks/useAuth.js (persist bilan – ism/email saqlanishi)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { users } from '../data/users';

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (email, password) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          const token = 'mock-token-' + Date.now();
          localStorage.setItem('token', token);
          set({ user: userWithoutPassword, token });
          return { success: true };
        }
        return { success: false, error: "Noto'g'ri ma'lumotlar" };
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
      loadUser: () => {
        const saved = localStorage.getItem('user');
        if (saved) {
          set({ user: JSON.parse(saved) });
        }
      },
      // Yangi: User ma'lumotlarini yangilash va persist
      updateUser: (updatedData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...updatedData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      },
      hasRole: (requiredRole) => {
        const { user } = get();
        if (!user) return false;
        const roleHierarchy = { admin: 3, manager: 2, operator: 1 };
        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
      },
    }),
    { name: 'auth-storage' }
  )
);

export default useAuth;
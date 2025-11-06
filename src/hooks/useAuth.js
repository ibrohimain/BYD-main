// src/hooks/useAuth.js
import { create } from 'zustand';
import { users } from '../data/users';

const useAuth = create((set) => ({
  user: null,
  login: (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      set({ user: userWithoutPassword });
      return { success: true };
    }
    return { success: false, error: "Noto'g'ri email yoki parol" };
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
  loadUser: () => {
    const saved = localStorage.getItem('user');
    if (saved) {
      set({ user: JSON.parse(saved) });
    }
  },
}));

export default useAuth;
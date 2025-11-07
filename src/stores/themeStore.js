// src/stores/themeStore.js - Dark Mode uchun Zustand store (agar mavjud bo'lmasa, qo'shing)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
      toggleTheme: () => set((state) => {
        const newTheme = !state.isDark;
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newTheme);
        return { isDark: newTheme };
      }),
    }),
    { name: 'theme-storage' }
  )
);
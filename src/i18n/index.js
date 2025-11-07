// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from './uz.json'; // Tarjimalar fayli

i18n.use(initReactI18next).init({
  resources: { uz: { translation: uz } },
  lng: 'uz', // Default til
  fallbackLng: 'uz',
  interpolation: { escapeValue: false }
});

export default i18n;
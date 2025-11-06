import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  uz: {
    translation: {
      orders: 'Buyurtmalar',
      newOrder: 'Yangi Buyurtma',
      search: 'Mijoz yoki model bo\'yicha qidirish...',
      status: 'Holatlar',
      model: 'Modellar',
      dateRange: 'Sana oralig\'i',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      customer: 'Mijoz',
      model: 'Model',
      color: 'Rang',
      quantity: 'Miqdor',
      deadline: 'Muddat',
      new: 'Yangi',
      inProgress: 'Jarayonda',
      delivered: 'Yetkazildi',
      canceled: 'Bekor qilindi',
      deliveryPoints: 'Yetkazib Berish Punktlari',
      operators: 'Operatorlar',
      map: 'Xarita',
      contact: 'Aloqa',
      contactAdmin: 'Admin bilan Aloqa',
      message: 'Xabar yozing...',
      send: 'Yuborish',
      allFieldsRequired: 'Barcha maydonlar to\'ldirilishi kerak!',
      noOrdersFound: 'Buyurtma topilmadi',
    }
  },
  en: {
    translation: {
      orders: 'Orders',
      newOrder: 'New Order',
      search: 'Search by customer or model...',
      status: 'Statuses',
      model: 'Models',
      dateRange: 'Date Range',
      save: 'Save',
      cancel: 'Cancel',
      customer: 'Customer',
      model: 'Model',
      color: 'Color',
      quantity: 'Quantity',
      deadline: 'Deadline',
      new: 'New',
      inProgress: 'In Progress',
      delivered: 'Delivered',
      canceled: 'Canceled',
      deliveryPoints: 'Delivery Points',
      operators: 'Operators',
      map: 'Map',
      contact: 'Contact',
      contactAdmin: 'Contact Admin',
      message: 'Write message...',
      send: 'Send',
      allFieldsRequired: 'All fields are required!',
      noOrdersFound: 'No orders found',
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'uz', // Default
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
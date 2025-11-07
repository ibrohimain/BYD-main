// src/utils/initPrices.js
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Bu funksiya faqat bir marta ishga tushadi
export const initializePrices = async () => {
  const models = ['Chevrolet Spark', 'Chevrolet Onix', 'Chevrolet Malibu'];
  const prices = [15000, 22000, 35000];

  try {
    for (let i = 0; i < models.length; i++) {
      await addDoc(collection(db, 'prices'), {
        model: models[i],
        price: prices[i],
        createdAt: serverTimestamp()
      });
    }
    console.log('Narxlar muvaffaqiyatli qo‘shildi!');
  } catch (error) {
    console.error('Xato:', error);
  }
};
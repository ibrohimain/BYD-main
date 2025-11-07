// src/firebase.js - To'liq va to'g'ri versiya – Auth, Firestore va Storage uchun moslashtirilgan
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Auth uchun qo'shildi
import { getFirestore } from "firebase/firestore"; // Database uchun qo'shildi
import { getStorage } from "firebase/storage"; // Storage qo'shildi (rasim yuklash uchun)
import { getAnalytics } from "firebase/analytics"; // Analytics (ixtiyoriy)

// Firebase config (sizning haqiqiy config'ingiz)
const firebaseConfig = {
  apiKey: "AIzaSyAjwAjhP3CIWooWW1zOgXlt0HIWJcn4CsA",
  authDomain: "bydlogin-9e075.firebaseapp.com",
  projectId: "bydlogin-9e075",
  storageBucket: "bydlogin-9e075.firebasestorage.app",
  messagingSenderId: "1088403917739",
  appId: "1:1088403917739:web:c84240b63ca502578860ee",
  measurementId: "G-BG9RJVY28S"
};

// Firebase'ni ishga tushirish
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Analytics (ixtiyoriy)

const auth = getAuth(app); // Auth (kirish/ro'yxat uchun)
const db = getFirestore(app); // Firestore (ma'lumotlar bazasi uchun)
const storage = getStorage(app); // Storage (rasim yuklash uchun)

export { app, auth, db, storage, analytics };
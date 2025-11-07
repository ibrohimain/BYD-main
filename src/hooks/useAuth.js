// src/hooks/useAuth.js (MUAMMO HAL QILINDI: onAuthStateChanged to'g'ri ishlaydi)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: '',

      // App ochilganda auth holatini yuklash
      init: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              set({ 
                user: { 
                  uid: firebaseUser.uid, 
                  email: firebaseUser.email, 
                  name: data.name || '',
                  role: data.role || 'user'
                }, 
                loading: false 
              });
            } else {
              set({ user: null, loading: false });
            }
          } else {
            set({ user: null, loading: false });
          }
        });
        return unsubscribe;
      },

      login: async (email, password) => {
        set({ loading: true, error: '' });
        try {
          const { user } = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            set({ 
              user: { 
                uid: user.uid, 
                email: user.email, 
                name: data.name || '',
                role: data.role || 'user'
              }, 
              loading: false 
            });
            return { success: true };
          }
        } catch (err) {
          set({ error: err.message, loading: false });
          return { success: false };
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: '' });
        try {
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', user.uid), {
            name, email, role: 'operator', createdAt: new Date().toISOString()
          });
          set({ 
            user: { uid: user.uid, email, name, role: 'operator' }, 
            loading: false 
          });
          return { success: true };
        } catch (err) {
          set({ error: err.message, loading: false });
          return { success: false };
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },

      hasRole: (role) => get().user?.role === role,
    }),
    { name: 'auth-storage' }
  )
);

export default useAuth;
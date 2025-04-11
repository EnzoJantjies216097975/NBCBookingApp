import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions } from 'firebase/functions';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { isSupported, Messaging } from 'firebase/messaging';

let analytics: any = null;
let messaging: Messaging | null = null;

const firebaseConfig = {
  apiKey: "AIzaSyCOcFalnN75Ta7FbM9yYDOSPQRXeTK4vxo",
  authDomain: "bookingapp-429d2.firebaseapp.com",
  databaseURL: "https://bookingapp-429d2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bookingapp-429d2",
  storageBucket: "bookingapp-429d2.firebasestorage.app",
  messagingSenderId: "853797141233",
  appId: "1:853797141233:web:cf9715f6b7b6a622e18750",
  measurementId: "G-1V32L44QX1"
};

// Initialize Firebase only if it's not initialized yet
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();  // Use the already initialized app
}

// Export Firebase services
export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Conditionally initialize Analytics (only in browser)
if (typeof window !== 'undefined') {
  // 🔁 Dynamic import to avoid SSR crash
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });

  (async () => {
    if (await isSupported()) {
      const { getMessaging } = await import('firebase/messaging');
      messaging = getMessaging(app);
    }
  })();
}

export { app, analytics, messaging };
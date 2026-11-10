import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Hardcoded verified configuration for eat-smart-83089 with env override support
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCa_5KV27FfIQrpJhiUTs9952YnBCYPvSU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eat-smart-83089.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eat-smart-83089",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eat-smart-83089.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "975765030990",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:975765030990:web:c598e39ebde06cf9cb5b1f",
  measurementId: "G-C74HK25JFC"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore (default database)
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Connection test helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database is provisioning.');
      return false;
    }
    return true;
  }
}

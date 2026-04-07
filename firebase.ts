import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTA-QxbqfTgPg4-vCgtS5tviN2bLLJNvI",
  authDomain: "project-health-3a381.firebaseapp.com",
  projectId: "project-health-3a381",
  storageBucket: "project-health-3a381.firebasestorage.app",
  messagingSenderId: "327385576396",
  appId: "1:327385576396:web:d6bb7b7c0fb13093eaa369",
  measurementId: "G-702VEHX350"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;

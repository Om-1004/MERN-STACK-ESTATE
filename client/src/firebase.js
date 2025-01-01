// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-stack-estate-d4f74.firebaseapp.com",
  projectId: "mern-stack-estate-d4f74",
  storageBucket: "mern-stack-estate-d4f74.firebasestorage.com",
  messagingSenderId: "541216866682",
  appId: "1:541216866682:web:10277a95eb7f5db28016c3",
  measurementId: "G-WW274LY65L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

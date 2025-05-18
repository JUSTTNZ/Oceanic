import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCSRAkm9g4uia5wuALKuGaXB3HC5EHA_1Y",
  authDomain: "oceanic-charts.firebaseapp.com",
  projectId: "oceanic-charts",
  storageBucket: "oceanic-charts.firebasestorage.app",
  messagingSenderId: "296792137036",
  appId: "1:296792137036:web:76ab4c53faaceaf2b083e9",
  measurementId: "G-P75LRSBF7J"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
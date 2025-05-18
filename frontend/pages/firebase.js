import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDjQYzTKid2JTOs_VwVHztr8sO3cqI5cUM",
  authDomain: "chat-app-321cb.firebaseapp.com",
  projectId: "chat-app-321cb",
  storageBucket: "chat-app-321cb.firebasestorage.app",
  messagingSenderId: "290327068207",
  appId: "1:290327068207:web:bc1f0e4aadfa03f91250da",
  measurementId: "G-T6V5W4M4W8"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
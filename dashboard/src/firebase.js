// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1JBacly6IumiN91PqORptrp8uB0Ikxqo",
  authDomain: "forum6-to-do.firebaseapp.com",
  projectId: "forum6-to-do",
  storageBucket: "forum6-to-do.firebasestorage.app",
  messagingSenderId: "1012886360600",
  appId: "1:1012886360600:web:ed0d8763de34ebb212a96d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
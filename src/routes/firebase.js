// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA98CXCXuV-aoXzk6_icHZMvDuIYtWKaxk",
  authDomain: "webdev-c7a71.firebaseapp.com",
  projectId: "webdev-c7a71",
  storageBucket: "webdev-c7a71.firebasestorage.app",
  messagingSenderId: "214952705873",
  appId: "1:214952705873:web:4109124af2703739271d70",
  measurementId: "G-4GQ4BWWRVD"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
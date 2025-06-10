// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6YRs5N_90wiEzkHdYk5eOOgL6lyfftgo",
  authDomain: "crud-firebase-13960.firebaseapp.com",
  projectId: "crud-firebase-13960",
  storageBucket: "crud-firebase-13960.firebasestorage.app",
  messagingSenderId: "298083952155",
  appId: "1:298083952155:web:22f6df19b974c9ed46fabe",
  measurementId: "G-ZKSBMDP5JX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

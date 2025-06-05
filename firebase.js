// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQUu6h0-jmaGQHJSsXDNaIFoY4T7wyjYs",
  authDomain: "voz-universitaria.firebaseapp.com",
  projectId: "voz-universitaria",
  storageBucket: "voz-universitaria.firebasestorage.app",
  messagingSenderId: "954771681740",
  appId: "1:954771681740:web:5d846576f63199f4c32d69",
  measurementId: "G-PDM3YETVJC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

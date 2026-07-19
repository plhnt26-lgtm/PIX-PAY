import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwcXzQ0Ruoz3UrwewaTBcu32WAq38O290",
  authDomain: "pix-pay-375de.firebaseapp.com",
  projectId: "pix-pay-375de",
  storageBucket: "pix-pay-375de.firebasestorage.app",
  messagingSenderId: "216788867675",
  appId: "1:216788867675:web:86ec3c2ab3efdcda5dfd7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

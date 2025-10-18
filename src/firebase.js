// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-6B74qBPBf6R3OTSOxvW30_BEBPtfUzo",
  authDomain: "dbfirebaseconection.firebaseapp.com",
  projectId: "dbfirebaseconection",
  storageBucket: "dbfirebaseconection.firebasestorage.app",
  messagingSenderId: "288531177423",
  appId: "1:288531177423:web:d4f013a255490e24957cba",
  measurementId: "G-4Y32FSQVGY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//variable para obtener funcionalidad de autenticacion
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configurar GitHub para que SIEMPRE pida autorización y muestre con qué cuenta inicia
githubProvider.setCustomParameters({
  allow_signup: 'true',
  // Esto fuerza a mostrar la pantalla de autorización
  prompt: 'consent'
});

// Forzar selección de cuenta
githubProvider.addScope('user:email');

// conexion a db
const db = getFirestore();

//exportar variables para consumo del proyecto
export {
  auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  googleProvider,
  githubProvider,
  signOut,
  signInWithPopup,
  db,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
};

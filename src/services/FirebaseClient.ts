/**
 * @file FirebaseClient.ts
 * @description Firebase configuration for frontend
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Configuración de Firebase para el frontend
const firebaseConfig = {
  apiKey: "AIzaSyAMObFDGxnUNxjPUtas0_q-y-rgwuvIDhc",
  authDomain: "cvweb-8d1aa.firebaseapp.com",
  projectId: "cvweb-8d1aa",
  storageBucket: "cvweb-8d1aa.firebasestorage.app",
  messagingSenderId: "183537387646",
  appId: "1:183537387646:web:4f79b37703ae925b17302f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Auth methods
export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
};
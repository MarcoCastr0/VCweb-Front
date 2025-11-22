/**
 * @file FirebaseClient.ts
 * @description Initializes Firebase services and exports authentication utilities for the frontend.
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

/**
 * Firebase configuration object loaded from environment variables.
 * @constant {object}
 */
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

/**
 * Initializes the Firebase App instance.
 * @type {import('firebase/app').FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 * @type {import('firebase/auth').Auth}
 */
export const auth = getAuth(app);

/**
 * Google authentication provider.
 * @type {import('firebase/auth').GoogleAuthProvider}
 */
export const googleProvider = new GoogleAuthProvider();

/**
 * Facebook authentication provider.
 * @type {import('firebase/auth').FacebookAuthProvider}
 */
export const facebookProvider = new FacebookAuthProvider();

/**
 * GitHub authentication provider.
 * @type {import('firebase/auth').GithubAuthProvider}
 */
export const githubProvider = new GithubAuthProvider();

/**
 * Authentication helper methods exported from Firebase.
 * @typedef {function} signInWithPopup
 * @typedef {function} signInWithEmailAndPassword
 * @typedef {function} createUserWithEmailAndPassword
 */
export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
};

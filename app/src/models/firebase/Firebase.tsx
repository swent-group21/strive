// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// @ts-ignore
import {
  initializeAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  sendPasswordResetEmail,
  // @ts-ignore
  getReactNativePersistence,
  signInAnonymously,
  updateEmail,
  signOut,
} from "firebase/auth";
//@ts-ignore
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  Firestore,
  onSnapshot,
  GeoPoint,
  arrayUnion,
  updateDoc,
  limit,
} from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);

export {
  firebaseConfig,
  app,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  sendPasswordResetEmail,
  firestore,
  collection,
  deleteDoc,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  Firestore,
  storage,
  onSnapshot,
  signInAnonymously,
  updateEmail,
  signOut,
  GeoPoint,
  arrayUnion,
  updateDoc,
  limit,
};

// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwfqgrSrOzdaHA9JS9U2gBKp_8l3JluvU",
  authDomain: "velentine-d5685.firebaseapp.com",
  projectId: "velentine-d5685",
  storageBucket: "velentine-d5685.firebasestorage.app",
  messagingSenderId: "809063051989",
  appId: "1:809063051989:web:187be1b3186420ec52685c",
  measurementId: "G-Y4H8WDTLMJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
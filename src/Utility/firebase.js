import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "clone-68e92.firebaseapp.com",
  projectId: "clone-68e92",
  storageBucket: "clone-68e92.firebasestorage.app",
  messagingSenderId: "761572977408",
  appId: "1:761572977408:web:01022d7bccbf396a2ea1e5",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();

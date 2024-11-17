// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6X9uJcZ0PBqT-H2xWDo3XQ3NFh872e5Y",
  authDomain: "reactfirebase-a354f.firebaseapp.com",
  projectId: "reactfirebase-a354f",
  storageBucket: "reactfirebase-a354f.firebasestorage.app",
  messagingSenderId: "357562133379",
  appId: "1:357562133379:web:f8c2083c0274006eed64b6",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXoAmNCueVYBD_hVcjae95uedkIGJ1BFA",
  authDomain: "ventures-ecommerce.firebaseapp.com",
  projectId: "ventures-ecommerce",
  storageBucket: "ventures-ecommerce.firebasestorage.app",
  messagingSenderId: "722636620523",
  appId: "1:722636620523:web:2fe84ebae9633736b834ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
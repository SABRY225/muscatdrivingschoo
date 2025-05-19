import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyDgCmRAtjY-jqVRmHb4W_dlmkJoZnwbZs8",
  // authDomain: "moalemy-54d19.firebaseapp.com",
  // projectId: "moalemy-54d19",
  // storageBucket: "moalemy-54d19.appspot.com",
  // messagingSenderId: "239715172398",
  // appId: "1:239715172398:web:79534f914a21f869c11fbf",
  // measurementId: "G-51Y8PNXGK8"
  apiKey: "AIzaSyCLURQd0SBvd4iZJ9JcFZJXin4h-iDrE_s",
  authDomain: "muscat-driving-school.firebaseapp.com",
  projectId: "muscat-driving-school",
  storageBucket: "muscat-driving-school.appspot.com",
  messagingSenderId: "524301110380",
  appId: "1:524301110380:web:81e32db0c0b8deea271c49",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();

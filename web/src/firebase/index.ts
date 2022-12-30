// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDiwKhvnEtM7hTcOBIiDIvsfFmQ25kc8Js",

  authDomain: "payitforward-e1c8b.firebaseapp.com",

  projectId: "payitforward-e1c8b",

  storageBucket: "payitforward-e1c8b.appspot.com",

  messagingSenderId: "940235756746",

  appId: "1:940235756746:web:1923227afb727e8f165033",

  measurementId: "G-27SZSDGT4B"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export default app;

export const firestore = getFirestore(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);
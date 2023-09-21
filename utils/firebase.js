// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbNp2RzPh0udBhlU64Uyx7qQaUNzB8Fyc",
  authDomain: "smart-notes-df265.firebaseapp.com",
  projectId: "smart-notes-df265",
  storageBucket: "smart-notes-df265.appspot.com",
  messagingSenderId: "999061912196",
  appId: "1:999061912196:web:3b91426fbcd67008b7e0d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app)


export{
    db,
    auth
}
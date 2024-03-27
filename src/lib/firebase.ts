// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCmXbuVaryMXzqMZC7P3W0sa62g5rgNryA",
    authDomain: "mdps-app.firebaseapp.com",
    projectId: "mdps-app",
    storageBucket: "mdps-app.appspot.com",
    messagingSenderId: "30856300439",
    appId: "1:30856300439:web:95757da85ee24b43eee6d2",
    measurementId: "G-3HSWXCMC6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const provider = new GoogleAuthProvider()
export const auth = getAuth(app);
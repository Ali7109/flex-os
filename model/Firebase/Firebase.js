// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA91wbuOd6EThqobrJuEWn7DBiV0vywBTo",
	authDomain: "flex-os-9cbdb.firebaseapp.com",
	projectId: "flex-os-9cbdb",
	storageBucket: "flex-os-9cbdb.appspot.com",
	messagingSenderId: "1077631763427",
	appId: "1:1077631763427:web:5c3bb98e71a2c626ae16d6",
	measurementId: "G-BXDPD6FN8D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { db, auth, provider };

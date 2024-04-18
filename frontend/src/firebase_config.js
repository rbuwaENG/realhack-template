// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBewyn9F2IHnv7HcOJ5qQ5N9qDftDy9TDs",
  authDomain: "realhack-626b4.firebaseapp.com",
  projectId: "realhack-626b4",
  storageBucket: "realhack-626b4.appspot.com",
  messagingSenderId: "636134226305",
  appId: "1:636134226305:web:eacaeff72e64713c3bd080"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
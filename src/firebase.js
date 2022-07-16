// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration

const firebaseConfig = {
  apiKey: "AIzaSyAqbPNDC94CW0_GxQnpWc15vFuLv0wBm5w",
  authDomain: "rocketgram-2edbb.firebaseapp.com",
  projectId: "rocketgram-2edbb",
  storageBucket: "rocketgram-2edbb.appspot.com",
  messagingSenderId: "498766635720",
  appId: "1:498766635720:web:ea45403d52f5d3fdc5bbfd",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://rocketgram-2edbb-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);

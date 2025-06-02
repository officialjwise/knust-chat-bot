import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig";

let app = null;
let auth = null;
let db = null;

const initializeFirebase = () => {
  if (!app) {
    console.log("Starting Firebase initialization...");
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized:", app.name);

    console.log("Initializing auth...");
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log("Auth initialized:", !!auth);

    console.log("Initializing Firestore...");
    db = getFirestore(app);
    console.log("Firestore initialized:", !!db);
  }
  return { app, auth, db };
};

// Initialize Firebase once on module load
initializeFirebase();

export { app, auth, db };
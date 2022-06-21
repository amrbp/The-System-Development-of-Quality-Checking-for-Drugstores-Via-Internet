import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { functions } from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBbTZMvuXaLmzfId5o2WQ7Ea8gD-UHFEYs",
  authDomain: "project041630.firebaseapp.com",
  databaseURL: "https://project041630.firebaseio.com",
  projectId: "project041630",
  storageBucket: "project041630.appspot.com",
  messagingSenderId: "693089817922",
  appId: "1:693089817922:web:2ac6d48b360627b30764db",
  measurementId: "G-8QTFFYGEZK",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

import firebase from 'firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore
import 'firebase/messaging';   // for cloud messaging
import 'firebase/functions';   // for cloud functions

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzNigqy7stltnVUU8cAollxCxvW0CNBTE",
  authDomain: "ghost-f8b34.firebaseapp.com",
  projectId: "ghost-f8b34",
  storageBucket: "ghost-f8b34.appspot.com",
  messagingSenderId: "838623299070",
  appId: "1:838623299070:web:b73429fee525b7c01cacaf",
  measurementId: "G-85ZG5FVKQ4"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
// Google auth as a provider for this app, the popup
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, provider };
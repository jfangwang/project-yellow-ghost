
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // for authentication
import 'firebase/compat/storage'; // for storage
import 'firebase/compat/database'; // for realtime database
import 'firebase/compat/firestore'; // for cloud firestore
import 'firebase/compat/messaging'; // for cloud messaging
import 'firebase/compat/functions'; // for cloud functions
// import {initializeApp} from 'firebase/compat/app';
// import {getAnalytics} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
// Google auth as a provider for this app
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

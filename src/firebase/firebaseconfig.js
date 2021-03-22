// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
    apiKey: "AIzaSyBeD8ehmGwNJave_IWxNtk4dzzRyB6-eek",
    authDomain: "eduteur-715e2.firebaseapp.com",
    projectId: "eduteur-715e2",
    storageBucket: "eduteur-715e2.appspot.com",
    messagingSenderId: "944957488240",
    appId: "1:944957488240:web:4c1e2118f05232892908b5",
    measurementId: "G-T959HJ5FJY"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export default firebase;
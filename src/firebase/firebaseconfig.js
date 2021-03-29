import firebase from "firebase/app"; 

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

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
firebase.firestore().settings({ timestampsInSnapshots: true });


export default firebase;
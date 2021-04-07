import firebase from "firebase/app"; 

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBeD8ehmGwNJave_IWxNtk4dzzRyB6-eek",
    authDomain: "eduteur-715e2.firebaseapp.com",
    projectId: "eduteur-715e2",
    storageBucket: "gs://eduteur-715e2.appspot.com",
    messagingSenderId: "944957488240",
    appId: "1:944957488240:web:4c1e2118f05232892908b5",
    measurementId: "G-T959HJ5FJY"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

// // Get a reference to the storage service, which is used to create references in your storage bucket
// var storage = firebase.storage();

// // Create a storage reference from our storage service
// var storageRef = storage.ref();

export default firebase;
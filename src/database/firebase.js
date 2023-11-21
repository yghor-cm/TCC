import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "***",
    authDomain: "***",
    databaseURL: "***",
    projectId: "***",
    storageBucket: "***",
    messagingSenderId: "***",
    appId: "***",
    measurementId: "***"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

  export default firebase;


// firebase.js

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD22DFXDMTBTye5TEYAiremR4fWkfNyFrQ",
  authDomain: "world-of-art-app.firebaseapp.com",
  projectId: "world-of-art-app",
  storageBucket: "world-of-art-app.appspot.com",
  messagingSenderId: "379083289992",
  appId: "1:379083289992:web:ecbc4519bbc5ce320df63d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar el almacenamiento y Firestore
const ImageDb = getStorage(app);
const txtDB = getFirestore(app);

export { ImageDb, txtDB };

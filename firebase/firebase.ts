import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "
    authDomain: "english-plam",
    // 🔹 DESCOMENTADO: Realtime Database necesita esta URL obligatoriamente
    databaseURL: "httrebaseio.com",
    projectId: "eng12",
    storageBucket: "enp",
    messagingSenderId: "1",
    appId: "1:3a",
    measurementId: "G-S"
};

// Inicializamos la app UNA SOLA VEZ
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// 🔹 Exportamos todo limpio en una sola línea (incluyendo 'app' y 'rtdb')
export { app, db, auth, storage, rtdb };
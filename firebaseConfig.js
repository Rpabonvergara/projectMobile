import { initializeApp, getApps } from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getAuth, sendEmailVerification} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkMcK_7r5h-wxUxFvbow1FpkqdoNMgbXg",
    authDomain: "mobile-dafde.firebaseapp.com",
    projectId: "mobile-dafde",
    storageBucket: "mobile-dafde.appspot.com",
    messagingSenderId: "639095076227",
    appId: "1:639095076227:web:85246b27b9b99e6cd1b2b6",
    measurementId: "G-1LGHE01D2B"
  };

// const app = initializeApp(firebaseConfig);

var app;

if(!getApps().length){
    app = initializeApp(firebaseConfig);
}
else{
    const APPS = getApps();
    app =APPS[0];
}

export const db = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export {sendEmailVerification};
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: 'task-manager-9767e.firebaseapp.com',
    projectId: 'task-manager-9767e',
    storageBucket: 'task-manager-9767e.appspot.com',
    messagingSenderId: '50691022774',
    appId: '1:50691022774:web:c57da76d10be20e294eb17',
    measurementId: 'G-LJ3R3G0JL6',
};

export const app = initializeApp(firebaseConfig);

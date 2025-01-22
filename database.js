import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2axhnlDhVTv5ac5GUpX99rgQQoj0-uXw",
    authDomain: "techtitive-counter.firebaseapp.com",
    projectId: "techtitive-counter",
    storageBucket: "techtitive-counter.firebasestorage.app",
    messagingSenderId: "374532775348",
    appId: "1:374532775348:web:337ceaa95f051eebd066e1",
    measurementId: "G-0C5VJE3VPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore reference
const counterRef = doc(db, 'clickData', 'counter');

// HTML element references
const clicktarget = document.querySelector('.button');
const counter = document.querySelector('.counter');

updateLocalStorageAndUI(firestoreCount);
localStorage.setItem(firestoreCount);
firestoreCount === clickcount;
clickcount === localStorage.setItem('clickcount', clickcount)

// Initialize local storage and UI
let clickcount = 0;

// Function to update local storage and UI
function updateLocalStorageAndUI(newCount) {
    clickcount = newCount;
    localStorage.setItem('clickcount', clickcount);
    counter.textContent = clickcount;
}



// Real-time listener for Firestore updates
onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        const firestoreCount = docSnapshot.data().count || 0;
        if (firestoreCount !== clickcount) {
            updateLocalStorageAndUI(firestoreCount);
        }
    }
});

// Button click event
clicktarget.addEventListener('click', async () => {
    const newCount = clickcount + 1;
    updateLocalStorageAndUI(newCount);

    try {
        await updateDoc(counterRef, { count: newCount });
    } catch (error) {
        console.error("Error updating Firestore:", error);
    }
});


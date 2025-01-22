import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, updateDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { FieldValue } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const resetButton = document.querySelector('.reset-button'); // Reset button reference
const counter = document.querySelector('.counter');

// Initialize UI and local storage
let clickcount = 0;

// Real-Time Listener for Firestore
onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        const firestoreCount = docSnapshot.data().count || 0;
        // Synchronize Firestore to local storage and UI
        if (firestoreCount !== clickcount) {
            clickcount = firestoreCount;
            localStorage.setItem('clickcount', clickcount);
            counter.textContent = clickcount;
        }
    } else {
        console.log("Counter document not found. Initializing...");
        // Initialize Firestore document if it doesn't exist
        setDoc(counterRef, { count: 0 });
    }
});

// Button click event with atomic increment
clicktarget.addEventListener('click', async () => {
    try {
        // Use Firestore's atomic increment operation
        await updateDoc(counterRef, {
            count: FieldValue.increment(1)
        });
    } catch (error) {
        console.error("Error updating Firestore:", error);
    }
});

// Reset button click event
resetButton.addEventListener('click', async () => {
    try {
        // Reset the counter to 0 in Firestore
        await setDoc(counterRef, { count: 0 });
        // Update local storage and UI
        clickcount = 0;
        localStorage.setItem('clickcount', clickcount);
        counter.textContent = clickcount;
    } catch (error) {
        console.error("Error resetting Firestore:", error);
    }
});

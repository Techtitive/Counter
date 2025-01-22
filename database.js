import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const counterRef = doc(db, 'clickData', 'counter');

// HTML element references
const clickButton = document.querySelector('.button');
const counterDisplay = document.querySelector('.counter');

// Initialize local storage and counter
let localCount = Number(localStorage.getItem('clickcount')) || 0;
counterDisplay.textContent = localCount;

// Function to update Firestore from local storage
async function syncToFirestore() {
    try {
        const docSnapshot = await getDoc(counterRef);
        const firestoreCount = docSnapshot.exists() ? docSnapshot.data().count : 0;

        if (localCount > firestoreCount) {
            // Update Firestore if local storage has a higher count
            await updateDoc(counterRef, { count: localCount });
        } else if (localCount < firestoreCount) {
            // Update local storage if Firestore has a higher count
            localCount = firestoreCount;
            localStorage.setItem('clickcount', localCount);
            counterDisplay.textContent = localCount;
        }
    } catch (error) {
        console.error("Error syncing to Firestore:", error);
    }
}

// Function to update local storage and Firestore
async function updateCounter(newCount) {
    // Update local storage and UI
    localCount = newCount;
    localStorage.setItem('clickcount', localCount);
    counterDisplay.textContent = localCount;

    // Sync to Firestore
    try {
        await updateDoc(counterRef, { count: localCount });
    } catch (error) {
        console.error("Error updating Firestore:", error);
    }
}

// Real-time listener for Firestore changes
onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        const firestoreCount = docSnapshot.data().count;
        if (firestoreCount !== localCount) {
            // Update local storage and UI if Firestore changes
            localCount = firestoreCount;
            localStorage.setItem('clickcount', localCount);
            counterDisplay.textContent = localCount;
        }
    }
});

// Button click event
clickButton.addEventListener('click', () => {
    const newCount = localCount + 1;
    updateCounter(newCount);
});

// Sync Firestore and local storage on load
syncToFirestore();

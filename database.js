import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

// Initialize local storage and UI
let clickcount = Number(localStorage.getItem('clickcount') || 0); // Get from local storage
counter.textContent = clickcount; // Update UI with local storage value

// Sync Firestore and local storage
async function syncWithFirestore() {
    try {
        const docSnapshot = await getDoc(counterRef);
        if (docSnapshot.exists()) {
            const firestoreCount = docSnapshot.data().count || 0;

            // If Firestore has a higher count, update local storage and UI
            if (firestoreCount > clickcount) {
                clickcount = firestoreCount;
                localStorage.setItem('clickcount', clickcount);
                counter.textContent = clickcount;
            } else if (firestoreCount < clickcount) {
                // If local storage has a higher count, update Firestore
                await updateDoc(counterRef, { count: clickcount });
            }
        } else {
            // Initialize Firestore document if it doesn't exist
            await setDoc(counterRef, { count: clickcount });
        }
    } catch (error) {
        console.error("Error syncing with Firestore:", error);
    }
}

// Real-time listener for Firestore updates
onSnapshot(counterRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
        const firestoreCount = docSnapshot.data().count || 0;
        if (firestoreCount !== clickcount) {
            clickcount = firestoreCount;
            localStorage.setItem('clickcount', clickcount);
            counter.textContent = clickcount;
        }
    }
});

// Button click event
clicktarget.addEventListener('click', async () => {
    // Update local storage and UI immediately
    clickcount++;
    localStorage.setItem('clickcount', clickcount);
    counter.textContent = clickcount;

    try {
        // Update Firestore
        await updateDoc(counterRef, { count: clickcount });
    } catch (error) {
        console.error("Error updating Firestore:", error);
    }
});

// Sync Firestore and local storage on page load
syncWithFirestore();

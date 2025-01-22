// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

// Generate a unique session ID for each user
const sessionId = Date.now().toString();

// Firestore reference for live users
const liveUsersRef = doc(db, "clickData", sessionId);

// Add user to Firestore when they visit
async function addUser() {
  await setDoc(liveUsersRef, { online: true });
}

// Remove user from Firestore when they leave
async function removeUser() {
  await deleteDoc(liveUsersRef);
}

// Track active users and update the count
function trackUsers() {
  const liveUsersCollection = collection(db, "clickData");
  onSnapshot(liveUsersCollection, (snapshot) => {
    const activeUsers = snapshot.docs.length;
    const counterElement = document.getElementById("active-users");
    counterElement.textContent = `Active Users: ${activeUsers}`;
  });
}

// Initialize session and tracking
async function initializeAppLogic() {
  // Add user to Firestore
  await addUser();

  // Remove user when they leave
  window.addEventListener("beforeunload", async () => {
    await removeUser();
  });

  // Track and update the active user count
  trackUsers();
}

// Start the application logic
initializeAppLogic();

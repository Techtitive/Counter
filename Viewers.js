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

// Time constants
const AFK_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

let afkTimeout;

// Function to mark the user as active
async function markActive() {
  clearTimeout(afkTimeout); // Reset AFK timer
  afkTimeout = setTimeout(async () => {
    await removeUser(); // Mark user as AFK
  }, AFK_TIMEOUT_MS);

  // Ensure user is added to Firestore as active
  await setDoc(liveUsersRef, { online: true, lastActive: new Date() });
}

// Function to remove user (e.g., when AFK or leaving)
async function removeUser() {
  clearTimeout(afkTimeout);
  await deleteDoc(liveUsersRef);
}

// Function to track active users and update the count
function trackUsers() {
  const liveUsersCollection = collection(db, "clickData");
  onSnapshot(liveUsersCollection, (snapshot) => {
    const activeUsers = snapshot.docs.length - 1;
    const counterElement = document.getElementById("active-users");
    counterElement.textContent = `Active Users: ${activeUsers}`;
  });
}

// Initialize app logic
async function initializeAppLogic() {
  // Add user to Firestore on load
  await markActive();

  // Remove user when they leave the page
  window.addEventListener("beforeunload", async () => {
    await removeUser();
  });

  // Track active users
  trackUsers();

  // Monitor user activity
  const events = ["mousemove", "keydown", "click", "touchstart"];
  events.forEach((event) => {
    document.addEventListener(event, markActive);
  });
}

// Start the application logic
initializeAppLogic();

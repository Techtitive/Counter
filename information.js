// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2axhnlDhVTv5ac5GUpX99rgQQoj0-uXw",
  authDomain: "techtitive-counter.firebaseapp.com",
  projectId: "techtitive-counter",
  storageBucket: "techtitive-counter.firebasestorage.app",
  messagingSenderId: "374532775348",
  appId: "1:374532775348:web:337ceaa95f051eebd066e1",
  measurementId: "G-0C5VJE3VPW",
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

// Get device and browser info
function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  return {
    userAgent,
    platform,
    browser: detectBrowser(userAgent),
  };
}

function detectBrowser(userAgent) {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident")) return "Internet Explorer";
  return "Unknown";
}

// Track user clicks
let clickCount = 0;
document.addEventListener("click", () => {
  clickCount++;
  logActivity();
});

// Log user activity
let lastActivity = new Date();

function logActivity() {
  lastActivity = new Date();
  markActive();
  sendActivityToServer();
  storeUserInfo();
}

// Function to mark the user as active
async function markActive() {
  clearTimeout(afkTimeout); // Reset AFK timer
  afkTimeout = setTimeout(async () => {
    await removeUser(); // Mark user as AFK
  }, AFK_TIMEOUT_MS);

  const deviceInfo = getDeviceInfo();
  const timestamp = new Date().toISOString();

  await setDoc(liveUsersRef, {
    sessionId,
    online: true,
    lastActive: timestamp,
    clicks: clickCount,
    device: deviceInfo,
  });
}

// Send activity data to the server
function sendActivityToServer() {
  const deviceInfo = getDeviceInfo();
  const timestamp = new Date().toISOString();

  const activityData = {
    sessionId,
    timestamp,
    clicks: clickCount,
    device: deviceInfo,
  };

  fetch("http://localhost:3000/log-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activityData),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Activity data sent to server successfully.");
      } else {
        console.error("Failed to send activity data to server.");
      }
    })
    .catch((error) => {
      console.error("Error sending activity data to server:", error);
    });
}

// Remove inactive users
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

// Monitor inactivity
function monitorActivity() {
  const now = new Date();
  const inactiveThreshold = 60 * 60 * 1000; // 1 hour

  if (now - lastActivity > inactiveThreshold) {
    removeUser();
  }
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
    document.addEventListener(event, logActivity);
  });

  // Start inactivity monitoring
  setInterval(monitorActivity, 60 * 1000); // Check every minute
}

// Start the application logic
initializeAppLogic();

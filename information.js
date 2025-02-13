// =====================================================
// 1. IMPORTS & FIREBASE INITIALIZATION
// =====================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2axhnlDhVTv5ac5GUpX99rgQQoj0-uXw",
  authDomain: "techtitive-counter.firebaseapp.com",
  projectId: "techtitive-counter",
  storageBucket: "techtitive-counter.firebasestorage.app",
  messagingSenderId: "374532775348",
  appId: "1:374532775348:web:",
  measurementId: "G-0C5VJE3VPW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// =====================================================
// 2. GLOBAL CONSTANTS & VARIABLES
// =====================================================
const AFK_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
let afkTimeout;
let userId = null;
let userName = "Guest";
let deviceId = localStorage.getItem("deviceId") || null; // Persist device ID
let tabId = sessionStorage.getItem("tabId") || null; // Unique ID for each tab

// For per‑tab counting (in‑memory only – resets for each new tab)
let tabClicks = 0;

if (!tabId) {
  tabId = `Tab-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  sessionStorage.setItem("tabId", tabId);
}

// =====================================================
// 3. UTILITY FUNCTIONS
// =====================================================
function generateDeviceID(existingDevices) {
  const deviceNumbers = Object.keys(existingDevices)
    .map((key) => parseInt(key.replace("Device-", "")))
    .filter((num) => !isNaN(num));
  const nextDeviceNum = deviceNumbers.length > 0 ? Math.max(...deviceNumbers) + 1 : 1;
  return `Device-${nextDeviceNum}`;
}

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

// =====================================================
// 4. LOCAL STORAGE HELPERS (OVERALL TOTAL ONLY)
// =====================================================
function saveTotalClicksToLocal(emailOrId, totalClicks) {
  localStorage.setItem(`totalClicks_${emailOrId}`, totalClicks);
}

function getTotalClicksFromLocal(emailOrId) {
  const data = localStorage.getItem(`totalClicks_${emailOrId}`);
  return data ? parseInt(data, 10) : 0;
}

// =====================================================
// 5. MAIN FUNCTIONALITY
// =====================================================

document.addEventListener("click", async () => {
  // --- Overall total (persistent across sessions) ---
  const user = auth.currentUser;
  const emailOrId = user ? user.email : userId;
  const userDocRef = doc(db, "clickData", emailOrId);
  const timestamp = new Date();
  const existingDoc = await getDoc(userDocRef);
  let userData = existingDoc.exists() ? existingDoc.data() : {};

  // Generate device ID if not already set
  if (!deviceId) {
    const existingDevices = userData["7. Devices"] || {};
    deviceId = generateDeviceID(existingDevices);
    localStorage.setItem("deviceId", deviceId);
  }

  // --- Per-device and per-tab counting ---
  // For each new tab (each tab session), we start with tabClicks = 0 (set on page load)
  // Increment the in-memory tabClicks variable
  tabClicks++;

  // Update the current device's tab data in Firestore using the in-memory value
  const currentDeviceData = userData["7. Devices"]?.[deviceId] || {
    clicks: 0,
    Tabs: 0,
    deviceInfo: getDeviceInfo(),
    tabs: {},
  };

  currentDeviceData.tabs[tabId] = {
    clicks: tabClicks, // Use our in-memory counter for this tab
    lastActive: timestamp,
  };

  // Recalculate device-level totals from tab data
  currentDeviceData.clicks = Object.values(currentDeviceData.tabs).reduce(
    (sum, tab) => sum + tab.clicks,
    0
  );
  currentDeviceData.Tabs = Object.keys(currentDeviceData.tabs).length;

  // Update the user's devices object
  userData["7. Devices"] = {
    ...userData["7. Devices"],
    [deviceId]: currentDeviceData,
  };

  // --- Overall total updates ---
  let overallTotal = getTotalClicksFromLocal(emailOrId); // Load saved overall total (or 0 if new)
  overallTotal = overallTotal + 1;                         // Increment overall total by 1
  saveTotalClicksToLocal(emailOrId, overallTotal);         // Save updated overall total to local storage
  userData["1. TotalClicks"] = overallTotal;               // Update overall total in Firestore data
  // *********************************************************

  // Recalculate total tabs across all devices
  userData["4. Tabs"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.Tabs,
    0
  );

  // Update Firestore with the new values
  await setDoc(
    userDocRef,
    {
      "1. TotalClicks": userData["1. TotalClicks"],
      "2. Email": user ? user.email : "Guest",
      "3. Name": user ? user.displayName || "Unnamed User" : userName,
      "4. Tabs": userData["4. Tabs"],
      "5. DeviceCount": Object.keys(userData["7. Devices"]).length,
      "6. Online": true,
      "7. Devices": userData["7. Devices"],
    },
    { merge: true }
  );
});

// ----- Remove User on Leave -----
// FIXED REMOVE FUNCTION: When the user leaves, remove the entire "clickData" collection immediately.
async function removeUser() {
  clearTimeout(afkTimeout);
  try {
    const allUsersCollection = collection(db, "clickData");
    const snapshot = await getDocs(allUsersCollection);
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, "clickData", docSnapshot.id))
    );
    await Promise.all(deletePromises);
    console.log("Entire database removed because the user left.");
  } catch (error) {
    console.error("Error removing database:", error);
  }
  // Clear local storage for the current tab so a new tab will start from 0
  localStorage.removeItem(`tab_${tabId}`);
}

// ----- Cleanup Inactive Users -----
async function cleanupInactiveUsers() {
  try {
    const oneHourAgo = new Date(Date.now() - AFK_TIMEOUT_MS);
    const inactiveUsersQuery = query(
      collection(db, "clickData"),
      where("6. Online", "==", true)
    );
    const inactiveSnapshots = await getDocs(inactiveUsersQuery);
    for (const userDoc of inactiveSnapshots.docs) {
      const userData = userDoc.data();
      const devices = userData["7. Devices"] || {};
      const updatedDevices = Object.entries(devices).reduce((acc, [id, device]) => {
        const updatedTabs = Object.entries(device.tabs || {}).reduce((tabAcc, [tabId, tab]) => {
          const lastActive = tab.lastActive?.toDate() || new Date(0);
          if (lastActive > oneHourAgo) {
            tabAcc[tabId] = tab;
          } else {
            localStorage.removeItem(`tab_${tabId}`);
          }
          return tabAcc;
        }, {});
        if (Object.keys(updatedTabs).length > 0) {
          acc[id] = { ...device, tabs: updatedTabs };
        }
        return acc;
      }, {});
      if (Object.keys(updatedDevices).length === 0) {
        await deleteDoc(doc(db, "clickData", userDoc.id));
        console.log("Inactive user removed:", userDoc.id);
      } else {
        await setDoc(
          userDoc.ref,
          {
            "7. Devices": updatedDevices,
            "1. TotalClicks": Object.values(updatedDevices).reduce(
              (sum, device) => sum + (device.clicks || 0),
              0
            ),
            "4. Tabs": Object.values(updatedDevices).reduce(
              (sum, device) => sum + (device.Tabs || 0),
              0
            ),
            "5. DeviceCount": Object.keys(updatedDevices).length,
          },
          { merge: true }
        );
      }
    }
  } catch (error) {
    console.error("Error during cleanup of inactive users:", error);
  }
}

// ----- Track Active Users (for display) -----
function trackUsers() {
  const liveUsersCollection = collection(db, "clickData");
  onSnapshot(liveUsersCollection, (snapshot) => {
    const activeUsers = snapshot.docs.length;
    const counterElement = document.getElementById("active-users");
    if (counterElement) {
      counterElement.textContent = `Active Users: ${activeUsers}`;
    }
  });
}

// ----- Activity Monitoring & Marking Active -----
let lastActivity = Date.now();
function logActivity() {
  lastActivity = Date.now();
  markActive();
}
function monitorActivity() {
  const now = Date.now();
  if (now - lastActivity > AFK_TIMEOUT_MS) {
    removeUser();
  }
}

// ----- Authentication State Handling -----
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const guestDocRef = doc(db, "clickData", `${userId}`);
    await deleteDoc(guestDocRef).catch(() => {});
    userId = user.email;
    userName = user.displayName || "Unnamed User";
    const totalFromLocal = getTotalClicksFromLocal(user.email);
    const userDocRef = doc(db, "clickData", user.email);
    const existingDoc = await getDoc(userDocRef);
    if (!existingDoc.exists()) {
      await setDoc(
        userDocRef,
        {
          "1. TotalClicks": totalFromLocal,
          "2. Email": user.email,
          "3. Name": user.displayName || "Unnamed User",
          "4. Tabs": 0,
          "5. DeviceCount": 0,
          "6. Online": true,
          "7. Devices": {},
        },
        { merge: true }
      );
    }
    userId = user.email;
    userName = user.displayName || "Unnamed User";
  } else {
    userId = `${Date.now()}`;
    userName = userId;
  }
  await markActive();
});

// ----- Mark User as Active (Update Firestore) -----
// On any activity, update the user's Firestore document with the saved overall total.
async function markActive() {
  clearTimeout(afkTimeout);
  afkTimeout = setTimeout(() => {
    removeUser();
  }, AFK_TIMEOUT_MS);
  const user = auth.currentUser;
  const emailOrId = user ? user.email : userId;
  const userDocRef = doc(db, "clickData", emailOrId);
  const deviceInfo = getDeviceInfo();
  const timestamp = new Date();
  const existingDoc = await getDoc(userDocRef);
  let userData = existingDoc.exists() ? existingDoc.data() : {};
  if (!deviceId) {
    const existingDevices = userData["7. Devices"] || {};
    deviceId = generateDeviceID(existingDevices);
    localStorage.setItem("deviceId", deviceId);
  }
  const currentDeviceData = userData["7. Devices"]?.[deviceId] || {
    clicks: 0,
    Tabs: 0,
    deviceInfo: deviceInfo,
    tabs: {},
  };
  currentDeviceData.tabs[tabId] = {
    clicks: currentDeviceData.tabs[tabId]?.clicks || 0,
    lastActive: timestamp,
  };
  currentDeviceData.clicks = Object.values(currentDeviceData.tabs).reduce(
    (sum, tab) => sum + tab.clicks,
    0
  );
  currentDeviceData.Tabs = Object.keys(currentDeviceData.tabs).length;
  userData["7. Devices"] = {
    ...userData["7. Devices"],
    [deviceId]: currentDeviceData,
  };
  userData["1. TotalClicks"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.clicks,
    0
  );
  userData["4. Tabs"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.Tabs,
    0
  );
  const savedTotal = getTotalClicksFromLocal(emailOrId);
  userData["1. TotalClicks"] = savedTotal;
  saveTotalClicksToLocal(emailOrId, userData["1. TotalClicks"]);
  await setDoc(
    userDocRef,
    {
      "1. TotalClicks": userData["1. TotalClicks"],
      "2. Email": user ? user.email : "Guest",
      "3. Name": user ? user.displayName || "Unnamed User" : userName,
      "4. Tabs": userData["4. Tabs"],
      "5. DeviceCount": Object.keys(userData["7. Devices"]).length,
      "6. Online": true,
      "7. Devices": userData["7. Devices"],
    },
    { merge: true }
  );
}

// =====================================================
// 6. INITIALIZATION & EVENT LISTENERS
// =====================================================
async function initializeAppLogic() {
  trackUsers();
  if (deviceId && tabId) {
    console.log(`Loaded ${getClickDataFromLocal(tabId)} clicks from local storage for tab ${tabId}`);
  }
  const user = auth.currentUser;
  const emailOrId = user ? user.email : userId;
  console.log(`Loaded total clicks from local storage for user ${emailOrId}: ${getTotalClicksFromLocal(emailOrId)}`);
  window.addEventListener("beforeunload", () => {
    removeUser();
  });
  window.addEventListener("unload", () => {
    removeUser();
  });
  const events = ["mousemove", "keydown", "touchstart"];
  events.forEach((eventName) => {
    document.addEventListener(eventName, logActivity);
  });
  setInterval(monitorActivity, 60 * 1000);
  setInterval(cleanupInactiveUsers, 5 * 60 * 1000);
}

initializeAppLogic();

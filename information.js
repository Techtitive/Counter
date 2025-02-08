// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2axhnlDhVTv5ac5GUpX99rgQQoj0-uXw",
  authDomain: "techtitive-counter.firebaseapp.com",
  projectId: "techtitive-counter",
  storageBucket: "techtitive-counter.firebasestorage.app",
  messagingSenderId: "374532775348",
  appId: "1:374532775348:web:",
  measurementId: "G-0C5VJE3VPW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Constants
const AFK_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
let afkTimeout;
let userId = null;
let userName = "Guest";
let deviceId = localStorage.getItem("deviceId") || null; // Persist device ID
let tabId = sessionStorage.getItem("tabId") || null; // Unique ID for each tab

// Generate a unique tab ID
if (!tabId) {
  tabId = `Tab-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  sessionStorage.setItem("tabId", tabId);
}

// Function to generate a unique device ID
function generateDeviceID(existingDevices) {
  const deviceNumbers = Object.keys(existingDevices)
    .map((key) => parseInt(key.replace("Device-", "")))
    .filter((num) => !isNaN(num));
  const nextDeviceNum = deviceNumbers.length > 0 ? Math.max(...deviceNumbers) + 1 : 1;
  return `Device-${nextDeviceNum}`;
}

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

// Save click data to local storage
function saveClickDataToLocal(deviceId, tabId, clicks) {
  const key = `clickData_${deviceId}_${tabId}`;
  localStorage.setItem(key, JSON.stringify({ clicks }));
}

// Retrieve click data from local storage
function getClickDataFromLocal(deviceId, tabId) {
  const key = `clickData_${deviceId}_${tabId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data).clicks : 0;
}

// Save total click count to local storage
function saveTotalClicksToLocal(totalClicks) {
  localStorage.setItem("totalClicks", totalClicks);
}

// Retrieve total click count from local storage
function getTotalClicksFromLocal() {
  const data = localStorage.getItem("totalClicks");
  return data ? parseInt(data, 10) : 0;
}

// Track user clicks
document.addEventListener("click", async () => {
  const user = auth.currentUser;
  const userDocRef = doc(db, "clickData", user ? user.email : `${userId}`);
  const timestamp = new Date();
  const existingDoc = await getDoc(userDocRef);
  let userData = existingDoc.exists() ? existingDoc.data() : {};

  // Generate device ID only once per device
  if (!deviceId) {
    const existingDevices = userData["7. Devices"] || {};
    deviceId = generateDeviceID(existingDevices);
    localStorage.setItem("deviceId", deviceId);
  }

  // Update device-specific data
  const currentDeviceData = userData["7. Devices"]?.[deviceId] || {
    clicks: 0,
    Tabs: 0,
    deviceInfo: getDeviceInfo(), // Store device info here
    tabs: {},
  };

  // Get existing clicks from local storage or default to 0
  const existingClicks = getClickDataFromLocal(deviceId, tabId);

  // Update the specific tab within the device's tabs
  currentDeviceData.tabs[tabId] = {
    clicks: existingClicks + 1, // Increment clicks for the tab
    lastActive: timestamp,
  };

  // Save updated click count to local storage
  saveClickDataToLocal(deviceId, tabId, currentDeviceData.tabs[tabId].clicks);

  // Aggregate device-level clicks
  currentDeviceData.clicks = Object.values(currentDeviceData.tabs).reduce(
    (sum, tab) => sum + tab.clicks,
    0
  );

  // Update the total number of tabs for the device
  currentDeviceData.Tabs = Object.keys(currentDeviceData.tabs).length;

  // Update the user's devices
  userData["7. Devices"] = {
    ...userData["7. Devices"], // Preserve existing devices
    [deviceId]: currentDeviceData, // Update the specific device
  };

  // Calculate total clicks
  userData["1. TotalClicks"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.clicks,
    0
  );

  // Save total clicks to local storage
  saveTotalClicksToLocal(userData["1. TotalClicks"]);

  // Calculate total tabs
  userData["4. Tabs"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.Tabs,
    0
  );

  // Update Firestore
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

// Remove inactive users or devices
async function removeUser() {
  clearTimeout(afkTimeout);
  const user = auth.currentUser;
  const userDocRef = doc(db, "clickData", user ? user.email : `${userId}`);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const devices = userData["7. Devices"] || {};

    // Remove the current tab from the device
    if (devices[deviceId]?.tabs?.[tabId]) {
      delete devices[deviceId].tabs[tabId];
      // Remove click data from local storage
      const key = `clickData_${deviceId}_${tabId}`;
      localStorage.removeItem(key);

      // If no tabs left in the device, remove the device
      if (Object.keys(devices[deviceId].tabs).length === 0) {
        delete devices[deviceId];
      }

      await setDoc(
        userDocRef,
        {
          "7. Devices": devices,
          "1. TotalClicks": Object.values(devices).reduce(
            (sum, device) => sum + device.clicks,
            0
          ),
          "4. Tabs": Object.values(devices).reduce(
            (sum, device) => sum + device.Tabs,
            0
          ),
          "5. DeviceCount": Object.keys(devices).length,
        },
        { merge: true }
      );
    }

    // If no devices left, remove the user entirely
    if (Object.keys(devices).length === 0) {
      await deleteDoc(userDocRef);
      console.log("User removed from database.");
    }
  }
}

// Cleanup inactive users
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

      // Remove tabs and devices that haven't been active for more than 1 hour
      const updatedDevices = Object.entries(devices).reduce((acc, [id, device]) => {
        const updatedTabs = Object.entries(device.tabs).reduce((tabAcc, [tabId, tab]) => {
          const lastActive = tab.lastActive?.toDate() || new Date(0);
          if (lastActive > oneHourAgo) {
            tabAcc[tabId] = tab;
          } else {
            // Remove click data from local storage
            const key = `clickData_${id}_${tabId}`;
            localStorage.removeItem(key);
          }
          return tabAcc;
        }, {});

        if (Object.keys(updatedTabs).length > 0) {
          acc[id] = { ...device, tabs: updatedTabs };
        }
        return acc;
      }, {});

      if (Object.keys(updatedDevices).length === 0) {
        // No active devices left, delete the user
        await deleteDoc(doc(db, "clickData", userDoc.id));
        console.log("Inactive user removed:", userDoc.id);
      } else {
        // Update the user's devices
        await setDoc(
          userDoc.ref,
          {
            "7. Devices": updatedDevices,
            "1. TotalClicks": Object.values(updatedDevices).reduce(
              (sum, device) => sum + device.clicks,
              0
            ),
            "4. Tabs": Object.values(updatedDevices).reduce(
              (sum, device) => sum + device.Tabs,
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

// Track active users and update the count
function trackUsers() {
  const liveUsersCollection = collection(db, "clickData");
  onSnapshot(liveUsersCollection, (snapshot) => {
    const activeUsers = snapshot.docs.length - 1;
    const counterElement = document.getElementById("active-users");
    if (counterElement) {
      counterElement.textContent = `Active Users: ${activeUsers}`;
    }
  });
}

// Monitor inactivity
let lastActivity = Date.now();

function logActivity() {
  lastActivity = Date.now();
  markActive(); // Ensure the user is marked as active
}

function monitorActivity() {
  const now = Date.now();
  if (now - lastActivity > AFK_TIMEOUT_MS) {
    removeUser();
  }
}

// Handle authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Remove guest data when logging in
    const guestDocRef = doc(db, "clickData", `${userId}`);
    await deleteDoc(guestDocRef);

    // Update user details
    userId = user.email;
    userName = user.displayName || "Unnamed User";
  } else {
    userId = `${Date.now()}`; // Use numeric ID for guests
    userName = userId;
  }
  await markActive();
});

// Function to mark the user as active
async function markActive() {
  clearTimeout(afkTimeout);
  afkTimeout = setTimeout(async () => {
    await removeUser();
  }, AFK_TIMEOUT_MS);

  const user = auth.currentUser;
  const userDocRef = doc(db, "clickData", user ? user.email : `${userId}`);
  const deviceInfo = getDeviceInfo();
  const timestamp = new Date();
  const existingDoc = await getDoc(userDocRef);
  let userData = existingDoc.exists() ? existingDoc.data() : {};

  // Generate device ID only once per device
  if (!deviceId) {
    const existingDevices = userData["7. Devices"] || {};
    deviceId = generateDeviceID(existingDevices);
    localStorage.setItem("deviceId", deviceId);
  }

  // Update device-specific data
  const currentDeviceData = userData["7. Devices"]?.[deviceId] || {
    clicks: 0,
    Tabs: 0,
    deviceInfo: deviceInfo, // Store device info here
    tabs: {},
  };

  // Update the specific tab within the device's tabs
  currentDeviceData.tabs[tabId] = {
    clicks: (currentDeviceData.tabs[tabId]?.clicks || 0),
    lastActive: timestamp,
  };

  // Aggregate device-level clicks
  currentDeviceData.clicks = Object.values(currentDeviceData.tabs).reduce(
    (sum, tab) => sum + tab.clicks,
    0
  );

  // Update the total number of tabs for the device
  currentDeviceData.Tabs = Object.keys(currentDeviceData.tabs).length;

  // Update the user's devices
  userData["7. Devices"] = {
    ...userData["7. Devices"], // Preserve existing devices
    [deviceId]: currentDeviceData, // Update the specific device
  };

  // Calculate total clicks
  userData["1. TotalClicks"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.clicks,
    0
  );

  // Save total clicks to local storage
  saveTotalClicksToLocal(userData["1. TotalClicks"]);

  // Calculate total tabs
  userData["4. Tabs"] = Object.values(userData["7. Devices"]).reduce(
    (sum, device) => sum + device.Tabs,
    0
  );

  // Update Firestore
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

// Initialize app logic
async function initializeAppLogic() {
  // Track active users
  trackUsers();

  // Initialize click counts from local storage
  if (deviceId && tabId) {
    const existingClicks = getClickDataFromLocal(deviceId, tabId);
    console.log(`Loaded ${existingClicks} clicks from local storage for tab ${tabId}`);
  }

  // Initialize total clicks from local storage
  const totalClicks = getTotalClicksFromLocal();
  console.log(`Loaded total clicks from local storage: ${totalClicks}`);

  // Remove user when they leave the page
  window.addEventListener("beforeunload", async () => {
    await removeUser();
  });

  // Monitor user activity
  const events = ["mousemove", "keydown", "touchstart"];
  events.forEach((event) => {
    document.addEventListener(event, logActivity);
  });

  // Start inactivity monitoring
  setInterval(monitorActivity, 60 * 1000); // Check every minute

  // Periodically clean up inactive users
  setInterval(cleanupInactiveUsers, 5 * 60 * 1000); // Every 5 minutes
}

// Start the application logic
initializeAppLogic();

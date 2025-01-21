// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

// Firestore Reference to the counter document
const counterRef = doc(db, 'clickData', 'counter');

// HTML Element References
const hovertarget = document.querySelector('.container3');
const clicktarget = document.querySelector('.button');
const countertext = document.querySelector('.counterBox');
const counter = document.querySelector('.counter');
const body = document.body;

// Initialize clickcount from Firestore
let clickcount = 0;

// Fetch data from Firestore
getDoc(counterRef).then((docSnapshot) => {
  if (docSnapshot.exists()) {
    clickcount = docSnapshot.data().count || 0;
    counter.textContent = clickcount; // Update counter on page
  } else {
    // Initialize the counter document in Firestore if it does not exist
    setDoc(counterRef, { count: 0 });
  }
});

// Action array to change background color
const actions = [
  () => (body.style.backgroundColor = '#A1C4FD'),
  () => (body.style.backgroundColor = 'blue'),
  () => (body.style.backgroundColor = '#FFFB7D'),
  () => (body.style.backgroundColor = 'yellow'),
  () => (body.style.backgroundColor = '#F8BBD0'),
  () => (body.style.backgroundColor = 'red'),
  () => (body.style.backgroundColor = '#B2EBF2'),
  () => (body.style.backgroundColor = 'green'),
  () => (body.style.backgroundColor = '#FFEE58'),
  () => (body.style.backgroundColor = 'orange'),
  () => (body.style.backgroundColor = '#A0C4FF'),
  () => (body.style.backgroundColor = 'brown'),
  () => (body.style.backgroundColor = '#C8E6C9'),
  () => (body.style.backgroundColor = 'grey'),
  () => (body.style.backgroundColor = '#D1C4E9'),
  () => (body.style.backgroundColor = 'teal'),
  () => (body.style.backgroundColor = '#FFB3DE'),
  () => (body.style.backgroundColor = 'chocolate'),
  () => (body.style.backgroundColor = '#D4E157'),
  () => (body.style.backgroundColor = 'pink'),
  () => (body.style.backgroundColor = '#F0E68C'),
  () => (body.style.backgroundColor = 'purple'),
  () => (body.style.backgroundColor = '#FFDAC1'),
  () => (body.style.backgroundColor = 'cyan'),
  () => (body.style.backgroundColor = '#D3F8E2'),
  () => (body.style.backgroundColor = '#F3E5F5'),
  () => (body.style.backgroundColor = '#A1C4FD'),
];

// Click Event Listener to update counter and Firestore
clicktarget.addEventListener('click', async () => {
  // Perform background color action
  actions[clickCounter]();
  clickCounter = (clickCounter + 1) % actions.length;

  // Fetch the current counter value from Firestore
  const docSnapshot = await getDoc(counterRef);
  if (docSnapshot.exists()) {
    const currentCount = docSnapshot.data().count || 0;
    const newCount = currentCount + 1;

    // Update Firestore with the new counter value
    await setDoc(counterRef, { count: newCount });

    // Update the counter on the UI
    counter.textContent = newCount;
    localStorage.setItem('clickcount', newCount); // Store in localStorage as well
  }
});

// Hover effects to change background and counter text color
hovertarget.addEventListener('mouseenter', () => {
  body.style.backgroundColor = '#000000';
  countertext.style.color = 'white';
});

hovertarget.addEventListener('mouseleave', () => {
  body.style.backgroundColor = 'white';
  countertext.style.color = 'black';
});

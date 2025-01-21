// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const counterRef = doc(collection(db, 'clickData'), 'counter');

// Fetch data
counterRef.get().then((doc) => {
  if (doc.exists) {
    console.log(doc.data());
  }
});


const hovertarget = document.querySelector('.container3');
const clicktarget = document.querySelector('.button');
const countertext = document.querySelector('.counterBox');
const counter = document.querySelector('.counter');
const body = document.body;

let clickcount = localStorage.getItem('clickcount')|| 0;

clickcount = Number(clickcount);

counter.textContent = clickcount;

let clickCounter = 0;
getDoc(counterRef).then((doc) => {
  if (doc.exists()) {
    clickcount = doc.data().count || 0;
    counter.textContent = clickcount;
  } else {
    // Initialize in Firestore if missing
    setDoc(counterRef, { count: 0 });
  }
});

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
    
]

clicktarget.addEventListener('click', () => {
    actions[clickCounter]();
    clickCounter = (clickCounter + 1) % actions.length
    
    clickcount ++;
    counter.textContent = clickcount;
    localStorage.setItem('clickcount', clickcount)
})


hovertarget.addEventListener('mouseenter', () => {
    body.style.backgroundColor = '#000000';
})

hovertarget.addEventListener('mouseleave', () => {
    body.style.backgroundColor = 'white';
})

hovertarget.addEventListener('mouseenter', () => {
    countertext.style.color = 'white';
})

hovertarget.addEventListener('mouseleave', () => {
    countertext.style.color = 'black';
})

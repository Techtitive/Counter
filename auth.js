import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updatePassword 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase Configuration
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
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const authSection = document.getElementById("auth-form");
    const userSection = document.getElementById("auth-status");
    const userEmailDisplay = document.getElementById("user-email");
    const rememberMe = document.getElementById("remember-me");
    const messageBox = document.getElementById("auth-message");

    // Check if "Remember Me" is enabled and auto-fill email
    if (localStorage.getItem("rememberMeEmail")) {
        document.getElementById("email").value = localStorage.getItem("rememberMeEmail");
        rememberMe.checked = true;
    }

    // Listen for Authentication State Changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authSection.style.display = "none";
            userSection.style.display = "block";
            userEmailDisplay.textContent = user.email;
        } else {
            authSection.style.display = "block";
            userSection.style.display = "none";
        }
    });

    // Display Messages
    function showMessage(msg, isError = false) {
        messageBox.textContent = msg;
        messageBox.style.color = isError ? "red" : "green";
    }

    // Sign Up Function
    window.handleSignUp = () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => showMessage("Sign-up successful!", false))
            .catch(error => {
                if (error.code === 'auth/invalid-email') {
                    showMessage('Invalid email provided', true);
                } else if (error.code === 'auth/missing-password') {
                    showMessage('Enter a password', true);
                } else if (error.code === 'auth/invalid-credential') {
                    showMessage('Invalid credentials provided', true);
                } else if (error.code === 'auth/weak-password') {
                    showMessage('Password should be at least 6 characters', true);
                } else {
                    showMessage(error.message, true);
                }
            });
    };

    // Sign In Function
    window.handleSignIn = () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                if (rememberMe.checked) {
                    localStorage.setItem("rememberMeEmail", email);
                } else {
                    localStorage.removeItem("rememberMeEmail");
                }
                showMessage("Sign-in successful!", false);
            })
            .catch(error => {
                if (error.code === 'auth/invalid-email') {
                    showMessage('Invalid email provided', true);
                } else if (error.code === 'auth/missing-password') {
                    showMessage('Enter a password', true);
                } else if (error.code === 'auth/invalid-credential') {
                    showMessage('Invalid credentials provided', true);
                } else {
                    showMessage(error.message, true);
                }
            });
    };
    

    // Sign Out Function
    window.handleSignOut = () => {
        signOut(auth).then(() => {
            localStorage.removeItem("rememberMeEmail");
            showMessage("Signed out successfully!", false);
        })            .catch(error => {
            if (error.code === 'auth/invalid-email') {
                showMessage('Invalid email provided', true);
            } else if (error.code === 'auth/missing-password') {
                showMessage('Enter a password', true);
            } else if (error.code === 'auth/invalid-credential') {
                showMessage('Invalid credentials provided', true);
            } else if (error.code === 'auth/network-request-failed') {
                showMessage('Can\'t connect to the server', true);
            } else {
                showMessage(error.message, true);
            }
        });
    };

    // Change Password Function
    window.handleChangePassword = () => {
        const newPassword = prompt("Enter new password:");
        if (auth.currentUser && newPassword) {
            updatePassword(auth.currentUser, newPassword)
                .then(() => showMessage("Password updated successfully!", false))
                .catch(error => {
                    if (error.code === 'auth/invalid-email') {
                        showMessage('Invalid email provided', true);
                    } else if (error.code === 'auth/missing-password') {
                        showMessage('Enter a password', true);
                    } else if (error.code === 'auth/invalid-credential') {
                        showMessage('Invalid credentials provided', true);
                    } else {
                        showMessage(error.message, true);
                    }
                });
        }
    };
});

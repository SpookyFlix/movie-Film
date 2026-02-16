import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";




const firebaseConfig = {
  apiKey: "AIzaSyDTsGa9by8bEsm7beKfwXOFmBLlZAF4NUQ",
  authDomain: "spooky-a6840.firebaseapp.com",
  projectId: "spooky-a6840",
  storageBucket: "spooky-a6840.firebasestorage.app",
  messagingSenderId: "137766818461",
  appId: "1:137766818461:web:5f091e46f6896a1197fa74"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// SIGN UP FUNCTION
export async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  await sendEmailVerification(userCredential.user);
  await auth.signOut();


  alert("Verification email sent. Please check your inbox.");
}

// HANDLE SIGNUP FORM
document.addEventListener("DOMContentLoaded", () => {

  const signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);

        alert("Verification email sent. Please check your inbox.");

      } catch (error) {
        alert(error.message);
      }

    });
  }

});

// HANDLE LOGIN
document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        await userCredential.user.reload();
        if (!userCredential.user.emailVerified) {
          alert("Please verify your email first!");
          return;
}

        

        const deviceId = getDeviceId();
const userRef = doc(db, "users", userCredential.user.uid);
const userSnap = await getDoc(userRef);

if (userSnap.exists()) {

  if (userSnap.data().deviceId !== deviceId) {

    const confirmSwitch = confirm("Account is logged in on another device. Continue here and logout other device?");

    if (!confirmSwitch) return;

    await setDoc(userRef, { deviceId: deviceId });
  }

} else {
  await setDoc(userRef, { deviceId: deviceId });
}

alert("Login successful!");
window.location.href = "index.html";


      } catch (error) {
        alert(error.message);
      }

    });
  }

});

function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}




import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getDatabase,
  ref,
  set
} from
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";


const firebaseConfig = {

  apiKey:
    "AIzaSyCuHXXUB5aYqlGfEs3lMMvFwNdqHIpT29E",

  authDomain:
    "baryan-5f81d.firebaseapp.com",

  projectId:
    "baryan-5f81d",

  storageBucket:
    "baryan-5f81d.firebasestorage.app",

  messagingSenderId:
    "409395363296",

  appId:
    "1:409395363296:web:f20c12dfb4c738361cbf85",

  databaseURL:
    "https://baryan-5f81d-default-rtdb.europe-west1.firebasedatabase.app"
};


console.log("1. Starting Firebase...");


const app =
  initializeApp(firebaseConfig);


console.log("2. Firebase initialized");


const database =
  getDatabase(app);


console.log("3. Database initialized");


const form =
  document.getElementById("membershipForm");


const message =
  document.getElementById("formMessage");


form.addEventListener("submit", async (event) => {

  event.preventDefault();

  console.log("4. FORM SUBMITTED");

  message.textContent =
    "Testing Firebase...";


  try {

    console.log("5. Attempting Firebase write...");


    const testRef =
      ref(
        database,
        "testConnection"
      );


    await set(
      testRef,
      {
        message: "Firebase connection works",
        time: new Date().toISOString()
      }
    );


    console.log(
      "6. FIREBASE WRITE SUCCESS"
    );


    message.textContent =
      "FIREBASE WORKS! Test data was saved.";

    message.style.color =
      "green";


  } catch (error) {

    console.error(
      "7. FIREBASE ERROR:",
      error
    );


    message.textContent =
      "FIREBASE ERROR: " +
      error.message;

    message.style.color =
      "red";

  }

});

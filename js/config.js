// js/config.js

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

  apiKey: "AIzaSyCuHXXUB5aYqlGfEs3lMMvFwNdqHIpT29E",

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

  measurementId:
    "G-J1RCHQN6XN"

};


const app =
  initializeApp(firebaseConfig);


const db =
  getFirestore(app);


export {
  app,
  db
};

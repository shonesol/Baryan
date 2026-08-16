/*
====================================================
BARYAN BADMINTON CLUB
PUBLIC FRONTEND CONFIGURATION
====================================================

IMPORTANT:
Firebase Web App configuration is normally safe
to include in frontend code.

DO NOT put:
- Firebase Admin SDK credentials
- Service account private keys
- Email passwords
- Private API secrets

in this file.
====================================================
*/

const BARYAN_CONFIG = {

  /*
  ================================
  FIREBASE
  ================================
  Replace these values with the
  Firebase Web App configuration
  from your Firebase console.
  */

  firebase: {
  apiKey: "AIzaSyCuHXXUB5aYqlGfEs3lMMvFwNdqHIpT29E",
  authDomain: "baryan-5f81d.firebaseapp.com",
  projectId: "baryan-5f81d",
  storageBucket: "baryan-5f81d.firebasestorage.app",
  messagingSenderId: "409395363296",
  appId: "1:409395363296:web:f20c12dfb4c738361cbf85",
  measurementId: "G-J1RCHQN6XN"

  },


  /*
  ================================
  EMAILJS
  ================================
  */

  emailjs: {

    publicKey:
      "yhUBvR2qJDBsXAOt6",

    serviceId:
      "service_jwvtdwh",

    templateId:
      "template_xh3ccdo"

  },


  /*
  ================================
  WHATSAPP
  ================================
  */

  whatsapp: {

    /*
    Put the official club WhatsApp
    number here.

    Uganda example:
    2567XXXXXXXX

    Do NOT use:
    +256
    spaces
    brackets
    hyphens
    */

    phone:
      "256755805092",

    message:
      "Hello Baryan Badminton Club, I would like to enquire about membership."

  },


  /*
  ================================
  CLUB INFORMATION
  ================================
  */

  club: {

    name:
      "Baryan Badminton Club",

    email:
      "baryanmintonclub@gmail.com",

    phone:
      "+256755805092",

    location:
      "kyebando ring road Kampala, Uganda"

  }

};

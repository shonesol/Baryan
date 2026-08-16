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
  apiKey: "AIzaSyChcaNBkSkXp4DILZvvpYism9F1617fhZQ",
  authDomain: "baryan-9997b.firebaseapp.com",
  projectId: "baryan-9997b",
  storageBucket: "baryan-9997b.firebasestorage.app",
  messagingSenderId: "1037368957847",
  appId: "1:1037368957847:web:c43200cbe2cb026c1fc2d2",
  measurementId: "G-SP6971YS6C"

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

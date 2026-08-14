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

    apiKey: "YOUR_FIREBASE_API_KEY",

    authDomain:
      "YOUR_PROJECT.firebaseapp.com",

    projectId:
      "YOUR_PROJECT_ID",

    storageBucket:
      "YOUR_PROJECT.firebasestorage.app",

    messagingSenderId:
      "YOUR_MESSAGING_SENDER_ID",

    appId:
      "YOUR_FIREBASE_APP_ID"

  },


  /*
  ================================
  EMAILJS
  ================================
  */

  emailjs: {

    publicKey:
      "YOUR_EMAILJS_PUBLIC_KEY",

    serviceId:
      "YOUR_EMAILJS_SERVICE_ID",

    templateId:
      "YOUR_EMAILJS_TEMPLATE_ID"

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
      "2567XXXXXXXX",

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
      "YOUR_CLUB_EMAIL",

    phone:
      "+256XXXXXXXXX",

    location:
      "Kampala, Uganda"

  }

};

// ============================================================
// BARYAN BADMINTON CLUB
// MEMBERSHIP REGISTRATION
// Firebase Realtime Database + WhatsApp
// ============================================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

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

  measurementId:
    "G-J1RCHQN6XN",

  databaseURL:
    "https://baryan-5f81d-default-rtdb.europe-west1.firebasedatabase.app"

};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app =
  initializeApp(firebaseConfig);

const database =
  getDatabase(app);


// ============================================================
// FORM ELEMENTS
// ============================================================

const form =
  document.getElementById("membershipForm");

const submitButton =
  document.getElementById("submitButton");

const submitText =
  document.getElementById("submitText");

const submitLoading =
  document.getElementById("submitLoading");

const formMessage =
  document.getElementById("formMessage");

const membershipCategory =
  document.getElementById("membershipCategory");

const juniorSection =
  document.getElementById("juniorSection");


// ============================================================
// CHECK THAT FORM EXISTS
// ============================================================

if (!form) {

  console.error(
    "ERROR: membershipForm was not found."
  );

}


// ============================================================
// SHOW / HIDE JUNIOR SECTION
// ============================================================

if (membershipCategory && juniorSection) {

  membershipCategory.addEventListener(
    "change",
    () => {

      const isJunior =
        membershipCategory.value === "Junior";

      juniorSection.hidden =
        !isJunior;

    }
  );

}


// ============================================================
// GET VALUE HELPER
// ============================================================

function getValue(id) {

  const element =
    document.getElementById(id);

  if (!element) {
    return "";
  }

  return element.value.trim();

}


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(
  message,
  type = "success"
) {

  if (!formMessage) {
    return;
  }

  formMessage.textContent =
    message;

  formMessage.className =
    `form-message ${type}`;

}


// ============================================================
// LOADING STATE
// ============================================================

function setLoading(loading) {

  if (submitButton) {

    submitButton.disabled =
      loading;

  }

  if (submitText) {

    submitText.hidden =
      loading;

  }

  if (submitLoading) {

    submitLoading.hidden =
      !loading;

  }

}


// ============================================================
// FORM SUBMISSION
// ============================================================

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    console.log(
      "Membership form submitted."
    );


    // ========================================================
    // HONEYPOT
    // ========================================================

    const website =
      getValue("website");

    if (website !== "") {

      console.warn(
        "Honeypot triggered."
      );

      return;

    }


    // ========================================================
    // HTML VALIDATION
    // ========================================================

    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


    // ========================================================
    // START LOADING
    // ========================================================

    setLoading(true);

    showMessage(
      "Submitting your application...",
      "success"
    );


    try {

      // ======================================================
      // COLLECT FORM DATA
      // ======================================================

      const application = {

        fullName:
          getValue("fullName"),

        dateOfBirth:
          getValue("dateOfBirth"),

        gender:
          getValue("gender"),

        phone:
          getValue("phone"),

        whatsapp:
          getValue("whatsapp"),

        email:
          getValue("email"),

        membershipCategory:
          getValue("membershipCategory"),

        skillLevel:
          getValue("skillLevel"),

        trainingSession:
          getValue("trainingSession"),

        experience:
          getValue("experience"),

        guardianName:
          getValue("guardianName"),

        guardianPhone:
          getValue("guardianPhone"),

        emergencyName:
          getValue("emergencyName"),

        emergencyPhone:
          getValue("emergencyPhone"),

        agreed:
          document.getElementById("agree").checked,

        createdAt:
          serverTimestamp()

      };


      console.log(
        "Application:",
        application
      );


      // ======================================================
      // FIREBASE DATABASE LOCATION
      // ======================================================

      const applicationsRef =
        ref(
          database,
          "membershipApplications"
        );


      // ======================================================
      // CREATE AUTOMATIC FIREBASE KEY
      // ======================================================

      const newApplication =
        push(applicationsRef);


      console.log(
        "Firebase key:",
        newApplication.key
      );


      // ======================================================
      // SAVE TO FIREBASE
      // ======================================================

      await set(
        newApplication,
        application
      );


      console.log(
        "Application successfully saved to Firebase."
      );


      // ======================================================
      // WHATSAPP MESSAGE
      // ======================================================

      const message = `

🏸 *NEW BARYAN BADMINTON CLUB MEMBERSHIP APPLICATION*

━━━━━━━━━━━━━━━━━━

👤 *PERSONAL INFORMATION*

Name:
${application.fullName}

Date of Birth:
${application.dateOfBirth}

Gender:
${application.gender}


📞 *CONTACT DETAILS*

Phone:
${application.phone}

WhatsApp:
${application.whatsapp || "Not provided"}

Email:
${application.email}


🏸 *MEMBERSHIP DETAILS*

Category:
${application.membershipCategory}

Skill Level:
${application.skillLevel}

Training Session:
${application.trainingSession}


📝 *BADMINTON EXPERIENCE*

${application.experience || "Not provided"}


👨‍👩‍👧 *PARENT / GUARDIAN*

Name:
${application.guardianName || "Not applicable"}

Phone:
${application.guardianPhone || "Not applicable"}


🚨 *EMERGENCY CONTACT*

Name:
${application.emergencyName}

Phone:
${application.emergencyPhone}


✅ Agreement:
${application.agreed ? "Accepted" : "Not accepted"}


━━━━━━━━━━━━━━━━━━

🏸 Baryan Badminton Club

Firebase ID:
${newApplication.key}

`.trim();


      // ======================================================
      // WHATSAPP NUMBER
      // ======================================================

      const whatsappNumber =
        "256755805092";


      // ======================================================
      // WHATSAPP URL
      // ======================================================

      const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);


      // ======================================================
      // SUCCESS MESSAGE
      // ======================================================

      showMessage(
        "Application submitted successfully. Opening WhatsApp...",
        "success"
      );


      // ======================================================
      // RESET FORM
      // ======================================================

      form.reset();


      if (juniorSection) {

        juniorSection.hidden =
          true;

      }


      // ======================================================
      // OPEN WHATSAPP
      // ======================================================

      window.location.href =
        whatsappURL;


    } catch (error) {

      // ======================================================
      // FIREBASE ERROR
      // ======================================================

      console.error(
        "MEMBERSHIP SUBMISSION ERROR:",
        error
      );


      let errorMessage =
        "Sorry, your application could not be submitted.";


      if (
        error &&
        error.code ===
        "PERMISSION_DENIED"
      ) {

        errorMessage =
          "Firebase rejected the submission. Please check your Realtime Database Rules.";

      }


      if (
        error &&
        error.message
      ) {

        console.error(
          "Firebase error message:",
          error.message
        );

      }


      showMessage(
        errorMessage,
        "error"
      );


    } finally {

      setLoading(false);

    }

  }
);

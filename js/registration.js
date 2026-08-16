// ============================================================
// BARYAN BADMINTON CLUB
// MEMBERSHIP REGISTRATION
// Firebase Realtime Database + WhatsApp
// ============================================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {

  apiKey: "AIzaSyCuHXXUB5aYqlGfEs3lMMvFwNdqHIpT29E",

  authDomain:
    "baryan-5f81d.firebaseapp.com",

  databaseURL:
    "https://baryan-5f81d-default-rtdb.firebaseio.com",

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


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ============================================================
// YOUR WHATSAPP NUMBER
// ============================================================

const WHATSAPP_NUMBER = "256755805092";


// ============================================================
// GET FORM
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
// SHOW / HIDE JUNIOR INFORMATION
// ============================================================

if (membershipCategory && juniorSection) {

  membershipCategory.addEventListener(
    "change",
    () => {

      if (
        membershipCategory.value === "Junior"
      ) {

        juniorSection.hidden = false;

      } else {

        juniorSection.hidden = true;

        document.getElementById(
          "guardianName"
        ).value = "";

        document.getElementById(
          "guardianPhone"
        ).value = "";

      }

    }
  );

}


// ============================================================
// FORM SUBMISSION
// ============================================================

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    // ========================================================
    // HONEYPOT
    // ========================================================

    const honeypot =
      document.getElementById(
        "website"
      ).value.trim();

    if (honeypot !== "") {

      return;

    }


    // ========================================================
    // BROWSER VALIDATION
    // ========================================================

    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


    // ========================================================
    // LOADING STATE
    // ========================================================

    submitButton.disabled = true;

    submitText.hidden = true;

    submitLoading.hidden = false;

    formMessage.textContent = "";

    formMessage.className =
      "form-message";


    try {


      // ======================================================
      // COLLECT FORM DATA
      // ======================================================

      const registration = {

        fullName:
          document
            .getElementById("fullName")
            .value
            .trim(),

        dateOfBirth:
          document
            .getElementById("dateOfBirth")
            .value,

        gender:
          document
            .getElementById("gender")
            .value,

        phone:
          document
            .getElementById("phone")
            .value
            .trim(),

        whatsapp:
          document
            .getElementById("whatsapp")
            .value
            .trim(),

        email:
          document
            .getElementById("email")
            .value
            .trim(),

        membershipCategory:
          document
            .getElementById(
              "membershipCategory"
            )
            .value,

        skillLevel:
          document
            .getElementById("skillLevel")
            .value,

        trainingSession:
          document
            .getElementById(
              "trainingSession"
            )
            .value,

        experience:
          document
            .getElementById("experience")
            .value
            .trim(),

        guardianName:
          document
            .getElementById("guardianName")
            .value
            .trim(),

        guardianPhone:
          document
            .getElementById("guardianPhone")
            .value
            .trim(),

        emergencyName:
          document
            .getElementById("emergencyName")
            .value
            .trim(),

        emergencyPhone:
          document
            .getElementById("emergencyPhone")
            .value
            .trim(),

        submittedAt:
          new Date().toISOString()

      };


      // ======================================================
      // SAVE TO REALTIME DATABASE
      // ======================================================

      const registrationsRef =
        ref(
          database,
          "registrations"
        );


      const newRegistration =
        push(registrationsRef);


      await set(
        newRegistration,
        {

          ...registration,

          createdAt:
            serverTimestamp()

        }
      );


      // ======================================================
      // CREATE WHATSAPP MESSAGE
      // ======================================================

      const message = `

🏸 *BARYAN BADMINTON CLUB*

*NEW MEMBERSHIP APPLICATION*

━━━━━━━━━━━━━━━━━━

👤 *PERSONAL INFORMATION*

Name:
${registration.fullName}

Date of Birth:
${registration.dateOfBirth}

Gender:
${registration.gender}

━━━━━━━━━━━━━━━━━━

📞 *CONTACT DETAILS*

Phone:
${registration.phone}

WhatsApp:
${registration.whatsapp || "Not provided"}

Email:
${registration.email}

━━━━━━━━━━━━━━━━━━

🏸 *MEMBERSHIP DETAILS*

Category:
${registration.membershipCategory}

Skill Level:
${registration.skillLevel}

Training Session:
${registration.trainingSession}

Badminton Experience:
${registration.experience || "Not provided"}

━━━━━━━━━━━━━━━━━━

👨‍👩‍👧 *PARENT / GUARDIAN*

Name:
${registration.guardianName || "Not applicable"}

Phone:
${registration.guardianPhone || "Not applicable"}

━━━━━━━━━━━━━━━━━━

🚨 *EMERGENCY CONTACT*

Name:
${registration.emergencyName}

Phone:
${registration.emergencyPhone}

━━━━━━━━━━━━━━━━━━

📅 *APPLICATION*

Submitted:
${new Date().toLocaleString()}

Registration ID:
${newRegistration.key}

━━━━━━━━━━━━━━━━━━

*BARYAN BADMINTON CLUB*

Train. Compete. Improve. Belong.

`;


      // ======================================================
      // CREATE WHATSAPP LINK
      // ======================================================

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);


      // ======================================================
      // SUCCESS MESSAGE
      // ======================================================

      formMessage.textContent =
        "Application submitted successfully. Opening WhatsApp...";

      formMessage.classList.add(
        "success"
      );


      // ======================================================
      // OPEN WHATSAPP
      // ======================================================

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );


      // ======================================================
      // RESET FORM
      // ======================================================

      form.reset();

      if (juniorSection) {

        juniorSection.hidden = true;

      }


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      // ======================================================
      // ERROR
      // ======================================================

      formMessage.textContent =
        "Registration failed. Please try again.";

      formMessage.classList.add(
        "error"
      );


    } finally {

      submitButton.disabled = false;

      submitText.hidden = false;

      submitLoading.hidden = true;

    }

  }
);

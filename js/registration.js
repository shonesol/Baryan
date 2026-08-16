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
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCuHXXUB5aYqlGfEs3lMMvFwNdqHIpT29E",
  authDomain: "baryan-5f81d.firebaseapp.com",
  projectId: "baryan-5f81d",
  storageBucket: "baryan-5f81d.firebasestorage.app",
  messagingSenderId: "409395363296",
  appId: "1:409395363296:web:f20c12dfb4c738361cbf85",
  measurementId: "G-J1RCHQN6XN",

  // IMPORTANT:
  // Replace this with the exact Realtime Database URL
  // shown in Firebase Console > Realtime Database.
  databaseURL: "https://baryan-5f81d-default-rtdb.firebaseio.com"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ============================================================
// FORM ELEMENTS
// ============================================================

const form = document.getElementById("membershipForm");

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
// SHOW / HIDE JUNIOR SECTION
// ============================================================

membershipCategory.addEventListener("change", () => {

  const isJunior =
    membershipCategory.value === "Junior";

  juniorSection.hidden = !isJunior;

});


// ============================================================
// HELPERS
// ============================================================

function getValue(id) {

  const element = document.getElementById(id);

  return element ? element.value.trim() : "";

}


function showMessage(message, type = "success") {

  formMessage.textContent = message;

  formMessage.className =
    `form-message ${type}`;

}


function setLoading(loading) {

  submitButton.disabled = loading;

  submitText.hidden = loading;

  submitLoading.hidden = !loading;

}


// ============================================================
// FORM SUBMISSION
// ============================================================

form.addEventListener("submit", async (event) => {

  event.preventDefault();


  // ----------------------------------------------------------
  // HONEYPOT
  // ----------------------------------------------------------

  const website =
    getValue("website");

  if (website !== "") {

    // Silently ignore bots
    return;

  }


  // ----------------------------------------------------------
  // HTML VALIDATION
  // ----------------------------------------------------------

  if (!form.checkValidity()) {

    form.reportValidity();

    return;

  }


  setLoading(true);

  showMessage("", "success");


  try {

    // ========================================================
    // COLLECT APPLICATION
    // ========================================================

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


    // ========================================================
    // SAVE TO FIREBASE REALTIME DATABASE
    // ========================================================

    const applicationsRef =
      ref(database, "membershipApplications");

    const newApplication =
      push(applicationsRef);

    await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js")
      .then(({ set }) => {

        return set(
          newApplication,
          application
        );

      });


    // ========================================================
    // CREATE WHATSAPP MESSAGE
    // ========================================================

    const message = `

🏸 *NEW BARYAN BADMINTON CLUB MEMBERSHIP APPLICATION*

━━━━━━━━━━━━━━━━━━

👤 *PERSONAL INFORMATION*

Name: ${application.fullName}

Date of Birth: ${application.dateOfBirth}

Gender: ${application.gender}


📞 *CONTACT DETAILS*

Phone: ${application.phone}

WhatsApp: ${application.whatsapp || "Not provided"}

Email: ${application.email}


🏸 *MEMBERSHIP DETAILS*

Category: ${application.membershipCategory}

Skill Level: ${application.skillLevel}

Training Session: ${application.trainingSession}


📝 *BADMINTON EXPERIENCE*

${application.experience || "Not provided"}


👨‍👩‍👧 *PARENT / GUARDIAN*

Name: ${application.guardianName || "Not applicable"}

Phone: ${application.guardianPhone || "Not applicable"}


🚨 *EMERGENCY CONTACT*

Name: ${application.emergencyName}

Phone: ${application.emergencyPhone}


✅ Agreement: ${application.agreed ? "Accepted" : "Not accepted"}

━━━━━━━━━━━━━━━━━━

🏸 Baryan Badminton Club
New Membership Application

Firebase ID:
${newApplication.key}

`.trim();


    // ========================================================
    // WHATSAPP NUMBER
    // ========================================================

    const whatsappNumber =
      "256755805092";


    // ========================================================
    // WHATSAPP URL
    // ========================================================

    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    // ========================================================
    // SUCCESS MESSAGE
    // ========================================================

    showMessage(
      "Application submitted successfully. Opening WhatsApp...",
      "success"
    );


    // ========================================================
    // OPEN WHATSAPP
    // ========================================================

    window.location.href =
      whatsappURL;


    // ========================================================
    // RESET FORM
    // ========================================================

    form.reset();

    juniorSection.hidden = true;


  } catch (error) {

    console.error(
      "Membership submission error:",
      error
    );


    showMessage(
      "Sorry, your application could not be submitted. Please try again.",
      "error"
    );


  } finally {

    setLoading(false);

  }

});

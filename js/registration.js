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
  apiKey: "AIzaSyCuHXXUB5aYqlGfEs3lMMvFwNdqHIpT29E",
  authDomain: "baryan-5f81d.firebaseapp.com",
  projectId: "baryan-5f81d",
  storageBucket: "baryan-5f81d.firebasestorage.app",
  messagingSenderId: "409395363296",
  appId: "1:409395363296:web:f20c12dfb4c738361cbf85",
  measurementId: "G-J1RCHQN6XN",

  databaseURL:
    "https://baryan-5f81d-default-rtdb.firebaseio.com"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


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
// CHECK ELEMENTS
// ============================================================

if (!form) {
  console.error("membershipForm was not found.");
}

if (!submitButton) {
  console.error("submitButton was not found.");
}


// ============================================================
// JUNIOR SECTION
// ============================================================

if (membershipCategory) {

  membershipCategory.addEventListener("change", () => {

    const isJunior =
      membershipCategory.value === "Junior";

    juniorSection.hidden = !isJunior;

  });

}


// ============================================================
// HELPERS
// ============================================================

function getValue(id) {

  const element =
    document.getElementById(id);

  return element
    ? element.value.trim()
    : "";

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

  console.log("Membership form submitted.");


  // ==========================================================
  // HONEYPOT
  // ==========================================================

  const website =
    getValue("website");

  if (website !== "") {

    console.warn("Spam submission blocked.");

    return;

  }


  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!form.checkValidity()) {

    form.reportValidity();

    return;

  }


  setLoading(true);

  showMessage(
    "Submitting your application...",
    "success"
  );


  try {

    // ========================================================
    // APPLICATION DATA
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
    // FIREBASE
    // ========================================================

    console.log(
      "Saving application to Firebase..."
    );


    const applicationsRef =
      ref(
        database,
        "membershipApplications"
      );


    const newApplication =
      push(applicationsRef);


    await set(
      newApplication,
      application
    );


    console.log(
      "Firebase save successful:",
      newApplication.key
    );


    // ========================================================
    // WHATSAPP MESSAGE
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


✅ Agreement:
${application.agreed ? "Accepted" : "Not accepted"}

━━━━━━━━━━━━━━━━━━

🏸 Baryan Badminton Club

Firebase ID:
${newApplication.key}

`.trim();


    // ========================================================
    // WHATSAPP
    // ========================================================

    const whatsappNumber =
      "256755805092";


    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    // ========================================================
    // SUCCESS
    // ========================================================

    showMessage(
      "Application saved successfully. Opening WhatsApp...",
      "success"
    );


    // ========================================================
    // OPEN WHATSAPP
    // ========================================================

    window.location.href =
      whatsappURL;


  } catch (error) {

    // ========================================================
    // FIREBASE ERROR
    // ========================================================

    console.error(
      "FULL FIREBASE ERROR:",
      error
    );


    console.error(
      "Error code:",
      error.code
    );


    console.error(
      "Error message:",
      error.message
    );


    let message =
      "Submission failed.";


    if (
      error.code ===
      "PERMISSION_DENIED"
    ) {

      message =
        "Firebase permission denied. Please check your Realtime Database rules.";

    }

    else if (
      error.code ===
      "NETWORK_ERROR"
    ) {

      message =
        "Network error. Please check your internet connection.";

    }

    else if (
      error.message &&
      error.message.includes("databaseURL")
    ) {

      message =
        "Firebase database URL is incorrect.";

    }

    else {

      message =
        `Submission failed: ${error.message || "Unknown Firebase error"}`;

    }


    showMessage(
      message,
      "error"
    );


  } finally {

    setLoading(false);

  }

});

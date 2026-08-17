// ============================================================
// BARYAN BADMINTON CLUB
// MEMBERSHIP REGISTRATION
// FIREBASE REALTIME DATABASE + WHATSAPP
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
// MAKE SURE FORM EXISTS
// ============================================================

if (!form) {

  console.error(
    "membershipForm was not found."
  );

  throw new Error(
    "membershipForm was not found."
  );

}


// ============================================================
// JUNIOR SECTION
// ============================================================

if (
  membershipCategory &&
  juniorSection
) {

  membershipCategory.addEventListener(
    "change",
    () => {

      juniorSection.hidden =
        membershipCategory.value !== "Junior";

    }
  );

}


// ============================================================
// GET INPUT VALUE
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

  formMessage.textContent =
    message;

  formMessage.className =
    `form-message ${type}`;

}


// ============================================================
// LOADING
// ============================================================

function setLoading(loading) {

  submitButton.disabled =
    loading;

  submitText.hidden =
    loading;

  submitLoading.hidden =
    !loading;

}


// ============================================================
// SUBMIT FORM
// ============================================================

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    console.log(
      "MEMBERSHIP FORM SUBMITTED"
    );


    // ========================================================
    // HONEYPOT
    // ========================================================

    const website =
      getValue("website");

    if (website !== "") {

      console.warn(
        "Bot detected."
      );

      return;

    }


    // ========================================================
    // VALIDATION
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
      // GET AGREEMENT
      // ======================================================

      const agreementElement =
        document.getElementById("agree");


      const agreed =
        agreementElement
          ? agreementElement.checked
          : false;


      // ======================================================
      // CREATE APPLICATION
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
          agreed,

        createdAt:
          serverTimestamp()

      };


      console.log(
        "Application created:",
        application
      );


      // ======================================================
      // FIREBASE REFERENCE
      // ======================================================

      const applicationsRef =
        ref(
          database,
          "membershipApplications"
        );


      // ======================================================
      // AUTOMATIC ID
      // ======================================================

      const newApplication =
        push(applicationsRef);


      console.log(
        "Firebase ID:",
        newApplication.key
      );


      // ======================================================
      // SAVE APPLICATION
      // ======================================================

      await set(
        newApplication,
        application
      );


      console.log(
        "APPLICATION SAVED SUCCESSFULLY"
      );


      // ======================================================
      // WHATSAPP MESSAGE
      // ======================================================

      const whatsappMessage = `

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

🏸 BARYAN BADMINTON CLUB

Firebase ID:
${newApplication.key}

`.trim();


      // ======================================================
      // WHATSAPP
      // ======================================================

      const whatsappNumber =
        "256755805092";


      const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(
          whatsappMessage
        );


      // ======================================================
      // SUCCESS
      // ======================================================

      showMessage(
        "Application submitted successfully!",
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

      setTimeout(
        () => {

          window.location.href =
            whatsappURL;

        },
        500
      );


    } catch (error) {

      console.error(
        "MEMBERSHIP ERROR:",
        error
      );


      // ======================================================
      // SHOW ACTUAL ERROR
      // ======================================================

      showMessage(
        "Submission failed: " +
        error.message,
        "error"
      );


    } finally {

      setLoading(false);

    }

  }
);

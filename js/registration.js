import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  firebaseConfig,
  emailjsConfig,
  clubConfig
} from "./config.js";


/* -----------------------------
   FIREBASE
----------------------------- */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* -----------------------------
   EMAILJS
----------------------------- */

const emailScript = document.createElement("script");

emailScript.src =
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

emailScript.onload = () => {
  emailjs.init({
    publicKey: emailjsConfig.publicKey
  });
};

document.head.appendChild(emailScript);


/* -----------------------------
   FORM
----------------------------- */

const form = document.getElementById("membershipForm");

const submitButton =
  document.getElementById("submitButton");

const submitText =
  document.getElementById("submitText");

const submitLoading =
  document.getElementById("submitLoading");

const formMessage =
  document.getElementById("formMessage");

const category =
  document.getElementById("membershipCategory");

const juniorSection =
  document.getElementById("juniorSection");


/* -----------------------------
   JUNIOR FIELDS
----------------------------- */

category.addEventListener("change", () => {

  const isJunior =
    category.value === "Junior";

  juniorSection.hidden = !isJunior;

});


/* -----------------------------
   MESSAGE
----------------------------- */

function showMessage(message, type) {

  formMessage.textContent = message;

  formMessage.className =
    `form-message ${type}`;

}


/* -----------------------------
   LOADING
----------------------------- */

function setLoading(loading) {

  submitButton.disabled = loading;

  submitText.hidden = loading;
  submitLoading.hidden = !loading;

}


/* -----------------------------
   WHATSAPP
----------------------------- */

function createWhatsAppLink(data) {

  const message =
    `Hello Baryan Badminton Club,%0A%0A` +
    `I have submitted a membership application.%0A%0A` +
    `Name: ${encodeURIComponent(data.fullName)}%0A` +
    `Membership: ${encodeURIComponent(data.membershipCategory)}%0A` +
    `Skill level: ${encodeURIComponent(data.skillLevel)}%0A%0A` +
    `Please let me know the next steps.`;

  return `https://wa.me/${clubConfig.whatsappNumber}?text=${message}`;
}


/* -----------------------------
   EMAILJS
----------------------------- */

async function sendEmailNotification(data) {

  if (
    !emailjsConfig.publicKey ||
    emailjsConfig.publicKey.includes("YOUR_")
  ) {
    console.warn(
      "EmailJS is not configured yet."
    );

    return;
  }

  await emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.templateId,
    {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      membership_category:
        data.membershipCategory,
      skill_level: data.skillLevel,
      training_session:
        data.trainingSession,
      experience: data.experience,
      guardian_name:
        data.guardianName,
      guardian_phone:
        data.guardianPhone,
      emergency_name:
        data.emergencyName,
      emergency_phone:
        data.emergencyPhone
    }
  );
}


/* -----------------------------
   FORM SUBMISSION
----------------------------- */

form.addEventListener("submit", async (event) => {

  event.preventDefault();


  /* Honeypot */

  const honeypot =
    form.elements.website.value.trim();

  if (honeypot !== "") {
    return;
  }


  /* Browser validation */

  if (!form.checkValidity()) {

    form.reportValidity();

    showMessage(
      "Please complete all required fields.",
      "error"
    );

    return;
  }


  setLoading(true);

  showMessage("", "");


  const formData =
    new FormData(form);


  const data = {

    fullName:
      formData.get("fullName").trim(),

    dateOfBirth:
      formData.get("dateOfBirth"),

    gender:
      formData.get("gender"),

    phone:
      formData.get("phone").trim(),

    whatsapp:
      formData.get("whatsapp").trim(),

    email:
      formData.get("email").trim(),

    membershipCategory:
      formData.get("membershipCategory"),

    skillLevel:
      formData.get("skillLevel"),

    trainingSession:
      formData.get("trainingSession"),

    experience:
      formData.get("experience").trim(),

    guardianName:
      formData.get("guardianName").trim(),

    guardianPhone:
      formData.get("guardianPhone").trim(),

    emergencyName:
      formData.get("emergencyName").trim(),

    emergencyPhone:
      formData.get("emergencyPhone").trim(),

    status:
      "pending"

  };


  try {

    /* -----------------------------
       SAVE TO FIREBASE
    ----------------------------- */

    await addDoc(
      collection(
        db,
        "membershipApplications"
      ),
      {
        ...data,
        createdAt:
          serverTimestamp()
      }
    );


    /* -----------------------------
       EMAIL NOTIFICATION
    ----------------------------- */

    try {

      await sendEmailNotification(data);

    } catch (emailError) {

      console.error(
        "EmailJS error:",
        emailError
      );

      /*
        Firebase registration has already
        succeeded, so we don't tell the
        applicant that the entire process
        failed.
      */

    }


    /* -----------------------------
       SUCCESS
    ----------------------------- */

    showMessage(
      "Application submitted successfully. " +
      "Club management will contact you with the next steps.",
      "success"
    );


    form.reset();

    juniorSection.hidden = true;


    /* -----------------------------
       WHATSAPP BUTTON
    ----------------------------- */

    const whatsappLink =
      createWhatsAppLink(data);

    const existing =
      document.getElementById(
        "whatsappSuccess"
      );

    if (existing) {
      existing.remove();
    }


    const whatsappButton =
      document.createElement("a");

    whatsappButton.id =
      "whatsappSuccess";

    whatsappButton.href =
      whatsappLink;

    whatsappButton.target =
      "_blank";

    whatsappButton.rel =
      "noopener noreferrer";

    whatsappButton.className =
      "whatsapp-button";

    whatsappButton.textContent =
      "Continue on WhatsApp";


    formMessage.after(
      whatsappButton
    );


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    showMessage(
      "We couldn't submit your application. " +
      "Please check your internet connection and try again.",
      "error"
    );

  } finally {

    setLoading(false);

  }

});

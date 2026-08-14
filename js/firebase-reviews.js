<script type="module">

  import {
    initializeApp
  } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
  } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


  /* ================================================
     YOUR FIREBASE CONFIG
  ================================================ */

  const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_PROJECT.firebasestorage.app",

    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

    appId: "YOUR_APP_ID"

  };


  const app =
    initializeApp(firebaseConfig);

  const db =
    getFirestore(app);


  /* ================================================
     ELEMENTS
  ================================================ */

  const reviewTrack =
    document.getElementById("reviewTrack");

  const reviewDots =
    document.getElementById("reviewDots");

  const reviewPrev =
    document.getElementById("reviewPrev");

  const reviewNext =
    document.getElementById("reviewNext");

  const reviewForm =
    document.getElementById("reviewForm");

  const reviewSubmit =
    document.getElementById("reviewSubmit");

  const reviewStatus =
    document.getElementById("reviewStatus");


  let reviews = [];

  let currentReview = 0;

  let autoSlide;


  /* ================================================
     LOAD REVIEWS FROM FIREBASE
  ================================================ */

  async function loadReviews() {

    try {

      const reviewsQuery = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(reviewsQuery);

      reviews = [];

      snapshot.forEach(documentSnapshot => {

        reviews.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        });

      });


      renderReviews();

    } catch (error) {

      console.error(
        "Error loading reviews:",
        error
      );

      reviewTrack.innerHTML = `
        <div class="reviews-loading">
          Reviews could not be loaded.
        </div>
      `;

    }

  }


  /* ================================================
     DISPLAY REVIEWS
  ================================================ */

  function renderReviews() {

    if (reviews.length === 0) {

      reviewTrack.innerHTML = `
        <div class="reviews-loading">
          No reviews yet. Be the first to review BBA!
        </div>
      `;

      reviewDots.innerHTML = "";

      return;

    }


    reviewTrack.innerHTML =
      reviews.map(review => {

        const rating =
          Number(review.rating) || 5;

        const stars =
          "★".repeat(rating) +
          "☆".repeat(5 - rating);

        return `

          <article class="review-card">

            <div class="review-stars">
              ${stars}
            </div>

            <p class="review-message">
              “${escapeHTML(review.message)}”
            </p>

            <strong class="review-name">
              ${escapeHTML(review.name)}
            </strong>

            <span class="review-role">
              ${escapeHTML(review.role || "BBA Member")}
            </span>

          </article>

        `;

      }).join("");


    reviewDots.innerHTML =
      reviews.map((_, index) => `

        <button
          type="button"
          class="review-dot ${
            index === 0 ? "active" : ""
          }"
          data-index="${index}"
          aria-label="Go to review ${index + 1}"
        ></button>

      `).join("");


    document
      .querySelectorAll(".review-dot")
      .forEach(dot => {

        dot.addEventListener(
          "click",
          () => {

            goToReview(
              Number(dot.dataset.index)
            );

            restartAutoSlide();

          }
        );

      });


    currentReview = 0;

    updateSlider();

    startAutoSlide();

  }


  /* ================================================
     SLIDE
  ================================================ */

  function updateSlider() {

    if (!reviews.length) {
      return;
    }

    reviewTrack.style.transform =
      `translateX(-${currentReview * 100}%)`;


    document
      .querySelectorAll(".review-dot")
      .forEach((dot, index) => {

        dot.classList.toggle(
          "active",
          index === currentReview
        );

      });

  }


  function goToReview(index) {

    if (!reviews.length) {
      return;
    }

    currentReview =
      (index + reviews.length) %
      reviews.length;

    updateSlider();

  }


  reviewNext.addEventListener(
    "click",
    () => {

      goToReview(
        currentReview + 1
      );

      restartAutoSlide();

    }
  );


  reviewPrev.addEventListener(
    "click",
    () => {

      goToReview(
        currentReview - 1
      );

      restartAutoSlide();

    }
  );


  /* ================================================
     AUTOMATIC SLIDE
  ================================================ */

  function startAutoSlide() {

    clearInterval(autoSlide);

    if (reviews.length <= 1) {
      return;
    }

    autoSlide = setInterval(() => {

      goToReview(
        currentReview + 1
      );

    }, 5000);

  }


  function restartAutoSlide() {

    startAutoSlide();

  }


  /* ================================================
     SUBMIT REVIEW
  ================================================ */

  reviewForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      reviewSubmit.disabled = true;

      reviewSubmit.textContent =
        "SUBMITTING...";

      reviewStatus.textContent = "";


      const name =
        document
          .getElementById("reviewName")
          .value
          .trim();

      const role =
        document
          .getElementById("reviewRole")
          .value;

      const rating =
        Number(
          document.querySelector(
            'input[name="rating"]:checked'
          ).value
        );

      const message =
        document
          .getElementById("reviewMessage")
          .value
          .trim();


      try {

        await addDoc(
          collection(db, "reviews"),
          {

            name: name,

            role: role,

            rating: rating,

            message: message,

            createdAt: serverTimestamp()

          }
        );


        reviewStatus.textContent =
          "Thank you! Your review has been submitted.";

        reviewStatus.style.color =
          "#168a45";


        reviewForm.reset();


        await loadReviews();


      } catch (error) {

        console.error(
          "Error submitting review:",
          error
        );

        reviewStatus.textContent =
          "Sorry, your review could not be submitted. Please try again.";

        reviewStatus.style.color =
          "#d32f2f";

      }


      reviewSubmit.disabled = false;

      reviewSubmit.textContent =
        "SUBMIT REVIEW";

    }
  );


  /* ================================================
     SECURITY: ESCAPE USER CONTENT
  ================================================ */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* ================================================
     START
  ================================================ */

  loadReviews();

</script>

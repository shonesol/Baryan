<script type="module">

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain:
    "YOUR_PROJECT.firebaseapp.com",

  projectId:
    "YOUR_PROJECT_ID",

  storageBucket:
    "YOUR_PROJECT.firebasestorage.app",

  messagingSenderId:
    "YOUR_MESSAGING_SENDER_ID",

  appId:
    "YOUR_APP_ID"

};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);


/* =====================================================
   ELEMENTS
===================================================== */

const reviewTrack =
  document.getElementById(
    "reviewTrack"
  );

const reviewDots =
  document.getElementById(
    "reviewDots"
  );

const reviewPrev =
  document.getElementById(
    "reviewPrev"
  );

const reviewNext =
  document.getElementById(
    "reviewNext"
  );

const reviewForm =
  document.getElementById(
    "reviewForm"
  );

const reviewName =
  document.getElementById(
    "reviewName"
  );

const reviewRole =
  document.getElementById(
    "reviewRole"
  );

const reviewMessage =
  document.getElementById(
    "reviewMessage"
  );

const reviewRating =
  document.getElementById(
    "reviewRating"
  );

const reviewStatus =
  document.getElementById(
    "reviewStatus"
  );

const reviewSubmit =
  document.getElementById(
    "reviewSubmit"
  );

const ratingStars =
  document.querySelectorAll(
    ".rating-star"
  );


let reviews = [];
let currentReview = 0;
let autoSlide;


/* =====================================================
   STAR RATING
===================================================== */

ratingStars.forEach(
  star => {

    star.addEventListener(
      "click",
      () => {

        const rating =
          Number(
            star.dataset.rating
          );

        reviewRating.value =
          rating;


        ratingStars.forEach(
          item => {

            item.classList.toggle(
              "selected",
              Number(
                item.dataset.rating
              ) <= rating
            );

          }
        );

      }
    );

  }
);


/* =====================================================
   LOAD REVIEWS
===================================================== */

async function loadReviews() {

  try {

    const reviewsQuery =
      query(

        collection(
          db,
          "reviews"
        ),

        where(
          "approved",
          "==",
          true
        ),

        orderBy(
          "createdAt",
          "desc"
        )

      );


    const snapshot =
      await getDocs(
        reviewsQuery
      );


    reviews = [];


    snapshot.forEach(
      doc => {

        reviews.push({

          id: doc.id,

          ...doc.data()

        });

      }
    );


    displayReviews();


  } catch (error) {

    console.error(
      error
    );


    reviewTrack.innerHTML = `
      <div class="reviews-loading">
        Unable to load reviews.
      </div>
    `;

  }

}


/* =====================================================
   DISPLAY REVIEWS
===================================================== */

function displayReviews() {

  if (!reviews.length) {

    reviewTrack.innerHTML = `
      <div class="reviews-loading">
        No reviews yet. Be the first to review BBA!
      </div>
    `;

    return;

  }


  reviewTrack.innerHTML =
    reviews.map(
      review => {

        const rating =
          Math.min(
            5,
            Math.max(
              1,
              Number(
                review.rating || 5
              )
            )
          );


        const stars =
          "★".repeat(rating) +
          "☆".repeat(5 - rating);


        const name =
          review.name ||
          "BBA Member";


        const role =
          review.role ||
          "BBA Community";


        const message =
          review.message ||
          "";


        const initials =
          name
            .split(" ")
            .map(
              word =>
                word.charAt(0)
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();


        return `

          <article class="review-card">

            <div class="review-stars">
              ${stars}
            </div>

            <p class="review-text">
              “${escapeHTML(message)}”
            </p>

            <div class="review-author">

              <div class="review-avatar">
                ${escapeHTML(initials)}
              </div>

              <div>

                <strong>
                  ${escapeHTML(name)}
                </strong>

                <span>
                  ${escapeHTML(role)}
                </span>

              </div>

            </div>

          </article>

        `;

      }
    ).join("");


  createDots();

  showReview(0);

  startAutoSlide();

}


/* =====================================================
   CREATE DOTS
===================================================== */

function createDots() {

  reviewDots.innerHTML = "";


  reviews.forEach(
    (review, index) => {

      const dot =
        document.createElement(
          "button"
        );


      dot.type = "button";

      dot.className =
        "review-dot";


      dot.setAttribute(
        "aria-label",
        `Show review ${index + 1}`
      );


      dot.addEventListener(
        "click",
        () => {

          showReview(index);

        }
      );


      reviewDots.appendChild(
        dot
      );

    }
  );

}


/* =====================================================
   SHOW REVIEW
===================================================== */

function showReview(index) {

  if (!reviews.length) {
    return;
  }


  currentReview =
    (index + reviews.length) %
    reviews.length;


  reviewTrack.style.transform =
    `translateX(-${currentReview * 100}%)`;


  document
    .querySelectorAll(
      ".review-dot"
    )
    .forEach(
      (dot, index) => {

        dot.classList.toggle(
          "active",
          index === currentReview
        );

      }
    );

}


/* =====================================================
   NEXT / PREVIOUS
===================================================== */

reviewNext.addEventListener(
  "click",
  () => {

    showReview(
      currentReview + 1
    );

    restartAutoSlide();

  }
);


reviewPrev.addEventListener(
  "click",
  () => {

    showReview(
      currentReview - 1
    );

    restartAutoSlide();

  }
);


/* =====================================================
   AUTO SLIDER
===================================================== */

function startAutoSlide() {

  clearInterval(
    autoSlide
  );


  autoSlide =
    setInterval(
      () => {

        showReview(
          currentReview + 1
        );

      },
      5000
    );

}


function restartAutoSlide() {

  startAutoSlide();

}


/* =====================================================
   SUBMIT REVIEW TO FIREBASE
===================================================== */

reviewForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const name =
      reviewName.value.trim();


    const role =
      reviewRole.value;


    const rating =
      Number(
        reviewRating.value
      );


    const message =
      reviewMessage.value.trim();


    /* Validate rating */

    if (rating < 1 || rating > 5) {

      reviewStatus.textContent =
        "Please select a rating.";

      reviewStatus.className =
        "review-status error";

      return;

    }


    /* Disable button */

    reviewSubmit.disabled =
      true;

    reviewSubmit.textContent =
      "SUBMITTING...";


    try {

      await addDoc(
        collection(
          db,
          "reviews"
        ),
        {

          name: name,

          role: role,

          rating: rating,

          message: message,

          approved: false,

          createdAt:
            serverTimestamp()

        }
      );


      reviewForm.reset();


      reviewRating.value =
        "0";


      ratingStars.forEach(
        star => {

          star.classList.remove(
            "selected"
          );

        }
      );


      reviewStatus.textContent =
        "Thank you! Your review has been submitted and is awaiting approval.";

      reviewStatus.className =
        "review-status success";


    } catch (error) {

      console.error(
        "Review submission error:",
        error
      );


      reviewStatus.textContent =
        "Something went wrong. Please try again.";

      reviewStatus.className =
        "review-status error";

    }


    reviewSubmit.disabled =
      false;

    reviewSubmit.textContent =
      "SUBMIT REVIEW";

  }
);


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =====================================================
   START
===================================================== */

loadReviews();

</script>

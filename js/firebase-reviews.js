import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs
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
   REVIEW ELEMENTS
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


let currentReview = 0;
let reviews = [];
let autoSlide;


/* =====================================================
   LOAD REVIEWS FROM FIREBASE
===================================================== */

async function loadReviews() {

  try {

    const reviewsQuery = query(

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
      document => {

        reviews.push({

          id: document.id,

          ...document.data()

        });

      }
    );


    displayReviews();


  } catch (error) {

    console.error(
      "Error loading reviews:",
      error
    );


    reviewTrack.innerHTML = `

      <div class="reviews-loading">

        Reviews are currently unavailable.

      </div>

    `;

  }

}


/* =====================================================
   CREATE REVIEW CARDS
===================================================== */

function displayReviews() {

  if (!reviews.length) {

    reviewTrack.innerHTML = `

      <div class="reviews-loading">

        No reviews available yet.

      </div>

    `;

    return;

  }


  reviewTrack.innerHTML =
    reviews.map(
      review => {


        const rating =
          Math.max(
            1,
            Math.min(
              5,
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


  createReviewDots();

  showReview(0);

  startAutoSlide();

}


/* =====================================================
   CREATE DOTS
===================================================== */

function createReviewDots() {

  reviewDots.innerHTML = "";


  reviews.forEach(
    (review, index) => {

      const dot =
        document.createElement(
          "button"
        );


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
   AUTO SLIDE
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
   SECURITY
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

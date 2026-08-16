<!-- =====================================================
     WHATSAPP REVIEWS
===================================================== -->

<script>

  /* =====================================================
     GET ELEMENTS
  ===================================================== */

  const reviewForm =
    document.getElementById("reviewForm");

  const reviewSubmit =
    document.getElementById("reviewSubmit");

  const reviewStatus =
    document.getElementById("reviewStatus");


  /* =====================================================
     WHATSAPP NUMBER
  ===================================================== */

  const academyWhatsApp =
    "256755805092";


  /* =====================================================
     SUBMIT REVIEW
  ===================================================== */

  reviewForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      /* -----------------------------------------------
         GET RATING
      ----------------------------------------------- */

      const ratingInput =
        document.querySelector(
          'input[name="rating"]:checked'
        );


      if (!ratingInput) {

        reviewStatus.textContent =
          "Please select a rating.";

        reviewStatus.style.color =
          "#d32f2f";

        return;

      }


      /* -----------------------------------------------
         GET FORM VALUES
      ----------------------------------------------- */

      const name =
        document
          .getElementById("reviewName")
          .value
          .trim();


      const role =
        document
          .getElementById("reviewRole")
          .value;


      const message =
        document
          .getElementById("reviewMessage")
          .value
          .trim();


      const rating =
        Number(
          ratingInput.value
        );


      /* -----------------------------------------------
         VALIDATION
      ----------------------------------------------- */

      if (
        !name ||
        !role ||
        !message
      ) {

        reviewStatus.textContent =
          "Please complete all fields.";

        reviewStatus.style.color =
          "#d32f2f";

        return;

      }


      if (
        name.length > 60
      ) {

        reviewStatus.textContent =
          "Your name is too long.";

        reviewStatus.style.color =
          "#d32f2f";

        return;

      }


      if (
        message.length > 500
      ) {

        reviewStatus.textContent =
          "Your review is too long.";

        reviewStatus.style.color =
          "#d32f2f";

        return;

      }


      if (
        rating < 1 ||
        rating > 5
      ) {

        reviewStatus.textContent =
          "Please select a valid rating.";

        reviewStatus.style.color =
          "#d32f2f";

        return;

      }


      /* -----------------------------------------------
         CREATE STARS
      ----------------------------------------------- */

      const stars =
        "★".repeat(rating) +
        "☆".repeat(5 - rating);


      /* -----------------------------------------------
         CURRENT DATE
      ----------------------------------------------- */

      const submittedAt =
        new Date().toLocaleString(
          "en-UG",
          {
            dateStyle: "medium",
            timeStyle: "short"
          }
        );


      /* -----------------------------------------------
         CREATE WHATSAPP MESSAGE
      ----------------------------------------------- */

      const whatsappMessage = `

🏸 BARYAN BADMINTON ACADEMY

⭐ NEW REVIEW

👤 Name:
${name}

🎯 Role:
${role}

⭐ Rating:
${stars} (${rating}/5)

💬 Review:
${message}

📅 Submitted:
${submittedAt}

      `.trim();


      /* -----------------------------------------------
         CREATE WHATSAPP URL
      ----------------------------------------------- */

      const whatsappURL =
        "https://wa.me/" +
        academyWhatsApp +
        "?text=" +
        encodeURIComponent(
          whatsappMessage
        );


      /* -----------------------------------------------
         UPDATE BUTTON
      ----------------------------------------------- */

      reviewSubmit.disabled =
        true;

      reviewSubmit.textContent =
        "OPENING WHATSAPP...";


      reviewStatus.textContent =
        "Opening WhatsApp with your review...";

      reviewStatus.style.color =
        "#0757c9";


      /* -----------------------------------------------
         OPEN WHATSAPP
      ----------------------------------------------- */

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );


      /* -----------------------------------------------
         RESET
      ----------------------------------------------- */

      setTimeout(
        () => {

          reviewForm.reset();

          reviewSubmit.disabled =
            false;

          reviewSubmit.textContent =
            "SUBMIT REVIEW";

          reviewStatus.textContent =
            "Your review has been prepared in WhatsApp. Please press Send.";

          reviewStatus.style.color =
            "#0757c9";

        },
        1000
      );

    }
  );

</script>

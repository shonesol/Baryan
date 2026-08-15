document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // ELEMENTS
  // =========================
  const filterButtons = document.querySelectorAll(".filter-button");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  let currentIndex = 0;
  let visibleItems = [];


  // =========================
  // FILTER FUNCTION
  // =========================
  function filterGallery(category) {
    galleryItems.forEach(item => {
      const itemCategory = item.getAttribute("data-category");

      if (category === "all" || itemCategory === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    // Update the list of currently visible items
    visibleItems = Array.from(galleryItems).filter(item => {
      return item.style.display !== "none";
    });
  }


  // =========================
  // FILTER BUTTONS
  // =========================
  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const category = this.getAttribute("data-filter");
      filterGallery(category);
    });
  });


  // =========================
  // OPEN LIGHTBOX
  // =========================
  function openLightbox(index) {
    const item = visibleItems[index];
    if (!item) return;

    const imgSrc = item.getAttribute("data-image");
    const title = item.getAttribute("data-title");

    lightboxImage.src = imgSrc;
    lightboxCaption.textContent = title;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    currentIndex = index;
  }


  // =========================
  // CLOSE LIGHTBOX
  // =========================
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }


  // =========================
  // NEXT / PREVIOUS
  // =========================
  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }


  // =========================
  // CLICK ON GALLERY ITEMS
  // =========================
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      // Recalculate visible items in case filters are active
      visibleItems = Array.from(galleryItems).filter(el => {
        return el.style.display !== "none";
      });

      // Find the index of the clicked item inside visible items
      const clickedIndex = visibleItems.indexOf(item);
      openLightbox(clickedIndex);
    });
  });


  // =========================
  // LIGHTBOX CONTROLS
  // =========================
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);


  // Close when clicking outside the image
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });


  // =========================
  // KEYBOARD SUPPORT
  // =========================
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") {
      closeLightbox();
    }
    if (e.key === "ArrowRight") {
      showNext();
    }
    if (e.key === "ArrowLeft") {
      showPrev();
    }
  });


  // =========================
  // INITIAL STATE
  // =========================
  filterGallery("all");

});

(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const year = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const video = document.getElementById("hero-video");

  if (year) year.textContent = String(new Date().getFullYear());

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealEls = document.querySelectorAll(".value, .project-card, .team-member");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 50}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  if (form && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.classList.remove("success");
      if (!form.checkValidity()) {
        form.reportValidity();
        formStatus.textContent = "Please complete the required fields.";
        return;
      }
      formStatus.textContent = "Thanks — we’ll get back to you shortly.";
      formStatus.classList.add("success");
      form.reset();
    });
  }

  // Squarespace-hosted HLS hero video
  if (video) {
    const src =
      "https://video.squarespace-cdn.com/content/v1/697e9ed5e4ae2b3832beac6e/b2e42f22-c357-4285-bc34-910cdb531b34/playlist.m3u8";

    function playSafe() {
      const play = video.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playSafe);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", playSafe);
    }
  }

  // Project gallery lightbox with prev/next
  const galleryButtons = Array.from(document.querySelectorAll(".project-gallery-item"));
  const coverPanel = document.querySelector(".project-cover-panel");
  const coverImg = coverPanel?.querySelector("img");

  if (galleryButtons.length || coverImg) {
    const slides = [];
    if (coverImg) {
      slides.push({
        src: coverImg.getAttribute("src") || coverImg.src,
        alt: coverImg.alt || "",
      });
    }
    galleryButtons.forEach((btn) => {
      const img = btn.querySelector("img");
      slides.push({
        src: btn.dataset.full || img?.getAttribute("src") || img?.src || "",
        alt: img?.alt || "",
      });
    });

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
      <button class="lightbox-nav prev" type="button" aria-label="Previous image">‹</button>
      <img alt="" />
      <button class="lightbox-nav next" type="button" aria-label="Next image">›</button>
      <p class="lightbox-caption"></p>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-nav.prev");
    const nextBtn = lightbox.querySelector(".lightbox-nav.next");
    let currentIndex = 0;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      const slide = slides[currentIndex];
      lightboxImg.src = slide.src;
      lightboxImg.alt = slide.alt;
      caption.textContent = `${currentIndex + 1} / ${slides.length}`;
    }

    function openLightbox(index) {
      showSlide(index);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
    }

    if (coverPanel && coverImg) {
      coverPanel.addEventListener("click", () => openLightbox(0));
    }

    galleryButtons.forEach((btn, i) => {
      const index = coverImg ? i + 1 : i;
      btn.addEventListener("click", () => openLightbox(index));
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      showSlide(currentIndex - 1);
    });
    nextBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      showSlide(currentIndex + 1);
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
      if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    });
  }
})();

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

  // Project gallery lightbox
  const galleryButtons = document.querySelectorAll(".project-gallery-item");
  if (galleryButtons.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img alt="" />';
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
    }

    galleryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(btn.dataset.full || btn.querySelector("img")?.src, btn.querySelector("img")?.alt);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }
})();

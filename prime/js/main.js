(function () {
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const header = document.querySelector(".site-header");
  const year = document.getElementById("year");
  const forms = document.querySelectorAll("form[data-thanks]");

  if (year) year.textContent = String(new Date().getFullYear());

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  forms.forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = "Please complete the required fields.";
        return;
      }
      if (status) status.textContent = form.dataset.thanks || "Thanks — we’ll be in touch shortly.";
      form.reset();
    });
  });

  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (reveals.length) {
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );

      reveals.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.07}s`;
        io.observe(el);
      });
    }
  }

  const projectButtons = Array.from(
    document.querySelectorAll("button.project-card[data-full], button.project-card")
  );

  if (!projectButtons.length) return;

  const slides = projectButtons.map((btn) => {
    const img = btn.querySelector("img");
    const name = btn.querySelector("strong")?.textContent?.trim() || img?.alt || "";
    const detail = btn.querySelector(".meta span")?.textContent?.trim() || "";
    return {
      src: btn.dataset.full || img?.src || "",
      alt: img?.alt || name,
      caption: detail ? `${name} — ${detail}` : name,
    };
  });

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Project image");
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
    <button class="lightbox-nav prev" type="button" aria-label="Previous image">‹</button>
    <div class="lightbox-figure">
      <img alt="" />
      <p class="lightbox-caption"></p>
    </div>
    <button class="lightbox-nav next" type="button" aria-label="Next image">›</button>
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox-caption");
  let index = 0;

  function show(i) {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    img.src = slide.src;
    img.alt = slide.alt;
    caption.textContent = `${slide.caption} · ${index + 1} / ${slides.length}`;
  }

  function openAt(i) {
    show(i);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    img.src = "";
  }

  projectButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => openAt(i));
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", (e) => {
    e.stopPropagation();
    show(index - 1);
  });
  lightbox.querySelector(".lightbox-nav.next").addEventListener("click", (e) => {
    e.stopPropagation();
    show(index + 1);
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();

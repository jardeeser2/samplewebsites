(function () {
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const year = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (year) year.textContent = String(new Date().getFullYear());

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

  if (form && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
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

  const items = Array.from(document.querySelectorAll(".portfolio-item"));
  if (!items.length) return;

  const slides = items.map((btn) => ({
    src: btn.dataset.full || btn.querySelector("img")?.src || "",
    alt: btn.querySelector("img")?.alt || "",
    caption: btn.querySelector("span")?.textContent || "",
  }));

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

  const img = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox-caption");
  let index = 0;

  function show(i) {
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    img.src = slide.src;
    img.alt = slide.alt;
    caption.textContent = `${slide.caption} · ${index + 1} / ${slides.length}`;
  }

  function open(i) {
    show(i);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    img.src = "";
  }

  items.forEach((btn, i) => btn.addEventListener("click", () => open(i)));
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

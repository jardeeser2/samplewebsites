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
      formStatus.textContent = "Thanks — call us at (509) 758-4000 and we’ll take it from there.";
      form.reset();
    });
  }

  const main = document.getElementById("gallery-main");
  const thumbs = Array.from(document.querySelectorAll(".gallery-thumb"));
  if (!main || !thumbs.length) return;

  function select(btn) {
    const src = btn.dataset.full || btn.querySelector("img")?.src || "";
    const alt = btn.querySelector("img")?.alt || "";
    main.src = src;
    main.alt = alt;
    thumbs.forEach((thumb) => thumb.classList.toggle("is-active", thumb === btn));
  }

  thumbs.forEach((btn) => btn.addEventListener("click", () => select(btn)));
})();

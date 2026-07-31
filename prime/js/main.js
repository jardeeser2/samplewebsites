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

  const hero = document.querySelector("[data-hero-rotate]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-media img"));
    const dotsWrap = hero.querySelector(".hero-dots");
    let index = Math.max(
      0,
      slides.findIndex((img) => img.classList.contains("is-active"))
    );
    let timer = null;

    if (slides.length > 1) {
      if (!slides.some((img) => img.classList.contains("is-active"))) {
        slides[0].classList.add("is-active");
        index = 0;
      }

      const dots = slides.map((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", `Show image ${i + 1}`);
        btn.addEventListener("click", () => goTo(i));
        dotsWrap?.appendChild(btn);
        return btn;
      });

      function paint() {
        slides.forEach((img, i) => img.classList.toggle("is-active", i === index));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      }

      function goTo(i) {
        index = (i + slides.length) % slides.length;
        paint();
        start();
      }

      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function start() {
        stop();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        timer = window.setInterval(() => {
          index = (index + 1) % slides.length;
          paint();
        }, 5000);
      }

      paint();
      start();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
        else start();
      });
    }
  }

  const projectButtons = Array.from(document.querySelectorAll("button.project-card[data-slug]"));
  if (!projectButtons.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Project gallery");
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
  let galleries = null;
  let slides = [];
  let index = 0;
  let projectTitle = "";
  let activeSlug = "";

  function show(i) {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    const src = slides[index];
    img.src = src;
    img.alt = `${projectTitle} photo ${index + 1}`;
    caption.textContent = `${projectTitle} · ${index + 1} / ${slides.length}`;
  }

  function setProjectParam(slug) {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("project", slug);
    else url.searchParams.delete("project");
    window.history.replaceState({}, "", url);
  }

  function openGallery(title, images, slug) {
    projectTitle = title;
    activeSlug = slug || "";
    slides = images.slice();
    show(0);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (activeSlug) setProjectParam(activeSlug);
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    img.src = "";
    slides = [];
    if (activeSlug) setProjectParam("");
    activeSlug = "";
  }

  async function ensureGalleries() {
    if (galleries) return galleries;
    const res = await fetch("/prime/assets/projects/galleries.json");
    const data = await res.json();
    galleries = Object.fromEntries(data.map((p) => [p.slug, p]));
    return galleries;
  }

  async function openBySlug(slug) {
    if (!slug) return false;
    try {
      const map = await ensureGalleries();
      const project = map[slug];
      if (!project || !project.images?.length) return false;
      const card = document.querySelector(`button.project-card[data-slug="${slug}"]`);
      if (card) card.scrollIntoView({ block: "center", behavior: "smooth" });
      openGallery(project.title, project.images, slug);
      return true;
    } catch (err) {
      return false;
    }
  }

  projectButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const opened = await openBySlug(btn.dataset.slug);
      if (opened) return;
      const fallback = btn.querySelector(".media img");
      if (fallback) openGallery(fallback.alt || "Project", [fallback.src], btn.dataset.slug);
    });
  });

  const requested = new URLSearchParams(window.location.search).get("project");
  if (requested) openBySlug(requested);

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

const GALLERY = [
  {
    src: "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Yellow excavator at work on a dusty job site",
  },
  {
    src: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Excavator arm digging into earth",
  },
  {
    src: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Heavy equipment grading a construction site",
  },
  {
    src: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Excavator digging a deep trench",
  },
  {
    src: "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Orange excavator parked on site",
  },
  {
    src: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Active construction and earthwork",
  },
  {
    src: "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Wide view of a busy excavation site",
  },
  {
    src: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Excavator silhouette against the sky",
  },
  {
    src: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Machinery working on rocky ground",
  },
  {
    src: "https://images.pexels.com/photos/209271/pexels-photo-209271.jpeg?auto=compress&cs=tinysrgb&w=1600",
    thumb: "https://images.pexels.com/photos/209271/pexels-photo-209271.jpeg?auto=compress&cs=tinysrgb&w=700",
    alt: "Close-up of an excavator bucket",
  },
];

const galleryGrid = document.getElementById("gallery-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const yearEl = document.getElementById("year");
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

let currentIndex = 0;

function buildGallery() {
  const fragment = document.createDocumentFragment();

  GALLERY.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.setAttribute("aria-label", `Open larger view: ${item.alt}`);
    button.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = item.thumb;
    img.alt = item.alt;
    img.loading = "lazy";

    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(index));
    fragment.appendChild(button);
  });

  galleryGrid.appendChild(fragment);
}

function openLightbox(index) {
  currentIndex = index;
  const item = GALLERY[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxCaption.textContent = `${currentIndex + 1} / ${GALLERY.length}`;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("is-open"));
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  window.setTimeout(() => {
    if (!lightbox.classList.contains("is-open")) {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }
  }, 280);
}

function showAdjacent(delta) {
  currentIndex = (currentIndex + delta + GALLERY.length) % GALLERY.length;
  const item = GALLERY[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxCaption.textContent = `${currentIndex + 1} / ${GALLERY.length}`;
}

function setupLightbox() {
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", () => showAdjacent(-1));
  lightbox.querySelector(".lightbox-nav.next").addEventListener("click", () => showAdjacent(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showAdjacent(-1);
    if (event.key === "ArrowRight") showAdjacent(1);
  });
}

function setupReveal() {
  const targets = document.querySelectorAll(".service, .gallery-item");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    observer.observe(el);
  });
}

function setupForm() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.classList.remove("success", "error");

    if (!form.checkValidity()) {
      formStatus.textContent = "Please fill out every field so I can get back to you.";
      formStatus.classList.add("error");
      form.reportValidity();
      return;
    }

    formStatus.textContent = "Thanks — message received. I’ll call you back soon.";
    formStatus.classList.add("success");
    form.reset();
  });
}

yearEl.textContent = String(new Date().getFullYear());
buildGallery();
setupLightbox();
setupReveal();
setupForm();

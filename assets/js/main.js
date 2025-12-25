/* =========================
   MENU SHOW / HIDE (Mobile)
   ========================= */
(function () {
  const toggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!toggle || !navMenu) return;

  // Accessibility: toggle should reflect expanded state
  toggle.setAttribute("aria-controls", "nav-menu");
  toggle.setAttribute("aria-expanded", "false");

  const openMenu = () => {
    navMenu.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    navMenu.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("show");
    isOpen ? closeMenu() : openMenu();
  });

  // Close when clicking any nav link
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Optional: Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Optional: Close when clicking outside the menu (mobile)
  document.addEventListener("click", (e) => {
    const clickedInside = navMenu.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });
})();

/* =========================
   ACTIVE LINK ON SCROLL
   (IntersectionObserver + fallback)
   ========================= */
(function () {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  if (!sections.length) return;

  const links = new Map();
  document.querySelectorAll('.nav__menu a[href^="#"]').forEach((a) => {
    const id = a.getAttribute("href")?.slice(1);
    if (id) links.set(id, a);
  });

  const setActive = (id) => {
    links.forEach((a) => a.classList.remove("active-link"));
    const target = links.get(id);
    if (target) target.classList.add("active-link");
  };

  // Preferred: IntersectionObserver (efficient)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        root: null,
        threshold: [0.25, 0.4, 0.6],
        rootMargin: "-30% 0px -55% 0px",
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return;
  }

  // Fallback: scroll listener (your original approach, improved + null-safe)
  const onScroll = () => {
    const scrollDown = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute("id");

      if (!sectionId) return;

      if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
        setActive(sectionId);
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* =========================
   SCROLL REVEAL ANIMATION
   ========================= */
(function () {
  if (typeof ScrollReveal === "undefined") return;

  // Defaults (reset is false by default in ScrollReveal) [web:187]
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 1200,
    delay: 120,
    reset: false,
    cleanup: true, // only meaningful when reset is false [web:184]
    mobile: true,
    desktop: true,
  });

  sr.reveal(".home__data, .about__img, .skills__subtitle, .skills__text", { interval: 100 });
  sr.reveal(".about__subtitle, .about__text, .skills__img", { delay: 200 });
  sr.reveal(".home__social-icon", { interval: 120, origin: "left" });
  sr.reveal(".skills__data, .work__img, .contact__input", { interval: 120 });
})();

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Lightbox
  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    const mediaHost = lightbox.querySelector("[data-lightbox-media]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");

    const close = () => {
      lightbox.hidden = true;
      mediaHost.innerHTML = "";
      document.body.style.overflow = "";
    };

    const openImage = (src, alt, cap) => {
      mediaHost.innerHTML = "";
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt || "";
      mediaHost.appendChild(img);
      caption.textContent = cap || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn?.focus();
    };

    const openYoutube = (id) => {
      mediaHost.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
      iframe.title = "Greenkeep trailer";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      mediaHost.appendChild(iframe);
      caption.textContent = "Greenkeep — official intro trailer (2:30)";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn?.focus();
    };

    document.querySelectorAll("[data-lightbox-src]").forEach((el) => {
      el.addEventListener("click", () => {
        openImage(el.getAttribute("data-lightbox-src"), el.getAttribute("data-lightbox-alt"), el.getAttribute("data-lightbox-caption"));
      });
    });

    document.querySelectorAll("[data-trailer-yt]").forEach((el) => {
      el.addEventListener("click", () => openYoutube(el.getAttribute("data-trailer-yt")));
    });

    closeBtn?.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) close();
    });
  }

  // Gallery filters
  const chips = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-tag]");
  if (chips.length && items.length) {
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter");
        chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        items.forEach((item) => {
          const tag = item.getAttribute("data-tag");
          item.hidden = !(filter === "all" || tag === filter);
        });
      });
    });
  }

  // Hero teaser: pause when offscreen
  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideo && "IntersectionObserver" in window) {
    const vio = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      },
      { threshold: 0.2 }
    );
    vio.observe(heroVideo);
  }
})();

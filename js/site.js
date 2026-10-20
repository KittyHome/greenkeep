(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tryPlay = (video) => {
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

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
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Lightbox (images)
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

    document.querySelectorAll("[data-lightbox-src]").forEach((el) => {
      el.addEventListener("click", () => {
        openImage(
          el.getAttribute("data-lightbox-src"),
          el.getAttribute("data-lightbox-alt"),
          el.getAttribute("data-lightbox-caption")
        );
      });
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

  // Autoplay videos when visible (muted required by browsers)
  document.querySelectorAll("[data-autoplay-video]").forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");

    if (reduceMotion) {
      video.removeAttribute("autoplay");
      return;
    }

    if ("IntersectionObserver" in window) {
      const vio = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (entry.isIntersecting) tryPlay(video);
          else video.pause();
        },
        { threshold: 0.35 }
      );
      vio.observe(video);
    } else {
      tryPlay(video);
    }
  });

  // Sound toggles for embedded HD trailer
  document.querySelectorAll("[data-sound-toggle]").forEach((btn) => {
    const sel = btn.getAttribute("data-sound-toggle");
    const video = sel ? document.querySelector(sel) : btn.closest(".player")?.querySelector("video");
    if (!video) return;

    const sync = () => {
      const on = !video.muted && video.volume > 0;
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "Sound on" : "Sound off";
    };

    sync();
    btn.addEventListener("click", () => {
      video.muted = !video.muted;
      if (!video.muted) {
        video.volume = 1;
        tryPlay(video);
      }
      sync();
    });
  });

  // Scroll-to-trailer CTAs
  document.querySelectorAll("[data-scroll-trailer]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = document.querySelector("#trailer");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      const video = target.querySelector("video");
      if (video) tryPlay(video);
    });
  });
})();

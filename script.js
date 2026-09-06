const reel = document.querySelector(".reel-video");
const placeholder = document.querySelector(".reel-placeholder");
const reelSources = [
  "https://pub-78fa8c0adab8468b8dca433e4bf8f4a2.r2.dev/Ethan%20Reel%20Compressed.mp4",
  "assets/reel.mp4",
  "assets/Ethan Smith´s Reel May 2026.mov",
];
let reelSourceIndex = 0;

if (reel) {
  reel.src = reelSources[reelSourceIndex];
  reel.muted = true;
  reel.loop = true;
  reel.autoplay = true;
  reel.playsInline = true;

  reel.addEventListener("loadedmetadata", () => {
    reel.style.display = "block";
    placeholder?.setAttribute("hidden", "");
    reel.play().catch(() => {
      placeholder?.removeAttribute("hidden");
    });
  });

  reel.addEventListener("error", () => {
    reelSourceIndex += 1;

    if (reelSourceIndex < reelSources.length) {
      reel.src = reelSources[reelSourceIndex];
      reel.load();
      return;
    }

    reel.removeAttribute("src");
  });
}

const flipWord = document.querySelector(".flip-word");
const descriptors = ["tell", "design", "build", "create"];
let descriptorIndex = 0;

if (flipWord) {
  window.setInterval(() => {
    descriptorIndex = (descriptorIndex + 1) % descriptors.length;
    flipWord.classList.remove("is-changing");

    window.requestAnimationFrame(() => {
      flipWord.textContent = descriptors[descriptorIndex];
      flipWord.classList.add("is-changing");
    });
  }, 2600);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mediaCarousel = document.querySelector('[data-carousel="media"]');
const productCarousel = document.querySelector('[data-carousel="product"]');

const updateCarouselDepth = (carousel) => {
  if (!carousel) {
    return;
  }

  const carouselCenter = window.innerWidth / 2;

  carousel.querySelectorAll(".carousel-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(carouselCenter - cardCenter);
    const strength = Math.max(0, 1 - distance / (carousel.clientWidth * 0.58));
    const scale = 0.84 + strength * 0.18;
    const opacity = 0.56 + strength * 0.44;

    card.style.setProperty("--card-scale", scale.toFixed(3));
    card.style.setProperty("--card-opacity", opacity.toFixed(3));
  });
};

if (mediaCarousel) {
  const originalCards = Array.from(mediaCarousel.children);

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    const clonedVideo = clone.querySelector(".reel-video");

    if (clonedVideo) {
      clonedVideo.src = reelSources[0];
      clonedVideo.muted = true;
      clonedVideo.loop = true;
      clonedVideo.autoplay = true;
      clonedVideo.playsInline = true;
    }

    clone.setAttribute("aria-hidden", "true");
    mediaCarousel.appendChild(clone);
  });

  let mediaAnimationFrame = null;

  const tickMediaCarousel = () => {
    updateCarouselDepth(mediaCarousel);
    mediaAnimationFrame = window.requestAnimationFrame(tickMediaCarousel);
  };

  mediaAnimationFrame = window.requestAnimationFrame(tickMediaCarousel);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(mediaAnimationFrame);
  });
}

if (productCarousel) {
  const originalCards = Array.from(productCarousel.children);

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.remove("is-focused");
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    productCarousel.appendChild(clone);
  });
}

document.querySelectorAll(".media-card video").forEach((video) => {
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.play().catch(() => {});
});

const productCards = document.querySelectorAll("[data-case-target]");
const casePanels = document.querySelectorAll("[data-case-panel]");
let activeCase = document.querySelector("[data-case-target].is-focused")?.dataset.caseTarget || "limer";

const setActiveCase = (target, options = {}) => {
  const { scrollCard = true } = options;
  const nextPanel = document.querySelector(`[data-case-panel="${target}"]`);
  const nextCard = document.querySelector(`[data-case-target="${target}"]`);

  if (!nextPanel || !nextCard || activeCase === target) {
    return;
  }

  activeCase = target;

  productCards.forEach((card) => {
    card.classList.toggle("is-focused", card.dataset.caseTarget === target);
  });

  casePanels.forEach((panel) => {
    if (!panel.classList.contains("is-active")) {
      panel.hidden = panel.dataset.casePanel !== target;
      return;
    }

    panel.classList.add("is-fading");
    window.setTimeout(() => {
      panel.hidden = true;
      panel.classList.remove("is-active", "is-fading");
      nextPanel.hidden = false;

      window.requestAnimationFrame(() => {
        nextPanel.classList.add("is-active");
      });
    }, 180);
  });

  if (scrollCard) {
    nextCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  updateCarouselDepth(productCarousel);
};

productCards.forEach((card) => {
  card.addEventListener("click", () => setActiveCase(card.dataset.caseTarget));
});

const stepProduct = (direction, options = {}) => {
  const cards = Array.from(productCards);
  const index = cards.findIndex((card) => card.dataset.caseTarget === activeCase);
  const nextIndex = (index + direction + cards.length) % cards.length;
  setActiveCase(cards[nextIndex].dataset.caseTarget, options);
};

window.setInterval(() => {
  if (!productCards.length || reduceMotion.matches) {
    return;
  }

  stepProduct(1, { scrollCard: false });
}, 6200);

updateCarouselDepth(productCarousel);

const contactButton = document.querySelector(".nav-cta");
const contactModal = document.querySelector("#contact-modal");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
let lastFocusedElement = null;

if (contactButton && contactModal) {
  const openContactModal = () => {
    lastFocusedElement = document.activeElement;
    contactModal.hidden = false;
    contactButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    contactModal.querySelector(".contact-close")?.focus();
  };

  const closeContactModal = () => {
    contactModal.hidden = true;
    contactButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
  };

  contactButton.addEventListener("click", openContactModal);
  contactCloseButtons.forEach((button) => {
    button.addEventListener("click", closeContactModal);
  });

  document.addEventListener("keydown", (event) => {
    if (contactModal.hidden || event.key !== "Escape") {
      return;
    }

    closeContactModal();
  });
}

window.addEventListener("resize", () => {
  updateCarouselDepth(mediaCarousel);
  updateCarouselDepth(productCarousel);
});

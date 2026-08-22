const reel = document.querySelector(".reel-video");
const placeholder = document.querySelector(".reel-placeholder");
const reelSources = [
  "https://pub-78fa8c0adab8468b8dca433e4bf8f4a2.r2.dev/Ethan%20Reel%20Compressed.mp4",
  "assets/reel.mp4",
  "assets/Ethan Smith´s Reel May 2026.mov",
];
let reelSourceIndex = 0;
const appScreen = document.querySelector(".app-screen");
const phoneDots = document.querySelectorAll(".phone-dots span");
const phonePrev = document.querySelector(".phone-control-prev");
const phoneNext = document.querySelector(".phone-control-next");
const contactButton = document.querySelector(".nav-cta");
const contactModal = document.querySelector("#contact-modal");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
let lastFocusedElement = null;

if (reel) {
  reel.src = reelSources[reelSourceIndex];
  reel.muted = true;
  reel.loop = true;
  reel.autoplay = true;
  reel.playsInline = true;

  reel.addEventListener("loadedmetadata", () => {
    reel.style.display = "block";
    if (placeholder) {
      placeholder.style.display = "none";
    }
    reel.play().catch(() => {
      if (placeholder) {
        placeholder.style.display = "";
      }
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

if (appScreen && phoneDots.length) {
  const updatePhoneDots = () => {
    const activeIndex = Math.round(appScreen.scrollLeft / appScreen.clientWidth);

    phoneDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const scrollPhone = (direction) => {
    const activeIndex = Math.round(appScreen.scrollLeft / appScreen.clientWidth);
    const nextIndex = (activeIndex + direction + phoneDots.length) % phoneDots.length;

    appScreen.scrollTo({
      left: nextIndex * appScreen.clientWidth,
      behavior: "smooth",
    });
  };

  appScreen.addEventListener("scroll", updatePhoneDots, { passive: true });
  phonePrev?.addEventListener("click", () => scrollPhone(-1));
  phoneNext?.addEventListener("click", () => scrollPhone(1));
  updatePhoneDots();
}

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

const proximityCards = document.querySelectorAll(".award-card, .note-card, .skill-card, .visual-card, .case-study-card, .case-mini-card, .case-step");
const canAnimateCards = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const proximityRadius = 210;
let pointerPosition = null;
let cardAnimationFrame = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const resetProximityCard = (card) => {
  card.classList.remove("is-near");
  card.style.setProperty("--card-rotate-x", "0deg");
  card.style.setProperty("--card-rotate-y", "0deg");
  card.style.setProperty("--card-lift", "0px");
};

const updateProximityCards = () => {
  cardAnimationFrame = null;

  proximityCards.forEach((card) => {
    if (!pointerPosition) {
      resetProximityCard(card);
      return;
    }

    const rect = card.getBoundingClientRect();
    const nearestX = clamp(pointerPosition.x, rect.left, rect.right);
    const nearestY = clamp(pointerPosition.y, rect.top, rect.bottom);
    const distance = Math.hypot(pointerPosition.x - nearestX, pointerPosition.y - nearestY);
    const strength = clamp(1 - distance / proximityRadius, 0, 1);

    if (!strength) {
      resetProximityCard(card);
      return;
    }

    const x = clamp((pointerPosition.x - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
    const y = clamp((pointerPosition.y - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);

    card.classList.add("is-near");
    card.style.setProperty("--card-rotate-x", `${(-y * strength * 4).toFixed(2)}deg`);
    card.style.setProperty("--card-rotate-y", `${(x * strength * 4).toFixed(2)}deg`);
    card.style.setProperty("--card-lift", `${(-strength * 4).toFixed(2)}px`);
  });
};

const queueProximityCardsUpdate = () => {
  if (!cardAnimationFrame) {
    cardAnimationFrame = window.requestAnimationFrame(updateProximityCards);
  }
};

if (proximityCards.length && canAnimateCards.matches && !reduceMotion.matches) {
  proximityCards.forEach((card) => {
    card.classList.add("proximity-card");
  });

  document.addEventListener("pointermove", (event) => {
    pointerPosition = { x: event.clientX, y: event.clientY };
    queueProximityCardsUpdate();
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    pointerPosition = null;
    queueProximityCardsUpdate();
  });

  document.addEventListener("scroll", queueProximityCardsUpdate, { passive: true });
}

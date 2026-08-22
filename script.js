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
const viewTriggers = document.querySelectorAll("[data-view-trigger]");
const portfolioViews = document.querySelectorAll("[data-portfolio-view]");
const mediaFollowups = document.querySelectorAll(".media-followup");
const sharedContent = document.querySelectorAll(".shared-content");
const productTabs = document.querySelectorAll("[data-project-tab]");
const productPanels = document.querySelectorAll("[data-project-panel]");
const sharedLinks = document.querySelectorAll("[data-shared-link]");
const contactButton = document.querySelector(".nav-cta");
const contactModal = document.querySelector("#contact-modal");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
let lastFocusedElement = null;
let refreshPhoneDots = () => {};

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
  refreshPhoneDots = () => {
    if (!appScreen.clientWidth) {
      return;
    }

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

  appScreen.addEventListener("scroll", refreshPhoneDots, { passive: true });
  phonePrev?.addEventListener("click", () => scrollPhone(-1));
  phoneNext?.addEventListener("click", () => scrollPhone(1));
  refreshPhoneDots();
}

const projectHashMap = {
  "#limer": "limer",
  "#case-study-496": "496",
  "#case-process": "496",
  "#case-study-flatline": "flatline",
  "#flatline-decisions": "flatline",
};

const mediaHashes = new Set(["#reel", "#awards", "#field-notes", "#visuals", "#reflections"]);
const productHashes = new Set(["#product-projects", ...Object.keys(projectHashMap)]);

const setSharedContentVisibility = (show) => {
  sharedContent.forEach((section) => {
    section.hidden = !show;
  });
};

const setMediaFollowupVisibility = (show) => {
  mediaFollowups.forEach((section) => {
    section.hidden = !show;
  });
};

const activateProjectTab = (project, options = {}) => {
  const { scroll = true } = options;
  const activePanel = document.querySelector(`[data-project-panel="${project}"]`);

  if (!activePanel) {
    return;
  }

  productTabs.forEach((tab) => {
    const isActive = tab.dataset.projectTab === project;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  productPanels.forEach((panel) => {
    const isActive = panel.dataset.projectPanel === project;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  if (project === "limer") {
    window.requestAnimationFrame(refreshPhoneDots);
  }

  if (scroll) {
    activePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const showPortfolioView = (view, options = {}) => {
  const { scroll = true, targetHash = "" } = options;
  const isMedia = view === "media";
  const isProduct = view === "product";

  if (!isMedia && !isProduct) {
    return;
  }

  document.body.classList.add("has-active-view");
  document.body.dataset.activeView = view;

  portfolioViews.forEach((portfolioView) => {
    portfolioView.hidden = portfolioView.dataset.portfolioView !== view;
  });

  setSharedContentVisibility(true);
  setMediaFollowupVisibility(isMedia);

  viewTriggers.forEach((trigger) => {
    const isActive = trigger.dataset.viewTrigger === view;
    trigger.classList.toggle("is-active", isActive);
    trigger.toggleAttribute("aria-current", isActive);
  });

  if (isProduct) {
    activateProjectTab(projectHashMap[targetHash] || "limer", { scroll: false });
  }

  if (scroll) {
    const target = targetHash ? document.querySelector(targetHash) : document.querySelector(isProduct ? "#product-projects" : "#reel");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

viewTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    showPortfolioView(trigger.dataset.viewTrigger);
  });
});

productTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const panel = document.querySelector(`[data-project-panel="${tab.dataset.projectTab}"]`);

    if (panel?.id) {
      window.history.pushState(null, "", `#${panel.id}`);
    }

    showPortfolioView("product", { scroll: false });
    activateProjectTab(tab.dataset.projectTab);
  });
});

sharedLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!document.body.dataset.activeView) {
      event.preventDefault();
      window.history.pushState(null, "", "#skills");
      showPortfolioView("media", { targetHash: "#skills" });
    }
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');

  if (!link) {
    return;
  }

  const hash = link.getAttribute("href");

  if (!hash || hash === "#top" || hash === "#skills") {
    return;
  }

  if (productHashes.has(hash)) {
    event.preventDefault();
    window.history.pushState(null, "", hash);
    showPortfolioView("product", { scroll: false, targetHash: hash });
    activateProjectTab(projectHashMap[hash] || "limer", { scroll: hash !== "#product-projects" });

    if (hash === "#product-projects") {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  if (mediaHashes.has(hash)) {
    event.preventDefault();
    window.history.pushState(null, "", hash);
    showPortfolioView("media", { targetHash: hash });
  }
});

const scrollToHash = (hash) => {
  window.requestAnimationFrame(() => {
    document.querySelector(hash)?.scrollIntoView({ block: "start" });
  });
};

const hydrateViewFromHash = () => {
  const hash = window.location.hash;

  if (productHashes.has(hash)) {
    showPortfolioView("product", { scroll: false, targetHash: hash });
    activateProjectTab(projectHashMap[hash] || "limer", { scroll: false });
    scrollToHash(hash);
    return;
  }

  if (mediaHashes.has(hash)) {
    showPortfolioView("media", { scroll: false, targetHash: hash });
    scrollToHash(hash);
    return;
  }

  if (hash === "#skills") {
    showPortfolioView("media", { scroll: false, targetHash: hash });
    scrollToHash(hash);
  }
};

hydrateViewFromHash();

window.addEventListener("hashchange", hydrateViewFromHash);

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

const proximityCards = document.querySelectorAll(".award-card, .note-card, .skill-card, .visual-card, .case-mini-card, .case-panel, .decision-card, .case-step, .service-architecture-grid article");
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

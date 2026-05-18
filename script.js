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

const cards = document.querySelectorAll(".award-card, .note-card");

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

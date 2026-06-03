// about.js
console.log("About JS loaded (enhanced)");

document.addEventListener("DOMContentLoaded", () => {
  const aboutIcon = document.getElementById("aboutApp");
  const aboutPopup = document.getElementById("aboutPopup");
  const closeAbout = document.getElementById("closeAbout");

  if (!aboutIcon || !aboutPopup || !closeAbout) {
    console.warn("About JS: required elements missing");
    return;
  }

  if (aboutIcon && aboutPopup && closeAbout) {
  aboutIcon.addEventListener("click", () => {
    aboutPopup.classList.remove("hiding");
    aboutPopup.classList.add("show");
  });

  closeAbout.addEventListener("click", () => {
    aboutPopup.classList.add("hiding");
    setTimeout(() => {
      aboutPopup.classList.remove("show", "hiding");
    }, 600); // match the aboutExit duration
  });
}

  // Open popup (remove any "hidden" class, add "show")
  aboutIcon.addEventListener("click", () => {
    aboutPopup.classList.remove("hidden");
    // small timeout ensures CSS transition sees the class change
    requestAnimationFrame(() => aboutPopup.classList.add("show"));
  });

  // Close popup: remove "show", then add "hidden" after animation finishes
  function hideAboutPopup() {
    aboutPopup.classList.remove("show");
    // wait for CSS transition to finish before marking hidden (600ms matches CSS)
    setTimeout(() => aboutPopup.classList.add("hidden"), 620);
  }

  closeAbout.addEventListener("click", () => {
  aboutPopup.classList.add("hiding");
  setTimeout(() => {
    aboutPopup.classList.remove("show", "hiding");
  }, 800);
});

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aboutPopup.classList.contains("show")) {
      hideAboutPopup();
    }
  });
});

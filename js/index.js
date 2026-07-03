// index.js

window.showBlur = function() {
  const backdrop = document.getElementById("globalModalBackdrop");
  if (backdrop) {
    backdrop.classList.remove("hidden");
    void backdrop.offsetWidth; // force repaint
    backdrop.classList.add("active");
  }
};

window.hideBlur = function() {
  const backdrop = document.getElementById("globalModalBackdrop");
  if (backdrop) {
    backdrop.classList.remove("active");
    backdrop.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", () => {

  console.log("NoirWave Android-style home screen loaded.");

  // ===============================
  // Theme Toggle
  // ===============================
  const themeButton = document.getElementById("themeToggle");

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
      } else {
        themeButton.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeButton) {
      themeButton.textContent = "☀️ Light Mode";
    }
  }

  // ===============================
  // App Grid Interactions
  // ===============================
  const calcIcon = document.getElementById("calculatorApp");
  if (calcIcon) {
    calcIcon.addEventListener("click", () => {
      if (window.noirCalc) window.noirCalc.toggle();
    });
  }

  // ===============================
  // NoirWave Animation Manager
  // ===============================
  const animations = ["balls", "flow", "lines", "blob" , "veil", "moons", "ripple", "matrix", "ink", "vortex"];
  let currentAnimationIndex = 0;

  function setAnimation(type) {
    if (window.NoirBalls) window.NoirBalls.stop();
    if (window.NoirFlow) window.NoirFlow.stop();
    if (window.NoirLines) window.NoirLines.stop();
    if (window.NoirBlob) window.NoirBlob.stop();
    if (window.NoirVeil) window.NoirVeil.stop();
    if (window.NoirMoons) window.NoirMoons.stop();
    if (window.NoirRipple) window.NoirRipple.stop();
    if (window.NoirMatrix) window.NoirMatrix.stop();
    if (window.NoirInk) window.NoirInk.stop();
    if (window.NoirVortex) window.NoirVortex.stop();

    if (type === "balls" && window.NoirBalls) {
      window.NoirBalls.start();
    }
    if (type === "flow" && window.NoirFlow) {
      window.NoirFlow.start();
    }
    if (type === "lines" && window.NoirLines) {
      window.NoirLines.start();
    }
    if (type === "blob" && window.NoirBlob) {
      window.NoirBlob.start();
    }
    if (type === "veil" && window.NoirVeil) {
      window.NoirVeil.start();
    }
    if (type === "moons" && window.NoirMoons) {
      window.NoirMoons.start();
    }
    if (type === "ripple" && window.NoirRipple) {
      window.NoirRipple.start();
    }
    if (type === "matrix" && window.NoirMatrix) {
      window.NoirMatrix.start();
    }
    if (type === "ink" && window.NoirInk) {
      window.NoirInk.start();
    }
    if (type === "vortex" && window.NoirVortex) {
      window.NoirVortex.start();
    }

    localStorage.setItem("noirwave-animation", type);
  }

  // Restore saved animation
  const savedAnim = localStorage.getItem("noirwave-animation");
  if (savedAnim && animations.includes(savedAnim)) {
    currentAnimationIndex = animations.indexOf(savedAnim);
  }

  // Start initial animation
  setAnimation(animations[currentAnimationIndex]);

  // ===============================
  // Carousel Logic (Temporary Controls)
  // ===============================
  function nextAnimation() {
    currentAnimationIndex = (currentAnimationIndex + 1) % animations.length;
    setAnimation(animations[currentAnimationIndex]);
  }

  function prevAnimation() {
    currentAnimationIndex = (currentAnimationIndex - 1 + animations.length) % animations.length;
    setAnimation(animations[currentAnimationIndex]);
  }

  // Keyboard test (temporary)
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextAnimation();
    if (e.key === "ArrowLeft") prevAnimation();
  });

  // ==========================================
  // ISOLATED ABOUT WIDGET DRAG ENGINE (FIXED)
  // ==========================================
  const aboutBox = document.querySelector(".about-container");
  const aboutHeader = document.querySelector(".about-header");

  if (aboutBox && aboutHeader) {
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;

    aboutBox.style.position = "absolute";
    aboutHeader.style.cursor = "move";

    function dragStart(e) {
      if (e.target.closest('button') || e.target.closest('a')) return;

      let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      initialX = clientX - aboutBox.offsetLeft;
      initialY = clientY - aboutBox.offsetTop;
      isDragging = true;
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();

      let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      aboutBox.style.left = `${clientX - initialX}px`;
      aboutBox.style.top = `${clientY - initialY}px`;
    }

    function dragEnd() {
      isDragging = false;
    }

    aboutHeader.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", drag, { passive: false });
    window.addEventListener("mouseup", dragEnd);

    aboutHeader.addEventListener("touchstart", dragStart, { passive: true });
    window.addEventListener("touchmove", drag, { passive: false });
    window.addEventListener("touchend", dragEnd);
  }

});

// ========================================================
// GLOBAL CANVAS DEPTH MANAGEMENT ENGINE (FIXED WRAPPER MATRIX)
// ========================================================
(function () {
  console.log("Global Z-Index Engine Initialized (Fixed Wrappers)");

  let highestZIndex = 3000; // Match your CSS window baseline
  
  // Target the actual outer wrapper popup shells consistently
  const widgetSelectors = ".about-popup, .theme-popup, .calculator-popup, #quotePopup";

  function focusWidget(e) {
    const activeWidget = e.target.closest(widgetSelectors);
    if (!activeWidget) return;
    
    const currentZ = parseInt(window.getComputedStyle(activeWidget).zIndex) || 0;
    if (currentZ === highestZIndex) return;

    highestZIndex++;
    activeWidget.style.zIndex = highestZIndex;
    
    console.log(`Focused window package: ${activeWidget.id || activeWidget.className} to layer ${highestZIndex}`);
  }

  window.addEventListener("mousedown", focusWidget, { passive: true });
  window.addEventListener("touchstart", focusWidget, { passive: true });
})();
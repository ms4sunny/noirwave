// index.js
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

  const animations = ["balls", "flow", "lines", "blob" , "veil"];
  let currentAnimationIndex = 0;

  function setAnimation(type) {
  if (window.NoirBalls) window.NoirBalls.stop();
  if (window.NoirFlow) window.NoirFlow.stop();
  if (window.NoirLines) window.NoirLines.stop();
  if (window.NoirBlob) window.NoirBlob.stop();
  if (window.NoirVeil) window.NoirVeil.stop();

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
    currentAnimationIndex =
      (currentAnimationIndex + 1) % animations.length;
    setAnimation(animations[currentAnimationIndex]);
  }

  function prevAnimation() {
    currentAnimationIndex =
      (currentAnimationIndex - 1 + animations.length) % animations.length;
    setAnimation(animations[currentAnimationIndex]);
  }

  // Keyboard test (temporary)
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextAnimation();
    if (e.key === "ArrowLeft") prevAnimation();
  });

});

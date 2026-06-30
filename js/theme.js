// ------------------------------
// THEME POPUP — FINAL STABLE CODE
// ------------------------------

const themePopup = document.getElementById("themePopup");
const themeContainer = themePopup.querySelector(".theme-container");
const themeOpenBtn = document.getElementById("themeApp");
const themeCloseBtn = document.getElementById("closeTheme");

// Prevent accidental close loops:
let popupRecentlyOpened = false;

// -------- OPEN POPUP ----------
themeOpenBtn.addEventListener("click", (e) => {
    e.stopPropagation();      // stop bubbling to overlay
    e.preventDefault();

    popupRecentlyOpened = true;

    // show popup
    themePopup.classList.add("open");

    // blur background
    document.body.classList.add("blurred");

    // allow outside-click close AFTER 200ms
    setTimeout(() => popupRecentlyOpened = false, 200);

    // play elastic animation
    themeContainer.style.animation = "none";
    void themeContainer.offsetWidth;
    themeContainer.style.animation = "popupElasticIn 0.35s ease forwards";
});

// -------- CLOSE POPUP ----------
function closeThemePopup() {
    // play closing animation
    themeContainer.style.animation = "popupElasticOut 0.25s ease forwards";

    setTimeout(() => {
        themePopup.classList.remove("open");
        document.body.classList.remove("blurred");
        themeContainer.style.animation = "";
    }, 250);
}

themeCloseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeThemePopup();
});

// -------- OUTSIDE CLICK CLOSE ----------
themePopup.addEventListener("mousedown", (e) => {
    // ignore the click that triggered opening
    if (popupRecentlyOpened) return;

    // close ONLY if click is outside the popup box
    if (!themeContainer.contains(e.target)) {
        closeThemePopup();
    }
});

// -------- ESC KEY CLOSE ----------
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && themePopup.classList.contains("open")) {
        closeThemePopup();
    }
});

// ------------------------------
// THEME SWITCHING LOGIC
// ------------------------------

// Load saved theme
const savedTheme = localStorage.getItem("noirwave-theme");
if (savedTheme) {
    document.body.className = "theme-" + savedTheme;
}

// Theme card clicks
document.querySelectorAll(".theme-card").forEach(card => {
    card.addEventListener("click", () => {
        const selected = card.dataset.theme;

        // Apply theme class to body
        document.body.className = "theme-" + selected;

        // Save to localStorage
        localStorage.setItem("noirwave-theme", selected);
    });

    // ISOLATED THEME WIDGET DRAG ENGINE (REPLICATED)
const themeBox = document.querySelector(".theme-container"); // Adjust selector if named differently
const themeHeader = document.querySelector(".theme-header");  // Adjust selector if named differently

if (themeBox && themeHeader) {
  let isDragging = false;
  let initialX = 0;
  let initialY = 0;

  themeBox.style.position = "absolute";
  themeHeader.style.cursor = "move";

  function dragStart(e) {
    // Prevent dragging if clicking buttons, links, or dropdowns inside the header
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('select')) return;
    
    let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    
    initialX = clientX - themeBox.offsetLeft;
    initialY = clientY - themeBox.offsetTop;
    isDragging = true;
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    
    themeBox.style.left = `${clientX - initialX}px`;
    themeBox.style.top = `${clientY - initialY}px`;
  }

  function dragEnd() { 
    isDragging = false; 
  }

  // Mouse Events
  themeHeader.addEventListener("mousedown", dragStart);
  window.addEventListener("mousemove", drag, { passive: false });
  window.addEventListener("mouseup", dragEnd);

  // Touch Events
  themeHeader.addEventListener("touchstart", dragStart, { passive: true });
  window.addEventListener("touchmove", drag, { passive: false });
  window.addEventListener("touchend", dragEnd);
}
});

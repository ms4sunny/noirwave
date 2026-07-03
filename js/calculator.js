// calculator.js — NoirWave Functional Skin & Scientific Mode Engine
console.log("Advanced Calculator JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const calculatorWidget = document.getElementById("calculatorWidget");
  const calculatorPopup = document.getElementById("calculatorPopup");
  const closeCalculator = document.getElementById("closeCalculator");
  const calcDisplay = document.getElementById("calcDisplay");
  const calcContainer = document.getElementById("calcContainer");
  const calcSciPanel = document.getElementById("calcSciPanel");
  
  // Custom navigation parameters
  const toggleScientificBtn = document.getElementById("toggleScientific");
  const btnPrev = document.getElementById("calcSkinPrev");
  const btnNext = document.getElementById("calcSkinNext");
  const skinLabel = document.getElementById("skinLabel");
  const dots = document.querySelectorAll(".skin-dot");
  const toggleDegRad = document.getElementById("toggleDegRad");

  if (!calculatorPopup || !calcDisplay || !calcContainer) {
    console.warn("calculator.js: critical template modules missing");
    return;
  }

  // --- CONFIG DATA DECKS ---
  const SKINS = [
    { class: "skin-default", name: "Default Skin" },
    { class: "skin-mono-noir", name: "Mono Noir" },
    { class: "skin-cyber-surge", name: "Cyber Surge" },
    { class: "skin-matrix-terminal", name: "Matrix Terminal" }
  ];
  let activeSkinIdx = 0;
  let isScientific = false;
  let isDegreeMode = true; // True = Degrees, False = Radians

  // --- ENGINE DISPLAY CONTROLLER ---
  let displayValue = ""; 

  function appendValue(str) {
    if (displayValue === "0" && str !== ".") displayValue = "";
    displayValue += str;
    calcDisplay.value = displayValue || "0";
  }

  function clearDisplay() {
    displayValue = "";
    calcDisplay.value = "0";
  }

  function dropLastToken() {
    displayValue = displayValue.slice(0, -1);
    calcDisplay.value = displayValue || "0";
  }

  // --- THE SKIN CAROUSEL CORE ---
  function changeSkin(targetIndex) {
    // Keep bounded within range limits
    if (targetIndex < 0) targetIndex = SKINS.length - 1;
    if (targetIndex >= SKINS.length) targetIndex = 0;

    // Purge old skin profiles matching arrays
    SKINS.forEach(s => calcContainer.classList.remove(s.class));
    
    activeSkinIdx = targetIndex;
    const currentSkin = SKINS[activeSkinIdx];
    
    calcContainer.classList.add(currentSkin.class);
    skinLabel.textContent = currentSkin.name;

    // Update active indicators track
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeSkinIdx);
    });
  }

  // Desktop Navigation Events
  btnPrev.addEventListener("click", () => changeSkin(activeSkinIdx - 1));
  btnNext.addEventListener("click", () => changeSkin(activeSkinIdx + 1));

  window.addEventListener("keydown", (e) => {
    if (calculatorPopup.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") {
      changeSkin(activeSkinIdx - 1);
    } else if (e.key === "ArrowRight") {
      changeSkin(activeSkinIdx + 1);
    }
  });

  // Mobile Touch Swipe Track Vectors
  let touchStartX = 0;
  calcContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  calcContainer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 60) { // requires 60px swipe travel delta
      if (swipeDistance > 0) {
        changeSkin(activeSkinIdx - 1); // Swiped Right -> Prev
      } else {
        changeSkin(activeSkinIdx + 1); // Swiped Left -> Next
      }
    }
  }, { passive: true });

  // --- SYSTEM LOGIC MATH PARSER ---
  function calculateResult() {
    try {
      let mathematicalString = displayValue
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E");

      // Regular expressions to process specialized operations
      mathematicalString = processTrigFunction(mathematicalString, "sin", Math.sin);
      mathematicalString = processTrigFunction(mathematicalString, "cos", Math.cos);
      mathematicalString = processTrigFunction(mathematicalString, "tan", Math.tan);

      mathematicalString = mathematicalString.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
      mathematicalString = mathematicalString.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
      mathematicalString = mathematicalString.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
      
      // Handle standard exponential exponents power notation loops (x^y)
      while (mathematicalString.includes("^")) {
        mathematicalString = mathematicalString.replace(/([^+\-*/()]+)\^([^+\-*/()]+)/g, "Math.pow($1,$2)");
      }

      // Safe isolated evaluations framework
      let evaluatedResult = new Function(`return (${mathematicalString})`)();
      
      if (evaluatedResult === undefined || isNaN(evaluatedResult)) {
        calcDisplay.value = "Error";
        displayValue = "";
      } else {
        // Fix trailing decimal calculation artifacts smoothly
        if (typeof evaluatedResult === "number" && !Number.isInteger(evaluatedResult)) {
          evaluatedResult = parseFloat(evaluatedResult.toFixed(8));
        }
        calcDisplay.value = evaluatedResult;
        displayValue = evaluatedResult.toString();
      }
    } catch (err) {
      calcDisplay.value = "Error";
      displayValue = "";
    }
  }

  function processTrigFunction(expr, name, mathFunc) {
    const regex = new RegExp(`${name}\\(([^)]+)\\)`, "g");
    return expr.replace(regex, (match, angleExpr) => {
      let angleValue = new Function(`return (${angleExpr})`)();
      if (isDegreeMode) {
        angleValue = angleValue * (Math.PI / 180); // convert degrees to radians
      }
      return mathFunc(angleValue);
    });
  }

  // ==========================================
  // UNIFIED OPEN / RESTORE MANAGEMENT
  // ==========================================
  calculatorWidget.addEventListener("click", () => {
    // Case A: If it was minimized, remove hidden layer and scale it back up
    if (calcContainer.classList.contains("minimized")) {
      calculatorPopup.classList.remove("hidden");
      window.showBlur(); // 👈 Turn blur ON when restoring
      setTimeout(() => {
        calcContainer.classList.remove("minimized");
      }, 10);
    } else {
      // Case B: Regular initial open from a closed state
      calculatorPopup.classList.remove("hidden");
      window.showBlur(); // 👈 Turn blur ON on fresh open
      changeSkin(activeSkinIdx);
    }
  });

  closeCalculator.addEventListener("click", () => {
    calculatorPopup.classList.add("hidden");
    window.hideBlur(); // 👈 Turn blur OFF
  });

  // Toggle Scientific Sidebar Panel Grid Expansion Frame
  toggleScientificBtn.addEventListener("click", () => {
    isScientific = !isScientific;
    calcContainer.classList.toggle("scientific-mode", isScientific);
    calcSciPanel.classList.toggle("hidden", !isScientific);
    toggleScientificBtn.classList.toggle("active", isScientific);
  });

  // Toggle angular tracking units format configuration metrics
  toggleDegRad.addEventListener("click", () => {
    isDegreeMode = !isDegreeMode;
    toggleDegRad.textContent = isDegreeMode ? "Deg" : "Rad";
  });

  // ==========================================
  // DRAG & DROP PHYSICS ENGINE FOR WINDOWS
  // ==========================================
  const header = document.getElementById("calculatorHeader");
  
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // Initialize position parameters smoothly
  function dragStart(e) {
    // If clicking buttons inside header, don't drag
    if (e.target.closest('button')) return;

    let clientX, clientY;
    if (e.type === "touchstart") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    initialX = clientX - xOffset;
    initialY = clientY - yOffset;

    isDragging = true;
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    let clientX, clientY;
    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    currentX = clientX - initialX;
    currentY = clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    // Apply translation math right onto the outer popup window wrapper
    calculatorPopup.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
  }

  function dragEnd() {
    isDragging = false;
  }

  // Desktop Mouse Listeners
  header.addEventListener("mousedown", dragStart);
  window.addEventListener("mousemove", drag, { passive: false });
  window.addEventListener("mouseup", dragEnd);

  // Mobile Touch Listeners 
  header.addEventListener("touchstart", dragStart, { passive: true });
  window.addEventListener("touchmove", drag, { passive: false });
  window.addEventListener("touchend", dragEnd);


 // ==========================================
  // MINIMIZE & RESTORE MANAGEMENT (FIXED TRANSITION)
  // ==========================================
  const minimizeBtn = document.getElementById("minimizeCalculator");

  minimizeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // 1. Trigger the smooth scale/shrink CSS animation first
    calcContainer.classList.add("minimized");
    window.hideBlur(); // 👈 Turn blur OFF when minimizing
    
    // 2. Wait exactly 350ms for the animation to play out, THEN add hidden
    setTimeout(() => {
      if (calcContainer.classList.contains("minimized")) {
        calculatorPopup.classList.add("hidden");
      }
    }, 350); // Matches the 0.35s CSS curve exactly
  });

  // Keep your calculatorWidget restoration click listener exactly the same!
  calculatorWidget.addEventListener("click", () => {
    if (calcContainer.classList.contains("minimized")) {
      // Remove hidden first so it can render the reverse scale up animation
      calculatorPopup.classList.remove("hidden");
      setTimeout(() => {
        calcContainer.classList.remove("minimized");
      }, 10);
    }
  });

  // General Button Deck Router Mapping Click Matrix Actions
  document.querySelectorAll(".calc-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = btn.getAttribute("data-value");
      if (!val || val === "sci" || val === "deg-rad") return;

      if (val === "clear") {
        clearDisplay();
      } else if (val === "backspace") {
        dropLastToken();
      } else if (val === "=") {
        calculateResult();
      } else if (["sin", "cos", "tan", "log", "ln", "√"].includes(val)) {
        appendValue(val + "(");
      } else {
        appendValue(val);
      }
    });
  });

  // Initialize UI display values
  clearDisplay();
});